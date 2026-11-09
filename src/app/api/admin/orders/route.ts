import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    const db = await connectToDatabase();

    if (db) {
      const query: Record<string, unknown> = {};

      if (status && status !== "All") {
        query.status = status;
      }

      if (search) {
        query.$or = [
          { orderNumber: { $regex: search, $options: "i" } },
          { "customer.name": { $regex: search, $options: "i" } },
          { "customer.email": { $regex: search, $options: "i" } },
        ];
      }

      const orders = await Order.find(query).sort({ createdAt: -1 }).lean();
      return NextResponse.json({ success: true, count: orders.length, orders });
    }

    // Demo Fallback Orders
    const mockOrders = [
      {
        _id: "demo-ord-1",
        orderNumber: "BO-849201",
        customer: {
          name: "Sophia Martinez",
          email: "sophia@green.com",
          phone: "+1 555-0192",
        },
        shippingAddress: {
          street: "142 Palm Boulevard",
          city: "San Francisco",
          state: "CA",
          postalCode: "94107",
          country: "United States",
        },
        items: [
          {
            productName: "Monstera Deliciosa",
            size: "Medium",
            unitPrice: 92,
            quantity: 1,
            totalPrice: 92,
            accessories: [{ name: "Handcrafted Ceramic Pot", price: 34 }],
          },
        ],
        subtotal: 126,
        deliveryCharge: 0,
        discount: 15,
        couponCode: "BLOOM15",
        total: 111,
        paymentMethod: "cod",
        paymentStatus: "pending",
        status: "Pending",
        statusTimeline: [
          {
            status: "Pending",
            timestamp: new Date().toISOString(),
            note: "Order placed via customer storefront",
          },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        _id: "demo-ord-2",
        orderNumber: "BO-849202",
        customer: {
          name: "Alexander Wright",
          email: "alex@living.com",
          phone: "+1 555-0144",
        },
        shippingAddress: {
          street: "782 Evergreen Terr",
          city: "Seattle",
          state: "WA",
          postalCode: "98101",
          country: "United States",
        },
        items: [
          {
            productName: "Fiddle Leaf Fig",
            size: "Large",
            unitPrice: 169,
            quantity: 1,
            totalPrice: 169,
            accessories: [{ name: "Mid-Century Walnut Plant Stand", price: 38 }],
          },
        ],
        subtotal: 207,
        deliveryCharge: 0,
        discount: 0,
        total: 207,
        paymentMethod: "cod",
        paymentStatus: "paid",
        status: "Confirmed",
        statusTimeline: [
          {
            status: "Pending",
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            note: "Order placed",
          },
          {
            status: "Confirmed",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            note: "Nursery confirmed root health and ready for packing",
          },
        ],
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      count: mockOrders.length,
      orders: mockOrders,
    });
  } catch (error) {
    console.error("Admin orders GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load orders" },
      { status: 500 }
    );
  }
}

