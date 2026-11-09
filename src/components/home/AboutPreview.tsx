"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Sparkles } from "lucide-react";

export function AboutPreview() {
  return (
    <section className="py-20 sm:py-28 bg-offwhite border-b border-sage/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Images Layout */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-card border border-sage/30 bg-cream">
              <Image
                src="https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=1200&q=80"
                alt="Botanical potting workshop with terracotta and Monstera"
                fill
                className="object-cover"
              />
            </div>

            {/* Overlapping Floating Badge */}
            <div className="absolute -bottom-6 -right-6 sm:bottom-8 sm:-right-8 bg-forest text-offwhite p-5 sm:p-6 rounded-3xl shadow-elevated border border-sage/30 max-w-xs">
              <div className="flex items-center gap-2 text-sage text-xs font-semibold uppercase tracking-wider mb-1">
                <Leaf className="w-4 h-4" /> Living Design
              </div>
              <p className="text-xs sm:text-sm text-cream/90 font-light leading-snug">
                &ldquo;Every plant we cultivate is selected to bring emotional calmness and living architecture into modern homes.&rdquo;
              </p>
            </div>
          </div>

          {/* Text Story Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-botanical">
              <Sparkles className="w-3.5 h-3.5" />
              About Blooming Oasis
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-forest tracking-tight leading-tight">
              Rooted in Nature. Crafted for Modern Sanctuaries.
            </h2>

            <p className="text-sm sm:text-base text-charcoal/80 leading-relaxed font-light">
              Blooming Oasis began with a simple belief: the environments we inhabit profoundly shape our mental clarity and daily wellbeing. In an increasingly digital world, living greenery grounds us, purifies our breathing spaces, and breathes soul into quiet corners.
            </p>

            <p className="text-sm sm:text-base text-charcoal/80 leading-relaxed font-light">
              We partner with responsible generational nurseries that cultivate robust, acclimatized root systems rather than fast-grown greenhouse specimens. When you receive a Blooming Oasis plant, you receive a companion prepared to thrive for years to come.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-forest hover:bg-forest-light text-offwhite text-xs font-semibold uppercase tracking-wider shadow-card hover:shadow-elevated transition-all"
              >
                Discover Our Story <ArrowRight className="w-4 h-4 text-sage" />
              </Link>
              <Link
                href="/about#sustainability"
                className="inline-flex items-center gap-2 text-xs font-semibold text-botanical hover:text-forest uppercase tracking-wider px-4 py-2"
              >
                Explore Sustainable Sourcing →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

