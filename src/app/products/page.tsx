"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ProductData } from "@/data/initialProducts";
import { PlantCard } from "@/components/shared/PlantCard";
import { ProductFilterBar } from "@/components/products/ProductFilterBar";
import { Sprout } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [petFriendlyOnly, setPetFriendlyOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
        ]);
        const prodJson = await prodRes.json();
        const catJson = await catRes.json();

        if (prodJson.success && Array.isArray(prodJson.data)) {
          setProducts(prodJson.data);
        }

        if (catJson.success && Array.isArray(catJson.categories)) {
          const names = catJson.categories.map((c: any) => c.name);
          setCategories(names);
        }
      } catch (err) {
        console.error("Failed to load products/categories:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute available categories including any present on products
  const allCategoryNames = useMemo(() => {
    const fromCategories = categories;
    const fromProducts = products.map((p) => p.category).filter(Boolean);
    return Array.from(new Set([...fromCategories, ...fromProducts]));
  }, [categories, products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== "All") {
      list = list.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
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
          p.botanicalName?.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q))) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (sortBy === "price-low") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") list.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") list.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return list;
  }, [products, searchQuery, selectedCategory, selectedDifficulty, petFriendlyOnly, sortBy]);

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
          availableCategories={allCategoryNames}
        />

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-[4/5] bg-cream rounded-2xl" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <PlantCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
