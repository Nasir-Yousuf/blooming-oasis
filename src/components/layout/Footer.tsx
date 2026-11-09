"use client";

import React from "react";
import Link from "next/link";
import {
  Sprout,
  Mail,
  Phone,
  MapPin,
  Heart,
  ShieldCheck,
} from "lucide-react";
import {
  InstagramIcon,
  FacebookIcon,
  PinterestIcon,
  TikTokIcon,
} from "@/components/shared/SocialIcons";
import { LiveClock } from "@/components/shared/LiveClock";
import { CURATED_COLLECTIONS } from "@/data/initialProducts";

export function Footer() {
  const [settings, setSettings] = React.useState<any>({
    phone: "+1 (800) 555-PLANT (7526)",
    storeEmail: "care@bloomingoasis.demo",
    address: "742 Botanical Way, Suite 4B, Verdant Green District, CA 94107",
    socialLinks: {
      instagram: "https://instagram.com",
      pinterest: "https://pinterest.com",
      facebook: "https://facebook.com",
      tiktok: "https://tiktok.com",
    },
  });

  React.useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.settings) {
          setSettings(json.settings);
        }
      } catch (err) {
        console.warn("Could not load footer settings:", err);
      }
    }
    loadSettings();
  }, []);
  return (
    <footer className="bg-forest text-offwhite border-t border-forest-light/40">
      {/* Top Banner with Guarantee and Live Greenhouse Clock */}
      <div className="border-b border-forest-light/30 bg-forest-dark/40 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-cream/90">
            <ShieldCheck className="w-4 h-4 text-sage flex-shrink-0" />
            <span>14-Day Botanical Guarantee • Safe Doorstep Delivery Guaranteed</span>
          </div>

          {/* Live Date and Time Display (Assessment Section 8 Requirement) */}
          <LiveClock variant="footer" />
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-forest-light border border-sage/30 flex items-center justify-center">
                <Sprout className="w-5 h-5 text-sage" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-offwhite">
                Blooming Oasis
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-cream/80 max-w-sm leading-relaxed">
              We curate resilient, architectural indoor plants paired with sustainable ceramics and practical plant-parent education to bring the restorative power of nature into modern sanctuaries.
            </p>

            {/* Social Media Links with target="_blank" and rel="noopener noreferrer" */}
            <div className="pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-sage block mb-2.5">
                Join Our Botanical Community
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={settings.socialLinks?.instagram || "https://instagram.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-forest-light hover:bg-botanical text-cream hover:text-offwhite flex items-center justify-center transition-colors border border-sage/20"
                  aria-label="Visit Blooming Oasis on Instagram (opens in new tab)"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href={settings.socialLinks?.pinterest || "https://pinterest.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-forest-light hover:bg-botanical text-cream hover:text-offwhite flex items-center justify-center transition-colors border border-sage/20"
                  aria-label="Visit Blooming Oasis on Pinterest (opens in new tab)"
                >
                  <PinterestIcon className="w-4 h-4" />
                </a>
                <a
                  href={settings.socialLinks?.facebook || "https://facebook.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-forest-light hover:bg-botanical text-cream hover:text-offwhite flex items-center justify-center transition-colors border border-sage/20"
                  aria-label="Visit Blooming Oasis on Facebook (opens in new tab)"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a
                  href={settings.socialLinks?.tiktok || "https://tiktok.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-forest-light hover:bg-botanical text-cream hover:text-offwhite flex items-center justify-center transition-colors border border-sage/20"
                  aria-label="Visit Blooming Oasis on TikTok (opens in new tab)"
                >
                  <TikTokIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-offwhite tracking-wide">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-cream/75">
              <li>
                <Link href="/" className="hover:text-sage transition-colors">
                  Home Sanctuary
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-sage transition-colors">
                  All Indoor Plants
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-sage transition-colors">
                  Our Story & Mission
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-sage transition-colors">
                  Contact & Greenhouse
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-sage transition-colors">
                  Botanical Cart
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-sage transition-colors">
                  Customer Account & Orders
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-sage hover:text-offwhite transition-colors font-medium">
                  Admin Dashboard →
                </Link>
              </li>
            </ul>
          </div>

          {/* Curated Themed Collections */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-offwhite tracking-wide">
              Themed Edits
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-cream/75">
              {CURATED_COLLECTIONS.map((col) => (
                <li key={col.slug}>
                  <Link
                    href={`/collections/${col.slug}`}
                    className="hover:text-sage transition-colors"
                  >
                    {col.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/products/monstera-deliciosa"
                  className="text-sage hover:text-offwhite transition-colors font-medium flex items-center gap-1"
                >
                  Monstera Showcase →
                </Link>
              </li>
            </ul>
          </div>

          {/* Demonstration Contact & Greenhouse Information */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-offwhite tracking-wide">
              Botanical Nursery
            </h4>
            <div className="space-y-2.5 text-xs text-cream/75">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
                <span className="whitespace-pre-line">
                  {settings.address}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sage flex-shrink-0" />
                <span>{settings.storeEmail}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sage flex-shrink-0" />
                <span>{settings.phone}</span>
              </div>
              <p className="text-[11px] text-sage/70 pt-1">
                Demonstration nursery info for Freelancing Level 3 Web Development Assessment.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Attribution */}
        <div className="mt-12 pt-8 border-t border-forest-light/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/60">
          <p>
            © {new Date().getFullYear()} Blooming Oasis. Designed & engineered as a premium botanical e-commerce experience.
          </p>
          <div className="flex items-center gap-1 text-sage/90">
            <span>Crafted with living green care</span>
            <Heart className="w-3.5 h-3.5 text-terracotta fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
}
