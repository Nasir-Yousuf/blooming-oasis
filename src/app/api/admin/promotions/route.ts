import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Coupon } from "@/models/Coupon";
import { INITIAL_COUPONS } from "@/data/initialData";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const count = await Coupon.countDocuments();
      if (count === 0) {
        await Coupon.insertMany(INITIAL_COUPONS);
      }
      const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
      return NextResponse.json({ success: true, coupons });
    }

    return NextResponse.json({
      success: true,
      coupons: INITIAL_COUPONS.map((c, i) => ({
        ...c,
        _id: `coup-${i}`,
      })),
    });
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
    const body = await req.json();
    if (!body.code || !body.discountValue) {
      return NextResponse.json(
        { success: false, message: "Coupon code and discount value are required" },
        { status: 400 }
      );
    }

    const cleanCode = body.code.trim().toUpperCase();
    const db = await connectToDatabase();

    if (db) {
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
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : new Date(Date.now() + 60 * 24 * 3600000),
      });

      return NextResponse.json({
        success: true,
        coupon: created,
        message: `Promotion code ${cleanCode} created successfully!`,
      });
    }

    return NextResponse.json({
      success: true,
      coupon: { ...body, code: cleanCode, _id: `local-coup-${Date.now()}` },
      message: "Promotion created (Demo Mode)",
    });
  } catch (error) {
    console.error("Promotion creation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create coupon" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const db = await connectToDatabase();
    if (db) {
      await Coupon.findByIdAndDelete(id);
      return NextResponse.json({
        success: true,
        message: "Promotion deleted successfully",
      });
    }
    return NextResponse.json({
      success: true,
      message: "Promotion deleted (Demo)",
    });
  } catch (error) {
    console.error("Promotion delete error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete promotion" },
      { status: 500 }
    );
  }
}

