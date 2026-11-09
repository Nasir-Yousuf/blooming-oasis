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
  availableCategories?: string[];
}

const DEFAULT_CATEGORIES = [
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
  availableCategories,
}: ProductFilterBarProps) {
  // Use dynamically provided categories from MongoDB if available, ensuring "All" is first
  const categoriesList = React.useMemo(() => {
    if (availableCategories && availableCategories.length > 0) {
      const distinct = Array.from(new Set(["All", ...availableCategories]));
      return distinct;
    }
    return DEFAULT_CATEGORIES;
  }, [availableCategories]);

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
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-forest text-offwhite shadow-sm"
                  : "bg-cream hover:bg-sage/20 text-charcoal/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty & Pet-Friendly Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-sage/20 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-forest uppercase tracking-wider text-[11px]">
            Care Difficulty:
          </span>
          <div className="flex items-center gap-1.5">
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff}
                onClick={() => onDifficultyChange(diff)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  selectedDifficulty === diff
                    ? "bg-forest text-offwhite font-medium"
                    : "bg-cream hover:bg-sage/20 text-charcoal/70"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Pet Friendly Toggle Button */}
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <input
            type="checkbox"
            checked={petFriendlyOnly}
            onChange={(e) => onPetFriendlyChange(e.target.checked)}
            className="w-4 h-4 rounded text-forest focus:ring-botanical accent-forest cursor-pointer"
          />
          <span className="text-xs font-medium text-forest group-hover:text-botanical transition-colors flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-botanical" />
            100% Pet-Friendly Only (Non-Toxic)
          </span>
        </label>
      </div>
    </div>
  );
}
