"use client";

import React, { useState, useEffect } from "react";
import { Settings, Check, Save } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({
    storeName: "Blooming Oasis",
    storeEmail: "care@bloomingoasis.demo",
    phone: "+1 (800) 555-PLANT",
    currency: "USD",
    deliveryCharge: 12,
    freeDeliveryThreshold: 75,
    address: "742 Botanical Way, Suite 4B, Verdant Green District, CA 94107",
    announcementText: "Bring home a little more green. Free delivery on orders over $75.",
    announcementActive: true,
  });

  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (e) {
      console.warn("Failed to fetch settings:", e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          deliveryCharge: Number(settings.deliveryCharge),
          freeDeliveryThreshold: Number(settings.freeDeliveryThreshold),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToastMessage("Store settings saved successfully!");
        setTimeout(() => setToastMessage(""), 3500);
      }
    } catch (e) {
      console.error("Save settings error:", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-forest text-offwhite px-4 py-3 rounded-2xl shadow-elevated border border-sage/40 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-4">
          <Check className="w-4 h-4 text-sage" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest tracking-tight">
          Store Operations & Policy Settings
        </h1>
        <p className="text-xs text-charcoal/60 mt-0.5">
          Configure delivery rate thresholds, nursery identity, and announcement messaging.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-offwhite rounded-3xl p-6 sm:p-8 border border-sage/30 shadow-soft space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
              Store Brand Name
            </label>
            <input
              type="text"
              value={settings.storeName}
              onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
              className="w-full bg-cream/60 border border-sage/40 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-botanical"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
              Store Care Email
            </label>
            <input
              type="email"
              value={settings.storeEmail}
              onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
              className="w-full bg-cream/60 border border-sage/40 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-botanical"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full bg-cream/60 border border-sage/40 rounded-xl px-3.5 py-2 text-xs text-charcoal"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
              Base Delivery Fee ($)
            </label>
            <input
              type="number"
              min="0"
              value={settings.deliveryCharge}
              onChange={(e) =>
                setSettings({ ...settings, deliveryCharge: e.target.value })
              }
              className="w-full bg-cream/60 border border-sage/40 rounded-xl px-3.5 py-2 text-xs text-charcoal"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
              Free Shipping Order ($)
            </label>
            <input
              type="number"
              min="0"
              value={settings.freeDeliveryThreshold}
              onChange={(e) =>
                setSettings({ ...settings, freeDeliveryThreshold: e.target.value })
              }
              className="w-full bg-cream/60 border border-sage/40 rounded-xl px-3.5 py-2 text-xs text-charcoal"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
            Storefront Announcement Bar Text
          </label>
          <input
            type="text"
            value={settings.announcementText}
            onChange={(e) =>
              setSettings({ ...settings, announcementText: e.target.value })
            }
            className="w-full bg-cream/60 border border-sage/40 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-botanical"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
            Physical Greenhouse Address
          </label>
          <textarea
            rows={2}
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            className="w-full bg-cream/60 border border-sage/40 rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-botanical"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-forest hover:bg-forest-light text-offwhite text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-sage" />
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}

