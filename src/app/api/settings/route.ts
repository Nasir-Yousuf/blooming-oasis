import { NextResponse } from "next/server";
import { getDbStoreSettings } from "@/lib/data-access";

export async function GET() {
  try {
    const settings = await getDbStoreSettings();
    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Settings public API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch store settings" },
      { status: 500 }
    );
  }
}

