"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, X, ArrowRight } from "lucide-react";

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [announcementText, setAnnouncementText] = useState(
    "Bring home a little more green. Free nationwide delivery on orders over $75."
  );

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.settings) {
          if (json.settings.announcementActive === false) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
            if (json.settings.announcementText) {
              setAnnouncementText(json.settings.announcementText);
            }
          }
        }
      } catch (err) {
        console.warn("Could not load announcement settings:", err);
      }
    }
    loadSettings();
  }, []);

  if (!isVisible) return null;

  return (
    <div className="bg-forest text-offwhite text-xs sm:text-sm py-2 px-4 transition-all duration-300 relative z-50 border-b border-forest-light/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 flex items-center justify-center gap-2 text-center">
          <Sparkles className="w-3.5 h-3.5 text-sage hidden sm:inline" />
          <span className="font-light tracking-wide text-cream/90">
            {announcementText}
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
