"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

interface CollageItem {
  name: string;
  botanical: string;
  slug: string;
  image: string;
  role: string;
  gridSpan: string;
}

const COLLAGE_PLANTS: CollageItem[] = [
  {
    name: "Monstera Deliciosa",
    botanical: "Swiss Cheese Plant",
    slug: "monstera-deliciosa",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1200&q=80",
    role: "Architectural Statement",
    gridSpan: "md:col-span-2 md:row-span-2 min-h-[380px] sm:min-h-[460px]",
  },
  {
    name: "Snake Plant Laurentii",
    botanical: "Dracaena trifasciata",
    slug: "snake-plant-laurentii",
    image: "https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?auto=format&fit=crop&w=800&q=80",
    role: "Indestructible Air Purifier",
    gridSpan: "min-h-[260px] sm:min-h-[300px]",
  },
  {
    name: "Fiddle Leaf Fig",
    botanical: "Ficus lyrata",
    slug: "fiddle-leaf-fig",
    image: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80",
    role: "Interior Design Icon",
    gridSpan: "min-h-[260px] sm:min-h-[300px]",
  },
  {
    name: "Peace Lily 'Sensation'",
    botanical: "Spathiphyllum wallisii",
    slug: "peace-lily",
    image: "https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=800&q=80",
    role: "Serene Snow-White Blooms",
    gridSpan: "min-h-[260px] sm:min-h-[300px]",
  },
  {
    name: "Golden Pothos",
    botanical: "Epipremnum aureum",
    slug: "golden-pothos",
    image: "https://images.unsplash.com/photo-1596724817757-5e93345d3cf6?auto=format&fit=crop&w=800&q=80",
    role: "Cascading Golden Vine",
    gridSpan: "min-h-[260px] sm:min-h-[300px]",
  },
  {
    name: "Raven ZZ Plant",
    botanical: "Zamioculcas zamiifolia",
    slug: "zz-plant",
    image: "https://images.unsplash.com/photo-1632207691143-643e2a9a9361?auto=format&fit=crop&w=800&q=80",
    role: "Obsidian Low-Light Gem",
    gridSpan: "md:col-span-2 min-h-[280px] sm:min-h-[320px]",
  },
];

export function BotanicalCollage() {
  return (
    <section className="py-20 sm:py-28 bg-cream/50 border-b border-sage/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-botanical mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Botanical Photography Collage
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-forest tracking-tight leading-tight">
              Six Living Sculptures That Redefine Modern Interiors.
            </h2>
          </div>
          <p className="text-sm text-charcoal/70 max-w-sm leading-relaxed">
            From the sculptural fenestrations of our Monstera to the indestructible upright silhouettes of the Snake Plant, each specimen is cultivated for architectural impact.
          </p>
        </div>

        {/* Editorial Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {COLLAGE_PLANTS.map((plant) => (
            <Link
              key={plant.slug}
              href={`/products/${plant.slug}`}
              className={`group relative rounded-3xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500 ${plant.gridSpan}`}
            >
              <Image
                src={plant.image}
                alt={plant.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Sophisticated Editorial Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Text Info */}
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-sage bg-forest/80 backdrop-blur-md px-3 py-1 rounded-full border border-sage/30">
                    {plant.role}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-offwhite/90 text-forest flex items-center justify-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-offwhite leading-tight">
                    {plant.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-sage/90 italic mt-1 font-light">
                    {plant.botanical}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

