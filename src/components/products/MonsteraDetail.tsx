"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sun,
  Droplets,
  Wind,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  ShoppingBag,
  Heart,
  Star,
  Check,
  Plus,
  Minus,
  Sparkles,
  Truck,
  Leaf,
} from "lucide-react";
import { ProductData } from "@/data/initialProducts";
import { useCart, SelectedAccessory } from "@/context/CartContext";
import { formatPrice } from "@/lib/browser-interactions";

interface MonsteraDetailProps {
  product: ProductData;
}

export function MonsteraDetail({ product }: MonsteraDetailProps) {
  const { addItem } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSizeName, setSelectedSizeName] = useState<string>("Small");
  const [selectedAccessories, setSelectedAccessories] = useState<SelectedAccessory[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedNotice, setIsAddedNotice] = useState(false);

  // Calculate dynamic unit price
  const activeSize = product.sizes?.find((s) => s.name === selectedSizeName) || {
    name: "Small",
    priceModifier: 0,
    height: "Standard",
  };
  const sizeModifier = activeSize.priceModifier || 0;
  const accessoriesTotal = selectedAccessories.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = product.price + sizeModifier + accessoriesTotal;
  const lineTotal = unitPrice * quantity;

  const toggleAccessory = (acc: { id: string; name: string; price: number }) => {
    const exists = selectedAccessories.some((a) => a.id === acc.id);
    if (exists) {
      setSelectedAccessories(selectedAccessories.filter((a) => a.id !== acc.id));
    } else {
      setSelectedAccessories([...selectedAccessories, acc]);
    }
  };

  const handleAddToCart = () => {
    addItem(product, selectedSizeName, selectedAccessories, quantity);
    setIsAddedNotice(true);
    setTimeout(() => setIsAddedNotice(false), 2000);
  };

  const images = product.images?.length > 0 ? product.images : [
    "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1200&q=80"
  ];

  return (
    <div className="bg-offwhite py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-charcoal/60 mb-8">
          <Link href="/" className="hover:text-forest transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-forest transition-colors">
            Indoor Plants
          </Link>
          <span>/</span>
          <span className="text-forest font-semibold truncate">{product.name}</span>
        </nav>

        {/* Main Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Multi-Image Product Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Featured Image */}
            <div className="relative aspect-[4/5] sm:aspect-[4/4.5] rounded-3xl overflow-hidden bg-cream shadow-card border border-sage/30">
              <Image
                src={images[selectedImageIndex]}
                alt={`${product.name} botanical view`}
                fill
                priority
                className="object-cover object-center transition-all duration-500 ease-out"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-forest text-offwhite shadow-sm">
                  <Sparkles className="w-3 h-3 text-sage" /> In Stock & Acclimatized
                </span>
                {product.petFriendly ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-cream text-botanical border border-botanical/20">
                    <ShieldCheck className="w-3.5 h-3.5" /> ASPCA Pet Safe
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-terracotta/90 text-offwhite">
                    <ShieldAlert className="w-3.5 h-3.5" /> Keep Away From Pets
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label="Wishlist toggle"
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all ${
                  isWishlisted
                    ? "bg-terracotta text-offwhite shadow-md scale-105"
                    : "bg-offwhite/85 text-charcoal hover:bg-offwhite hover:text-terracotta"
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3 sm:gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx
                        ? "border-forest shadow-md scale-[1.02]"
                        : "border-sage/30 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail view ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Specifications & Configuration (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-botanical mb-1.5 flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5" /> {product.category} Collection
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest tracking-tight leading-tight">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-charcoal/60 italic font-serif mt-1">
                {product.botanicalName}
              </p>

              {/* Rating presentation */}
              <div className="flex items-center gap-2 mt-3 text-xs text-charcoal/80">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="font-semibold">{product.rating}</span>
                <span className="text-charcoal/50">
                  ({product.reviewsCount} verified reviews)
                </span>
              </div>
            </div>

            {/* Dynamic Price Display */}
            <div className="py-4 border-y border-sage/20 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-charcoal/60 uppercase tracking-wider block">
                  Configuration Price
                </span>
                <div className="font-serif text-3xl font-bold text-forest">
                  {formatPrice(lineTotal)}
                </div>
              </div>
              <span className="text-xs text-botanical font-medium bg-botanical/10 px-2.5 py-1 rounded-full border border-botanical/20">
                Free Delivery eligible
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Size Selection (Required Section 5.B) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-forest">
                  Select Botanical Size
                </span>
                <span className="text-xs text-charcoal/60 font-medium">
                  {activeSize.height}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {product.sizes?.map((size) => (
                  <button
                    key={size.name}
                    onClick={() => setSelectedSizeName(size.name)}
                    className={`p-3 rounded-2xl border-2 text-left transition-all ${
                      selectedSizeName === size.name
                        ? "border-forest bg-cream/70 text-forest shadow-xs font-semibold"
                        : "border-sage/30 hover:border-sage bg-offwhite text-charcoal/80"
                    }`}
                  >
                    <div className="text-xs font-bold">{size.name}</div>
                    <div className="text-[11px] text-botanical mt-0.5">
                      {size.priceModifier === 0
                        ? "Base Size"
                        : `+${formatPrice(size.priceModifier)}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Accessories Add-Ons (Required Section 5.B) */}
            {product.accessories && product.accessories.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-forest block">
                  Optional Curated Accessories
                </span>
                <div className="space-y-2">
                  {product.accessories.map((acc) => {
                    const isChecked = selectedAccessories.some((a) => a.id === acc.id);
                    return (
                      <label
                        key={acc.id}
                        className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${
                          isChecked
                            ? "border-botanical bg-cream/50"
                            : "border-sage/30 bg-offwhite hover:bg-cream/20"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            toggleAccessory({
                              id: acc.id,
                              name: acc.name,
                              price: acc.price,
                            })
                          }
                          className="w-4 h-4 rounded text-forest focus:ring-forest border-sage mt-0.5 accent-forest"
                        />
                        <div className="flex-1 text-xs">
                          <div className="flex items-center justify-between font-semibold text-forest">
                            <span>{acc.name}</span>
                            <span className="font-mono">+{formatPrice(acc.price)}</span>
                          </div>
                          <p className="text-[11px] text-charcoal/60 mt-0.5">
                            {acc.description}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Cart Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center justify-between border border-sage/40 rounded-2xl bg-cream/70 px-3 py-2">
                <span className="text-xs font-semibold text-charcoal/70 sm:hidden">
                  Quantity:
                </span>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 text-charcoal/70 hover:text-forest transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-forest min-w-[28px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 text-charcoal/70 hover:text-forest transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Add to Cart CTA */}
              {product.stock <= 0 ? (
                <button
                  disabled
                  className="flex-1 py-4 px-6 rounded-2xl bg-charcoal/20 text-charcoal/50 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  Out of Stock
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 px-6 rounded-2xl bg-forest hover:bg-forest-light text-offwhite text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-card hover:shadow-elevated transition-all active:scale-95"
                >
                  {isAddedNotice ? (
                    <>
                      <Check className="w-4 h-4 text-sage animate-bounce" /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-sage" /> Add to Botanical Cart (
                      {formatPrice(lineTotal)})
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Delivery & Guarantee Badges */}
            <div className="pt-4 border-t border-sage/20 grid grid-cols-2 gap-3 text-xs text-charcoal/80">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-botanical" />
                <span>Zero-plastic doorstep delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-botanical" />
                <span>14-day thriving guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Plant Specifications (Required Section 5.B) */}
        <div className="mt-16 sm:mt-24 pt-12 border-t border-sage/20">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-botanical">
              Botanical Care Guide & Biology
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest mt-1">
              {product.name} Specifications
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Sunlight */}
            <div className="bg-cream/50 p-5 rounded-2xl border border-sage/30 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-offwhite flex items-center justify-center text-terracotta flex-shrink-0 shadow-xs">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/60 block">
                  Sunlight
                </span>
                <span className="text-sm font-semibold text-forest block mt-0.5">
                  {product.sunlight}
                </span>
                <span className="text-xs text-charcoal/70 mt-1 block">
                  East window or filtered south exposure.
                </span>
              </div>
            </div>

            {/* Watering */}
            <div className="bg-cream/50 p-5 rounded-2xl border border-sage/30 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-offwhite flex items-center justify-center text-botanical flex-shrink-0 shadow-xs">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/60 block">
                  Watering
                </span>
                <span className="text-sm font-semibold text-forest block mt-0.5">
                  {product.watering}
                </span>
                <span className="text-xs text-charcoal/70 mt-1 block">
                  Allow top 2 inches to dry between waterings.
                </span>
              </div>
            </div>

            {/* Humidity */}
            <div className="bg-cream/50 p-5 rounded-2xl border border-sage/30 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-offwhite flex items-center justify-center text-sage flex-shrink-0 shadow-xs">
                <Wind className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/60 block">
                  Humidity
                </span>
                <span className="text-sm font-semibold text-forest block mt-0.5">
                  {product.humidity}
                </span>
                <span className="text-xs text-charcoal/70 mt-1 block">
                  Thrives with routine foliage misting.
                </span>
              </div>
            </div>

            {/* Repotting */}
            <div className="bg-cream/50 p-5 rounded-2xl border border-sage/30 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-offwhite flex items-center justify-center text-forest flex-shrink-0 shadow-xs">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/60 block">
                  Repotting
                </span>
                <span className="text-sm font-semibold text-forest block mt-0.5">
                  {product.repottingFrequency}
                </span>
                <span className="text-xs text-charcoal/70 mt-1 block">
                  Best performed in spring season.
                </span>
              </div>
            </div>
          </div>

          {/* Special Pet Safety & Toxicity Banner (Required Section 5.B) */}
          <div
            className={`mt-6 p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              product.petFriendly
                ? "bg-botanical/10 border-botanical/30 text-forest"
                : "bg-terracotta/10 border-terracotta/30 text-charcoal"
            }`}
          >
            <div className="flex items-start gap-3">
              {product.petFriendly ? (
                <ShieldCheck className="w-6 h-6 text-botanical flex-shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="w-6 h-6 text-terracotta flex-shrink-0 mt-0.5" />
              )}
              <div>
                <h3 className="font-serif text-base font-bold">
                  {product.petFriendly ? "100% ASPCA Certified Pet-Safe" : "Toxicity & Pet Advisory Warning"}
                </h3>
                <p className="text-xs sm:text-sm mt-0.5 leading-relaxed opacity-90">
                  {product.toxicity}
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-offwhite shadow-xs whitespace-nowrap">
              Difficulty: {product.difficulty}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

