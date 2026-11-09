import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInventoryLog extends Document {
  productId: string;
  productName: string;
  previousStock: number;
  changeAmount: number;
  newStock: number;
  reason: "Order Placement" | "Manual Adjustment" | "Restock" | "Order Cancellation" | "Damage/Waste";
  updatedBy: string;
  createdAt: Date;
}

const InventoryLogSchema = new Schema<IInventoryLog>(
  {
    productId: { type: String, required: true, index: true },
    productName: { type: String, required: true },
    previousStock: { type: Number, required: true },
    changeAmount: { type: Number, required: true },
    newStock: { type: Number, required: true },
    reason: {
      type: String,
      required: true,
      enum: [
        "Order Placement",
        "Manual Adjustment",
        "Restock",
        "Order Cancellation",
        "Damage/Waste",
      ],
    },
    updatedBy: { type: String, default: "System" },
  },
  {
    timestamps: true,
  }
);

export const InventoryLog: Model<IInventoryLog> =
  mongoose.models.InventoryLog ||
  mongoose.model<IInventoryLog>("InventoryLog", InventoryLogSchema);

