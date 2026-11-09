"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, ArrowRight } from "lucide-react";
import { ProductData } from "@/data/initialProducts";
import { formatPrice } from "@/lib/browser-interactions";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const url = query.trim()
          ? `/api/products?search=${encodeURIComponent(query.trim())}`
          : `/api/products`;
        const res = await fetch(url);
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.data)) {
          setResults(query.trim() ? json.data : json.data.slice(0, 4));
        }
      } catch (err) {
        console.warn("Search query failed:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(delayDebounce);
    };
  }, [query, isOpen]);

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
          {["Monstera", "Snake Plant", "Low light", "Pet Friendly", "Trees"].map(
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

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-sage/20">
          {loading ? (
            <div className="py-8 text-center text-xs text-charcoal/60">
              Searching greenhouse catalog...
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-serif font-bold text-forest mb-1">
                No matching plants found
              </p>
              <p className="text-xs text-charcoal/60">
                Try searching for general keywords like &ldquo;Tropical&rdquo;, &ldquo;Pothos&rdquo;, or &ldquo;Fern&rdquo;.
              </p>
            </div>
          ) : (
            results.map((product) => {
              const mainImg = product.images?.[0] || "";
              return (
                <Link
                  key={product.slug}
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 py-3 px-2 rounded-xl hover:bg-cream/70 transition-colors group"
                >
                  <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-cream flex-shrink-0">
                    {mainImg && (
                      <Image
                        src={mainImg}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-forest group-hover:text-botanical transition-colors truncate">
                        {product.name}
                      </h4>
                      <span className="text-xs font-mono font-bold text-forest ml-2">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal/60 italic truncate">
                      {product.botanicalName}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-charcoal/70">
                      <span className="px-2 py-0.5 rounded-full bg-cream border border-sage/30">
                        {product.category}
                      </span>
                      <span>•</span>
                      <span>{product.sunlight}</span>
                      {product.petFriendly && (
                        <>
                          <span>•</span>
                          <span className="text-botanical font-medium">Pet Safe</span>
                        </>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-sage opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-cream/50 border-t border-sage/20 flex items-center justify-between text-xs text-charcoal/60 px-5">
          <span>Press ESC or click outside to dismiss</span>
          <Link
            href="/products"
            onClick={onClose}
            className="text-botanical hover:text-forest font-medium uppercase tracking-wider"
          >
            View all plants →
          </Link>
        </div>
      </div>
    </div>
  );
}
