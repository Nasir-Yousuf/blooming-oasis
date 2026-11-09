"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/browser-interactions";

export function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    items,
    updateQuantity,
    removeItem,
    subtotal,
    shipping,
    total,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-forest/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-offwhite shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 bg-cream border-b border-sage/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-forest" />
              <h2 className="font-serif text-xl font-bold text-forest">
                Your Botanical Cart
              </h2>
              <span className="text-xs bg-sage/40 text-forest font-semibold px-2 py-0.5 rounded-full">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-sage/20 text-charcoal/70 hover:text-forest transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-sage/20">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 rounded-full bg-cream flex items-center justify-center mb-4 text-sage">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-forest mb-1">
                  Your cart is quiet
                </h3>
                <p className="text-xs text-charcoal/70 mb-6 max-w-xs">
                  Discover thoughtfully selected indoor plants to bring organic warmth into your home.
                </p>
                <Link
                  href="/products"
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-forest text-offwhite text-xs font-semibold uppercase tracking-wider hover:bg-forest-light transition-colors"
                >
                  Explore Plants
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-cream flex-shrink-0 border border-sage/20">
                    <Image
                      src={
                        item.product.images?.[0] ||
                        "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=400&q=80"
                      }
                      alt={item.product.name}
                      fill
                      className="object-cover object-center"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <Link
                          href={`/products/${item.product.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-serif font-semibold text-forest text-sm hover:text-botanical transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-charcoal/40 hover:text-terracotta transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-xs text-botanical font-medium mt-0.5">
                        Size: {item.size}
                      </div>

                      {/* Accessories list */}
                      {item.accessories && item.accessories.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {item.accessories.map((acc) => (
                            <div key={acc.id} className="text-[11px] text-charcoal/70 flex items-center justify-between">
                              <span>+ {acc.name}</span>
                              <span className="font-mono">{formatPrice(acc.price)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-sage/40 rounded-lg bg-cream">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 text-charcoal/70 hover:text-forest transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-forest min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 text-charcoal/70 hover:text-forest transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="font-serif font-bold text-forest text-sm">
                        {formatPrice(item.totalPrice)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-6 bg-cream border-t border-sage/30 space-y-3">
              <div className="flex justify-between text-xs text-charcoal/80">
                <span>Subtotal</span>
                <span className="font-semibold font-mono">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-charcoal/80">
                <span>Nationwide Botanical Delivery</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-botanical font-semibold">FREE</span>
                  ) : (
                    <span className="font-mono">{formatPrice(shipping)}</span>
                  )}
                </span>
              </div>

              {subtotal < 75 && (
                <div className="text-[11px] text-botanical bg-sage/20 p-2 rounded-lg">
                  Add {formatPrice(75 - subtotal)} more for Free Nationwide Delivery!
                </div>
              )}

              <div className="pt-2 border-t border-sage/30 flex justify-between text-base font-serif font-bold text-forest">
                <span>Estimated Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <div className="pt-2 space-y-2">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 px-4 rounded-xl bg-forest hover:bg-forest-light text-offwhite text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-card transition-all"
                >
                  View Full Cart & Review <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl border border-sage/40 hover:bg-offwhite text-forest text-xs font-medium uppercase tracking-wider transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

