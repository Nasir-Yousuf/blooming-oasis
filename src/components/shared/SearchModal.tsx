"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import { INITIAL_PRODUCTS, ProductData } from "@/data/initialProducts";
import { formatPrice } from "@/lib/browser-interactions";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductData[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(INITIAL_PRODUCTS.slice(0, 4));
      return;
    }

    const q = query.toLowerCase().trim();
    const matched = INITIAL_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.botanicalName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
    setResults(matched);
  }, [query]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-forest/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative max-w-2xl mx-auto bg-offwhite rounded-2xl shadow-2xl border border-sage/40 overflow-hidden z-10">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 bg-cream border-b border-sage/30 flex items-center gap-3">
          <Search className="w-5 h-5 text-botanical flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search plants by name, botanical species, light requirement..."
            autoFocus
            className="flex-1 bg-transparent border-none text-charcoal placeholder-charcoal/50 text-sm sm:text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-charcoal/50 hover:text-charcoal px-2 py-1 rounded bg-sage/20"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-sage/20 text-charcoal/70"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick category filter tags */}
        <div className="px-5 py-2.5 bg-offwhite/50 border-b border-sage/20 flex items-center gap-2 overflow-x-auto text-xs text-charcoal/70">
          <span className="font-medium text-forest">Popular:</span>
          {["Monstera", "Snake Plant", "Low Light", "Pet Friendly", "Trees"].map(
            (tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-2.5 py-1 rounded-full bg-cream hover:bg-sage/20 text-charcoal text-[11px] font-medium transition-colors whitespace-nowrap"
              >
                {tag}
              </button>
            )
          )}
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5 divide-y divide-sage/20">
          <div className="text-xs font-semibold uppercase tracking-wider text-botanical mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {query.trim() ? `Search Results (${results.length})` : "Curated Recommendations"}
          </div>

          {results.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-serif text-lg text-forest mb-1">
                No plants found matching &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-charcoal/70 max-w-sm mx-auto mb-4">
                Try searching for broader terms like &ldquo;Tropical&rdquo;, &ldquo;Low light&rdquo;, or &ldquo;Ferns&rdquo;.
              </p>
            </div>
          ) : (
            results.map((product) => (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="group flex items-center gap-4 py-3 hover:bg-cream/60 rounded-xl px-2 transition-colors"
              >
                <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-cream flex-shrink-0 border border-sage/20">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-semibold text-forest text-sm group-hover:text-botanical transition-colors truncate">
                      {product.name}
                    </h4>
                    {product.petFriendly && (
                      <span className="text-[10px] uppercase font-medium px-1.5 py-0.5 rounded bg-sage/30 text-forest flex-shrink-0">
                        Pet Safe
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-charcoal/60 truncate italic">
                    {product.botanicalName}
                  </p>
                  <p className="text-xs text-charcoal/80 truncate mt-0.5">
                    {product.tagline}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-serif font-bold text-forest text-sm">
                    {formatPrice(product.price)}
                  </span>
                  <div className="text-[11px] text-botanical flex items-center justify-end gap-1 group-hover:translate-x-0.5 transition-transform">
                    View <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

