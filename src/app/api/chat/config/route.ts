import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { AiSettings } from "@/models/AiSettings";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      let settings = await AiSettings.findOne().lean();
      if (!settings) {
        settings = (await AiSettings.create({})).toObject();
      }
      return NextResponse.json({
        success: true,
        enabled: settings.enabled ?? true,
        displayName: settings.displayName || "Blooming AI",
        welcomeMessage:
          settings.welcomeMessage ||
          "Hello! I'm Blooming AI, your personal plant specialist. Whether you're looking for your first houseplant, trying to save a struggling Monstera, or finding the perfect plant for your home, I'm here to help. What can I help you grow today?",
        suggestedQuestions: settings.suggestedQuestions?.length
          ? settings.suggestedQuestions
          : [
              "Find a plant for my room",
              "Which plants are safe for pets?",
              "Help me care for my Monstera",
              "Recommend beginner-friendly plants",
              "Track my order",
            ],
      });
    }

    // Default configuration if DB offline
    return NextResponse.json({
      success: true,
      enabled: true,
      displayName: "Blooming AI",
      welcomeMessage:
        "Hello! I'm Blooming AI, your personal plant specialist. Whether you're looking for your first houseplant, trying to save a struggling Monstera, or finding the perfect plant for your home, I'm here to help. What can I help you grow today?",
      suggestedQuestions: [
        "Find a plant for my room",
        "Which plants are safe for pets?",
        "Help me care for my Monstera",
        "Recommend beginner-friendly plants",
        "Track my order",
      ],
    });
  } catch (error) {
    console.error("AI Config API error:", error);
    return NextResponse.json({
      success: true,
      enabled: true,
      displayName: "Blooming AI",
      welcomeMessage:
        "Hello! I'm Blooming AI, your personal plant specialist. What can I help you grow today?",
      suggestedQuestions: [
        "Find a plant for my room",
        "Which plants are safe for pets?",
        "Help me care for my Monstera",
        "Track my order",
      ],
    });
  }
}

