"use client";

import React from "react";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";

interface ProductFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (diff: string) => void;
  petFriendlyOnly: boolean;
  onPetFriendlyChange: (checked: boolean) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalCount: number;
}

const CATEGORIES = [
  "All",
  "Tropical",
  "Foliage",
  "Trees",
  "Flowering",
  "Ferns",
  "Succulent",
];

const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Experienced"];

export function ProductFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDifficulty,
  onDifficultyChange,
  petFriendlyOnly,
  onPetFriendlyChange,
  sortBy,
  onSortChange,
  totalCount,
}: ProductFilterBarProps) {
  return (
    <div className="bg-offwhite rounded-3xl p-6 sm:p-8 border border-sage/30 shadow-soft mb-10 space-y-6">
      {/* Top Search & Results Counter */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-botanical absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search catalog by name, botanical species, light..."
            className="w-full bg-cream/70 border border-sage/40 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-charcoal placeholder-charcoal/50 focus:outline-none focus:border-botanical focus:bg-offwhite transition-colors"
          />
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-charcoal/70">
          <span className="font-medium text-forest">
            Showing <span className="font-bold">{totalCount}</span> indoor plants
          </span>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-botanical" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-cream/70 border border-sage/40 rounded-xl px-3 py-2 text-xs text-charcoal font-medium focus:outline-none focus:border-botanical"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-botanical block mb-2.5">
          Botanical Classification
        </span>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-forest text-offwhite shadow-sm"
                  : "bg-cream hover:bg-sage/20 text-charcoal/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Care Level & Pet Safety Toggles */}
      <div className="pt-4 border-t border-sage/20 flex flex-wrap items-center justify-between gap-4">
        {/* Difficulty level */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-charcoal/80 mr-1">
            Care Level:
          </span>
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff}
              onClick={() => onDifficultyChange(diff)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedDifficulty === diff
                  ? "bg-sage text-forest font-semibold"
                  : "bg-cream/60 hover:bg-cream text-charcoal/70"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Pet-friendly filter checkbox */}
        <label className="inline-flex items-center gap-2.5 cursor-pointer select-none text-xs text-charcoal/90 font-medium bg-cream/70 hover:bg-cream px-3.5 py-1.5 rounded-xl border border-sage/30 transition-colors">
          <input
            type="checkbox"
            checked={petFriendlyOnly}
            onChange={(e) => onPetFriendlyChange(e.target.checked)}
            className="w-4 h-4 rounded text-forest focus:ring-forest border-sage accent-forest"
          />
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-botanical" />
            Pet-Safe Only (Non-Toxic)
          </span>
        </label>
      </div>
    </div>
  );
}

