import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { getUserFromRequest, hasAdminAccess } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = getUserFromRequest(req);
    const { searchParams } = new URL(req.url);
    const guestEmail = searchParams.get("email")?.toLowerCase().trim();

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database connection unavailable" },
        { status: 503 }
      );
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
    const query = isMongoId ? { _id: id } : { orderNumber: id };

    const order = await Order.findOne(query).lean();
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Access authorization:
    // 1. Staff with admin privileges can view any order
    if (authUser && hasAdminAccess(authUser.role)) {
      return NextResponse.json({ success: true, order });
    }

    // 2. Authenticated customer who placed the order
    if (
      authUser &&
      ((order.customer.userId && order.customer.userId === authUser.userId) ||
        order.customer.email.toLowerCase() === authUser.email.toLowerCase())
    ) {
      return NextResponse.json({ success: true, order });
    }

    // 3. Order placed recently (within last 10 minutes) on receipt page
    const isRecentCheckout =
      order.createdAt &&
      new Date(order.createdAt).getTime() > Date.now() - 10 * 60 * 1000;

    if (isRecentCheckout) {
      return NextResponse.json({ success: true, order });
    }

    // 4. Guest tracking with exact matching email
    if (guestEmail && order.customer.email.toLowerCase() === guestEmail) {
      return NextResponse.json({ success: true, order });
    }

    // Unauthorized attempt
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized. You do not have permission to view this order.",
      },
      { status: 403 }
    );
  } catch (error) {
    console.error("Order lookup error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}
