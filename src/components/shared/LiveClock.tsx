"use client";

import React, { useState, useEffect } from "react";
import { subscribeToLiveTime, FormattedDateTime } from "@/lib/date-time";
import { Clock, Radio } from "lucide-react";

interface LiveClockProps {
  variant?: "footer" | "contact" | "compact";
  className?: string;
}

export function LiveClock({ variant = "footer", className = "" }: LiveClockProps) {
  const [dateTime, setDateTime] = useState<FormattedDateTime | null>(null);

  useEffect(() => {
    // Subscribes to live 1-second interval using JS Date API
    const unsubscribe = subscribeToLiveTime((data) => {
      setDateTime(data);
    });
    return () => unsubscribe();
  }, []);

  if (!dateTime) {
    // Initial server-safe placeholder to avoid hydration mismatch
    return (
      <div className={`inline-flex items-center gap-2 text-xs text-sage animate-pulse ${className}`}>
        <Clock className="w-3.5 h-3.5" />
        <span>Syncing greenhouse time...</span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`inline-flex items-center gap-2 text-xs font-mono text-sage ${className}`}>
        <Clock className="w-3.5 h-3.5 text-sage" />
        <span>{dateTime.timeString}</span>
      </div>
    );
  }

  if (variant === "contact") {
    return (
      <div className={`p-4 rounded-xl border border-sage/40 bg-cream/60 text-charcoal ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-botanical flex items-center gap-1.5">
            <Radio className={`w-3.5 h-3.5 ${dateTime.isNurseryOpen ? "text-botanical animate-pulse" : "text-terracotta"}`} />
            Live Greenhouse Time
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              dateTime.isNurseryOpen
                ? "bg-botanical/15 text-botanical border border-botanical/30"
                : "bg-terracotta/15 text-terracotta border border-terracotta/30"
            }`}
          >
            {dateTime.isNurseryOpen ? "Open Now" : "Currently Closed"}
          </span>
        </div>
        <div className="text-xl font-serif font-bold text-forest mb-1">
          {dateTime.timeString}
        </div>
        <div className="text-xs text-charcoal/70">
          {dateTime.fullDate} • {dateTime.timeZone}
        </div>
        <p className="text-xs text-charcoal/80 mt-2 font-medium">
          {dateTime.statusMessage}
        </p>
      </div>
    );
  }

  // Default "footer" variant
  return (
    <div className={`text-xs text-sage/90 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 ${className}`}>
      <div className="flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5 text-sage" />
        <span className="font-mono tracking-tight text-offwhite">{dateTime.timeString}</span>
        <span className="text-sage/60">({dateTime.timeZone})</span>
      </div>
      <span className="hidden sm:inline text-sage/40">•</span>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-sage inline-block animate-pulse" />
        <span>{dateTime.statusMessage}</span>
      </div>
    </div>
  );
}

