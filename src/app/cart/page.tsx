"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice, triggerBotanicalConfetti } from "@/lib/browser-interactions";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, shipping, total } =
    useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleDemoCheckout = () => {
    setOrderPlaced(true);
    triggerBotanicalConfetti();
    setTimeout(() => {
      clearCart();
    }, 1500);
  };

  if (orderPlaced) {
    return (
      <div className="bg-offwhite min-h-[70vh] flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-cream rounded-3xl p-8 sm:p-10 border border-sage/40 shadow-card text-center">
          <div className="w-16 h-16 rounded-full bg-botanical/20 text-botanical flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-botanical block mb-1">
            Order Demonstration Completed
          </span>
          <h2 className="font-serif text-3xl font-bold text-forest mb-2">
            Your Greenery Is On Its Way!
          </h2>
          <p className="text-xs sm:text-sm text-charcoal/75 leading-relaxed mb-6 font-light">
            Thank you for welcoming living plants into your home. A tracking confirmation with nursery dispatch details has been prepared.
          </p>
          <Link
            href="/products"
            onClick={() => setOrderPlaced(false)}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-forest text-offwhite text-xs font-semibold uppercase tracking-wider hover:bg-forest-light transition-colors"
          >
            Continue Exploring Botanicals <ArrowRight className="w-4 h-4 text-sage" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-offwhite min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-6 border-b border-sage/20 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-botanical block mb-1">
              Your Botanical Living Order
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest tracking-tight">
              Shopping Cart ({items.length})
            </h1>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-charcoal/60 hover:text-terracotta uppercase tracking-wider flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Empty Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-cream/40 rounded-3xl p-12 sm:p-20 border border-sage/30 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-cream flex items-center justify-center mx-auto mb-6 text-sage">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest mb-2">
              Your Botanical Cart Is Quiet
            </h2>
            <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed mb-8 max-w-sm mx-auto">
              You haven&rsquo;t added any indoor greenery yet. Browse our hand-selected botanical specimens to find your space&rsquo;s match.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-forest hover:bg-forest-light text-offwhite text-xs font-semibold uppercase tracking-wider shadow-card transition-all"
            >
              Discover Indoor Plants <ArrowRight className="w-4 h-4 text-sage" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Cart Items List (8 cols) */}
            <div className="lg:col-span-8 divide-y divide-sage/20 bg-cream/30 rounded-3xl p-6 sm:p-8 border border-sage/30">
              {items.map((item) => (
                <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-5">
                  {/* Thumbnail */}
                  <div className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden bg-cream flex-shrink-0 border border-sage/20 shadow-xs">
                    <Image
                      src={
                        item.product.images?.[0] ||
                        "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="font-serif text-lg font-bold text-forest hover:text-botanical transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <div className="text-xs text-botanical font-medium mt-0.5">
                            Size: <span className="font-semibold">{item.size}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 text-charcoal/40 hover:text-terracotta transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Accessories */}
                      {item.accessories && item.accessories.length > 0 && (
                        <div className="mt-2 space-y-1 bg-offwhite/70 p-2.5 rounded-xl border border-sage/20">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-charcoal/60 block">
                            Included Accessories:
                          </span>
                          {item.accessories.map((acc) => (
                            <div
                              key={acc.id}
                              className="text-xs text-charcoal/80 flex items-center justify-between"
                            >
                              <span>+ {acc.name}</span>
                              <span className="font-mono text-forest">
                                {formatPrice(acc.price)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quantity & Line Total */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-sage/20">
                      <div className="flex items-center border border-sage/40 rounded-xl bg-offwhite">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 text-charcoal/70 hover:text-forest transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-forest min-w-[28px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 text-charcoal/70 hover:text-forest transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-charcoal/50 block font-light">
                          {item.quantity} × {formatPrice(item.unitPrice)}
                        </span>
                        <span className="font-serif text-lg font-bold text-forest">
                          {formatPrice(item.totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-cream rounded-3xl p-6 sm:p-8 border border-sage/30 shadow-card space-y-5">
                <h3 className="font-serif text-xl font-bold text-forest">
                  Order Summary
                </h3>

                <div className="space-y-3 text-xs sm:text-sm text-charcoal/80">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono font-semibold text-forest">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Nationwide Botanical Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-botanical font-bold uppercase text-xs">
                          Free Delivery
                        </span>
                      ) : (
                        <span className="font-mono">{formatPrice(shipping)}</span>
                      )}
                    </span>
                  </div>

                  {subtotal < 75 && (
                    <div className="text-[11px] text-botanical bg-sage/20 p-2.5 rounded-xl border border-botanical/20">
                      Add {formatPrice(75 - subtotal)} more for Free Nationwide Delivery!
                    </div>
                  )}

                  <div className="pt-3 border-t border-sage/30 flex justify-between text-base sm:text-lg font-serif font-bold text-forest">
                    <span>Estimated Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleDemoCheckout}
                    className="w-full py-4 px-6 rounded-2xl bg-forest hover:bg-forest-light text-offwhite text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-card hover:shadow-elevated transition-all active:scale-95"
                  >
                    Proceed with Botanical Order <ArrowRight className="w-4 h-4 text-sage" />
                  </button>
                  <span className="text-[10px] text-charcoal/50 text-center block mt-2">
                    Payment gateway not required for assessment demonstration.
                  </span>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="p-5 rounded-2xl bg-offwhite border border-sage/30 space-y-2.5 text-xs text-charcoal/80">
                <div className="flex items-center gap-2 text-forest font-semibold">
                  <ShieldCheck className="w-4 h-4 text-botanical" />
                  <span>14-Day Healthy Foliage Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-forest font-semibold">
                  <Truck className="w-4 h-4 text-botanical" />
                  <span>Zero-Plastic Biodegradable Packaging</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

