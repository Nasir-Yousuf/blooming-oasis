"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { CURATED_COLLECTIONS } from "@/data/initialProducts";

export function CuratedCollections() {
  return (
    <section className="py-20 sm:py-28 bg-offwhite border-b border-sage/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-botanical mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Curated Themed Edits
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-forest tracking-tight leading-tight">
              Spaces Designed Around You.
            </h2>
          </div>
          <p className="text-sm text-charcoal/70 max-w-sm leading-relaxed">
            Whether welcoming pets into your sanctuary, brightening a dim home office, or curating your first starter garden, our botanists grouped plants for effortless harmony.
          </p>
        </div>

        {/* Collections Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CURATED_COLLECTIONS.map((col, index) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className={`group relative rounded-3xl overflow-hidden bg-cream shadow-soft hover:shadow-elevated transition-all duration-500 flex flex-col justify-between ${
                index === 0 ? "lg:col-span-2 lg:flex-row" : ""
              }`}
            >
              {/* Media Container */}
              <div
                className={`relative overflow-hidden bg-cream ${
                  index === 0
                    ? "lg:w-1/2 aspect-[4/3] lg:aspect-auto"
                    : "aspect-[16/10]"
                }`}
              >
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-forest/20 group-hover:bg-forest/10 transition-colors" />
              </div>

              {/* Text Info */}
              <div
                className={`p-6 sm:p-8 flex flex-col justify-between ${
                  index === 0 ? "lg:w-1/2" : ""
                }`}
              >
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-botanical mb-2">
                    {col.subtitle}
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest group-hover:text-botanical transition-colors leading-tight mb-3">
                    {col.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal/75 leading-relaxed">
                    {col.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-sage/20 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-forest group-hover:text-botanical transition-colors">
                  <span>Explore Edit ({col.plantCount} plants)</span>
                  <div className="w-8 h-8 rounded-full bg-cream group-hover:bg-forest group-hover:text-offwhite flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

