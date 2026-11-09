"use client";

import React from "react";
import Image from "next/image";
import { ExternalLink, Heart, Sparkles, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/shared/SocialIcons";

interface SocialPost {
  id: string;
  image: string;
  tag: string;
  caption: string;
  likes: string;
  comments: string;
  platform: "Instagram" | "Pinterest" | "TikTok";
  url: string;
}

const SOCIAL_POSTS: SocialPost[] = [
  {
    id: "post-1",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80",
    tag: "#NurseryGlimpse",
    caption: "Morning misting rounds in greenhouse #3. The Monstera fenestrations are thriving today! 🌿",
    likes: "1.4k",
    comments: "82",
    platform: "Instagram",
    url: "https://instagram.com",
  },
  {
    id: "post-2",
    image: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80",
    tag: "#HomeStyling",
    caption: "Sunday morning sanctuary goals. A 6-foot Fiddle Leaf Fig paired with textured ceramics and soft morning sunlight.",
    likes: "2.1k",
    comments: "144",
    platform: "Pinterest",
    url: "https://pinterest.com",
  },
  {
    id: "post-3",
    image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=800&q=80",
    tag: "#PetSafeBotanicals",
    caption: "Milo inspecting his new Calathea Orbifolia. 100% ASPCA certified pet-safe for peace of mind. 🐾",
    likes: "3.5k",
    comments: "219",
    platform: "Instagram",
    url: "https://instagram.com",
  },
  {
    id: "post-4",
    image: "https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?auto=format&fit=crop&w=800&q=80",
    tag: "#CareTips",
    caption: "Quick diagnostic: how to tell if your Snake Plant is thirsty vs overwatered in under 10 seconds.",
    likes: "4.8k",
    comments: "305",
    platform: "TikTok",
    url: "https://tiktok.com",
  },
];

export function SocialSection() {
  return (
    <section className="py-20 sm:py-28 bg-offwhite">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-botanical mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Community & Social Inspiration
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-forest tracking-tight leading-tight">
              Life Inside the Living Oasis.
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream hover:bg-sage/20 border border-sage/40 text-xs font-semibold text-forest uppercase tracking-wider transition-colors"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-botanical" /> Follow @BloomingOasis
            </a>
          </div>
        </div>

        {/* Social Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SOCIAL_POSTS.map((post) => (
            <a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-2xl overflow-hidden bg-cream shadow-soft hover:shadow-card transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden bg-cream">
                <Image
                  src={post.image}
                  alt={post.caption}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-forest/20 group-hover:bg-forest/40 transition-colors" />

                {/* Platform Tag */}
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-forest/80 backdrop-blur-sm text-offwhite text-[10px] font-semibold uppercase tracking-wider">
                  {post.platform}
                </div>

                {/* External Link Icon */}
                <div className="absolute top-3 right-3 p-1.5 rounded-full bg-offwhite/90 text-forest opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>

                {/* Hover Likes and Comments overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-4 text-offwhite font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-current text-terracotta" /> {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4 fill-current" /> {post.comments}
                  </span>
                </div>
              </div>

              {/* Caption */}
              <div className="p-4 bg-offwhite flex-1 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-botanical mb-1 block">
                  {post.tag}
                </span>
                <p className="text-xs text-charcoal/80 line-clamp-2 leading-relaxed">
                  {post.caption}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
