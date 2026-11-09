import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { INITIAL_PRODUCTS } from "@/data/initialProducts";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const db = await connectToDatabase();

    if (db) {
      try {
        const product = await Product.findOne({ slug }).lean();
        if (product) {
          return NextResponse.json({
            success: true,
            dataSource: "mongodb-atlas",
            data: product,
          });
        }
      } catch (e) {
        console.warn("DB lookup error, falling back to static:", e);
      }
    }

    const staticProduct = INITIAL_PRODUCTS.find((p) => p.slug === slug);
    if (!staticProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      dataSource: "local-fallback",
      data: staticProduct,
    });
  } catch (error) {
    console.error("Single product API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load product" },
      { status: 500 }
    );
  }
}

