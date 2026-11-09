import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order, OrderStatus } from "@/models/Order";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await connectToDatabase();

    if (db) {
      const order = await Order.findById(id).lean();
      if (order) {
        return NextResponse.json({ success: true, order });
      }
    }

    return NextResponse.json(
      { success: false, message: "Order not found" },
      { status: 404 }
    );
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
    const { id } = await params;
    const body = await req.json();
    const { status, note } = body;

    const authUser = getUserFromRequest(req);
    const updatedBy = authUser ? `${authUser.name} (${authUser.role})` : "Admin Specialist";

    const db = await connectToDatabase();
    if (db) {
      const order = await Order.findById(id);
      if (!order) {
        return NextResponse.json(
          { success: false, message: "Order not found" },
          { status: 404 }
        );
      }

      if (status) {
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

      return NextResponse.json({
        success: true,
        order,
        message: `Order #${order.orderNumber} status updated to ${status}!`,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${status} (Demo Mode)`,
    });
  } catch (error) {
    console.error("Order status update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update order status" },
      { status: 500 }
    );
  }
}

