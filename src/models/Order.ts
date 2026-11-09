import mongoose, { Schema, Document, Model } from "mongoose";

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Refunded";

export interface IOrderItemAccessory {
  id: string;
  name: string;
  price: number;
}

export interface IOrderItem {
  productId: string;
  productSlug: string;
  productName: string;
  productImage: string;
  size: string;
  unitPrice: number;
  quantity: number;
  accessories: IOrderItemAccessory[];
  totalPrice: number;
}

export interface IOrderStatusHistory {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
  updatedBy?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  customer: {
    userId?: string;
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: IOrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: "cod" | "card";
  paymentStatus: "pending" | "paid";
  status: OrderStatus;
  statusTimeline: IOrderStatusHistory[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    customer: {
      userId: { type: String, index: true },
      name: { type: String, required: true },
      email: { type: String, required: true, index: true },
      phone: { type: String, required: true },
    },
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: "United States" },
    },
    items: [
      {
        productId: { type: String, required: true },
        productSlug: { type: String, required: true },
        productName: { type: String, required: true },
        productImage: { type: String, default: "" },
        size: { type: String, default: "Small" },
        unitPrice: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        accessories: [
          {
            id: { type: String, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
          },
        ],
        totalPrice: { type: Number, required: true },
      },
    ],
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    couponCode: { type: String, default: "" },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cod", "card"], default: "cod" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Refunded",
      ],
      default: "Pending",
      index: true,
    },
    statusTimeline: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String, default: "" },
        updatedBy: { type: String, default: "System" },
      },
    ],
    notes: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

