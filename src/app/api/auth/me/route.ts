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
    if (db && !tokenUser.userId.startsWith("local-") && !tokenUser.userId.startsWith("demo-")) {
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

