"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Truck,
  ArrowRight,
  CheckCircle2,
  Tag,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/browser-interactions";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  // Form State
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
  });

  const [notes, setNotes] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");

  // Calculate pricing
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const deliveryCharge = subtotal >= 75 ? 0 : 12;
  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryCharge);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponError("");

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAppliedCoupon(data.coupon);
        setCouponError("");
      } else {
        setCouponError(data.message || "Invalid coupon code");
      }
    } catch {
      setCouponError("Could not validate coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer.name || !customer.email || !customer.phone) {
      setOrderError("Please enter your complete name, email, and phone number.");
      return;
    }
    if (
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode
    ) {
      setOrderError("Please enter your full delivery address.");
      return;
    }

    setSubmitting(true);
    setOrderError("");

    try {
      const payload = {
        customer,
        shippingAddress,
        items,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        notes,
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        clearCart();
        router.push(`/orders/${data.orderNumber}`);
      } else {
        setOrderError(data.message || "Failed to process order. Please check item quantities.");
      }
    } catch {
      setOrderError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-offwhite flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-cream rounded-3xl p-8 text-center border border-sage/40">
          <ShoppingBag className="w-12 h-12 text-sage mx-auto mb-3" />
          <h2 className="font-serif text-2xl font-bold text-forest mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-xs text-charcoal/70 mb-6">
            Please add botanical plants to your cart before proceeding to checkout.
          </p>
          <Link
            href="/products"
            className="px-6 py-2.5 rounded-xl bg-forest text-offwhite text-xs font-semibold uppercase tracking-wider inline-block"
          >
            Explore Plants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-offwhite min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-botanical block mb-1">
            Secure Botanical Checkout
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-forest tracking-tight">
            Finalize Your Living Sanctuary
          </h1>
        </div>

        {orderError && (
          <div className="p-4 rounded-2xl bg-terracotta/15 border border-terracotta/40 text-charcoal text-xs flex items-center gap-2 mb-8">
            <AlertCircle className="w-5 h-5 text-terracotta flex-shrink-0" />
            <span className="font-medium">{orderError}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Customer & Address Form (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Customer Information */}
            <div className="bg-cream/40 rounded-3xl p-6 sm:p-8 border border-sage/30 space-y-4">
              <h2 className="font-serif text-xl font-bold text-forest flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-forest text-offwhite text-xs font-sans flex items-center justify-center font-bold">
                  1
                </span>
                Customer Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    placeholder="e.g. Maya Lin"
                    className="w-full bg-offwhite border border-sage/40 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-botanical"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                    Email Address (For Order Tracking) *
                  </label>
                  <input
                    type="email"
                    required
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    placeholder="maya@sanctuary.com"
                    className="w-full bg-offwhite border border-sage/40 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-botanical"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="+1 (555) 019-2834"
                    className="w-full bg-offwhite border border-sage/40 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-botanical"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="bg-cream/40 rounded-3xl p-6 sm:p-8 border border-sage/30 space-y-4">
              <h2 className="font-serif text-xl font-bold text-forest flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-forest text-offwhite text-xs font-sans flex items-center justify-center font-bold">
                  2
                </span>
                Delivery Destination
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.street}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, street: e.target.value })
                    }
                    placeholder="742 Evergreen Terrace, Apt 3B"
                    className="w-full bg-offwhite border border-sage/40 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-botanical"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, city: e.target.value })
                      }
                      placeholder="Seattle"
                      className="w-full bg-offwhite border border-sage/40 rounded-xl px-3 py-2 text-xs text-charcoal"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                      State / Province *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.state}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, state: e.target.value })
                      }
                      placeholder="WA"
                      className="w-full bg-offwhite border border-sage/40 rounded-xl px-3 py-2 text-xs text-charcoal"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.postalCode}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          postalCode: e.target.value,
                        })
                      }
                      placeholder="98101"
                      className="w-full bg-offwhite border border-sage/40 rounded-xl px-3 py-2 text-xs text-charcoal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                    Special Greenhouse Delivery Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Leave with doorman or shaded front porch"
                    className="w-full bg-offwhite border border-sage/40 rounded-xl px-4 py-2.5 text-xs text-charcoal"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-cream/40 rounded-3xl p-6 sm:p-8 border border-sage/30 space-y-3">
              <h2 className="font-serif text-xl font-bold text-forest flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-forest text-offwhite text-xs font-sans flex items-center justify-center font-bold">
                  3
                </span>
                Payment Method
              </h2>
              <div className="p-4 rounded-2xl bg-offwhite border-2 border-forest flex items-center justify-between">
                <div>
                  <span className="font-bold text-forest text-xs block">
                    Cash on Doorstep Delivery (COD)
                  </span>
                  <span className="text-[11px] text-charcoal/60">
                    Inspect your living plants before paying at delivery.
                  </span>
                </div>
                <CheckCircle2 className="w-5 h-5 text-botanical" />
              </div>
            </div>
          </div>

          {/* Order Summary & Coupon (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-cream rounded-3xl p-6 sm:p-8 border border-sage/30 shadow-card space-y-5">
              <h2 className="font-serif text-xl font-bold text-forest">
                Order Review ({items.length})
              </h2>

              {/* Items List */}
              <div className="divide-y divide-sage/20 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-forest">{item.product.name}</div>
                      <div className="text-[11px] text-charcoal/60">
                        {item.size} • Qty: {item.quantity}
                      </div>
                      {item.accessories?.map((a) => (
                        <div key={a.id} className="text-[10px] text-botanical">
                          + {a.name}
                        </div>
                      ))}
                    </div>
                    <div className="font-serif font-bold text-forest text-sm">
                      {formatPrice(item.totalPrice)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Code Input */}
              <div className="pt-2 border-t border-sage/30">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code (e.g. WELCOME10)"
                    className="flex-1 bg-offwhite border border-sage/40 rounded-xl px-3 py-2 text-xs text-charcoal uppercase font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="px-4 py-2 rounded-xl bg-forest text-offwhite text-xs font-semibold uppercase tracking-wider disabled:opacity-50"
                  >
                    {couponLoading ? "..." : "Apply"}
                  </button>
                </div>

                {couponError && (
                  <p className="text-[11px] text-terracotta mt-1">{couponError}</p>
                )}
                {appliedCoupon && (
                  <p className="text-[11px] text-botanical font-semibold mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Coupon {appliedCoupon.code} applied (-{formatPrice(appliedCoupon.discount)})!
                  </p>
                )}
              </div>

              {/* Totals Calculation */}
              <div className="pt-3 border-t border-sage/30 space-y-2 text-xs text-charcoal/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold">{formatPrice(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-botanical font-semibold">
                    <span>Promotional Discount</span>
                    <span className="font-mono">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Nationwide Botanical Shipping</span>
                  <span>
                    {deliveryCharge === 0 ? (
                      <span className="text-botanical font-bold uppercase text-xs">
                        Free Delivery
                      </span>
                    ) : (
                      <span className="font-mono">{formatPrice(deliveryCharge)}</span>
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-sage/30 flex justify-between font-serif font-bold text-forest text-lg">
                  <span>Final Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-2xl bg-forest hover:bg-forest-light text-offwhite text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-card hover:shadow-elevated transition-all active:scale-95 disabled:opacity-50"
              >
                {submitting ? (
                  <span>Reserving Plants & Placing Order...</span>
                ) : (
                  <>
                    <span>Confirm Order ({formatPrice(finalTotal)})</span>
                    <ArrowRight className="w-4 h-4 text-sage" />
                  </>
                )}
              </button>
            </div>

            {/* Delivery Guarantees */}
            <div className="p-4 rounded-2xl bg-offwhite border border-sage/30 text-xs text-charcoal/80 space-y-2">
              <div className="flex items-center gap-2 text-forest font-semibold">
                <Truck className="w-4 h-4 text-botanical" />
                <span>Zero-Plastic Biodegradable Moisture Packaging</span>
              </div>
              <div className="flex items-center gap-2 text-forest font-semibold">
                <ShieldCheck className="w-4 h-4 text-botanical" />
                <span>14-Day Healthy Foliage Replacement Guarantee</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

