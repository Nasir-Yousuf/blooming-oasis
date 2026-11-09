import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { INITIAL_CATEGORIES } from "@/data/initialData";

export async function GET() {
  try {
    const db = await connectToDatabase();

    if (db) {
      const count = await Category.countDocuments();
      if (count === 0) {
        await Category.insertMany(INITIAL_CATEGORIES);
      }

      const categories = await Category.find().sort({ displayOrder: 1 }).lean();

      // Aggregate product counts per category
      const categoriesWithCount = await Promise.all(
        categories.map(async (cat) => {
          const productCount = await Product.countDocuments({
            category: cat.name,
          });
          return { ...cat, productCount };
        })
      );

      return NextResponse.json({
        success: true,
        categories: categoriesWithCount,
      });
    }

    return NextResponse.json({
      success: true,
      categories: INITIAL_CATEGORIES.map((c, i) => ({
        ...c,
        _id: `cat-${i}`,
        productCount: 2,
      })),
    });
  } catch (error) {
    console.error("Categories GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json(
        { success: false, message: "Category name is required" },
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
      const existing = await Category.findOne({ slug });
      if (existing) {
        return NextResponse.json(
          { success: false, message: "Category slug already exists" },
          { status: 409 }
        );
      }

      const created = await Category.create({
        ...body,
        slug,
        image:
          body.image ||
          "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80",
      });

      return NextResponse.json({
        success: true,
        category: created,
        message: "Category created successfully",
      });
    }

    return NextResponse.json({
      success: true,
      category: { ...body, slug, _id: `local-cat-${Date.now()}` },
      message: "Category created (Demo Mode)",
    });
  } catch (error) {
    console.error("Category creation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create category" },
      { status: 500 }
    );
  }
}

