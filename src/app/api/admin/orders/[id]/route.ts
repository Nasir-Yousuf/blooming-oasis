import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order, OrderStatus } from "@/models/Order";
import { Product } from "@/models/Product";
import { InventoryLog } from "@/models/InventoryLog";
import { getUserFromRequest, canManageOrders } from "@/lib/auth";
import { revalidateStoreCatalog } from "@/lib/data-access";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = getUserFromRequest(req);
    if (!authUser || !canManageOrders(authUser.role)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Order management privileges required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database connection unavailable" },
        { status: 503 }
      );
    }

    const order = await Order.findById(id).lean();
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Order lookup error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = getUserFromRequest(req);
    if (!authUser || !canManageOrders(authUser.role)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Order management privileges required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { status, note } = body;

    const updatedBy = `${authUser.name} (${authUser.role})`;

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database connection unavailable" },
        { status: 503 }
      );
    }

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    const previousStatus = order.status;

    if (status && status !== previousStatus) {
      const validStatuses: OrderStatus[] = [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Refunded",
      ];

      if (!validStatuses.includes(status as OrderStatus)) {
        return NextResponse.json(
          { success: false, message: `Invalid order status: ${status}` },
          { status: 400 }
        );
      }

      // Check stock restoration rule:
      // If moving to Cancelled or Refunded and previously NOT cancelled/refunded, restore stock!
      const isCancellation = status === "Cancelled" || status === "Refunded";
      const wasAlreadyCancelled = previousStatus === "Cancelled" || previousStatus === "Refunded";

      if (isCancellation && !wasAlreadyCancelled) {
        for (const itm of order.items) {
          const product = await Product.findById(itm.productId);
          if (product) {
            const prevStock = product.stock;
            product.stock += itm.quantity;
            await product.save();

            await InventoryLog.create({
              productId: String(product._id),
              productName: product.name,
              previousStock: prevStock,
              changeAmount: itm.quantity,
              newStock: product.stock,
              reason: "Order Cancellation",
              updatedBy: `Order #${order.orderNumber} Cancelled`,
            });
          }
        }
      }

      order.status = status as OrderStatus;
      order.statusTimeline.push({
        status: status as OrderStatus,
        timestamp: new Date(),
        note: note || `Order status updated to ${status}`,
        updatedBy,
      });

      if (status === "Delivered") {
        order.paymentStatus = "paid";
      }
    }

    if (body.notes !== undefined) {
      order.notes = body.notes;
    }

    await order.save();
    revalidateStoreCatalog();

    return NextResponse.json({
      success: true,
      order,
      message: `Order #${order.orderNumber} status updated to ${status || previousStatus}!`,
    });
  } catch (error) {
    console.error("Order status update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order status" },
      { status: 500 }
    );
  }
}
