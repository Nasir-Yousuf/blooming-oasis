import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order, OrderStatus } from "@/models/Order";
import { Product } from "@/models/Product";
import { Coupon } from "@/models/Coupon";
import { InventoryLog } from "@/models/InventoryLog";
import { getUserFromRequest } from "@/lib/auth";
import { INITIAL_PRODUCTS } from "@/data/initialProducts";

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
        { success: false, message: "Please provide complete customer details" },
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
        { success: false, message: "Please provide complete shipping address" },
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

    // 1. Calculate and re-verify pricing on server
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      let catalogPlant: any = null;
      if (db) {
        catalogPlant = await Product.findOne({ slug: item.product.slug });
      }
      if (!catalogPlant) {
        catalogPlant = INITIAL_PRODUCTS.find((p) => p.slug === item.product.slug);
      }

      if (!catalogPlant) {
        return NextResponse.json(
          { success: false, message: `Plant not found: ${item.product.name}` },
          { status: 400 }
        );
      }

      // Check stock
      if (catalogPlant.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Insufficient stock for ${catalogPlant.name}. Only ${catalogPlant.stock} available.`,
          },
          { status: 400 }
        );
      }

      const sizeOption = catalogPlant.sizes?.find(
        (s: any) => s.name === item.size
      );
      const sizeModifier = sizeOption ? sizeOption.priceModifier : 0;

      let accessoriesCost = 0;
      const validAccessories = [];
      if (item.accessories && Array.isArray(item.accessories)) {
        for (const acc of item.accessories) {
          const matchAcc = catalogPlant.accessories?.find(
            (a: any) => a.id === acc.id
          );
          if (matchAcc) {
            accessoriesCost += matchAcc.price;
            validAccessories.push({
              id: matchAcc.id,
              name: matchAcc.name,
              price: matchAcc.price,
            });
          }
        }
      }

      const unitPrice = catalogPlant.price + sizeModifier + accessoriesCost;
      const totalPrice = unitPrice * item.quantity;
      calculatedSubtotal += totalPrice;

      validatedItems.push({
        productId: catalogPlant._id ? String(catalogPlant._id) : catalogPlant.slug,
        productSlug: catalogPlant.slug,
        productName: catalogPlant.name,
        productImage: catalogPlant.images?.[0] || "",
        size: item.size || "Small",
        unitPrice,
        quantity: item.quantity,
        accessories: validAccessories,
        totalPrice,
      });
    }

    // 2. Validate Coupon
    let discountAmount = 0;
    let validCouponCode = "";

    if (couponCode && typeof couponCode === "string") {
      const codeClean = couponCode.trim().toUpperCase();
      if (db) {
        const coupon = await Coupon.findOne({
          code: codeClean,
          active: true,
          expiresAt: { $gte: new Date() },
        });

        if (coupon && calculatedSubtotal >= coupon.minOrderAmount) {
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
      } else {
        // Dev fallback coupons
        if (codeClean === "WELCOME10" && calculatedSubtotal >= 40) {
          discountAmount = (calculatedSubtotal * 10) / 100;
          validCouponCode = "WELCOME10";
        } else if (codeClean === "BLOOM15" && calculatedSubtotal >= 75) {
          discountAmount = (calculatedSubtotal * 15) / 100;
          validCouponCode = "BLOOM15";
        }
      }
    }

    // 3. Delivery charge (Free over $75)
    const deliveryCharge = calculatedSubtotal >= 75 ? 0 : 12;
    const finalTotal = Math.max(0, calculatedSubtotal - discountAmount + deliveryCharge);

    // 4. Generate unique order number
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

    if (db) {
      const createdOrder: any = await Order.create(orderData);

      // Decrement inventory safely & record log
      for (const itm of validatedItems) {
        const plantDoc = await Product.findById(itm.productId);
        if (plantDoc) {
          const prev = plantDoc.stock;
          plantDoc.stock = Math.max(0, plantDoc.stock - itm.quantity);
          await plantDoc.save();

          await InventoryLog.create({
            productId: String(plantDoc._id),
            productName: plantDoc.name,
            previousStock: prev,
            changeAmount: -itm.quantity,
            newStock: plantDoc.stock,
            reason: "Order Placement",
            updatedBy: `Order #${orderNumber}`,
          });
        }
      }

      return NextResponse.json({
        success: true,
        orderNumber,
        orderId: createdOrder._id,
        order: createdOrder,
        message: "Order placed successfully!",
      });
    }

    // Offline dev fallback
    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: `local-${Date.now()}`,
      order: orderData,
      message: "Order placed successfully (Demonstration Mode)!",
    });
  } catch (error) {
    console.error("Checkout API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to place order. Please try again." },
      { status: 500 }
    );
  }
}
