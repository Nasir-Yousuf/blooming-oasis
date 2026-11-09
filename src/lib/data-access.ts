import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { StoreSettings } from "@/models/StoreSettings";
import { revalidatePath } from "next/cache";

export interface SerializedProduct {
  _id: string;
  name: string;
  slug: string;
  botanicalName?: string;
  sku?: string;
  tagline?: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  sunlight: "Low light" | "Indirect sunlight" | "Bright indirect sunlight" | "Direct sunlight";
  watering: "Low maintenance" | "Weekly care" | "I enjoy regular plant care";
  humidity?: string;
  difficulty: "Beginner" | "Intermediate" | "Experienced";
  toxicity: string;
  petFriendly: boolean;
  growthRate?: "Slow" | "Moderate" | "Fast";
  repottingFrequency?: string;
  sizes: Array<{
    name: string;
    priceModifier: number;
    height: string;
  }>;
  accessories: Array<{
    id: string;
    name: string;
    price: number;
    description?: string;
    image?: string;
  }>;
  stock: number;
  featured: boolean;
  published: boolean;
  rating: number;
  reviewsCount: number;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SerializedCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  displayOrder: number;
  active: boolean;
  productCount?: number;
}

function serializeProduct(doc: any): SerializedProduct {
  return {
    _id: String(doc._id),
    name: doc.name,
    slug: doc.slug,
    botanicalName: doc.botanicalName || "",
    sku: doc.sku || "",
    tagline: doc.tagline || "",
    description: doc.description || "",
    price: Number(doc.price) || 0,
    discountPrice: doc.discountPrice ? Number(doc.discountPrice) : 0,
    images: Array.isArray(doc.images) ? doc.images : [],
    category: doc.category,
    sunlight: doc.sunlight,
    watering: doc.watering,
    humidity: doc.humidity || "Normal (40-50%)",
    difficulty: doc.difficulty,
    toxicity: doc.toxicity || "",
    petFriendly: Boolean(doc.petFriendly),
    growthRate: doc.growthRate || "Moderate",
    repottingFrequency: doc.repottingFrequency || "Every 1-2 years",
    sizes: (doc.sizes || []).map((s: any) => ({
      name: s.name,
      priceModifier: Number(s.priceModifier) || 0,
      height: s.height,
    })),
    accessories: (doc.accessories || []).map((a: any) => ({
      id: a.id,
      name: a.name,
      price: Number(a.price) || 0,
      description: a.description || "",
      image: a.image || "",
    })),
    stock: typeof doc.stock === "number" ? doc.stock : 0,
    featured: Boolean(doc.featured),
    published: doc.published !== false,
    rating: typeof doc.rating === "number" ? doc.rating : 4.8,
    reviewsCount: typeof doc.reviewsCount === "number" ? doc.reviewsCount : 0,
    tags: Array.isArray(doc.tags) ? doc.tags : [],
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : undefined,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : undefined,
  };
}

export async function getDbProducts(filter: Record<string, any> = {}): Promise<SerializedProduct[]> {
  const db = await connectToDatabase();
  if (!db) {
    throw new Error("Database connection unavailable");
  }

  const { search, ...restFilter } = filter;
  const query: Record<string, any> = { ...restFilter };
  // Default to published only unless explicitly querying all
  if (query.published === undefined) {
    query.published = true;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { botanicalName: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }

  const products = await Product.find(query).sort({ featured: -1, createdAt: -1 }).lean();
  return products.map(serializeProduct);
}

export async function getDbProductBySlug(slug: string, requirePublished: boolean = true): Promise<SerializedProduct | null> {
  const db = await connectToDatabase();
  if (!db) {
    throw new Error("Database connection unavailable");
  }

  const query: Record<string, any> = { slug };
  if (requirePublished) {
    query.published = true;
  }

  const product = await Product.findOne(query).lean();
  if (!product) return null;
  return serializeProduct(product);
}

export async function getDbCategories(activeOnly: boolean = true): Promise<SerializedCategory[]> {
  const db = await connectToDatabase();
  if (!db) {
    throw new Error("Database connection unavailable");
  }

  const query = activeOnly ? { active: true } : {};
  const categories = await Category.find(query).sort({ displayOrder: 1, name: 1 }).lean();

  const categoriesWithCount = await Promise.all(
    categories.map(async (cat) => {
      const productCount = await Product.countDocuments({
        category: cat.name,
        published: true,
      });
      return {
        _id: String(cat._id),
        name: cat.name,
        slug: cat.slug,
        description: cat.description || "",
        image: cat.image || "",
        displayOrder: cat.displayOrder || 0,
        active: cat.active !== false,
        productCount,
      };
    })
  );

  return categoriesWithCount;
}

export async function getDbStoreSettings() {
  const db = await connectToDatabase();
  if (!db) return null;

  let settings = await StoreSettings.findOne().lean();
  if (!settings) {
    settings = (await StoreSettings.create({})).toObject();
  }

  return {
    storeName: settings.storeName || "Blooming Oasis",
    storeEmail: settings.storeEmail || "care@bloomingoasis.demo",
    phone: settings.phone || "+1 (800) 555-PLANT",
    currency: settings.currency || "USD",
    deliveryCharge: typeof settings.deliveryCharge === "number" ? settings.deliveryCharge : 12,
    freeDeliveryThreshold: typeof settings.freeDeliveryThreshold === "number" ? settings.freeDeliveryThreshold : 75,
    address: settings.address || "742 Botanical Way, Suite 4B, Verdant Green District, CA 94107",
    announcementText:
      settings.announcementText ||
      "Bring home a little more green. Free nationwide delivery on orders over $75.",
    announcementActive: settings.announcementActive !== false,
    socialLinks: {
      instagram: settings.socialLinks?.instagram || "https://instagram.com",
      pinterest: settings.socialLinks?.pinterest || "https://pinterest.com",
      facebook: settings.socialLinks?.facebook || "https://facebook.com",
      tiktok: settings.socialLinks?.tiktok || "https://tiktok.com",
    },
  };
}

export function revalidateStoreCatalog() {
  try {
    revalidatePath("/", "page");
    revalidatePath("/products", "page");
    revalidatePath("/products/[slug]", "page");
    revalidatePath("/collections/[slug]", "page");
    revalidatePath("/admin/products", "page");
    revalidatePath("/admin/categories", "page");
    revalidatePath("/admin/inventory", "page");
  } catch (e) {
    // revalidatePath might throw if called outside Next.js request context (e.g. standalone scripts)
    console.warn("revalidateStoreCatalog note:", e);
  }
}
