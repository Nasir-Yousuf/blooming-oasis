import { NextResponse } from "next/server";
import { getDbCategories } from "@/lib/data-access";

export async function GET() {
  try {
    const categories = await getDbCategories(true);
    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Categories public API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

