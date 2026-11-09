"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, X, ArrowRight } from "lucide-react";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-forest text-offwhite text-xs sm:text-sm py-2 px-4 transition-all duration-300 relative z-50 border-b border-forest-light/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 flex items-center justify-center gap-2 text-center">
          <Sparkles className="w-3.5 h-3.5 text-sage hidden sm:inline" />
          <span className="font-light tracking-wide text-cream/90">
            Bring home a little more green.{" "}
            <span className="font-medium text-offwhite">
              Free nationwide delivery on orders over $75.
            </span>
          </span>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 font-medium underline underline-offset-4 hover:text-sage ml-1 transition-colors"
          >
            Explore Plants <ArrowRight className="w-3 h-3 inline" />
          </Link>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-sage hover:text-offwhite transition-colors p-1"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

