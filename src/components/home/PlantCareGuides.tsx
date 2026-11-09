"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BookOpen, Clock, ArrowRight, X, Sparkles, Check } from "lucide-react";
import { CARE_ARTICLES, CareArticle } from "@/data/initialProducts";

export function PlantCareGuides() {
  const [selectedArticle, setSelectedArticle] = useState<CareArticle | null>(null);

  return (
    <section className="py-20 sm:py-28 bg-cream/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-botanical mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              Botanical Care Journal
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-forest tracking-tight leading-tight">
              Master the Art of Plant Parenting.
            </h2>
          </div>
          <p className="text-sm text-charcoal/70 max-w-sm leading-relaxed">
            Science-backed horticultural guidance written by our resident botanical team. Discover how subtle adjustments in light and moisture unleash lush growth.
          </p>
        </div>

        {/* Magazine Editorial Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {CARE_ARTICLES.map((article) => (
            <article
              key={article.slug}
              className="group bg-offwhite rounded-2xl border border-sage/30 overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-cream">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-forest/85 backdrop-blur-sm text-offwhite text-[10px] font-semibold uppercase tracking-wider">
                    {article.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-charcoal/60 mb-2">
                    <Clock className="w-3 h-3 text-botanical" />
                    <span>{article.readTime}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-forest group-hover:text-botanical transition-colors leading-snug line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xs text-charcoal/70 line-clamp-3 mt-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => setSelectedArticle(article)}
                  className="w-full py-2.5 px-3 rounded-xl border border-sage/40 hover:bg-cream text-forest text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                >
                  Read Editorial <ArrowRight className="w-3 h-3 text-botanical" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-12 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-forest/70 backdrop-blur-md transition-opacity"
            onClick={() => setSelectedArticle(null)}
          />

          <div className="relative max-w-2xl w-full bg-offwhite rounded-3xl shadow-2xl border border-sage/40 overflow-hidden z-10 my-8">
            <div className="relative h-64 sm:h-72 w-full">
              <Image
                src={selectedArticle.image}
                alt={selectedArticle.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/40 to-transparent" />
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-offwhite/90 text-charcoal hover:bg-offwhite transition-colors"
                aria-label="Close article"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 left-6 right-6 text-offwhite">
                <span className="text-xs font-semibold uppercase tracking-wider text-sage bg-forest/80 px-2.5 py-0.5 rounded-full border border-sage/30">
                  {selectedArticle.category}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold mt-2 leading-tight">
                  {selectedArticle.title}
                </h3>
                <p className="text-xs text-cream/80 mt-1">
                  By {selectedArticle.author} • {selectedArticle.date}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <p className="text-sm sm:text-base text-charcoal/80 leading-relaxed font-light">
                {selectedArticle.summary}
              </p>

              <div className="bg-cream rounded-2xl p-5 border border-sage/30">
                <h4 className="font-serif text-base font-bold text-forest mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-botanical" />
                  Key Horticultural Takeaways
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-charcoal/80">
                  {selectedArticle.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-botanical flex-shrink-0 mt-0.5" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-6 py-2.5 rounded-xl bg-forest text-offwhite text-xs font-semibold uppercase tracking-wider hover:bg-forest-light transition-colors"
                >
                  Close Reader
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

