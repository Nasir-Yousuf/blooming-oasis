"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Heart,
  Sparkles,
  Send,
  Plus,
  CheckCircle2,
  X,
  Leaf,
} from "lucide-react";
import { triggerBotanicalConfetti } from "@/lib/browser-interactions";

interface CommunityTip {
  _id: string;
  authorName: string;
  plantName: string;
  content: string;
  imageUrl?: string;
  likes: number;
  createdAt: string;
}

export function PlantParentTips() {
  const [tips, setTips] = useState<CommunityTip[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  // Form states
  const [authorName, setAuthorName] = useState("");
  const [plantName, setPlantName] = useState("Monstera Deliciosa");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "idle";
    text: string;
  }>({ type: "idle", text: "" });

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      const res = await fetch("/api/plant-tips");
      const data = await res.json();
      if (data.success && data.data) {
        setTips(data.data);
      }
    } catch (e) {
      console.warn("Failed to load community tips:", e);
    }
  };

  const handleLike = (tipId: string) => {
    if (likedIds.has(tipId)) return;
    setLikedIds(new Set(likedIds).add(tipId));
    setTips((prev) =>
      prev.map((t) => (t._id === tipId ? { ...t, likes: t.likes + 1 } : t))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) {
      setStatusMessage({
        type: "error",
        text: "Please provide your name and plant experience.",
      });
      return;
    }

    setSubmitting(true);
    setStatusMessage({ type: "idle", text: "" });

    try {
      const res = await fetch("/api/plant-tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName,
          plantName,
          content,
          imageUrl: imageUrl.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({
          type: "success",
          text: data.message || "Thank you! Your plant tip has been published.",
        });
        if (data.data) {
          setTips((prev) => [data.data, ...prev]);
        }
        setAuthorName("");
        setContent("");
        setImageUrl("");
        triggerBotanicalConfetti();
        setTimeout(() => {
          setModalOpen(false);
          setStatusMessage({ type: "idle", text: "" });
        }, 1800);
      } else {
        setStatusMessage({
          type: "error",
          text: data.message || "Could not publish tip. Please check form fields.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network error. Please try again later.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-20 sm:py-28 bg-offwhite border-t border-sage/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-botanical mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Community Knowledge Exchange
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-forest tracking-tight leading-tight">
              Plant Parent Tips & Stories.
            </h2>
            <p className="text-sm text-charcoal/70 mt-2 leading-relaxed">
              Real advice, propagation triumphs, and lighting discoveries shared by the Blooming Oasis community.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-forest hover:bg-forest-light text-offwhite text-xs font-semibold uppercase tracking-wider shadow-card hover:shadow-elevated transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-sage" /> Share Your Plant Experience
          </button>
        </div>

        {/* Community Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {tips.map((tip) => (
            <div
              key={tip._id}
              className="bg-cream/40 rounded-3xl p-6 sm:p-7 border border-sage/30 flex flex-col justify-between hover:shadow-soft transition-all"
            >
              <div>
                {/* Image if available */}
                {tip.imageUrl && (
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-5 bg-cream border border-sage/20">
                    <Image
                      src={tip.imageUrl}
                      alt={`${tip.authorName}'s ${tip.plantName}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Plant Tag & Author Info */}
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="inline-flex items-center gap-1 font-semibold text-botanical uppercase tracking-wider text-[10px] bg-cream px-2.5 py-1 rounded-full border border-sage/30">
                    <Leaf className="w-3 h-3" /> {tip.plantName}
                  </span>
                  <span className="text-charcoal/50 text-[11px]">
                    Verified Plant Parent
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-charcoal/85 leading-relaxed font-light italic">
                  &ldquo;{tip.content}&rdquo;
                </p>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-sage/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-forest text-offwhite text-xs font-bold flex items-center justify-center">
                    {tip.authorName.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-forest block leading-none">
                      {tip.authorName}
                    </span>
                    <span className="text-[10px] text-charcoal/60">Community Member</span>
                  </div>
                </div>

                {/* Helpful Like Button */}
                <button
                  onClick={() => handleLike(tip._id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    likedIds.has(tip._id)
                      ? "bg-terracotta/20 text-terracotta border border-terracotta/30"
                      : "bg-cream hover:bg-sage/20 text-charcoal/70"
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      likedIds.has(tip._id) ? "fill-current text-terracotta" : ""
                    }`}
                  />
                  <span>{tip.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share Plant Tip Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-12 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-forest/70 backdrop-blur-md transition-opacity"
            onClick={() => setModalOpen(false)}
          />

          <div className="relative max-w-lg w-full bg-offwhite rounded-3xl shadow-2xl border border-sage/40 p-6 sm:p-8 z-10">
            <div className="flex items-center justify-between pb-4 border-b border-sage/20 mb-6">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-botanical" />
                <h3 className="font-serif text-xl font-bold text-forest">
                  Share Plant Parent Wisdom
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full text-charcoal/60 hover:text-forest"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {statusMessage.type === "success" ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-botanical mx-auto mb-3" />
                <h4 className="font-serif text-xl font-bold text-forest mb-1">
                  Thank You for Sharing!
                </h4>
                <p className="text-xs text-charcoal/70">{statusMessage.text}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                    Your Name (or Nickname) *
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Maya Lin"
                    className="w-full bg-cream/70 border border-sage/40 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-botanical"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                    Plant Species *
                  </label>
                  <input
                    type="text"
                    required
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                    placeholder="e.g. Monstera Deliciosa, Snake Plant..."
                    className="w-full bg-cream/70 border border-sage/40 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-botanical"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                    Your Care Experience or Breakthrough *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Tell us what worked! (e.g. misting aerial roots, rotating towards morning light, switching to pebble trays...)"
                    className="w-full bg-cream/70 border border-sage/40 rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-botanical"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                    Photo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-cream/70 border border-sage/40 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-botanical"
                  />
                  <span className="text-[10px] text-charcoal/50 block mt-1">
                    Paste an image URL of your thriving plant.
                  </span>
                </div>

                {statusMessage.type === "error" && (
                  <p className="text-xs text-terracotta bg-terracotta/20 p-2.5 rounded-lg border border-terracotta/30">
                    {statusMessage.text}
                  </p>
                )}

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-sage/40 text-xs font-semibold text-charcoal hover:bg-cream"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-forest hover:bg-forest-light text-offwhite text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {submitting ? "Publishing..." : "Publish to Community"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

