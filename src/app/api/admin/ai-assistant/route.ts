import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { AiSettings } from "@/models/AiSettings";
import { getUserFromRequest, hasAdminAccess } from "@/lib/auth";
import { getGeminiModel } from "@/lib/gemini";

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

    let settings = await AiSettings.findOne().lean();
    if (!settings) {
      settings = (await AiSettings.create({})).toObject();
    }

    // Secure environment status (Never reveal the actual secret API key!)
    const envStatus = {
      model: getGeminiModel(),
      apiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
      maskedKey: process.env.GEMINI_API_KEY
        ? `${process.env.GEMINI_API_KEY.slice(0, 6)}••••••••••••••••${process.env.GEMINI_API_KEY.slice(-4)}`
        : "Not Configured",
    };

    return NextResponse.json({
      success: true,
      settings,
      envStatus,
    });
  } catch (error) {
    console.error("Admin AI Assistant GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load AI Assistant settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authUser = getUserFromRequest(req);
    if (!hasAdminAccess(authUser?.role)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Administrator rights required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      enabled,
      displayName,
      welcomeMessage,
      suggestedQuestions,
      supportedTopics,
      customKnowledge,
    } = body;

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database connection unavailable" },
        { status: 503 }
      );
    }

    let settings = await AiSettings.findOne();
    if (!settings) {
      settings = new AiSettings({});
    }

    if (enabled !== undefined) settings.enabled = enabled;
    if (displayName) settings.displayName = displayName;
    if (welcomeMessage) settings.welcomeMessage = welcomeMessage;
    if (suggestedQuestions) settings.suggestedQuestions = suggestedQuestions;
    if (supportedTopics) settings.supportedTopics = supportedTopics;
    if (customKnowledge !== undefined) settings.customKnowledge = customKnowledge;

    await settings.save();

    return NextResponse.json({
      success: true,
      settings,
      message: "Blooming AI settings updated successfully!",
    });
  } catch (error) {
    console.error("Admin AI Assistant update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update AI settings" },
      { status: 500 }
    );
  }
}
