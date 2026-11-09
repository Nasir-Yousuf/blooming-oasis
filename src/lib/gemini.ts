import { GoogleGenAI, Type } from "@google/genai";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { Order } from "@/models/Order";
import { StoreSettings } from "@/models/StoreSettings";
import { AiSettings } from "@/models/AiSettings";
import { TokenPayload } from "@/lib/auth";
import { INITIAL_PRODUCTS } from "@/data/initialProducts";
import { INITIAL_CATEGORIES } from "@/data/initialData";
import { IProductCardSummary } from "@/models/AiConversation";
import mongoose from "mongoose";

// Configurable model name with fallback
export function getGeminiModel(): string {
  return process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
}

// In-memory dynamic catalog registry for immediate synchronization
const dynamicCatalogStore: any[] = INITIAL_PRODUCTS.map((p) => ({
  ...p,
  published: true,
}));

export function registerDynamicProduct(product: any) {
  const existingIdx = dynamicCatalogStore.findIndex(
    (p) => p.slug === product.slug || (product._id && String(p._id) === String(product._id))
  );
  if (existingIdx >= 0) {
    dynamicCatalogStore[existingIdx] = {
      ...dynamicCatalogStore[existingIdx],
      ...product,
    };
  } else {
    dynamicCatalogStore.unshift({
      ...product,
      published: product.published ?? true,
      stock: product.stock ?? 15,
      images: product.images || [
        "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80",
      ],
    });
  }
}

export function updateDynamicProduct(slugOrId: string, updates: Record<string, any>) {
  const item = dynamicCatalogStore.find(
    (p) => p.slug === slugOrId || String(p._id) === slugOrId
  );
  if (item) {
    Object.assign(item, updates);
  }
}

export function getDynamicCatalog(): any[] {
  return dynamicCatalogStore;
}

// Client singleton initializer
let genAiClient: GoogleGenAI | null = null;

export function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured in the environment variables."
    );
  }
  if (!genAiClient) {
    genAiClient = new GoogleGenAI({ apiKey });
  }
  return genAiClient;
}

// Tool function declarations for Gemini
const TOOL_DECLARATIONS: any[] = [
  {
    functionDeclarations: [
      {
        name: "search_products",
        description:
          "Search the live Blooming Oasis plant and accessory catalog by criteria such as sunlight, watering difficulty, pet-friendliness, price, category, and keywords.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            query: {
              type: Type.STRING,
              description:
                "Search term or plant name (e.g. 'monstera', 'fern', 'hanging')",
            },
            category: {
              type: Type.STRING,
              description:
                "Category name (e.g. 'Tropical', 'Succulent', 'Foliage', 'Flowering', 'Ferns', 'Trees')",
            },
            sunlight: {
              type: Type.STRING,
              description:
                "Light level: 'Low light', 'Indirect sunlight', 'Bright indirect sunlight', 'Direct sunlight'",
            },
            watering: {
              type: Type.STRING,
              description:
                "Watering routine: 'Low maintenance', 'Weekly care', 'I enjoy regular plant care'",
            },
            difficulty: {
              type: Type.STRING,
              description:
                "Care difficulty level: 'Beginner', 'Intermediate', 'Experienced'",
            },
            petFriendly: {
              type: Type.BOOLEAN,
              description:
                "Filter for plants that are safe and non-toxic for cats and dogs",
            },
            minPrice: {
              type: Type.NUMBER,
              description: "Minimum price in USD",
            },
            maxPrice: {
              type: Type.NUMBER,
              description: "Maximum price in USD",
            },
            inStockOnly: {
              type: Type.BOOLEAN,
              description: "Whether to only return items currently in stock",
            },
          },
        },
      },
      {
        name: "get_product_details",
        description:
          "Retrieve complete botanical and commercial details for an actual product by its URL slug or database ID.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            slugOrId: {
              type: Type.STRING,
              description:
                "The product slug (e.g. 'monstera-deliciosa', 'snake-plant-laurentii') or MongoDB ID",
            },
          },
          required: ["slugOrId"],
        },
      },
      {
        name: "get_categories",
        description:
          "Retrieve all currently active plant categories available in Blooming Oasis.",
        parameters: {
          type: Type.OBJECT,
          properties: {},
        },
      },
      {
        name: "get_featured_products",
        description:
          "Retrieve curated and featured botanical products currently spotlighted in the nursery.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            limit: {
              type: Type.INTEGER,
              description: "Number of featured products to retrieve (max 10)",
            },
          },
        },
      },
      {
        name: "get_available_products",
        description:
          "Retrieve currently published products that are in stock and ready for customer purchase.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: "Optional category filter",
            },
            limit: {
              type: Type.INTEGER,
              description: "Maximum number of products to return (default 6)",
            },
          },
        },
      },
      {
        name: "get_store_info",
        description:
          "Retrieve official Blooming Oasis store information, greenhouse location, contact details, delivery rates, free shipping thresholds, and care guarantee policies.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            topic: {
              type: Type.STRING,
              description:
                "Topic: 'delivery', 'policies', 'contact', 'hours', or 'all'",
            },
          },
        },
      },
      {
        name: "get_customer_orders",
        description:
          "Retrieve order history and tracking status for the currently authenticated customer.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            limit: {
              type: Type.INTEGER,
              description: "Maximum number of recent orders to retrieve",
            },
          },
        },
      },
      {
        name: "get_order_details",
        description:
          "Retrieve detailed items, tracking timeline, and status for a specific order belonging to the authenticated customer.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            orderNumber: {
              type: Type.STRING,
              description: "The order number (e.g. 'BO-849201')",
            },
          },
          required: ["orderNumber"],
        },
      },
    ],
  },
];

// Helper to transform product model/object to UI card summary
function toProductCard(p: any, reason?: string): IProductCardSummary {
  const images = Array.isArray(p.images) ? p.images : [];
  return {
    id: p._id ? String(p._id) : p.slug,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    discountPrice: p.discountPrice ? Number(p.discountPrice) : 0,
    image: images[0] || "",
    category: p.category || "Tropical",
    difficulty: p.difficulty,
    sunlight: p.sunlight,
    petFriendly: Boolean(p.petFriendly),
    stock: typeof p.stock === "number" ? p.stock : 10,
    reason,
  };
}

// Tool Implementation Execution
export async function executeAiTool(
  toolName: string,
  args: Record<string, any>,
  authUser: TokenPayload | null,
  collectedCards: Map<string, IProductCardSummary>
): Promise<any> {
  const db = await connectToDatabase();

  switch (toolName) {
    case "search_products": {
      const {
        query,
        category,
        sunlight,
        watering,
        difficulty,
        petFriendly,
        minPrice,
        maxPrice,
        inStockOnly,
      } = args;

      if (db) {
        try {
          const filter: Record<string, any> = { published: true };

          if (inStockOnly) {
            filter.stock = { $gt: 0 };
          }

          if (category && category !== "All") {
            filter.category = new RegExp(category, "i");
          }

          if (difficulty && difficulty !== "All") {
            filter.difficulty = difficulty;
          }

          if (typeof petFriendly === "boolean") {
            filter.petFriendly = petFriendly;
          }

          if (sunlight) {
            filter.sunlight = new RegExp(sunlight, "i");
          }

          if (watering) {
            filter.watering = new RegExp(watering, "i");
          }

          if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};
            if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
            if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
          }

          if (query) {
            filter.$or = [
              { name: { $regex: query, $options: "i" } },
              { botanicalName: { $regex: query, $options: "i" } },
              { description: { $regex: query, $options: "i" } },
              { tags: { $regex: query, $options: "i" } },
            ];
          }

          const products = await Product.find(filter)
            .limit(8)
            .sort({ featured: -1, rating: -1 })
            .lean();

          products.forEach((p) => {
            const card = toProductCard(p);
            collectedCards.set(card.slug, card);
          });

          return {
            source: "mongodb-atlas",
            count: products.length,
            products: products.map((p) => ({
              id: String(p._id),
              name: p.name,
              slug: p.slug,
              botanicalName: p.botanicalName,
              tagline: p.tagline,
              price: p.price,
              discountPrice: p.discountPrice,
              stock: p.stock,
              category: p.category,
              sunlight: p.sunlight,
              watering: p.watering,
              difficulty: p.difficulty,
              petFriendly: p.petFriendly,
              toxicity: p.toxicity,
              url: `/products/${p.slug}`,
            })),
          };
        } catch (err) {
          console.warn("DB search failed, falling back to static:", err);
        }
      }

      // In-memory / dynamic catalog fallback
      let list = dynamicCatalogStore.filter((p) => p.published !== false);
      if (category && category !== "All") {
        list = list.filter((p) =>
          p.category.toLowerCase().includes(category.toLowerCase())
        );
      }
      if (difficulty && difficulty !== "All") {
        list = list.filter((p) => p.difficulty === difficulty);
      }
      if (typeof petFriendly === "boolean") {
        list = list.filter((p) => p.petFriendly === petFriendly);
      }
      if (sunlight) {
        list = list.filter((p) =>
          p.sunlight.toLowerCase().includes(sunlight.toLowerCase())
        );
      }
      if (watering) {
        list = list.filter((p) =>
          p.watering.toLowerCase().includes(watering.toLowerCase())
        );
      }
      if (minPrice !== undefined) {
        list = list.filter((p) => p.price >= Number(minPrice));
      }
      if (maxPrice !== undefined) {
        list = list.filter((p) => p.price <= Number(maxPrice));
      }
      if (inStockOnly) {
        list = list.filter((p) => p.stock > 0);
      }
      if (query) {
        const q = query.toLowerCase();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.botanicalName.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.tags && Array.isArray(p.tags) && p.tags.some((t: string) => t.toLowerCase().includes(q))
        );
      }

      const results = list.slice(0, 8);
      results.forEach((p) => {
        const card = toProductCard(p);
        collectedCards.set(card.slug, card);
      });

      return {
        source: "initial-products-catalog",
        count: results.length,
        products: results.map((p) => ({
          name: p.name,
          slug: p.slug,
          botanicalName: p.botanicalName,
          tagline: p.tagline,
          price: p.price,
          stock: p.stock,
          category: p.category,
          sunlight: p.sunlight,
          watering: p.watering,
          difficulty: p.difficulty,
          petFriendly: p.petFriendly,
          toxicity: p.toxicity,
          url: `/products/${p.slug}`,
        })),
      };
    }

    case "get_product_details": {
      const { slugOrId } = args;
      if (!slugOrId) return { error: "Product slug or ID is required" };

      if (db) {
        try {
          const isObjectId = mongoose.Types.ObjectId.isValid(slugOrId);
          const filter = isObjectId
            ? { $or: [{ _id: slugOrId }, { slug: slugOrId }] }
            : { slug: slugOrId };

          const product = await Product.findOne(filter).lean();
          if (product) {
            const card = toProductCard(product);
            collectedCards.set(card.slug, card);

            return {
              found: true,
              product: {
                id: String(product._id),
                name: product.name,
                slug: product.slug,
                botanicalName: product.botanicalName,
                sku: product.sku,
                tagline: product.tagline,
                description: product.description,
                price: product.price,
                discountPrice: product.discountPrice,
                category: product.category,
                sunlight: product.sunlight,
                watering: product.watering,
                humidity: product.humidity,
                difficulty: product.difficulty,
                toxicity: product.toxicity,
                petFriendly: product.petFriendly,
                growthRate: product.growthRate,
                repottingFrequency: product.repottingFrequency,
                stock: product.stock,
                published: product.published,
                sizes: product.sizes,
                accessories: product.accessories,
                url: `/products/${product.slug}`,
              },
            };
          }
        } catch (err) {
          console.warn("DB get_product_details error:", err);
        }
      }

      // In-memory fallback
      const found = dynamicCatalogStore.find(
        (p) =>
          p.slug === slugOrId ||
          p.name.toLowerCase() === slugOrId.toLowerCase() ||
          String(p._id) === slugOrId
      );
      if (found) {
        if (found.published === false) {
          return {
            found: true,
            published: false,
            message: `Product '${found.name}' is currently unpublished / archived and not available for purchase.`,
            product: { ...found, published: false },
          };
        }
        const card = toProductCard(found);
        collectedCards.set(card.slug, card);
        return {
          found: true,
          product: {
            ...found,
            published: true,
            url: `/products/${found.slug}`,
          },
        };
      }

      return { found: false, message: `Product '${slugOrId}' was not found in our catalog.` };
    }

    case "get_categories": {
      if (db) {
        try {
          const categories = await Category.find({ active: true })
            .sort({ displayOrder: 1 })
            .lean();
          if (categories.length > 0) {
            return {
              categories: categories.map((c) => ({
                name: c.name,
                slug: c.slug,
                description: c.description,
              })),
            };
          }
        } catch (err) {
          console.warn("DB get_categories error:", err);
        }
      }

      return {
        categories: INITIAL_CATEGORIES.map((c) => ({
          name: c.name,
          slug: c.slug,
          description: c.description,
        })),
      };
    }

    case "get_featured_products": {
      const limit = Math.min(Number(args.limit) || 4, 10);
      if (db) {
        try {
          const featured = await Product.find({ featured: true, published: true })
            .limit(limit)
            .lean();
          if (featured.length > 0) {
            featured.forEach((p) => {
              const card = toProductCard(p);
              collectedCards.set(card.slug, card);
            });
            return {
              count: featured.length,
              products: featured.map((p) => ({
                name: p.name,
                slug: p.slug,
                price: p.price,
                category: p.category,
                sunlight: p.sunlight,
                difficulty: p.difficulty,
                url: `/products/${p.slug}`,
              })),
            };
          }
        } catch (err) {
          console.warn("DB get_featured_products error:", err);
        }
      }

      const featured = INITIAL_PRODUCTS.filter((p) => p.featured).slice(0, limit);
      featured.forEach((p) => {
        const card = toProductCard(p);
        collectedCards.set(card.slug, card);
      });
      return {
        count: featured.length,
        products: featured.map((p) => ({
          name: p.name,
          slug: p.slug,
          price: p.price,
          category: p.category,
          sunlight: p.sunlight,
          difficulty: p.difficulty,
          url: `/products/${p.slug}`,
        })),
      };
    }

    case "get_available_products": {
      const limit = Math.min(Number(args.limit) || 6, 12);
      const category = args.category;

      if (db) {
        try {
          const filter: Record<string, any> = {
            published: true,
            stock: { $gt: 0 },
          };
          if (category) filter.category = category;

          const available = await Product.find(filter).limit(limit).lean();
          available.forEach((p) => {
            const card = toProductCard(p);
            collectedCards.set(card.slug, card);
          });
          return {
            count: available.length,
            products: available.map((p) => ({
              name: p.name,
              slug: p.slug,
              price: p.price,
              category: p.category,
              stock: p.stock,
              url: `/products/${p.slug}`,
            })),
          };
        } catch (err) {
          console.warn("DB get_available_products error:", err);
        }
      }

      let list = INITIAL_PRODUCTS.filter((p) => p.stock > 0);
      if (category) list = list.filter((p) => p.category === category);
      const available = list.slice(0, limit);
      available.forEach((p) => {
        const card = toProductCard(p);
        collectedCards.set(card.slug, card);
      });
      return {
        count: available.length,
        products: available.map((p) => ({
          name: p.name,
          slug: p.slug,
          price: p.price,
          category: p.category,
          stock: p.stock,
          url: `/products/${p.slug}`,
        })),
      };
    }

    case "get_store_info": {
      let storeSettings: any = null;
      let aiSettings: any = null;

      if (db) {
        try {
          storeSettings = await StoreSettings.findOne().lean();
          aiSettings = await AiSettings.findOne().lean();
        } catch (err) {
          console.warn("DB get_store_info error:", err);
        }
      }

      return {
        storeName: storeSettings?.storeName || "Blooming Oasis",
        storeEmail: storeSettings?.storeEmail || "care@bloomingoasis.demo",
        phone: storeSettings?.phone || "+1 (800) 555-PLANT",
        physicalAddress:
          storeSettings?.address ||
          "742 Botanical Way, Suite 4B, Verdant Green District, CA 94107",
        baseDeliveryFee: storeSettings?.deliveryCharge ?? 12,
        freeDeliveryThreshold: storeSettings?.freeDeliveryThreshold ?? 75,
        announcement:
          storeSettings?.announcementText ||
          "Bring home a little more green. Free delivery on orders over $75.",
        greenhouseHours:
          "Monday to Saturday: 9:00 AM - 6:00 PM PST. Closed Sundays for conservatory watering & propagation.",
        careGuarantee:
          "30-Day Healthy Plant Guarantee: If your plant arrives damaged or perishes within 30 days despite recommended care, we replace it free of charge.",
        customStorePolicies: aiSettings?.customKnowledge || "",
      };
    }

    case "get_customer_orders": {
      // SECURITY ENFORCEMENT: Server-side authentication check
      if (!authUser) {
        return {
          authenticated: false,
          message:
            "The customer is currently browsing as a guest. Please advise them to sign in at /account or /admin/login to view their personal order history and delivery tracking.",
        };
      }

      const limit = Math.min(Number(args.limit) || 5, 10);

      if (db) {
        try {
          const orders = await Order.find({
            $or: [
              { "customer.userId": authUser.userId },
              { "customer.email": authUser.email.toLowerCase() },
            ],
          })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

          return {
            authenticated: true,
            customerName: authUser.name,
            totalOrdersFound: orders.length,
            orders: orders.map((o) => ({
              orderNumber: o.orderNumber,
              date: o.createdAt,
              status: o.status,
              paymentStatus: o.paymentStatus,
              total: o.total,
              items: o.items.map((i) => ({
                productName: i.productName,
                productSlug: i.productSlug,
                size: i.size,
                quantity: i.quantity,
                unitPrice: i.unitPrice,
                totalPrice: i.totalPrice,
              })),
            })),
          };
        } catch (err) {
          console.warn("DB get_customer_orders error:", err);
        }
      }

      // Demo orders for authenticated user preview with strict ownership verification
      const isSophia =
        Boolean(authUser.email?.toLowerCase().includes("sophia")) ||
        authUser.userId === "cust-101" ||
        Boolean(authUser.name?.toLowerCase().includes("sophia"));

      if (!isSophia) {
        return {
          authenticated: true,
          customerName: authUser.name,
          totalOrdersFound: 0,
          orders: [],
          message: "No orders found associated with your verified account.",
        };
      }

      return {
        authenticated: true,
        customerName: authUser.name,
        totalOrdersFound: 2,
        orders: [
          {
            orderNumber: "BO-849201",
            status: "Processing",
            date: new Date(Date.now() - 3600000 * 24).toISOString(),
            total: 137.7,
            items: [
              {
                productName: "Monstera Deliciosa",
                productSlug: "monstera-deliciosa",
                size: "Large",
                quantity: 1,
                unitPrice: 68,
              },
            ],
          },
          {
            orderNumber: "BO-592813",
            status: "Delivered",
            date: new Date(Date.now() - 3600000 * 24 * 14).toISOString(),
            total: 84,
            items: [
              {
                productName: "Snake Plant Laurentii",
                productSlug: "snake-plant-laurentii",
                size: "Standard",
                quantity: 2,
                unitPrice: 42,
              },
            ],
          },
        ],
      };
    }

    case "get_order_details": {
      const { orderNumber } = args;
      if (!orderNumber) return { error: "Order number is required" };

      // SECURITY ENFORCEMENT: Server-side authentication check
      if (!authUser) {
        return {
          authenticated: false,
          message:
            "Please log in at /account to view details for this order. For your privacy and security, order details cannot be displayed to unverified guests.",
        };
      }

      if (db) {
        try {
          const order = await Order.findOne({ orderNumber }).lean();
          if (!order) {
            return {
              found: false,
              message: `Order #${orderNumber} was not found in our records.`,
            };
          }

          // STRICT OWNERSHIP VERIFICATION
          const userMatches =
            (order.customer.userId && order.customer.userId === authUser.userId) ||
            order.customer.email.toLowerCase() === authUser.email.toLowerCase();

          if (!userMatches) {
            return {
              found: true,
              authorized: false,
              error:
                "Access denied. This order belongs to a different account. For customer privacy, you can only view orders associated with your verified email address.",
            };
          }

          return {
            found: true,
            authorized: true,
            order: {
              orderNumber: order.orderNumber,
              status: order.status,
              createdAt: order.createdAt,
              paymentMethod: order.paymentMethod,
              paymentStatus: order.paymentStatus,
              subtotal: order.subtotal,
              deliveryCharge: order.deliveryCharge,
              discount: order.discount,
              total: order.total,
              timeline: order.statusTimeline,
              items: order.items.map((i) => ({
                productName: i.productName,
                productSlug: i.productSlug,
                size: i.size,
                quantity: i.quantity,
                unitPrice: i.unitPrice,
                totalPrice: i.totalPrice,
              })),
            },
          };
        } catch (err) {
          console.warn("DB get_order_details error:", err);
        }
      }

      // Demo fallback order with strict customer ownership verification
      if (orderNumber === "BO-849201" || orderNumber === "BO-592813") {
        const isOwner =
          Boolean(authUser.email?.toLowerCase().includes("sophia")) ||
          authUser.userId === "cust-101" ||
          Boolean(authUser.name?.toLowerCase().includes("sophia"));

        if (!isOwner) {
          return {
            found: true,
            authorized: false,
            error:
              "Access denied. This order belongs to a different account. For customer privacy, you can only view orders associated with your verified email address.",
          };
        }

        return {
          found: true,
          authorized: true,
          order: {
            orderNumber,
            status: orderNumber === "BO-849201" ? "Processing" : "Delivered",
            total: orderNumber === "BO-849201" ? 137.7 : 84,
            items: [
              {
                productName:
                  orderNumber === "BO-849201"
                    ? "Monstera Deliciosa"
                    : "Snake Plant Laurentii",
                quantity: 1,
                unitPrice: orderNumber === "BO-849201" ? 68 : 42,
              },
            ],
          },
        };
      }

      return {
        found: false,
        message: `Order #${orderNumber} could not be located in our system.`,
      };
    }

    default:
      return { error: `Unknown tool function: ${toolName}` };
  }
}

// Generate the authoritative system instructions for Blooming AI
export async function buildSystemInstruction(): Promise<string> {
  let displayName = "Blooming AI";
  let customKnowledge = "";

  try {
    const db = await connectToDatabase();
    if (db) {
      const settings = await AiSettings.findOne().lean();
      if (settings) {
        if (settings.displayName) displayName = settings.displayName;
        if (settings.customKnowledge) customKnowledge = settings.customKnowledge;
      }
    }
  } catch {
    // Non-blocking
  }

  return `You are ${displayName}, the official Personal Plant Specialist and botanical concierge at Blooming Oasis.

YOUR IDENTITY & PERSONALITY:
- Name: ${displayName}
- Role: Personal Plant Specialist at Blooming Oasis
- Personality: Friendly, knowledgeable, patient, professional, approachable, helpful, natural, and conversational.
- Communication style: Speak like an enthusiastic, caring botanist and interior horticulturist, NOT like a robotic or generic AI chatbot.

CRITICAL PRODUCT CATALOG & PRICING RULES (MANDATORY):
1. LIVE DATABASE ONLY: You have direct access to our live MongoDB catalog via tool calls ('search_products', 'get_product_details', 'get_featured_products', 'get_available_products', 'get_categories').
2. NEVER INVENT OR HALLUCINATE: You must NEVER invent a plant name, SKU, price, discount, size, or stock quantity. Every recommendation MUST come from a live tool call.
3. PRICE & AVAILABILITY: Always quote the exact price and stock status returned from the catalog. If a plant has a discount price, highlight both the regular and discounted price.
4. OUT OF STOCK: If an item has stock 0 or is out of stock, explain that clearly to the customer. Never recommend out-of-stock or unpublished products as currently purchasable items.
5. LINKS: When mentioning products, always link to them using markdown: [Plant Name](/products/plant-slug).
6. ACCESSORIES: When customers ask for pots, planters, soil, or accessories (e.g. for a Monstera), check the product's accessories or catalog tools.

PLANT CARE & DIAGNOSTIC EXPERTISE:
You provide clear, practical, step-by-step guidance on:
- Indoor plant selection based on lighting, space, pets, and lifestyle
- Watering techniques (the "finger test", bottom watering, seasonal adjustments)
- Sunlight conditions (low light, medium indirect, bright indirect, direct sun)
- Soil types, perlite, drainage, aerated potting mixes
- Fertilizers and seasonal feeding
- Humidity requirements and misting vs. pebble trays
- Repotting best practices (pot sizing, root bound signs, spring timing)
- Propagation methods (stem cuttings in water, node placement, division)
- Pest identification (spider mites, fungus gnats, mealybugs, scale) & organic treatments (neem oil, insecticidal soap)
- Diagnosing yellowing leaves, brown crispy tips, drooping, and root rot
- Pet-friendly & non-toxic varieties for households with cats or dogs

SAFETY & UNCERTAINTY GUIDELINES:
- When uncertain about a diagnosis or plant species, communicate uncertainty clearly instead of pretending to know.
- SAFETY WITH PETS & CHILDREN: Never provide dangerous medical or toxicity advice. If a customer reports that a pet or child has chewed or ingested a potentially toxic plant or is showing symptoms of poisoning, immediately advise them to contact an emergency veterinarian, animal poison control, or poison control center.

STORE POLICIES & ORDER SUPPORT:
- Use 'get_store_info' to retrieve official shipping charges, free shipping thresholds, and greenhouse location.
- For order questions ("Where is my order?", "Status of BO-12345"), call 'get_customer_orders' or 'get_order_details'.
- Security: If the tool reports that the user is a guest / unauthenticated, politely instruct them to sign in at /account to access their orders. Never guess or display another user's order details.
- Never claim to cancel an order, alter shipping addresses, or execute refunds directly. Direct them to customer support at our contact page or email.

STORE KNOWLEDGE:
${customKnowledge ? `Additional store context: ${customKnowledge}` : ""}

Keep your replies warm, botanically accurate, concise, and helpful.`;
}

export interface ChatResponseResult {
  text: string;
  productCards: IProductCardSummary[];
  toolCallsCount: number;
}

// Multi-turn conversational processor with Google Gen AI SDK
export async function processChatWithGemini(
  userMessage: string,
  history: Array<{ role: "user" | "model" | "assistant"; content: string }>,
  authUser: TokenPayload | null
): Promise<ChatResponseResult> {
  const ai = getGenAIClient();
  const modelName = getGeminiModel();
  const systemInstruction = await buildSystemInstruction();

  // Map history to SDK format (only 'user' and 'model' roles allowed)
  const contents: any[] = [];

  for (const msg of history) {
    const role = msg.role === "model" ? "model" : "user";
    if (msg.content && msg.content.trim()) {
      contents.push({
        role,
        parts: [{ text: msg.content.trim() }],
      });
    }
  }

  // Add the current user query
  contents.push({
    role: "user",
    parts: [{ text: userMessage.trim() }],
  });

  const collectedCards = new Map<string, IProductCardSummary>();
  let totalToolCalls = 0;
  const MAX_TURNS = 5;

  let currentTurn = 0;
  let finalText = "";

  while (currentTurn < MAX_TURNS) {
    currentTurn++;

    let response: any = null;
    let attempts = 0;
    while (attempts < 3) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            tools: TOOL_DECLARATIONS,
            temperature: 0.7,
            maxOutputTokens: 1500,
          },
        });
        break;
      } catch (genErr: any) {
        attempts++;
        const errMsg = String(genErr?.message || "");
        if (
          (errMsg.includes("503") ||
            errMsg.includes("UNAVAILABLE") ||
            errMsg.includes("demand") ||
            errMsg.includes("429")) &&
          attempts < 3
        ) {
          await new Promise((r) => setTimeout(r, 1200 * attempts));
          continue;
        }
        throw genErr;
      }
    }

    const calls = response.functionCalls;

    if (calls && calls.length > 0) {
      totalToolCalls += calls.length;

      // Append model turn with function calls
      contents.push({
        role: "model",
        parts: response.candidates?.[0]?.content?.parts || [],
      });

      // Execute each tool and append response parts with role "user"
      const responseParts: any[] = [];

      for (const call of calls) {
        if (!call.name) continue;
        const toolName = call.name;
        const toolResult = await executeAiTool(
          toolName,
          (call.args || {}) as Record<string, any>,
          authUser,
          collectedCards
        );

        responseParts.push({
          functionResponse: {
            name: toolName,
            response: toolResult,
          },
        });
      }

      contents.push({
        role: "user",
        parts: responseParts,
      });

      // Loop continues to let Gemini produce the final conversational text
    } else {
      // Model produced text response without tool calls
      finalText = response.text || "";
      break;
    }
  }

  // Record usage metrics if database is connected
  try {
    const db = await connectToDatabase();
    if (db) {
      await AiSettings.findOneAndUpdate(
        {},
        {
          $inc: {
            "stats.totalMessages": 1,
            "stats.totalToolCalls": totalToolCalls,
          },
          $set: { "stats.lastActive": new Date() },
        },
        { upsert: true }
      );
    }
  } catch {
    // Non-blocking
  }

  return {
    text:
      finalText ||
      "I'm here to help with all your plant questions! Feel free to ask about our indoor plant collection, watering routines, or care diagnostics.",
    productCards: Array.from(collectedCards.values()),
    toolCallsCount: totalToolCalls,
  };
}
