import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { INITIAL_PRODUCTS } from "@/data/initialProducts";

export async function GET() {
  return handleSeed();
}

export async function POST() {
  return handleSeed();
}

async function handleSeed() {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json({
        success: false,
        message:
          "MONGODB_URI is not set in environment. Please supply your MongoDB Atlas connection string in .env.local to seed the database.",
      });
    }

    // Delete existing products to refresh catalog
    await Product.deleteMany({});
    const inserted = await Product.insertMany(INITIAL_PRODUCTS);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${inserted.length} premium indoor plants into MongoDB Atlas!`,
      count: inserted.length,
    });
  } catch (error) {
    console.error("Database seed error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to seed database" },
      { status: 500 }
    );
  }
}

