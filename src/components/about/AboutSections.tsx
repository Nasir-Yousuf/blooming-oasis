"use client";

import React from "react";
import Image from "next/image";
import {
  Sparkles,
  Heart,
  Leaf,
  BookOpen,
  Users,
  Award,
  Globe,
} from "lucide-react";

export function AboutHero() {
  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] bg-forest text-offwhite flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=2000&q=80"
          alt="Lush botanical greenhouse interior filled with mature indoor plants"
          fill
          priority
          className="object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest/95 via-forest/80 to-forest/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-light/80 backdrop-blur-md border border-sage/30 text-xs text-sage mb-6">
            <Sparkles className="w-3.5 h-3.5 text-sage" />
            <span className="font-medium tracking-wider uppercase text-[11px]">
              Our Botanical Heritage
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-offwhite leading-[1.1] mb-6">
            Rooted in Nature. <br />
            <span className="italic font-normal text-sage">Made for Living.</span>
          </h1>

          <p className="text-base sm:text-lg text-cream/90 font-light leading-relaxed mb-8 max-w-xl">
            We believe that living with indoor plants is not merely interior decoration—it is a conscious daily practice of mindfulness, restorative living, and reconnection with the natural world.
          </p>
        </div>
      </div>
    </section>
  );
}

export function OurStory() {
  return (
    <section className="py-20 sm:py-28 bg-offwhite border-b border-sage/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-botanical block">
              The Genesis of Blooming Oasis
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest tracking-tight">
              From an Overcrowded Apartment to an Award-Winning Botanical Collective.
            </h2>
            <p className="text-sm sm:text-base text-charcoal/80 leading-relaxed font-light">
              Blooming Oasis began in 2021 inside a light-starved city apartment. Our co-founders—botanists and interior architects—struggled with sickly plants purchased from big-box home improvement stores that perished within weeks due to fragile root systems and cold transit shocks.
            </p>
            <p className="text-sm sm:text-base text-charcoal/80 leading-relaxed font-light">
              We realized the fundamental issue: conventional retailers treated houseplants like disposable consumer goods. We envisioned a different path—partnering directly with family-owned growers who let root systems mature naturally, acclimatizing plants for real indoor light conditions, and pairing them with science-backed guidance.
            </p>
            <p className="text-sm sm:text-base text-charcoal/80 leading-relaxed font-light">
              Today, Blooming Oasis has helped over 25,000 households across the country transform cold living spaces into lush, calming sanctuaries.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-card">
              <Image
                src="https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80"
                alt="Architectural indoor plant styling"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-card mt-8">
              <Image
                src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80"
                alt="Monstera leaf fenestration"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SustainableSourcing() {
  return (
    <section id="sustainability" className="py-20 sm:py-28 bg-cream/50 border-b border-sage/20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-botanical block mb-2">
            Eco-Conscious Philosophy
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-forest tracking-tight">
            Sustainable Cultivation & Packaging.
          </h2>
          <p className="text-sm text-charcoal/70 mt-3 leading-relaxed">
            We are dedicated to reducing our environmental footprint at every stage—from responsible nursery propagation to zero-plastic delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-offwhite p-8 rounded-3xl border border-sage/30 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-forest-light/20 flex items-center justify-center text-forest mb-6">
              <Leaf className="w-6 h-6 text-botanical" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest mb-3">
              Generational Nursery Care
            </h3>
            <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed font-light">
              We partner exclusively with sustainable growers who practice integrated pest management (IPM), rainwater harvesting, and beneficial insect biocontrol instead of synthetic pesticides.
            </p>
          </div>

          <div className="bg-offwhite p-8 rounded-3xl border border-sage/30 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-forest-light/20 flex items-center justify-center text-forest mb-6">
              <Globe className="w-6 h-6 text-botanical" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest mb-3">
              100% Zero-Plastic Packaging
            </h3>
            <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed font-light">
              Root balls are secured in biodegradable coco-coir membranes, and shipping boxes are engineered from 100% recycled unbleached corrugated fiberboard sealed with water-activated gummed tape.
            </p>
          </div>

          <div className="bg-offwhite p-8 rounded-3xl border border-sage/30 shadow-soft">
            <div className="w-12 h-12 rounded-2xl bg-forest-light/20 flex items-center justify-center text-forest mb-6">
              <BookOpen className="w-6 h-6 text-botanical" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest mb-3">
              Lifelong Education & Anti-Waste
            </h3>
            <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed font-light">
              The greenest plant is the one that lives a decade. Our continuous plant-parent support ensures healthy plants stay out of landfills and thrive as living family heirlooms.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function MeetTheTeam() {
  const team = [
    {
      name: "Dr. Elena Vance",
      role: "Co-Founder & Head of Horticultural Science",
      bio: "Ph.D. in Plant Ecophysiology with over 15 years researching tropical aroid fenestrations and indoor air-purifying mechanisms.",
      plantPreference: "Monstera Deliciosa (named 'Barnaby', 8 years old)",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Julian Chen",
      role: "Co-Founder & Biophilic Interior Architect",
      bio: "Architect specializing in biophilic Scandinavian spaces. Passionate about how shadows and botanical silhouettes affect human stress hormones.",
      plantPreference: "Fiddle Leaf Fig & Architectural Palms",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Marcus Thorne",
      role: "Nursery Director & Soil Formulator",
      bio: "Third-generation nurseryman with a relentless obsession for well-draining aroid potting mixes, mycorrhizal fungi, and organic potting substrates.",
      plantPreference: "Raven ZZ Plant (for indestructible night foliage)",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-offwhite border-b border-sage/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-botanical block mb-2">
            The Living Minds Behind The Brand
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-forest tracking-tight">
            Meet the Founding Team.
          </h2>
          <p className="text-xs text-charcoal/50 italic mt-2">
            * Demonstration profiles created for the Freelancing Level 3 Web Development Assessment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-cream/40 rounded-3xl overflow-hidden border border-sage/30 shadow-soft hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] bg-cream">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-forest">
                    {member.name}
                  </h3>
                  <div className="text-xs font-semibold uppercase tracking-wider text-botanical mt-0.5 mb-3">
                    {member.role}
                  </div>
                  <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed font-light">
                    {member.bio}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="p-3 bg-offwhite rounded-xl border border-sage/30 text-xs">
                  <span className="font-semibold text-forest block text-[11px] uppercase tracking-wider">
                    Personal Companion:
                  </span>
                  <span className="text-charcoal/80 italic mt-0.5 block">
                    {member.plantPreference}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BrandValues() {
  const values = [
    {
      title: "Botanical Integrity",
      desc: "We never artificially polish leaves with harmful oils or rush root development with harsh chemical stimulants.",
      icon: <Award className="w-5 h-5 text-botanical" />,
    },
    {
      title: "Accessible Education",
      desc: "Demystifying plant care through straightforward, non-intimidating advice so anyone can keep plants alive.",
      icon: <BookOpen className="w-5 h-5 text-botanical" />,
    },
    {
      title: "Living Harmony",
      desc: "Designing living products that integrate peacefully into modern architectural aesthetics.",
      icon: <Heart className="w-5 h-5 text-botanical" />,
    },
    {
      title: "Community Growth",
      desc: "Celebrating every new leaf unfurling with our active circle of passionate plant lovers.",
      icon: <Users className="w-5 h-5 text-botanical" />,
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-cream/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-botanical block mb-2">
            Guiding Philosophy
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-forest tracking-tight">
            Our Brand Values.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div
              key={v.title}
              className="bg-offwhite p-6 rounded-2xl border border-sage/30 shadow-soft"
            >
              <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center mb-4">
                {v.icon}
              </div>
              <h3 className="font-serif text-lg font-bold text-forest mb-2">
                {v.title}
              </h3>
              <p className="text-xs text-charcoal/70 leading-relaxed font-light">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

