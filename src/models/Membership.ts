import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMembership extends Document {
  name?: string;
  email: string;
  source?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MembershipSchema = new Schema<IMembership>(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    source: { type: String, default: "homepage_accordion" },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Membership: Model<IMembership> =
  mongoose.models.Membership ||
  mongoose.model<IMembership>("Membership", MembershipSchema);

