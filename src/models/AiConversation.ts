import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductCardSummary {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  image: string;
  category: string;
  difficulty?: string;
  sunlight?: string;
  petFriendly?: boolean;
  stock: number;
  reason?: string;
}

export interface IAiMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: Date;
  productRecommendations?: IProductCardSummary[];
}

export interface IAiConversation extends Document {
  sessionId: string;
  userId?: string;
  userEmail?: string;
  messages: IAiMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const AiConversationSchema = new Schema<IAiConversation>(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, index: true },
    userEmail: { type: String, index: true },
    messages: [
      {
        id: { type: String, required: true },
        role: { type: String, enum: ["user", "model"], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        productRecommendations: [
          {
            id: { type: String, required: true },
            name: { type: String, required: true },
            slug: { type: String, required: true },
            price: { type: Number, required: true },
            discountPrice: { type: Number, default: 0 },
            image: { type: String, default: "" },
            category: { type: String, default: "Tropical" },
            difficulty: { type: String },
            sunlight: { type: String },
            petFriendly: { type: Boolean, default: false },
            stock: { type: Number, default: 0 },
            reason: { type: String },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const AiConversation: Model<IAiConversation> =
  mongoose.models.AiConversation ||
  mongoose.model<IAiConversation>("AiConversation", AiConversationSchema);

