import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { Product } from "../models/Product";
import { INITIAL_PRODUCTS } from "../data/initialProducts";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

async function seedDatabase() {
  if (!MONGODB_URI) {
    console.error(
      "❌ MONGODB_URI is not set. Please set MONGODB_URI in .env.local to seed MongoDB Atlas."
    );
    process.exit(1);
  }

  try {
    console.log("🌱 Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected successfully!");

    console.log("🧹 Clearing old product catalog...");
    await Product.deleteMany({});

    console.log(`🌿 Seeding ${INITIAL_PRODUCTS.length} premium indoor plants...`);
    const inserted = await Product.insertMany(INITIAL_PRODUCTS);

    console.log(
      `🎉 Successfully seeded ${inserted.length} botanical products into Blooming Oasis!`
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed with error:", error);
    process.exit(1);
  }
}

seedDatabase();

