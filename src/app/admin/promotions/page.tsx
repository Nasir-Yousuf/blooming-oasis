"use client";

import React, { useState, useEffect } from "react";
import { Plus, Tag, Trash2, Check, X, AlertCircle } from "lucide-react";
import { formatPrice } from "@/lib/browser-interactions";

export default function AdminPromotionsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 15,
    minOrderAmount: 50,
    maxDiscount: 30,
    usageLimit: 100,
    expiresAt: new Date(Date.now() + 60 * 24 * 3600000).toISOString().split("T")[0],
    active: true,
  });

  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetchCoupons();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/promotions");
      const data = await res.json();
      if (data.success && data.coupons) {
        setCoupons(data.coupons);
      }
    } catch (e) {
      console.warn("Failed to fetch promotions:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          code: formData.code.toUpperCase().trim(),
          discountValue: Number(formData.discountValue),
          minOrderAmount: Number(formData.minOrderAmount),
          maxDiscount: Number(formData.maxDiscount),
          usageLimit: Number(formData.usageLimit),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsModalOpen(false);
        fetchCoupons();
        showToast(`Promotion ${formData.code.toUpperCase()} created!`);
      } else {
        alert(data.message || "Failed to create promotion");
      }
    } catch (e) {
      console.error("Create coupon error:", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promotion?")) return;
    try {
      const res = await fetch("/api/admin/promotions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchCoupons();
        showToast("Promotion deleted");
      }
    } catch (e) {
      console.error("Delete coupon error:", e);
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest tracking-tight">
            Promotions & Discount Codes
          </h1>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Configure promotional campaign codes for storefront cart checkout.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-forest hover:bg-forest-light text-offwhite text-xs font-semibold uppercase tracking-wider shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-sage" /> Create Discount Code
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div
            key={c._id}
            className="bg-offwhite rounded-3xl p-6 border border-sage/30 shadow-soft flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono font-bold text-lg text-forest bg-cream px-3 py-1 rounded-xl border border-sage/40 tracking-wider">
                  {c.code}
                </span>
                <span
                  className={`text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full ${
                    c.active ? "bg-botanical/15 text-botanical" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {c.active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="font-serif text-2xl font-bold text-forest mb-2">
                {c.discountType === "percentage"
                  ? `${c.discountValue}% Off`
                  : `${formatPrice(c.discountValue)} Off`}
              </div>

              <div className="space-y-1 text-xs text-charcoal/70">
                <div>Min Order: {formatPrice(c.minOrderAmount || 0)}</div>
                <div>
                  Usage: {c.usageCount || 0} / {c.usageLimit || "Unlimited"}
                </div>
                <div>
                  Expires:{" "}
                  {new Date(c.expiresAt).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-sage/20 flex justify-end">
              <button
                onClick={() => handleDelete(c._id)}
                className="p-1.5 rounded-lg text-charcoal/60 hover:text-terracotta hover:bg-cream"
                title="Delete Promotion"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest/80 backdrop-blur-sm">
          <div className="bg-offwhite rounded-3xl p-6 sm:p-8 max-w-md w-full border border-sage/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sage/20">
              <h3 className="font-serif text-xl font-bold text-forest">
                Create Discount Code
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-charcoal/60 hover:text-forest"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. SUMMERGREEN"
                  className="w-full bg-cream/60 border border-sage/40 rounded-xl px-3.5 py-2 text-xs text-charcoal font-mono uppercase focus:outline-none focus:border-botanical"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({ ...formData, discountType: e.target.value })
                    }
                    className="w-full bg-cream/60 border border-sage/40 rounded-xl px-3 py-2 text-xs text-charcoal"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Dollar ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData({ ...formData, discountValue: Number(e.target.value) })
                    }
                    className="w-full bg-cream/60 border border-sage/40 rounded-xl px-3.5 py-2 text-xs text-charcoal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                    Min Order ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrderAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, minOrderAmount: Number(e.target.value) })
                    }
                    className="w-full bg-cream/60 border border-sage/40 rounded-xl px-3.5 py-2 text-xs text-charcoal"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.expiresAt}
                    onChange={(e) =>
                      setFormData({ ...formData, expiresAt: e.target.value })
                    }
                    className="w-full bg-cream/60 border border-sage/40 rounded-xl px-3 py-2 text-xs text-charcoal"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-sage/20 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-sage/40 text-xs font-semibold text-charcoal hover:bg-cream"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-forest hover:bg-forest-light text-offwhite text-xs font-semibold uppercase tracking-wider"
                >
                  Create Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

