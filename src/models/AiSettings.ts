import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAiSettings extends Document {
  enabled: boolean;
  displayName: string;
  welcomeMessage: string;
  suggestedQuestions: string[];
  supportedTopics: string[];
  customKnowledge: string;
  stats: {
    totalMessages: number;
    totalConversations: number;
    totalToolCalls: number;
    lastActive: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AiSettingsSchema = new Schema<IAiSettings>(
  {
    enabled: { type: Boolean, default: true },
    displayName: { type: String, default: "Blooming AI" },
    welcomeMessage: {
      type: String,
      default:
        "Hello! I'm Blooming AI, your personal plant specialist. Whether you're looking for your first houseplant, trying to save a struggling Monstera, or finding the perfect plant for your home, I'm here to help. What can I help you grow today?",
    },
    suggestedQuestions: {
      type: [String],
      default: [
        "Find a plant for my room",
        "Which plants are safe for pets?",
        "Help me care for my Monstera",
        "Recommend beginner-friendly plants",
        "Track my order",
      ],
    },
    supportedTopics: {
      type: [String],
      default: [
        "Indoor Plant Selection",
        "Watering & Sunlight Needs",
        "Pest & Disease Diagnosis",
        "Pet & Child Safety",
        "Order Status & Tracking",
        "Greenhouse Store Policies",
      ],
    },
    customKnowledge: {
      type: String,
      default:
        "Blooming Oasis offers complimentary greenhouse consultation. Free shipping is provided on all orders over $75. Orders typically ship within 24-48 business hours with specialized plant protection packaging.",
    },
    stats: {
      totalMessages: { type: Number, default: 0 },
      totalConversations: { type: Number, default: 0 },
      totalToolCalls: { type: Number, default: 0 },
      lastActive: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
  }
);

export const AiSettings: Model<IAiSettings> =
  mongoose.models.AiSettings ||
  mongoose.model<IAiSettings>("AiSettings", AiSettingsSchema);

