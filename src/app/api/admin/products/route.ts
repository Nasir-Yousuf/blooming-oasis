import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { getUserFromRequest, canManageProducts } from "@/lib/auth";
import { INITIAL_PRODUCTS } from "@/data/initialProducts";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase();
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    const db = await connectToDatabase();

    if (db) {
      const query: Record<string, unknown> = {};

      if (category && category !== "All") {
        query.category = category;
      }

      if (status === "published") {
        query.published = true;
      } else if (status === "draft") {
        query.published = false;
      } else if (status === "low_stock") {
        query.stock = { $lte: 5 };
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { botanicalName: { $regex: search, $options: "i" } },
          { sku: { $regex: search, $options: "i" } },
        ];
      }

      const products = await Product.find(query).sort({ createdAt: -1 }).lean();
      return NextResponse.json({ success: true, count: products.length, products });
    }

    // Fallback
    return NextResponse.json({
      success: true,
      count: INITIAL_PRODUCTS.length,
      products: INITIAL_PRODUCTS,
    });
  } catch (error) {
    console.error("Admin products GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = getUserFromRequest(req);
    // Allow dev convenience
    const body = await req.json();

    if (!body.name || !body.price || !body.description) {
      return NextResponse.json(
        { success: false, message: "Product name, price, and description are required" },
        { status: 400 }
      );
    }

    const slug =
      body.slug?.trim() ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const db = await connectToDatabase();

    if (db) {
      const existing = await Product.findOne({ slug });
      if (existing) {
        return NextResponse.json(
          { success: false, message: "A plant with this URL slug already exists" },
          { status: 409 }
        );
      }

      const newProduct = await Product.create({
        ...body,
        slug,
        sku: body.sku || `BO-${Math.floor(1000 + Math.random() * 9000)}`,
        sizes: body.sizes && body.sizes.length > 0 ? body.sizes : [
          { name: "Small", priceModifier: 0, height: "Standard (6\" pot)" },
          { name: "Medium", priceModifier: 20, height: "Medium (8\" pot)" },
          { name: "Large", priceModifier: 45, height: "Specimen (10\" pot)" },
        ],
        accessories: body.accessories || [
          {
            id: "ceramic-pot",
            name: "Artisan Ceramic Planter",
            price: 32,
            description: "Handcrafted stoneware with matching drainage saucer",
          },
        ],
        published: body.published ?? true,
      });

      return NextResponse.json({
        success: true,
        product: newProduct,
        message: "Plant created and published successfully!",
      });
    }

    return NextResponse.json({
      success: true,
      product: { ...body, _id: `local-${Date.now()}`, slug },
      message: "Plant created (Local Demonstration Mode)!",
    });
  } catch (error) {
    console.error("Admin product creation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create product" },
      { status: 500 }
    );
  }
}

