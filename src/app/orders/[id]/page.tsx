"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  Calendar,
  Printer,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import confetti from "canvas-confetti";
import { formatPrice } from "@/lib/browser-interactions";

const STATUS_STEPS = [
  { key: "Pending", label: "Order Placed", icon: Clock },
  { key: "Confirmed", label: "Confirmed", icon: CheckCircle2 },
  { key: "Processing", label: "Nursery Packing", icon: Package },
  { key: "Shipped", label: "Out for Delivery", icon: Truck },
  { key: "Delivered", label: "Delivered & Growing", icon: Sparkles },
];

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setOrder(data.order);
          // Trigger subtle botanical confetti burst for celebratory confirmation
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 },
              colors: ["#183D32", "#547B55", "#A8B99A", "#C98568"],
            });
          } catch {
            // ignore confetti error
          }
        } else {
          setError(data.message || "Order not found");
        }
      } catch {
        setError("Failed to fetch order details. Please check network.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-offwhite flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-3 border-sage/40 border-t-forest rounded-full animate-spin mb-4" />
        <p className="font-serif text-lg text-forest">Loading your plant order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] bg-offwhite flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-cream rounded-3xl p-8 text-center border border-sage/30 shadow-sm">
          <ShoppingBag className="w-12 h-12 text-terracotta mx-auto mb-3" />
          <h2 className="font-serif text-2xl font-bold text-forest mb-2">Order Not Found</h2>
          <p className="text-sm text-charcoal/70 mb-6">
            We couldn&apos;t locate an order with ID <span className="font-mono font-bold text-forest">{orderId}</span>.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/products"
              className="px-5 py-2.5 bg-forest text-offwhite text-sm font-medium rounded-full hover:bg-forest/90 transition-colors"
            >
              Explore Nursery
            </Link>
            <Link
              href="/account"
              className="px-5 py-2.5 bg-offwhite text-forest border border-forest/20 text-sm font-medium rounded-full hover:bg-sage/10 transition-colors"
            >
              My Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate timeline index
  const statusOrder = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];
  const currentStatusIndex = statusOrder.indexOf(order.status) !== -1 ? statusOrder.indexOf(order.status) : 0;

  return (
    <div className="min-h-screen bg-offwhite py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Top Banner / Order Confirmation */}
        <div className="bg-cream rounded-3xl p-8 mb-8 border border-sage/30 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-sage/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-botanical/15 text-forest text-xs font-semibold tracking-wide uppercase mb-3">
                <CheckCircle2 className="w-3.5 h-3.5 text-botanical" />
                Order Confirmed
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest tracking-tight">
                Thank you for your green addition!
              </h1>
              <p className="text-sm text-charcoal/70 mt-1.5">
                Order <span className="font-mono font-bold text-forest">#{order.orderNumber}</span> placed on{" "}
                {new Date(order.createdAt || Date.now()).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-offwhite hover:bg-white text-forest text-xs font-semibold rounded-xl border border-sage/40 transition shadow-sm"
              >
                <Printer className="w-4 h-4 text-forest/70" />
                Print Receipt
              </button>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-forest hover:bg-forest/90 text-offwhite text-xs font-semibold rounded-xl transition shadow-sm"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Interactive Progress Bar */}
          <div className="mt-10 pt-8 border-t border-sage/20">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-charcoal/60 mb-6">
              Fulfillment & Delivery Progress
            </h2>

            <div className="relative">
              {/* Line behind steps */}
              <div className="absolute top-5 left-6 right-6 h-0.5 bg-sage/30 hidden sm:block">
                <div
                  className="h-full bg-forest transition-all duration-700"
                  style={{
                    width: `${(currentStatusIndex / (STATUS_STEPS.length - 1)) * 100}%`,
                  }}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 relative z-10">
                {STATUS_STEPS.map((step, idx) => {
                  const isDone = idx <= currentStatusIndex;
                  const isCurrent = idx === currentStatusIndex;
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.key}
                      className={`flex flex-col items-center text-center p-3 rounded-2xl transition ${
                        isCurrent
                          ? "bg-white shadow-sm ring-1 ring-forest/20"
                          : "bg-cream/40"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2.5 transition-colors ${
                          isDone
                            ? "bg-forest text-offwhite"
                            : "bg-sage/20 text-charcoal/40"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          isCurrent
                            ? "text-forest font-bold"
                            : isDone
                            ? "text-forest"
                            : "text-charcoal/50"
                        }`}
                      >
                        {step.label}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] text-botanical font-medium mt-0.5 bg-botanical/10 px-2 py-0.5 rounded-full">
                          Current Status
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: Left: Items, Right: Shipping & Pricing */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Order Items & Care Note */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-cream rounded-3xl p-6 sm:p-8 border border-sage/30 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-forest mb-4 flex items-center justify-between">
                <span>Items in This Order</span>
                <span className="text-xs font-sans text-charcoal/60 font-normal">
                  {order.items?.length || 0} plants / accessories
                </span>
              </h2>

              <div className="divide-y divide-sage/20">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-sage/10 flex-shrink-0 border border-sage/20">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sage">
                          <Package className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium text-forest text-sm">{item.name}</h4>
                          <p className="text-xs text-charcoal/60 mt-0.5">
                            Size: <span className="text-forest font-medium">{item.size || "Standard"}</span> · Qty: {item.quantity}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-forest">
                          {formatPrice(item.total || item.price * item.quantity)}
                        </span>
                      </div>

                      {item.accessories && item.accessories.length > 0 && (
                        <div className="mt-2 text-[11px] text-charcoal/70 bg-offwhite px-2.5 py-1.5 rounded-lg border border-sage/20 inline-block">
                          <span className="font-semibold text-forest">Includes: </span>
                          {item.accessories.map((a: any) => a.name).join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Timeline History */}
            {order.statusTimeline && order.statusTimeline.length > 0 && (
              <div className="bg-cream rounded-3xl p-6 sm:p-8 border border-sage/30 shadow-sm">
                <h3 className="font-serif text-lg font-bold text-forest mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-botanical" />
                  Order Activity Log
                </h3>
                <div className="space-y-4">
                  {order.statusTimeline.map((log: any, i: number) => (
                    <div key={i} className="flex gap-3 text-xs">
                      <div className="w-2 h-2 rounded-full bg-botanical mt-1.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-forest">{log.status}</span>
                          <span className="text-charcoal/50 text-[11px]">
                            {new Date(log.timestamp).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        {log.note && <p className="text-charcoal/70 mt-0.5">{log.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Botanical Care Note */}
            <div className="bg-forest text-offwhite rounded-3xl p-6 sm:p-7 relative overflow-hidden">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-botanical/30 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-sage" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-cream mb-1">
                    Acclimating Your New Green Companion
                  </h4>
                  <p className="text-xs text-cream/80 leading-relaxed">
                    When your shipment arrives, gently unbox your plants in a shaded room. 
                    Allow them 24 hours to adapt to your ambient humidity before watering thoroughly. 
                    Need help? Our nursery botanists are always available via the Contact page.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customer Details, Address, and Summary */}
          <div className="space-y-6">
            {/* Delivery & Customer Info */}
            <div className="bg-cream rounded-3xl p-6 border border-sage/30 shadow-sm">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-charcoal/60 mb-4 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-forest" />
                Shipping Destination
              </h3>

              <div className="text-xs text-charcoal/80 space-y-1">
                <p className="font-semibold text-forest text-sm">{order.customer?.name}</p>
                <p>{order.shippingAddress?.street}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                  {order.shippingAddress?.postalCode}
                </p>
                <p>{order.shippingAddress?.country || "United States"}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-sage/20 text-xs space-y-1">
                <p className="text-charcoal/60">
                  Email: <span className="text-forest font-medium">{order.customer?.email}</span>
                </p>
                <p className="text-charcoal/60">
                  Phone: <span className="text-forest font-medium">{order.customer?.phone}</span>
                </p>
                {order.notes && (
                  <p className="text-charcoal/60 mt-2">
                    Note: <span className="italic text-forest">&ldquo;{order.notes}&rdquo;</span>
                  </p>
                )}
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="bg-cream rounded-3xl p-6 border border-sage/30 shadow-sm">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-charcoal/60 mb-4">
                Payment Summary
              </h3>

              <div className="space-y-2.5 text-xs text-charcoal/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-forest">{formatPrice(order.subtotal || 0)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Botanical Courier Delivery</span>
                  <span className="font-medium text-forest">
                    {order.deliveryCharge === 0 ? "FREE" : formatPrice(order.deliveryCharge || 0)}
                  </span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-botanical font-medium">
                    <span>Discount ({order.couponCode || "Coupon"})</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-sage/20 flex justify-between items-baseline">
                  <span className="font-serif text-base font-bold text-forest">Total Paid</span>
                  <span className="font-serif text-xl font-bold text-forest">
                    {formatPrice(order.total || 0)}
                  </span>
                </div>
              </div>

              <div className="mt-5 p-3 rounded-xl bg-offwhite border border-sage/20 text-xs flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-charcoal/60 uppercase tracking-wide">Payment Method</p>
                  <p className="font-semibold text-forest">Cash on Delivery (COD)</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-sage/20 text-forest text-[10px] font-semibold">
                  Pay at Door
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-cream rounded-3xl p-5 border border-sage/30 text-center">
              <p className="text-xs text-charcoal/70 mb-3">
                Have an account with us? Track all your botanical orders in one place.
              </p>
              <Link
                href="/account"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest hover:text-botanical transition"
              >
                Go to My Account
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

