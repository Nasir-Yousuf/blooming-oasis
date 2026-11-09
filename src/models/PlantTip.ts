import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPlantTip extends Document {
  authorName: string;
  plantName: string;
  content: string;
  imageUrl?: string;
  status: "pending" | "approved" | "featured";
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const PlantTipSchema = new Schema<IPlantTip>(
  {
    authorName: { type: String, required: true, trim: true },
    plantName: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "featured"],
      default: "approved", // Allow immediate preview during review
      index: true,
    },
    likes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const PlantTip: Model<IPlantTip> =
  mongoose.models.PlantTip ||
  mongoose.model<IPlantTip>("PlantTip", PlantTipSchema);

