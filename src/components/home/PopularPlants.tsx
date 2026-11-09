"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { ProductData } from "@/data/initialProducts";
import { PlantCard } from "@/components/shared/PlantCard";

interface PopularPlantsProps {
  initialProducts?: ProductData[];
}

export function PopularPlants({ initialProducts = [] }: PopularPlantsProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [products, setProducts] = useState<ProductData[]>(initialProducts);
  const [loading, setLoading] = useState(initialProducts.length === 0);

  useEffect(() => {
    // Client-side fetch to ensure fresh synchronization
    async function loadFresh() {
      try {
        const res = await fetch("/api/products");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setProducts(json.data);
        }
      } catch (err) {
        console.warn("Could not fetch fresh popular products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFresh();
  }, []);

  const filterProducts = (): ProductData[] => {
    switch (activeTab) {
      case "low-light":
        return products.filter(
          (p) =>
            p.sunlight?.toLowerCase().includes("low") ||
            p.sunlight?.toLowerCase().includes("indirect")
        );
      case "pet-friendly":
        return products.filter((p) => p.petFriendly === true);
      case "statement":
        return products.filter(
          (p) =>
            (p.tags && p.tags.some((t) => t.toLowerCase().includes("statement"))) ||
            p.price >= 65
        );
      default:
        return products.slice(0, 8);
    }
  };

  const displayed = filterProducts();

  return (
    <section className="py-20 sm:py-28 bg-offwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-botanical mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Popular Houseplants
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-forest tracking-tight leading-tight">
              Curated for Living Spaces.
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: "all", label: "All Highlights" },
              { id: "low-light", label: "Low Light" },
              { id: "pet-friendly", label: "Pet Friendly" },
              { id: "statement", label: "Statement Plants" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-forest text-offwhite shadow-sm"
                    : "bg-cream hover:bg-sage/20 text-charcoal/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading && products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[4/5] bg-cream rounded-2xl" />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="py-12 text-center text-charcoal/70 bg-cream/40 rounded-2xl">
            No houseplants match this filter in the current catalog.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {displayed.slice(0, 8).map((product, index) => (
              <PlantCard key={product.slug} product={product} priority={index < 4} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-forest hover:bg-forest-light text-offwhite text-xs font-semibold uppercase tracking-wider shadow-card hover:shadow-elevated transition-all"
          >
            Explore Complete Botanical Catalog
            <ArrowRight className="w-4 h-4 text-sage" />
          </Link>
        </div>
      </div>
    </section>
  );
}
