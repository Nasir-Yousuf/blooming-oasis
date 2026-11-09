import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Order } from "@/models/Order";
import { getUserFromRequest, hasAdminAccess } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authUser = getUserFromRequest(req);
    if (!hasAdminAccess(authUser?.role)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database connection unavailable" },
        { status: 503 }
      );
    }

    const query: Record<string, unknown> = { role: "customer" };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-passwordHash")
      .sort({ createdAt: -1 })
      .lean();

    // Calculate total spend and order count for each customer
    const customersWithStats = await Promise.all(
      users.map(async (u) => {
        const userOrders = await Order.find({
          $or: [{ "customer.userId": String(u._id) }, { "customer.email": u.email }],
        }).lean();

        const totalSpend = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        return {
          ...u,
          orderCount: userOrders.length,
          totalSpend,
        };
      })
    );

    return NextResponse.json({
      success: true,
      customers: customersWithStats,
    });
  } catch (error) {
    console.error("Customers GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load customers" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authUser = getUserFromRequest(req);
    if (!hasAdminAccess(authUser?.role)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    const { userId, status } = await req.json();
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database connection unavailable" },
        { status: 503 }
      );
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select("-passwordHash");

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Customer account not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      customer: updated,
      message: `Customer account status updated to ${status}`,
    });
  } catch (error) {
    console.error("Customer status update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update customer status" },
      { status: 500 }
    );
  }
}
