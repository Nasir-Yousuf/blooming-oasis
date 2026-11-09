import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { getUserFromRequest, canManageProducts } from "@/lib/auth";
import { registerDynamicProduct } from "@/lib/gemini";
import { revalidateStoreCatalog } from "@/lib/data-access";

export async function GET(req: NextRequest) {
  try {
    const authUser = getUserFromRequest(req);
    if (!canManageProducts(authUser?.role)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Administrative privileges required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase().trim();
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database connection unavailable" },
        { status: 503 }
      );
    }

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
    if (!canManageProducts(authUser?.role)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Administrative privileges required to create plants." },
        { status: 403 }
      );
    }

    const body = await req.json();

    if (!body.name || body.price === undefined || !body.description || !body.category) {
      return NextResponse.json(
        { success: false, message: "Product name, category, price, and description are required" },
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
    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database connection unavailable" },
        { status: 503 }
      );
    }

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
      sunlight: body.sunlight || "Indirect sunlight",
      watering: body.watering || "Weekly care",
      difficulty: body.difficulty || "Beginner",
      toxicity: body.toxicity || "Non-toxic",
      petFriendly: body.petFriendly ?? false,
      stock: typeof body.stock === "number" ? body.stock : 10,
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

    registerDynamicProduct(newProduct.toObject ? newProduct.toObject() : newProduct);
    revalidateStoreCatalog();

    return NextResponse.json({
      success: true,
      product: newProduct,
      message: "Plant created and published successfully!",
    });
  } catch (error) {
    console.error("Admin product creation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create product" },
      { status: 500 }
    );
  }
}
