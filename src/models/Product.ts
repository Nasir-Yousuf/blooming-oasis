import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductSize {
  name: string;
  priceModifier: number;
  height: string;
}

export interface IProductAccessory {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  botanicalName?: string;
  sku?: string;
  tagline: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  sunlight: "Low light" | "Indirect sunlight" | "Bright indirect sunlight" | "Direct sunlight";
  watering: "Low maintenance" | "Weekly care" | "I enjoy regular plant care";
  humidity: "Normal (40-50%)" | "High (60%+)" | "Tolerates dry air";
  difficulty: "Beginner" | "Intermediate" | "Experienced";
  toxicity: string;
  petFriendly: boolean;
  growthRate: "Slow" | "Moderate" | "Fast";
  repottingFrequency: string;
  sizes: IProductSize[];
  accessories: IProductAccessory[];
  stock: number;
  featured: boolean;
  published: boolean;
  rating: number;
  reviewsCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    botanicalName: { type: String, default: "" },
    sku: { type: String, default: "" },
    tagline: { type: String, default: "" },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0 },
    images: { type: [String], default: [] },
    category: {
      type: String,
      required: true,
      index: true,
    },
    sunlight: {
      type: String,
      required: true,
      enum: ["Low light", "Indirect sunlight", "Bright indirect sunlight", "Direct sunlight"],
    },
    watering: {
      type: String,
      required: true,
      enum: ["Low maintenance", "Weekly care", "I enjoy regular plant care"],
    },
    humidity: { type: String, default: "Normal (40-50%)" },
    difficulty: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Experienced"],
    },
    toxicity: { type: String, required: true },
    petFriendly: { type: Boolean, required: true, default: false },
    growthRate: {
      type: String,
      enum: ["Slow", "Moderate", "Fast"],
      default: "Moderate",
    },
    repottingFrequency: { type: String, default: "Every 1-2 years" },
    sizes: [
      {
        name: { type: String, required: true },
        priceModifier: { type: Number, default: 0 },
        height: { type: String, required: true },
      },
    ],
    accessories: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, default: "" },
        image: { type: String },
      },
    ],
    stock: { type: Number, default: 20 },
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: true, index: true },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 24 },
    tags: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
