import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { INITIAL_PRODUCTS } from "@/data/initialProducts";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase();
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");
    const petFriendly = searchParams.get("petFriendly");
    const sort = searchParams.get("sort") || "featured";

    const db = await connectToDatabase();

    let products = [];
    let dataSource = "local-fallback";

    if (db) {
      try {
        const count = await Product.countDocuments();
        if (count === 0) {
          // Auto-seed if database is empty
          await Product.insertMany(INITIAL_PRODUCTS);
        }

        const query: Record<string, unknown> = {};
        if (category && category !== "All") query.category = category;
        if (difficulty && difficulty !== "All") query.difficulty = difficulty;
        if (petFriendly === "true") query.petFriendly = true;
        if (search) {
          query.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { botanicalName: { $regex: search, $options: "i" } },
          ];
        }

        let sortOption: Record<string, 1 | -1> = { featured: -1, createdAt: -1 };
        if (sort === "price-low") sortOption = { price: 1 };
        if (sort === "price-high") sortOption = { price: -1 };
        if (sort === "rating") sortOption = { rating: -1 };

        products = await Product.find(query).sort(sortOption).lean();
        dataSource = "mongodb-atlas";
      } catch (dbError) {
        console.warn("MongoDB query failed, using static catalog:", dbError);
        products = filterStaticProducts(search, category, difficulty, petFriendly, sort);
      }
    } else {
      products = filterStaticProducts(search, category, difficulty, petFriendly, sort);
    }

    return NextResponse.json({
      success: true,
      dataSource,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

function filterStaticProducts(
  search?: string,
  category?: string | null,
  difficulty?: string | null,
  petFriendly?: string | null,
  sort?: string | null
) {
  let list = [...INITIAL_PRODUCTS];

  if (category && category !== "All") {
    list = list.filter((p) => p.category === category);
  }

  if (difficulty && difficulty !== "All") {
    list = list.filter((p) => p.difficulty === difficulty);
  }

  if (petFriendly === "true") {
    list = list.filter((p) => p.petFriendly === true);
  }

  if (search) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.botanicalName.toLowerCase().includes(search)
    );
  }

  if (sort === "price-low") list.sort((a, b) => a.price - b.price);
  if (sort === "price-high") list.sort((a, b) => b.price - a.price);
  if (sort === "rating") list.sort((a, b) => b.rating - a.rating);

  return list;
}

