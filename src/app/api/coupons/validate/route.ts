import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Coupon } from "@/models/Coupon";
import { INITIAL_COUPONS } from "@/data/initialData";

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();
    if (!code) {
      return NextResponse.json(
        { success: false, message: "Please provide a coupon code" },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();
    const db = await connectToDatabase();

    if (db) {
      const coupon = await Coupon.findOne({
        code: cleanCode,
        active: true,
        expiresAt: { $gte: new Date() },
      });

      if (!coupon) {
        return NextResponse.json(
          { success: false, message: "Invalid or expired coupon code" },
          { status: 404 }
        );
      }

      if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        return NextResponse.json(
          { success: false, message: "This coupon has reached its usage limit" },
          { status: 400 }
        );
      }

      if (subtotal < coupon.minOrderAmount) {
        return NextResponse.json(
          {
            success: false,
            message: `Minimum order amount of $${coupon.minOrderAmount} required for this coupon`,
          },
          { status: 400 }
        );
      }

      let discount = 0;
      if (coupon.discountType === "percentage") {
        discount = (subtotal * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.discountValue;
      }

      return NextResponse.json({
        success: true,
        coupon: {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          discount,
        },
        message: `Coupon ${coupon.code} applied successfully!`,
      });
    }

    // Fallback coupon check
    const match = INITIAL_COUPONS.find((c) => c.code === cleanCode);
    if (!match) {
      return NextResponse.json(
        { success: false, message: "Invalid promotional code" },
        { status: 404 }
      );
    }

    if (subtotal < match.minOrderAmount) {
      return NextResponse.json(
        {
          success: false,
          message: `Minimum order of $${match.minOrderAmount} required`,
        },
        { status: 400 }
      );
    }

    let discount = 0;
    if (match.discountType === "percentage") {
      discount = (subtotal * match.discountValue) / 100;
      if (match.maxDiscount && discount > match.maxDiscount) {
        discount = match.maxDiscount;
      }
    } else {
      discount = match.discountValue;
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: match.code,
        discountType: match.discountType,
        discountValue: match.discountValue,
        discount,
      },
      message: `Promotional code ${match.code} applied!`,
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}

