"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { INITIAL_PRODUCTS, ProductData } from "@/data/initialProducts";
import { PlantCard } from "@/components/shared/PlantCard";

export function PopularPlants() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filterProducts = (): ProductData[] => {
    switch (activeTab) {
      case "low-light":
        return INITIAL_PRODUCTS.filter(
          (p) => p.sunlight === "Low light" || p.sunlight === "Indirect sunlight"
        );
      case "pet-friendly":
        return INITIAL_PRODUCTS.filter((p) => p.petFriendly === true);
      case "statement":
        return INITIAL_PRODUCTS.filter(
          (p) => p.tags.includes("statement") || p.price >= 65
        );
      default:
        return INITIAL_PRODUCTS.slice(0, 8);
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

        {/* 8-Card Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayed.slice(0, 8).map((product, index) => (
            <PlantCard key={product.slug} product={product} priority={index < 4} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-forest hover:bg-forest-light text-offwhite text-xs font-semibold uppercase tracking-wider shadow-card hover:shadow-elevated transition-all"
          >
            Explore Complete 12+ Botanical Catalog
            <ArrowRight className="w-4 h-4 text-sage" />
          </Link>
        </div>
      </div>
    </section>
  );
}

