"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MessageSquare, Check, X, Star, Trash2, Heart } from "lucide-react";

export default function AdminPlantTipsPage() {
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetchTips();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchTips = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/plant-tips");
      const data = await res.json();
      if (data.success && data.tips) {
        setTips(data.tips);
      }
    } catch (e) {
      console.warn("Failed to fetch tips:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/plant-tips", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchTips();
        showToast(`Tip status updated to ${status}!`);
      }
    } catch (e) {
      console.error("Status update error:", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this tip?")) return;
    try {
      const res = await fetch("/api/admin/plant-tips", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchTips();
        showToast("Tip deleted safely.");
      }
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-forest text-offwhite px-4 py-3 rounded-2xl shadow-elevated border border-sage/40 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-4">
          <Check className="w-4 h-4 text-sage" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest tracking-tight">
          Plant Parent Tips Moderation
        </h1>
        <p className="text-xs text-charcoal/60 mt-0.5">
          Review, approve, and curate community plant care stories before they appear publicly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-offwhite rounded-3xl border border-sage/30">
            <p className="font-serif text-lg text-forest">No community tips submitted yet.</p>
          </div>
        ) : (
          tips.map((tip) => (
            <div
              key={tip._id}
              className="bg-offwhite rounded-3xl p-6 border border-sage/30 shadow-soft flex flex-col justify-between"
            >
              <div>
                {tip.imageUrl && (
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4 bg-cream">
                    <Image
                      src={tip.imageUrl}
                      alt={tip.authorName}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-botanical bg-cream px-2.5 py-0.5 rounded-full border border-sage/30">
                    {tip.plantName}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      tip.status === "approved"
                        ? "bg-botanical/15 text-botanical"
                        : tip.status === "featured"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tip.status}
                  </span>
                </div>

                <p className="text-xs text-charcoal/80 leading-relaxed italic mt-2">
                  &ldquo;{tip.content}&rdquo;
                </p>

                <div className="mt-4 pt-2 flex items-center justify-between text-xs text-charcoal/60">
                  <span className="font-semibold text-forest">By {tip.authorName}</span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-terracotta fill-current" /> {tip.likes || 0}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-sage/20 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {tip.status !== "approved" && (
                    <button
                      onClick={() => handleUpdateStatus(tip._id, "approved")}
                      className="px-2.5 py-1 rounded-lg bg-botanical/15 hover:bg-botanical/25 text-botanical text-[11px] font-semibold"
                    >
                      Approve
                    </button>
                  )}
                  {tip.status !== "featured" && (
                    <button
                      onClick={() => handleUpdateStatus(tip._id, "featured")}
                      className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 text-[11px] font-semibold"
                    >
                      Feature
                    </button>
                  )}
                  {tip.status !== "rejected" && (
                    <button
                      onClick={() => handleUpdateStatus(tip._id, "rejected")}
                      className="px-2.5 py-1 rounded-lg bg-terracotta/15 hover:bg-terracotta/25 text-terracotta text-[11px] font-semibold"
                    >
                      Reject
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handleDelete(tip._id)}
                  className="p-1.5 rounded-lg text-charcoal/50 hover:text-terracotta"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

