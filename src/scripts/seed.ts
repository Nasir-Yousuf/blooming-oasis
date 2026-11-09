import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { Product } from "../models/Product";
import { Category } from "../models/Category";
import { Coupon } from "../models/Coupon";
import { StoreSettings } from "../models/StoreSettings";
import { INITIAL_PRODUCTS } from "../data/initialProducts";
import { INITIAL_CATEGORIES, INITIAL_COUPONS } from "../data/initialData";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

async function seedDatabase() {
  if (!MONGODB_URI) {
    console.error(
      "❌ MONGODB_URI is not set. Please set MONGODB_URI in .env.local to seed MongoDB."
    );
    process.exit(1);
  }

  try {
    console.log("🌱 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected successfully!");

    console.log("🧹 Clearing old product catalog and categories...");
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Coupon.deleteMany({});

    console.log(`🌿 Seeding ${INITIAL_CATEGORIES.length} categories...`);
    await Category.insertMany(INITIAL_CATEGORIES);

    console.log(`🌿 Seeding ${INITIAL_PRODUCTS.length} premium indoor plants...`);
    const inserted = await Product.insertMany(INITIAL_PRODUCTS);

    console.log(`🎟️ Seeding ${INITIAL_COUPONS.length} promotion coupons...`);
    await Coupon.insertMany(INITIAL_COUPONS);

    const existingSettings = await StoreSettings.findOne();
    if (!existingSettings) {
      console.log("⚙️ Initializing default store settings...");
      await StoreSettings.create({
        storeName: "Blooming Oasis",
        storeEmail: "care@bloomingoasis.demo",
        phone: "+1 (800) 555-PLANT",
        currency: "USD",
        deliveryCharge: 12,
        freeDeliveryThreshold: 75,
        address: "742 Botanical Way, Suite 4B, Verdant Green District, CA 94107",
        announcementText:
          "Bring home a little more green. Free nationwide delivery on orders over $75.",
        announcementActive: true,
        socialLinks: {
          instagram: "https://instagram.com",
          pinterest: "https://pinterest.com",
          facebook: "https://facebook.com",
          tiktok: "https://tiktok.com",
        },
      });
    }

    console.log(
      `🎉 Successfully seeded ${inserted.length} botanical products, ${INITIAL_CATEGORIES.length} categories, and coupons into Blooming Oasis!`
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed with error:", error);
    process.exit(1);
  }
}

seedDatabase();
