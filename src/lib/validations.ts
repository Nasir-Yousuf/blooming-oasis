import { z } from "zod";

export const ContactMessageSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please provide a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(150),
  category: z.enum([
    "General Inquiry",
    "Plant Care Help",
    "Order Assistance",
    "Custom Interior Consultation",
    "Wholesale & Corporate",
  ]),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export type ContactMessageInput = z.infer<typeof ContactMessageSchema>;

export const MembershipSchema = z.object({
  name: z.string().max(100).optional(),
  email: z.string().email("Please provide a valid email address"),
});

export type MembershipInput = z.infer<typeof MembershipSchema>;

export const PlantTipSchema = z.object({
  authorName: z.string().min(2, "Name must be at least 2 characters").max(60),
  plantName: z.string().min(2, "Plant name must be at least 2 characters").max(100),
  content: z.string().min(15, "Tip must be at least 15 characters").max(1000),
  imageUrl: z
    .string()
    .url("Must be a valid image URL")
    .optional()
    .or(z.literal("")),
});

export type PlantTipInput = z.infer<typeof PlantTipSchema>;

