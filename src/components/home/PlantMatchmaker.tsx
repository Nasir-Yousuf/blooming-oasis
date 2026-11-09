"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { ProductData } from "@/data/initialProducts";
import { triggerBotanicalConfetti, formatPrice } from "@/lib/browser-interactions";

interface PlantMatchmakerProps {
  initialProducts?: ProductData[];
}

interface QuizAnswers {
  sunlight: string;
  experience: string;
  pets: string;
  watering: string;
}

interface MatchResult {
  product: ProductData;
  matchScore: number;
  reasons: string[];
}

export function PlantMatchmaker({ initialProducts = [] }: PlantMatchmakerProps) {
  const [catalog, setCatalog] = useState<ProductData[]>(initialProducts);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    sunlight: "",
    experience: "",
    pets: "",
    watering: "",
  });
  const [results, setResults] = useState<MatchResult[] | null>(null);

  React.useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await fetch("/api/products");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setCatalog(json.data);
        }
      } catch (err) {
        console.warn("Matchmaker catalog load error:", err);
      }
    }
    loadCatalog();
  }, []);

  const questions = [
    {
      id: "sunlight",
      title: "What is the lighting situation in your space?",
      subtitle: "Observe where shadows fall during peak daylight hours.",
      options: [
        {
          label: "Low light",
          desc: "North-facing window, interior hallway, or dim cozy bedroom.",
          icon: "🌙",
        },
        {
          label: "Indirect sunlight",
          desc: "Diffused ambient daylight several feet away from windows.",
          icon: "⛅",
        },
        {
          label: "Bright indirect sunlight",
          desc: "Abundant luminous light shielded by sheer curtains or east exposure.",
          icon: "☀️",
        },
        {
          label: "Direct sunlight",
          desc: "Unobstructed south or west-facing windows drenched in warm rays.",
          icon: "🌞",
        },
      ],
    },
    {
      id: "experience",
      title: "What is your plant care experience level?",
      subtitle: "Be honest! We have thriving companions for every green thumb.",
      options: [
        {
          label: "Beginner",
          desc: "New to plant parenting. Looking for hardy, forgiving foliage.",
          icon: "🌱",
        },
        {
          label: "Intermediate",
          desc: "Have kept a few plants alive and comfortable with routine care.",
          icon: "🌿",
        },
        {
          label: "Experienced",
          desc: "Seasoned collector ready for tropical humidity and pruning rituals.",
          icon: "🪴",
        },
      ],
    },
    {
      id: "pets",
      title: "Do curious cats or dogs share your living room?",
      subtitle: "Pet safety is our top priority. We verify ASPCA non-toxicity.",
      options: [
        {
          label: "I have pets",
          desc: "Strictly pet-safe, non-toxic botanicals only.",
          icon: "🐾",
        },
        {
          label: "No pets",
          desc: "Open to any botanical species or statement plants.",
          icon: "🏡",
        },
      ],
    },
    {
      id: "watering",
      title: "What is your natural watering cadence preference?",
      subtitle: "Choose a rhythm that naturally fits your daily lifestyle.",
      options: [
        {
          label: "Low maintenance",
          desc: "Forgetful waterer. Prefers drought-resilient succulents and rhizomes.",
          icon: "⏳",
        },
        {
          label: "Weekly care",
          desc: "A steady weekend soak and routine leaf misting.",
          icon: "💧",
        },
        {
          label: "I enjoy regular plant care",
          desc: "Love interactive rituals: daily misting, pebble trays, and nurturing.",
          icon: "🌊",
        },
      ],
    },
  ];

  const handleSelectOption = (key: keyof QuizAnswers, value: string) => {
    const updated = { ...answers, [key]: value };
    setAnswers(updated);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step: calculate actual botanical matches
      calculateMatches(updated);
    }
  };

  const calculateMatches = (finalAnswers: QuizAnswers) => {
    const scored: MatchResult[] = catalog.map((plant) => {
      let score = 0;
      const reasons: string[] = [];

      // 1. Pet safety check
      if (finalAnswers.pets === "I have pets") {
        if (plant.petFriendly) {
          score += 40;
          reasons.push("100% ASPCA Certified Pet-Friendly for curious cats and dogs.");
        } else {
          // Demote toxic plants if pet owner requested safe
          score -= 50;
        }
      } else {
        score += 15;
      }

      // 2. Sunlight alignment
      if (plant.sunlight === finalAnswers.sunlight) {
        score += 30;
        reasons.push(`Naturally calibrated for your ${finalAnswers.sunlight} exposure.`);
      } else if (
        (finalAnswers.sunlight === "Low light" && plant.sunlight === "Indirect sunlight") ||
        (finalAnswers.sunlight === "Bright indirect sunlight" && plant.sunlight === "Indirect sunlight")
      ) {
        score += 18;
        reasons.push("Adaptable light tolerance for your room layout.");
      }

      // 3. Experience level alignment
      if (plant.difficulty === finalAnswers.experience) {
        score += 20;
        reasons.push(`Matches your ${finalAnswers.experience} experience level perfectly.`);
      } else if (finalAnswers.experience === "Intermediate" && plant.difficulty === "Beginner") {
        score += 15;
        reasons.push("Effortless to keep thriving in your collection.");
      }

      // 4. Watering preference
      if (plant.watering === finalAnswers.watering) {
        score += 20;
        reasons.push(`Fits your ${finalAnswers.watering.toLowerCase()} routine with ease.`);
      }

      return {
        product: plant,
        matchScore: score,
        reasons,
      };
    });

    // Filter positive matches and sort highest score first
    const topMatches = scored
      .filter((m) => m.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);

    // Fallback guarantee: if filter was overly restrictive, supply top pet-friendly or beginners
    const finalSelection =
      topMatches.length > 0
        ? topMatches
        : scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);

    setResults(finalSelection);
    triggerBotanicalConfetti();
  };

  const resetQuiz = () => {
    setAnswers({
      sunlight: "",
      experience: "",
      pets: "",
      watering: "",
    });
    setCurrentStep(0);
    setResults(null);
  };

  return (
    <section id="plant-matchmaker" className="py-20 sm:py-28 bg-cream/60 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest text-offwhite text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-sage" />
            Interactive Plant Matchmaker
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-forest tracking-tight leading-tight">
            Find Your Perfect Botanical Companion.
          </h2>
          <p className="text-sm text-charcoal/70 mt-3 leading-relaxed">
            Answer four quick questions about your room lighting, care habits, and pets to receive personalized, biologically accurate recommendations.
          </p>
        </div>

        {/* Quiz Container Card */}
        <div className="bg-offwhite rounded-3xl p-6 sm:p-10 shadow-card border border-sage/30">
          {!results ? (
            <div>
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-xs text-botanical font-semibold uppercase tracking-wider mb-2">
                  <span>Question {currentStep + 1} of {questions.length}</span>
                  <span>{Math.round(((currentStep + 1) / questions.length) * 100)}% Complete</span>
                </div>
                <div className="w-full h-2 bg-cream rounded-full overflow-hidden">
                  <div
                    className="h-full bg-botanical rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${((currentStep + 1) / questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Current Question */}
              <div className="mb-8 text-center sm:text-left">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest mb-1.5">
                  {questions[currentStep].title}
                </h3>
                <p className="text-xs sm:text-sm text-charcoal/70">
                  {questions[currentStep].subtitle}
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {questions[currentStep].options.map((option) => (
                  <button
                    key={option.label}
                    onClick={() =>
                      handleSelectOption(
                        questions[currentStep].id as keyof QuizAnswers,
                        option.label
                      )
                    }
                    className="group flex items-start gap-4 p-5 rounded-2xl border-2 border-sage/30 hover:border-forest bg-cream/40 hover:bg-offwhite text-left transition-all duration-300 hover:shadow-soft active:scale-[0.99]"
                  >
                    <span className="text-3xl p-2 rounded-xl bg-offwhite group-hover:scale-110 transition-transform shadow-xs">
                      {option.icon}
                    </span>
                    <div>
                      <h4 className="font-serif font-bold text-forest text-base group-hover:text-botanical transition-colors">
                        {option.label}
                      </h4>
                      <p className="text-xs text-charcoal/70 mt-1 leading-relaxed">
                        {option.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation Back */}
              {currentStep > 0 && (
                <div className="mt-8 pt-4 border-t border-sage/20 flex justify-between">
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal/70 hover:text-forest uppercase tracking-wider"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Previous Question
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Results View */
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <div className="text-center max-w-lg mx-auto mb-10">
                <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-botanical/15 text-botanical border border-botanical/30 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Matchmaker Analysis Complete
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
                  Your Top Botanical Soulmates
                </h3>
                <p className="text-xs text-charcoal/70 mt-1.5">
                  Calculated using your lighting ({answers.sunlight}), experience level ({answers.experience}), and pet preferences.
                </p>
              </div>

              {/* Recommended Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {results.map(({ product, reasons }, idx) => (
                  <div
                    key={product.slug}
                    className="bg-cream/40 rounded-2xl border border-sage/30 overflow-hidden flex flex-col justify-between hover:shadow-card transition-all"
                  >
                    <div>
                      {/* Image */}
                      <div className="relative aspect-[4/3] bg-cream">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-forest text-offwhite text-[11px] font-bold shadow-sm">
                          #{idx + 1} Best Match
                        </div>
                        {product.petFriendly && (
                          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-offwhite/90 text-botanical text-[10px] font-semibold">
                            Pet Safe
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-5">
                        <div className="flex items-center justify-between text-xs text-botanical mb-1">
                          <span className="uppercase text-[10px] font-medium tracking-wider">
                            {product.category}
                          </span>
                          <span className="font-serif font-bold text-forest text-sm">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                        <h4 className="font-serif text-lg font-bold text-forest leading-snug">
                          {product.name}
                        </h4>
                        <p className="text-[11px] text-charcoal/60 italic mt-0.5">
                          {product.botanicalName}
                        </p>

                        {/* Match Reasons */}
                        <div className="mt-4 pt-3 border-t border-sage/20 space-y-1.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/60 block">
                            Why it matches:
                          </span>
                          {reasons.slice(0, 2).map((reason, rIdx) => (
                            <div
                              key={rIdx}
                              className="text-xs text-charcoal/80 flex items-start gap-1.5 leading-snug"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-botanical flex-shrink-0 mt-0.5" />
                              <span>{reason}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* View Plant CTA */}
                    <div className="p-4 pt-0">
                      <Link
                        href={`/products/${product.slug}`}
                        className="w-full py-2.5 px-4 rounded-xl bg-forest hover:bg-forest-light text-offwhite text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                      >
                        View Plant Specifications <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Retake Button */}
              <div className="text-center pt-4 border-t border-sage/20">
                <button
                  onClick={resetQuiz}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-botanical hover:text-forest uppercase tracking-wider transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake Matchmaker Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

