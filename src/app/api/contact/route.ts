import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ContactMessage } from "@/models/ContactMessage";
import { ContactMessageSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Server-side Zod validation
    const parsed = ContactMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsed.error.flatten().fieldErrors,
          message: "Please correct the errors in the form.",
        },
        { status: 400 }
      );
    }

    const { name, email, subject, category, message } = parsed.data;

    // 2. Connect to database
    const db = await connectToDatabase();

    if (db) {
      // 3. Prevent duplicate submissions: check if duplicate exists in the last 2 minutes
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
      const duplicate = await ContactMessage.findOne({
        email: email.toLowerCase(),
        message: message,
        createdAt: { $gte: twoMinutesAgo },
      });

      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            message:
              "We have already received your message just a moment ago. Our plant care team is reviewing it!",
            duplicate: true,
          },
          { status: 429 }
        );
      }

      // 4. Save into MongoDB
      const savedDoc = await ContactMessage.create({
        name,
        email: email.toLowerCase(),
        subject,
        category,
        message,
        status: "unread",
      });

      return NextResponse.json({
        success: true,
        persisted: true,
        messageId: savedDoc._id,
        message:
          "Thank you! Your message has been safely received by our botanical specialists.",
      });
    }

    // Fallback when MongoDB is pending configuration:
    console.log(
      "[Advisory] Contact message validated (MongoDB Atlas credentials pending):",
      { name, email, subject, category }
    );

    return NextResponse.json({
      success: true,
      persisted: false,
      message:
        "Thank you! Your inquiry has been received and processed successfully.",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected server error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}

