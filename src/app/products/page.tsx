"use client";

import React, { useState, useMemo } from "react";
import { INITIAL_PRODUCTS } from "@/data/initialProducts";
import { PlantCard } from "@/components/shared/PlantCard";
import { ProductFilterBar } from "@/components/products/ProductFilterBar";
import { Sprout } from "lucide-react";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [petFriendlyOnly, setPetFriendlyOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  const filteredProducts = useMemo(() => {
    let list = [...INITIAL_PRODUCTS];

    if (selectedCategory !== "All") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (selectedDifficulty !== "All") {
      list = list.filter((p) => p.difficulty === selectedDifficulty);
    }

    if (petFriendlyOnly) {
      list = list.filter((p) => p.petFriendly === true);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.botanicalName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (sortBy === "price-low") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") list.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [searchQuery, selectedCategory, selectedDifficulty, petFriendlyOnly, sortBy]);

  return (
    <div className="bg-offwhite min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream text-botanical border border-botanical/20 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sprout className="w-3.5 h-3.5" />
            Complete Botanical Living Catalog
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-forest tracking-tight leading-tight">
            Indoor Plants & Foliage.
          </h1>
          <p className="text-sm sm:text-base text-charcoal/75 mt-3 leading-relaxed font-light">
            Every plant in our collection is hand-selected from generational nurseries, acclimatized for indoor vitality, and delivered with our signature 14-day botanical guarantee.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <ProductFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={setSelectedDifficulty}
          petFriendlyOnly={petFriendlyOnly}
          onPetFriendlyChange={setPetFriendlyOnly}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalCount={filteredProducts.length}
        />

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-cream/40 rounded-3xl border border-sage/30 p-8">
            <p className="font-serif text-2xl font-bold text-forest mb-2">
              No botanical companions found
            </p>
            <p className="text-xs sm:text-sm text-charcoal/70 max-w-md mx-auto mb-6">
              Try loosening your filters or clear your search term to explore our full selection of indoor plants.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedDifficulty("All");
                setPetFriendlyOnly(false);
              }}
              className="px-6 py-2.5 rounded-xl bg-forest text-offwhite text-xs font-semibold uppercase tracking-wider"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product, idx) => (
              <PlantCard
                key={product.slug}
                product={product}
                priority={idx < 4}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

