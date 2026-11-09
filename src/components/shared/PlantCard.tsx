"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Sun, Droplets, Check, Sparkles } from "lucide-react";
import { ProductData } from "@/data/initialProducts";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/browser-interactions";

interface PlantCardProps {
  product: ProductData;
  priority?: boolean;
}

export function PlantCard({ product, priority = false }: PlantCardProps) {
  const { addItem } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addItem(product, "Small", [], 1);
    setTimeout(() => {
      setIsAdding(false);
    }, 900);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const mainImage = product.images?.[0] || "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="group relative flex flex-col bg-offwhite rounded-2xl border border-sage/30 overflow-hidden shadow-soft hover:shadow-card transition-all duration-500 hover:-translate-y-1">
      {/* Top Media Container */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-cream">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={priority}
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Gradient overlay for soft lighting */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.featured && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-forest text-offwhite backdrop-blur-sm shadow-sm">
              <Sparkles className="w-2.5 h-2.5 text-sage" /> Featured
            </span>
          )}
          {product.petFriendly && (
            <span className="inline-flex items-center text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-cream text-botanical border border-botanical/20 backdrop-blur-sm">
              Pet Safe
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-10 ${
            isWishlisted
              ? "bg-terracotta text-offwhite shadow-md scale-110"
              : "bg-offwhite/85 text-charcoal hover:bg-offwhite hover:text-terracotta hover:scale-105"
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Quick Add overlay button on hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden sm:block">
          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            className="w-full py-2.5 px-4 rounded-xl bg-forest/95 hover:bg-forest text-offwhite text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 backdrop-blur-sm shadow-lg transition-all active:scale-95"
          >
            {isAdding ? (
              <>
                <Check className="w-3.5 h-3.5 text-sage animate-bounce" /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-sage" /> Quick Add
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Product Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Botanical Subtitle */}
          <div className="flex items-center justify-between text-xs text-botanical mb-1">
            <span className="font-medium tracking-wider uppercase text-[10px]">
              {product.category}
            </span>
            <span className="italic text-charcoal/60 truncate max-w-[130px]">
              {product.botanicalName?.split(" ")[0]} {product.botanicalName?.split(" ")[1]}
            </span>
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug}`} className="block group-hover:text-botanical transition-colors">
            <h3 className="font-serif text-lg font-semibold text-forest leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs text-charcoal/70 line-clamp-2 mt-1.5 leading-relaxed">
            {product.tagline || product.description}
          </p>
        </div>

        {/* Attributes: Light & Care */}
        <div className="mt-4 pt-3 border-t border-sage/20 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-charcoal/70">
            <span className="inline-flex items-center gap-1" title={`Sunlight: ${product.sunlight}`}>
              <Sun className="w-3.5 h-3.5 text-terracotta" />
              <span className="text-[11px] truncate max-w-[70px] sm:max-w-none">{product.sunlight.split(" ")[0]}</span>
            </span>
            <span className="inline-flex items-center gap-1" title={`Difficulty: ${product.difficulty}`}>
              <Droplets className="w-3.5 h-3.5 text-botanical" />
              <span className="text-[11px]">{product.difficulty}</span>
            </span>
          </div>

          {/* Price */}
          <div className="text-right">
            <span className="font-serif text-lg font-bold text-forest">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>

        {/* Mobile Quick Add Button */}
        <div className="mt-3 block sm:hidden">
          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            className="w-full py-2 px-3 rounded-lg bg-forest text-offwhite text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-2"
          >
            {isAdding ? <Check className="w-3 h-3 text-sage" /> : <ShoppingBag className="w-3 h-3 text-sage" />}
            {isAdding ? "Added" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

