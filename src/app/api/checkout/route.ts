import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order, OrderStatus } from "@/models/Order";
import { Product } from "@/models/Product";
import { Coupon } from "@/models/Coupon";
import { InventoryLog } from "@/models/InventoryLog";
import { StoreSettings } from "@/models/StoreSettings";
import { getUserFromRequest } from "@/lib/auth";
import { revalidateStoreCatalog } from "@/lib/data-access";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer,
      shippingAddress,
      items,
      couponCode,
      notes,
    } = body;

    if (!customer?.name || !customer?.email || !customer?.phone) {
      return NextResponse.json(
        { success: false, message: "Please provide complete customer name, email, and phone" },
        { status: 400 }
      );
    }

    if (
      !shippingAddress?.street ||
      !shippingAddress?.city ||
      !shippingAddress?.state ||
      !shippingAddress?.postalCode
    ) {
      return NextResponse.json(
        { success: false, message: "Please provide a complete shipping address" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Your botanical cart is empty" },
        { status: 400 }
      );
    }

    const authUser = getUserFromRequest(req);
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database connection unavailable. Please try again." },
        { status: 503 }
      );
    }

    // 1. Fetch live Store Settings for delivery charges
    let storeSettings = await StoreSettings.findOne().lean();
    if (!storeSettings) {
      storeSettings = (await StoreSettings.create({})).toObject();
    }
    const deliveryChargeFee = typeof storeSettings.deliveryCharge === "number" ? storeSettings.deliveryCharge : 12;
    const freeDeliveryThreshold = typeof storeSettings.freeDeliveryThreshold === "number" ? storeSettings.freeDeliveryThreshold : 75;

    // 2. Validate and calculate item prices server-side from MongoDB
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const slugOrId = item.product?.slug || item.product?._id || item.productId;
      if (!slugOrId) {
        return NextResponse.json(
          { success: false, message: "Invalid product information in cart" },
          { status: 400 }
        );
      }

      // Query database
      const plant = await Product.findOne({
        $or: [{ slug: slugOrId }, { _id: slugOrId.match(/^[0-9a-fA-F]{24}$/) ? slugOrId : null }],
      });

      if (!plant) {
        return NextResponse.json(
          { success: false, message: `Botanical product '${item.product?.name || slugOrId}' not found in catalog` },
          { status: 400 }
        );
      }

      if (!plant.published) {
        return NextResponse.json(
          { success: false, message: `Plant '${plant.name}' is currently unavailable for purchase` },
          { status: 400 }
        );
      }

      const requestedQty = Number(item.quantity) || 1;
      if (plant.stock < requestedQty) {
        return NextResponse.json(
          {
            success: false,
            message: `Insufficient stock for ${plant.name}. Only ${plant.stock} remaining in greenhouse.`,
          },
          { status: 400 }
        );
      }

      // Check size modifier
      const chosenSize = plant.sizes?.find((s: any) => s.name === item.size);
      const sizeModifier = chosenSize ? Number(chosenSize.priceModifier) || 0 : 0;

      // Validate accessories against actual product accessory specs
      let accessoriesCost = 0;
      const validAccessories = [];
      if (item.accessories && Array.isArray(item.accessories)) {
        for (const acc of item.accessories) {
          const matchAcc = plant.accessories?.find((a: any) => a.id === acc.id);
          if (matchAcc) {
            accessoriesCost += Number(matchAcc.price) || 0;
            validAccessories.push({
              id: matchAcc.id,
              name: matchAcc.name,
              price: Number(matchAcc.price) || 0,
            });
          }
        }
      }

      const unitPrice = plant.price + sizeModifier + accessoriesCost;
      const totalPrice = unitPrice * requestedQty;
      calculatedSubtotal += totalPrice;

      validatedItems.push({
        productId: String(plant._id),
        productSlug: plant.slug,
        productName: plant.name,
        productImage: plant.images?.[0] || "",
        size: item.size || "Small",
        unitPrice,
        quantity: requestedQty,
        accessories: validAccessories,
        totalPrice,
      });
    }

    // 3. Validate coupon code against MongoDB
    let discountAmount = 0;
    let validCouponCode = "";

    if (couponCode && typeof couponCode === "string") {
      const codeClean = couponCode.trim().toUpperCase();
      const coupon = await Coupon.findOne({
        code: codeClean,
        active: true,
        expiresAt: { $gte: new Date() },
      });

      if (coupon) {
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
          return NextResponse.json(
            { success: false, message: "This coupon code has reached its maximum usage limit." },
            { status: 400 }
          );
        }

        if (calculatedSubtotal < coupon.minOrderAmount) {
          return NextResponse.json(
            {
              success: false,
              message: `Coupon ${coupon.code} requires a minimum order subtotal of $${coupon.minOrderAmount}.`,
            },
            { status: 400 }
          );
        }

        if (coupon.discountType === "percentage") {
          discountAmount = (calculatedSubtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
          }
        } else {
          discountAmount = coupon.discountValue;
        }

        validCouponCode = coupon.code;
        coupon.usageCount += 1;
        await coupon.save();
      }
    }

    // 4. Calculate delivery fee and final total
    const deliveryCharge = calculatedSubtotal >= freeDeliveryThreshold ? 0 : deliveryChargeFee;
    const finalTotal = Math.max(0, calculatedSubtotal - discountAmount + deliveryCharge);

    // 5. Atomic Inventory Decrement with Concurrency Safety
    // To prevent overselling under high concurrency, decrement each product conditionally
    const decrementedList: Array<{ productId: string; quantity: number; prevStock: number; newStock: number; name: string }> = [];

    for (const item of validatedItems) {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: item.productId, stock: { $gte: item.quantity }, published: true },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      if (!updatedProduct) {
        // Roll back any previously decremented items
        for (const rolledBack of decrementedList) {
          await Product.findByIdAndUpdate(rolledBack.productId, {
            $inc: { stock: rolledBack.quantity },
          });
        }
        return NextResponse.json(
          {
            success: false,
            message: `Sorry, inventory for '${item.productName}' just changed. Please review your cart.`,
          },
          { status: 409 }
        );
      }

      decrementedList.push({
        productId: item.productId,
        quantity: item.quantity,
        prevStock: updatedProduct.stock + item.quantity,
        newStock: updatedProduct.stock,
        name: updatedProduct.name,
      });
    }

    // 6. Generate unique order number
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `BO-${randomSuffix}`;

    const orderData = {
      orderNumber,
      customer: {
        userId: authUser ? authUser.userId : undefined,
        name: customer.name.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone.trim(),
      },
      shippingAddress: {
        street: shippingAddress.street.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        postalCode: shippingAddress.postalCode.trim(),
        country: shippingAddress.country || "United States",
      },
      items: validatedItems,
      subtotal: calculatedSubtotal,
      deliveryCharge,
      discount: discountAmount,
      couponCode: validCouponCode,
      total: finalTotal,
      paymentMethod: "cod" as const,
      paymentStatus: "pending" as const,
      status: "Pending" as const,
      statusTimeline: [
        {
          status: "Pending" as OrderStatus,
          timestamp: new Date(),
          note: "Order placed successfully via storefront (Cash on Delivery)",
          updatedBy: "Customer Checkout",
        },
      ],
      notes: notes || "",
    };

    const createdOrder: any = await Order.create(orderData);

    // 7. Record inventory logs
    for (const dec of decrementedList) {
      await InventoryLog.create({
        productId: dec.productId,
        productName: dec.name,
        previousStock: dec.prevStock,
        changeAmount: -dec.quantity,
        newStock: dec.newStock,
        reason: "Order Placement",
        updatedBy: `Order #${orderNumber}`,
      });
    }

    revalidateStoreCatalog();

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: createdOrder._id,
      order: createdOrder,
      message: "Order placed successfully!",
    });
  } catch (error) {
    console.error("Checkout API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to place order. Please try again." },
      { status: 500 }
    );
  }
}
