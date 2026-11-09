import { NextRequest, NextResponse } from "next/server";
import {
  ChatRequestSchema,
  checkRateLimit,
  sanitizeInput,
  getFriendlyErrorMessage,
} from "@/lib/ai-security";
import { processChatWithGemini } from "@/lib/gemini";
import { getUserFromRequest } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { AiSettings } from "@/models/AiSettings";
import { AiConversation } from "@/models/AiConversation";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown-client";

    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You have sent several messages quickly. Please pause for a moment to let our plant specialist catch up!",
          retryAfterMs: rateLimit.resetMs,
        },
        { status: 429 }
      );
    }

    // 2. Validate Request Body with Zod
    const rawBody = await req.json();
    const parseResult = ChatRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const firstError =
        parseResult.error.issues?.[0]?.message || "Invalid chat request format";
      return NextResponse.json(
        { success: false, error: firstError },
        { status: 400 }
      );
    }

    const { message, sessionId = `session-${Date.now()}`, history = [] } =
      parseResult.data;
    const sanitizedUserMessage = sanitizeInput(message);

    if (!sanitizedUserMessage) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid question or comment." },
        { status: 400 }
      );
    }

    // 3. Verify Admin AI Assistant Status
    const db = await connectToDatabase();
    if (db) {
      const settings = await AiSettings.findOne().lean();
      if (settings && settings.enabled === false) {
        return NextResponse.json({
          success: false,
          disabled: true,
          error:
            "Blooming AI is currently offline for greenhouse maintenance. Please explore our curated collections or visit our Contact page for assistance.",
        });
      }
    }

    // 4. Extract Authenticated User (Secure Server-Side Check)
    const authUser = getUserFromRequest(req);

    // 5. Process with Gemini & Live Database Tools
    const result = await processChatWithGemini(
      sanitizedUserMessage,
      history,
      authUser
    );

    const botMessageId = `model-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const userMessageId = `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    // 6. Persist Conversation in MongoDB if available
    if (db && sessionId) {
      try {
        const userEntry = {
          id: userMessageId,
          role: "user" as const,
          content: sanitizedUserMessage,
          timestamp: new Date(),
        };

        const modelEntry = {
          id: botMessageId,
          role: "model" as const,
          content: result.text,
          timestamp: new Date(),
          productRecommendations: result.productCards,
        };

        await AiConversation.findOneAndUpdate(
          { sessionId },
          {
            $push: { messages: { $each: [userEntry, modelEntry] } },
            $setOnInsert: {
              sessionId,
              userId: authUser?.userId,
              userEmail: authUser?.email,
            },
          },
          { upsert: true, new: true }
        );

        // Increment conversation counter if new
        await AiSettings.findOneAndUpdate(
          {},
          { $inc: { "stats.totalConversations": 1 } }
        );
      } catch (dbSaveErr) {
        console.warn("Failed to persist conversation history:", dbSaveErr);
      }
    }

    return NextResponse.json({
      success: true,
      sessionId,
      message: {
        id: botMessageId,
        role: "model",
        content: result.text,
        timestamp: new Date().toISOString(),
        productRecommendations: result.productCards,
      },
    });
  } catch (error: any) {
    console.error("Chat API route error:", error);
    const friendlyMessage = getFriendlyErrorMessage(error);
    return NextResponse.json(
      {
        success: false,
        error: friendlyMessage,
      },
      { status: 500 }
    );
  }
}

