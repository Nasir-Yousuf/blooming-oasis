"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] bg-forest text-offwhite flex items-center overflow-hidden">
      {/* Background High-Resolution Botanical Imagery with Editorial Duotone Gradient */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=2400&q=85"
          alt="Lush green houseplants in a sunlit Scandinavian living space"
          fill
          priority
          className="object-cover object-center scale-105 animate-in fade-in zoom-in-105 duration-1000 ease-out"
        />
        {/* Editorial Gradients: ensuring text contrast while letting lush plants dominate */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest/95 via-forest/80 to-forest/30 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-transparent to-transparent opacity-80" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 w-full">
        <div className="max-w-2xl">
          {/* Botanical Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-light/80 backdrop-blur-md border border-sage/30 text-xs text-sage mb-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <Sparkles className="w-3.5 h-3.5 text-sage" />
            <span className="font-medium tracking-wider uppercase text-[11px]">
              Award-Winning Botanical Nursery & Ceramics
            </span>
          </div>

          {/* Hero Headline (Specified in Brief) */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-offwhite leading-[1.08] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Bring Nature <span className="italic font-normal text-sage">Home.</span>
          </h1>

          {/* Supporting Text (Specified in Brief) */}
          <p className="text-base sm:text-xl text-cream/90 font-light leading-relaxed mb-10 max-w-xl animate-in fade-in slide-in-from-bottom-5 duration-800">
            Discover thoughtfully selected indoor plants that make every space feel a little more alive. Direct from our sustainable greenhouses to your doorstep.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-900">
            {/* Primary CTA */}
            <Link
              href="/products"
              className="px-8 py-4 rounded-2xl bg-offwhite hover:bg-cream text-forest font-semibold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-card hover:shadow-elevated transition-all active:scale-95 group"
            >
              Explore Plants
              <ArrowRight className="w-4 h-4 text-botanical group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Secondary CTA */}
            <Link
              href="/#plant-matchmaker"
              className="px-8 py-4 rounded-2xl bg-forest-light/80 hover:bg-forest-light text-offwhite border border-sage/40 font-medium text-sm uppercase tracking-wider flex items-center justify-center gap-2 backdrop-blur-md transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-sage" />
              Find Your Plant
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 pt-8 border-t border-sage/20 grid grid-cols-3 gap-4 text-xs text-cream/80 max-w-lg">
            <div className="flex flex-col gap-1">
              <span className="font-serif text-xl sm:text-2xl font-bold text-offwhite">
                14-Day
              </span>
              <span className="text-[11px] text-sage">Healthy Arrival Guarantee</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-serif text-xl sm:text-2xl font-bold text-offwhite">
                100%
              </span>
              <span className="text-[11px] text-sage">Plastic-Free Packaging</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-serif text-xl sm:text-2xl font-bold text-offwhite">
                Free
              </span>
              <span className="text-[11px] text-sage">Botanist Care Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

