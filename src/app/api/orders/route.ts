import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authUser = getUserFromRequest(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Please sign in to view your orders." },
        { status: 401 }
      );
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database connection unavailable" },
        { status: 503 }
      );
    }

    const query: Record<string, any> = {
      $or: [
        { "customer.userId": authUser.userId },
        { "customer.email": authUser.email.toLowerCase() },
      ],
    };

    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Customer orders API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch order history" },
      { status: 500 }
    );
  }
}
