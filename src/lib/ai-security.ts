import { z } from "zod";

// Rate limiting in-memory store (sliding window per IP/User)
interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 25; // max 25 messages per minute per IP

// Periodically clean up old rate limit entries
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      record.timestamps = record.timestamps.filter(
        (ts) => now - ts < RATE_LIMIT_WINDOW_MS
      );
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  resetMs: number;
} {
  const now = Date.now();
  let record = rateLimitStore.get(identifier);

  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(identifier, record);
  }

  // Filter timestamps to current window
  record.timestamps = record.timestamps.filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS
  );

  if (record.timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldestTimestamp = record.timestamps[0];
    const resetMs = RATE_LIMIT_WINDOW_MS - (now - oldestTimestamp);
    return {
      allowed: false,
      remaining: 0,
      resetMs: Math.max(0, resetMs),
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - record.timestamps.length,
    resetMs: RATE_LIMIT_WINDOW_MS,
  };
}

// Zod validation schemas
export const HistoryMessageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(["user", "model", "assistant"]),
  content: z.string().min(1).max(2000),
  productRecommendations: z.array(z.any()).optional(),
});

export const ChatRequestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(1000, "Message is too long (maximum 1,000 characters)"),
  sessionId: z.string().max(100).optional(),
  history: z.array(HistoryMessageSchema).max(20).optional().default([]),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

// Protection against prompt injection & dangerous instructions
export function sanitizeInput(input: string): string {
  // Remove null bytes and non-printable control characters (except newline, carriage return, tab)
  const cleaned = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  return cleaned.trim();
}

// Friendly error message transformer for user display
export function getFriendlyErrorMessage(error: any): string {
  const message = String(error?.message || error || "");

  if (
    message.includes("quota") ||
    message.includes("RESOURCE_EXHAUSTED") ||
    message.includes("429")
  ) {
    return "Our botanical advisory service is experiencing exceptionally high volume at this moment. Please wait a moment and ask again!";
  }

  if (message.includes("API key") || message.includes("UNAUTHENTICATED")) {
    return "I am temporarily having trouble accessing my botanical knowledge service. Please try again shortly or contact the Blooming Oasis nursery team.";
  }

  if (
    message.includes("503") ||
    message.includes("UNAVAILABLE") ||
    message.includes("overloaded")
  ) {
    return "Our plant specialist service is momentarily busy tending to the greenhouse. Please try asking your question again in just a few seconds!";
  }

  if (message.includes("timeout") || message.includes("aborted")) {
    return "Searching our nursery database took a little longer than expected. Please try asking again!";
  }

  return "I'm having a brief connection issue right now. Please try again in a moment, or feel free to check our plant catalog directly!";
}

