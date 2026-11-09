"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Sprout,
  ChevronDown,
  Sparkles,
  User,
  Shield,
  Layers,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { SearchModal } from "@/components/shared/SearchModal";
import { CURATED_COLLECTIONS } from "@/data/initialProducts";

interface NavCategory {
  _id: string;
  name: string;
  slug: string;
  productCount?: number;
}

export function Navbar() {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState<NavCategory[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch dynamic categories for navigation
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        const json = await res.json();
        if (json.success && Array.isArray(json.categories)) {
          setCategories(json.categories);
        }
      } catch (err) {
        console.warn("Could not load dynamic navigation categories:", err);
      }
    }
    loadCategories();
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCollectionsOpen(false);
    setCategoriesOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Plants & Care", href: "/products" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-offwhite/95 backdrop-blur-md shadow-soft border-b border-sage/20 py-3.5"
            : "bg-offwhite border-b border-sage/20 py-4 sm:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-forest hover:text-botanical rounded-lg hover:bg-cream transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-forest text-offwhite flex items-center justify-center transition-transform group-hover:scale-105 duration-300 shadow-sm">
                <Sprout className="w-5 h-5 text-sage group-hover:rotate-6 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-forest leading-none">
                  Blooming Oasis
                </span>
                <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.2em] text-botanical font-medium mt-0.5">
                  Botanical Living
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm tracking-wide font-medium relative transition-colors py-1 ${
                    isActive(link.href)
                      ? "text-forest font-semibold"
                      : "text-charcoal/80 hover:text-forest"
                  }`}
                >
                  {link.name}
                  {isActive(link.href) && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest rounded-full" />
                  )}
                </Link>
              ))}

              {/* Dynamic Categories Dropdown */}
              <div className="relative group">
                <button
                  onClick={() => {
                    setCategoriesOpen(!categoriesOpen);
                    setCollectionsOpen(false);
                  }}
                  onMouseEnter={() => {
                    setCategoriesOpen(true);
                    setCollectionsOpen(false);
                  }}
                  className="flex items-center gap-1 text-sm tracking-wide font-medium text-charcoal/80 hover:text-forest py-1"
                >
                  <span>Categories</span>
                  <ChevronDown className="w-3.5 h-3.5 text-sage group-hover:rotate-180 transition-transform duration-300" />
                </button>

                <div
                  onMouseLeave={() => setCategoriesOpen(false)}
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-offwhite rounded-2xl shadow-xl border border-sage/30 p-3 transition-all duration-300 z-50 ${
                    categoriesOpen
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-botanical px-3 py-1 flex items-center gap-1">
                    <Layers className="w-3 h-3" /> Live Classifications
                  </div>
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/products?category=${encodeURIComponent(cat.name)}`}
                      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-cream transition-colors text-xs font-semibold text-forest"
                    >
                      <span>{cat.name}</span>
                      {typeof cat.productCount === "number" && (
                        <span className="text-[10px] text-charcoal/50 font-mono">
                          {cat.productCount}
                        </span>
                      )}
                    </Link>
                  ))}
                  <div className="pt-2 mt-1 border-t border-sage/20 text-center">
                    <Link
                      href="/products"
                      className="text-[11px] font-semibold uppercase tracking-wider text-botanical hover:text-forest"
                    >
                      All Indoor Plants →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Curated Collections Dropdown */}
              <div className="relative group">
                <button
                  onClick={() => {
                    setCollectionsOpen(!collectionsOpen);
                    setCategoriesOpen(false);
                  }}
                  onMouseEnter={() => {
                    setCollectionsOpen(true);
                    setCategoriesOpen(false);
                  }}
                  className="flex items-center gap-1 text-sm tracking-wide font-medium text-charcoal/80 hover:text-forest py-1"
                >
                  <span>Collections</span>
                  <ChevronDown className="w-3.5 h-3.5 text-sage group-hover:rotate-180 transition-transform duration-300" />
                </button>

                <div
                  onMouseLeave={() => setCollectionsOpen(false)}
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-offwhite rounded-2xl shadow-xl border border-sage/30 p-3 transition-all duration-300 z-50 ${
                    collectionsOpen
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-botanical px-3 py-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Themed Plant Edits
                  </div>
                  {CURATED_COLLECTIONS.map((col) => (
                    <Link
                      key={col.slug}
                      href={`/collections/${col.slug}`}
                      className="flex flex-col px-3 py-2 rounded-xl hover:bg-cream transition-colors"
                    >
                      <span className="text-xs font-semibold text-forest">
                        {col.title}
                      </span>
                      <span className="text-[11px] text-charcoal/60">
                        {col.subtitle}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 sm:p-2.5 rounded-full hover:bg-cream text-charcoal/80 hover:text-forest transition-colors relative"
                aria-label="Search plants"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Shopping Cart Icon with Live Badge */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 sm:p-2.5 rounded-full hover:bg-cream text-forest transition-colors"
                aria-label="View shopping cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-forest text-offwhite text-[11px] font-bold flex items-center justify-center border-2 border-offwhite animate-in zoom-in-50">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Customer Account Button */}
              <Link
                href="/account"
                className="p-2 sm:p-2.5 rounded-full hover:bg-cream text-forest transition-colors relative"
                title="Customer Account & Orders"
                aria-label="Customer Account & Orders"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Admin Dashboard Pill */}
              <Link
                href="/admin"
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-forest/5 hover:bg-forest/10 border border-forest/20 text-xs font-semibold text-forest transition-colors"
                title="Administrative Control Center"
              >
                <Shield className="w-3.5 h-3.5 text-terracotta" />
                <span>Admin</span>
              </Link>

              {/* CTA Link to Matchmaker */}
              <Link
                href="/#plant-matchmaker"
                className="hidden xl:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-cream hover:bg-sage/20 border border-sage/40 text-xs font-semibold text-forest uppercase tracking-wider transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-botanical" />
                <span>Matchmaker</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-sage/20 bg-offwhite px-4 pt-4 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-3 py-2 rounded-xl text-base font-medium ${
                  isActive(link.href)
                    ? "bg-cream text-forest font-semibold"
                    : "text-charcoal hover:bg-cream/60"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Categories */}
            {categories.length > 0 && (
              <div className="pt-2 border-t border-sage/20">
                <span className="px-3 text-xs font-semibold text-botanical uppercase tracking-wider block mb-1">
                  Plant Categories
                </span>
                <div className="grid grid-cols-2 gap-1 px-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/products?category=${encodeURIComponent(cat.name)}`}
                      className="px-2 py-1.5 rounded-lg text-xs font-medium text-charcoal/80 hover:bg-cream hover:text-forest truncate"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-sage/20">
              <span className="px-3 text-xs font-semibold text-botanical uppercase tracking-wider block mb-1">
                Themed Collections
              </span>
              {CURATED_COLLECTIONS.map((col) => (
                <Link
                  key={col.slug}
                  href={`/collections/${col.slug}`}
                  className="block px-3 py-1.5 text-sm text-charcoal/80 hover:text-forest"
                >
                  {col.title}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-sage/20 space-y-2">
              <Link
                href="/account"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-forest hover:bg-cream"
              >
                <User className="w-4 h-4 text-botanical" />
                <span>My Account & Orders</span>
              </Link>
              <Link
                href="/admin"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-forest hover:bg-cream"
              >
                <Shield className="w-4 h-4 text-terracotta" />
                <span>Admin Dashboard</span>
              </Link>
            </div>

            <div className="pt-2">
              <Link
                href="/#plant-matchmaker"
                className="w-full py-2.5 px-4 rounded-xl bg-forest text-offwhite text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-sage" /> Find Your Plant Match
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Dialog Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
