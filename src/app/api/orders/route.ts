import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authUser = getUserFromRequest(req);
    const db = await connectToDatabase();

    if (db && authUser) {
      const orders = await Order.find({
        $or: [
          { "customer.userId": authUser.userId },
          { "customer.email": authUser.email.toLowerCase() },
        ],
      })
        .sort({ createdAt: -1 })
        .lean();

      if (orders.length > 0) {
        return NextResponse.json({ success: true, count: orders.length, orders });
      }
    }

    // Demo customer orders for testing / offline preview
    const sampleCustomerOrders = [
      {
        _id: "demo-cust-1",
        orderNumber: "BO-849201",
        customer: {
          name: authUser?.name || "Sophia Martinez",
          email: authUser?.email || "customer@bloomingoasis.com",
          phone: "+1 (555) 349-8201",
        },
        shippingAddress: {
          street: "742 Evergreen Terrace",
          city: "Portland",
          state: "OR",
          postalCode: "97201",
          country: "United States",
        },
        items: [
          {
            name: "Monstera Deliciosa",
            image:
              "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80",
            price: 68,
            quantity: 1,
            size: "Large",
            total: 68,
          },
          {
            name: "Fiddle Leaf Fig",
            image:
              "https://images.unsplash.com/photo-1597055181300-e3633a207519?auto=format&fit=crop&w=800&q=80",
            price: 85,
            quantity: 1,
            size: "Standard",
            total: 85,
          },
        ],
        subtotal: 153,
        deliveryCharge: 0,
        discount: 15.3,
        couponCode: "WELCOME10",
        total: 137.7,
        status: "Processing",
        createdAt: new Date(Date.now() - 3600000 * 36),
      },
      {
        _id: "demo-cust-2",
        orderNumber: "BO-592813",
        customer: {
          name: authUser?.name || "Sophia Martinez",
          email: authUser?.email || "customer@bloomingoasis.com",
          phone: "+1 (555) 349-8201",
        },
        shippingAddress: {
          street: "742 Evergreen Terrace",
          city: "Portland",
          state: "OR",
          postalCode: "97201",
          country: "United States",
        },
        items: [
          {
            name: "Snake Plant Laurentii",
            image:
              "https://images.unsplash.com/photo-1599598425947-52033527022c?auto=format&fit=crop&w=800&q=80",
            price: 42,
            quantity: 2,
            size: "Standard",
            total: 84,
          },
        ],
        subtotal: 84,
        deliveryCharge: 0,
        discount: 0,
        total: 84,
        status: "Delivered",
        createdAt: new Date(Date.now() - 3600000 * 24 * 14),
      },
    ];

    return NextResponse.json({
      success: true,
      count: sampleCustomerOrders.length,
      orders: sampleCustomerOrders,
    });
  } catch (error) {
    console.error("Fetch customer orders error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load orders" },
      { status: 500 }
    );
  }
}

