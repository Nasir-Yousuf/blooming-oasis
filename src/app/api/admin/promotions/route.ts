import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Coupon } from "@/models/Coupon";
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

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database connection unavailable" },
        { status: 503 }
      );
    }

    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    console.error("Promotions GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load promotions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = getUserFromRequest(req);
    if (!hasAdminAccess(authUser?.role)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    if (!body.code || body.discountValue === undefined) {
      return NextResponse.json(
        { success: false, message: "Coupon code and discount value are required" },
        { status: 400 }
      );
    }

    const cleanCode = body.code.trim().toUpperCase();
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database connection unavailable" },
        { status: 503 }
      );
    }

    const existing = await Coupon.findOne({ code: cleanCode });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "A promotion with this code already exists" },
        { status: 409 }
      );
    }

    const created = await Coupon.create({
      ...body,
      code: cleanCode,
      discountType: body.discountType || "percentage",
      discountValue: Number(body.discountValue),
      minOrderAmount: Number(body.minOrderAmount) || 0,
      maxDiscount: Number(body.maxDiscount) || 0,
      usageLimit: Number(body.usageLimit) || 100,
      active: body.active !== false,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : new Date(Date.now() + 60 * 24 * 3600000),
    });

    return NextResponse.json({
      success: true,
      coupon: created,
      message: `Promotion code ${cleanCode} created successfully!`,
    });
  } catch (error) {
    console.error("Promotion creation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create coupon" },
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

    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Coupon ID is required" },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database connection unavailable" },
        { status: 503 }
      );
    }

    if (updates.code) {
      updates.code = updates.code.trim().toUpperCase();
    }

    const updated = await Coupon.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Coupon not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      coupon: updated,
      message: "Promotion updated successfully",
    });
  } catch (error) {
    console.error("Promotion update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update coupon" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authUser = getUserFromRequest(req);
    if (!hasAdminAccess(authUser?.role)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    const { id } = await req.json();
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database connection unavailable" },
        { status: 503 }
      );
    }

    const deleted = await Coupon.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Promotion not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Promotion deleted successfully",
    });
  } catch (error) {
    console.error("Promotion delete error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete promotion" },
      { status: 500 }
    );
  }
}
