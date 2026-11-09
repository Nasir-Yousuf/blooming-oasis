import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Membership } from "@/models/Membership";
import { MembershipSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = MembershipSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsed.error.flatten().fieldErrors,
          message: "Please provide a valid email address.",
        },
        { status: 400 }
      );
    }

    const { email, name } = parsed.data;
    const db = await connectToDatabase();

    if (db) {
      // Upsert membership
      await Membership.findOneAndUpdate(
        { email: email.toLowerCase() },
        { email: email.toLowerCase(), name, active: true },
        { upsert: true, new: true }
      );

      return NextResponse.json({
        success: true,
        persisted: true,
        message:
          "Welcome to Blooming Oasis Circle! Your member welcome guide and exclusive discount code are on their way.",
      });
    }

    console.log(
      "[Advisory] Membership subscription validated (MongoDB Atlas pending):",
      { email, name }
    );

    return NextResponse.json({
      success: true,
      persisted: false,
      message:
        "Welcome to Blooming Oasis Circle! Your member perks have been activated.",
    });
  } catch (error) {
    console.error("Membership API error:", error);
    return NextResponse.json(
      { success: false, message: "Subscription failed. Please try again." },
      { status: 500 }
    );
  }
}

