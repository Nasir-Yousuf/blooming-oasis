import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET(req: NextRequest) {
  const tokenUser = getUserFromRequest(req);
  if (!tokenUser) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  try {
    const db = await connectToDatabase();
    if (db) {
      const userDoc = await User.findById(tokenUser.userId)
        .select("-passwordHash")
        .lean();
      if (userDoc) {
        return NextResponse.json({ authenticated: true, user: userDoc });
      }
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        _id: tokenUser.userId,
        name: tokenUser.name,
        email: tokenUser.email,
        role: tokenUser.role,
      },
    });
  } catch (e) {
    console.error("Auth me error:", e);
    return NextResponse.json({ authenticated: false, user: null });
  }
}

export async function PUT(req: NextRequest) {
  const tokenUser = getUserFromRequest(req);
  if (!tokenUser) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please sign in." },
      { status: 401 }
    );
  }

  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database connection unavailable" },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { name, phone, addresses, wishlist } = body;

    const user = await User.findById(tokenUser.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User account not found" },
        { status: 404 }
      );
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (addresses && Array.isArray(addresses)) user.addresses = addresses;
    if (wishlist && Array.isArray(wishlist)) user.wishlist = wishlist;

    await user.save();

    const updatedSafeUser = await User.findById(user._id)
      .select("-passwordHash")
      .lean();

    return NextResponse.json({
      success: true,
      user: updatedSafeUser,
      message: "Profile updated successfully!",
    });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update profile" },
      { status: 500 }
    );
  }
}
