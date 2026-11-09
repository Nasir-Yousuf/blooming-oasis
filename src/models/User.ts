import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole =
  | "superadmin"
  | "admin"
  | "order_manager"
  | "product_manager"
  | "customer";

export interface IUserAddress {
  id?: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  phone?: string;
  addresses: IUserAddress[];
  wishlist: string[];
  status: "active" | "suspended";
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["superadmin", "admin", "order_manager", "product_manager", "customer"],
      default: "customer",
      index: true,
    },
    phone: { type: String, default: "" },
    addresses: [
      {
        name: { type: String, default: "" },
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        postalCode: { type: String, default: "" },
        country: { type: String, default: "United States" },
        isDefault: { type: Boolean, default: false },
      },
    ],
    wishlist: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
      index: true,
    },
    lastLogin: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

