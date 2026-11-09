import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { AiConversation } from "@/models/AiConversation";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ success: true, messages: [] });
    }

    const db = await connectToDatabase();
    if (db) {
      const convo = await AiConversation.findOne({ sessionId }).lean();
      if (convo) {
        return NextResponse.json({
          success: true,
          messages: convo.messages || [],
        });
      }
    }

    return NextResponse.json({ success: true, messages: [] });
  } catch (error) {
    console.error("Chat history GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load history" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (sessionId) {
      const db = await connectToDatabase();
      if (db) {
        await AiConversation.deleteOne({ sessionId });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Conversation cleared successfully.",
    });
  } catch (error) {
    console.error("Chat history DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to clear history" },
      { status: 500 }
    );
  }
}

