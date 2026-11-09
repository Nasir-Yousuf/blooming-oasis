import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Please fill all required fields" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters long",
        },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();

    if (db) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return NextResponse.json(
          {
            success: false,
            message: "An account with this email address already exists",
          },
          { status: 409 }
        );
      }

      const passwordHash = await hashPassword(password);
      const user = await User.create({
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: "customer",
        status: "active",
      });

      const token = signToken({
        userId: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
      });

      const res = NextResponse.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: "Account registered successfully",
      });

      setAuthCookie(res, token);
      return res;
    }

    // Local fallback
    const token = signToken({
      userId: `local-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      role: "customer",
    });

    const res = NextResponse.json({
      success: true,
      user: {
        id: `local-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        role: "customer",
      },
      message: "Account registered successfully",
    });
    setAuthCookie(res, token);
    return res;
  } catch (error) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { success: false, message: "Registration failed" },
      { status: 500 }
    );
  }
}

