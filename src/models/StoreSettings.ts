import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStoreSettings extends Document {
  storeName: string;
  storeEmail: string;
  phone: string;
  currency: string;
  deliveryCharge: number;
  freeDeliveryThreshold: number;
  address: string;
  announcementText: string;
  announcementActive: boolean;
  socialLinks: {
    instagram: string;
    pinterest: string;
    facebook: string;
    tiktok: string;
  };
  orderNotificationsEmail: string;
  updatedAt: Date;
}

const StoreSettingsSchema = new Schema<IStoreSettings>(
  {
    storeName: { type: String, default: "Blooming Oasis" },
    storeEmail: { type: String, default: "care@bloomingoasis.demo" },
    phone: { type: String, default: "+1 (800) 555-PLANT" },
    currency: { type: String, default: "USD" },
    deliveryCharge: { type: Number, default: 12 },
    freeDeliveryThreshold: { type: Number, default: 75 },
    address: {
      type: String,
      default: "742 Botanical Way, Suite 4B, Verdant Green District, CA 94107",
    },
    announcementText: {
      type: String,
      default:
        "Bring home a little more green. Free delivery on orders over $75.",
    },
    announcementActive: { type: Boolean, default: true },
    socialLinks: {
      instagram: { type: String, default: "https://instagram.com" },
      pinterest: { type: String, default: "https://pinterest.com" },
      facebook: { type: String, default: "https://facebook.com" },
      tiktok: { type: String, default: "https://tiktok.com" },
    },
    orderNotificationsEmail: {
      type: String,
      default: "admin@bloomingoasis.demo",
    },
  },
  {
    timestamps: true,
  }
);

export const StoreSettings: Model<IStoreSettings> =
  mongoose.models.StoreSettings ||
  mongoose.model<IStoreSettings>("StoreSettings", StoreSettingsSchema);

