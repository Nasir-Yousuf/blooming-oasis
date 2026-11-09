import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { Order } from "@/models/Order";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    const db = await connectToDatabase();

    if (db) {
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
    }

    // Demo fallback customers
    const mockCustomers = [
      {
        _id: "demo-cust-1",
        name: "Sophia Martinez",
        email: "sophia@green.com",
        role: "customer",
        status: "active",
        orderCount: 4,
        totalSpend: 384,
        createdAt: new Date(Date.now() - 30 * 24 * 3600000).toISOString(),
      },
      {
        _id: "demo-cust-2",
        name: "Alexander Wright",
        email: "alex@living.com",
        role: "customer",
        status: "active",
        orderCount: 2,
        totalSpend: 296,
        createdAt: new Date(Date.now() - 14 * 24 * 3600000).toISOString(),
      },
      {
        _id: "demo-cust-3",
        name: "Amara Lin",
        email: "amara@calathea.org",
        role: "customer",
        status: "active",
        orderCount: 1,
        totalSpend: 58,
        createdAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      customers: mockCustomers,
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
    const { userId, status } = await req.json();
    const db = await connectToDatabase();
    if (db) {
      const updated = await User.findByIdAndUpdate(
        userId,
        { status },
        { new: true }
      ).select("-passwordHash");
      return NextResponse.json({
        success: true,
        user: updated,
        message: `Customer account ${status === "suspended" ? "suspended" : "activated"}.`,
      });
    }
    return NextResponse.json({
      success: true,
      message: "Customer status updated (Demo)",
    });
  } catch (error) {
    console.error("Customer status update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update customer status" },
      { status: 500 }
    );
  }
}

