import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Order } from "@/models/Order";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await connectToDatabase();

    if (db) {
      // Find by orderNumber or MongoDB _id
      const order = await Order.findOne({
        $or: [{ orderNumber: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
      }).lean();

      if (order) {
        return NextResponse.json({ success: true, order });
      }
    }

    // Fallback for demonstration / offline mode
    if (id.startsWith("BO-") || id.startsWith("local-") || id === "demo") {
      const demoOrder = {
        orderNumber: id.startsWith("BO-") ? id : "BO-849201",
        customer: {
          name: "Sophia Martinez",
          email: "sophia.martinez@example.com",
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
            image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80",
            price: 68,
            quantity: 1,
            size: "Large",
            accessories: [{ name: "Handcrafted Terracotta Pot", price: 24 }],
            total: 92,
          },
          {
            name: "Fiddle Leaf Fig",
            image: "https://images.unsplash.com/photo-1597055181300-e3633a207519?auto=format&fit=crop&w=800&q=80",
            price: 85,
            quantity: 1,
            size: "Standard",
            accessories: [],
            total: 85,
          },
        ],
        subtotal: 177,
        deliveryCharge: 0,
        discount: 17.7,
        couponCode: "WELCOME10",
        total: 159.3,
        paymentMethod: "cod",
        paymentStatus: "pending",
        status: "Processing",
        statusTimeline: [
          {
            status: "Pending",
            timestamp: new Date(Date.now() - 3600000 * 24),
            note: "Order placed via website checkout",
            updatedBy: "Customer",
          },
          {
            status: "Confirmed",
            timestamp: new Date(Date.now() - 3600000 * 18),
            note: "Payment and stock confirmed by greenhouse staff",
            updatedBy: "Admin Dispatch",
          },
          {
            status: "Processing",
            timestamp: new Date(Date.now() - 3600000 * 4),
            note: "Plants inspected, hydrated, and wrapped in protective botanical packaging",
            updatedBy: "Greenhouse Team",
          },
        ],
        notes: "Please leave at front porch inside shade.",
        createdAt: new Date(Date.now() - 3600000 * 24),
      };
      return NextResponse.json({ success: true, order: demoOrder });
    }

    return NextResponse.json(
      { success: false, message: "Order not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Order lookup error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load order details" },
      { status: 500 }
    );
  }
}
