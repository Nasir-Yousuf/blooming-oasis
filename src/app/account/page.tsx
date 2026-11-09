"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  ShoppingBag,
  MapPin,
  LogOut,
  Shield,
  ArrowRight,
  Package,
  Calendar,
  Sparkles,
  ExternalLink,
  Droplets,
  Sun,
  ChevronRight,
} from "lucide-react";
import { formatPrice } from "@/lib/browser-interactions";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "care">("orders");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [meRes, ordersRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/orders"),
        ]);

        const meData = await meRes.json();
        if (meRes.ok && meData.user) {
          setUser(meData.user);
        }

        const ordersData = await ordersRes.json();
        if (ordersRes.ok && ordersData.orders) {
          setOrders(ordersData.orders);
        }
      } catch (err) {
        console.error("Account fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
    } catch {
      // ignore
    }
  };

  const handleQuickCustomerLogin = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quickRole: "customer" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        const ordersRes = await fetch("/api/orders");
        const ordersData = await ordersRes.json();
        if (ordersData.orders) setOrders(ordersData.orders);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-offwhite flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-3 border-sage/40 border-t-forest rounded-full animate-spin mb-4" />
        <p className="font-serif text-lg text-forest">Loading your botanical sanctuary...</p>
      </div>
    );
  }

  // Not logged in state
  if (!user) {
    return (
      <div className="min-h-[75vh] bg-offwhite flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-cream rounded-3xl p-8 text-center border border-sage/30 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-sage/20 text-forest flex items-center justify-center mx-auto mb-4">
            <User className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-forest mb-2">
            Welcome to Blooming Oasis
          </h2>
          <p className="text-xs text-charcoal/70 mb-6 leading-relaxed">
            Sign in to track orders in real-time, view your indoor plant collection, and manage delivery preferences.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleQuickCustomerLogin}
              className="w-full py-3 bg-forest hover:bg-forest/90 text-offwhite text-xs font-semibold rounded-xl transition shadow-sm flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-sage" />
              <span>1-Click Instant Demo Login (Customer)</span>
            </button>

            <Link
              href="/login"
              className="w-full py-2.5 bg-offwhite hover:bg-white text-forest border border-forest/20 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2"
            >
              <span>Sign In with Password</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/register"
              className="block text-xs text-botanical hover:underline pt-2 font-medium"
            >
              Don&apos;t have an account? Join our Green Club
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isAdminRole = ["superadmin", "admin", "product_manager", "order_manager"].includes(
    user.role
  );

  return (
    <div className="min-h-screen bg-offwhite py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="bg-cream rounded-3xl p-6 sm:p-8 mb-8 border border-sage/30 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-forest text-offwhite flex items-center justify-center font-serif text-2xl font-bold flex-shrink-0 shadow-sm">
              {user.name?.charAt(0).toUpperCase() || "B"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-botanical/15 text-forest text-[11px] font-semibold capitalize">
                  {user.role === "customer" ? "Botanical Member" : user.role.replace("_", " ")}
                </span>
              </div>
              <p className="text-xs text-charcoal/60 mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isAdminRole && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta hover:bg-terracotta/90 text-offwhite text-xs font-semibold rounded-xl transition shadow-sm"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Dashboard</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 bg-offwhite hover:bg-white text-charcoal text-xs font-semibold rounded-xl border border-sage/40 transition shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5 text-charcoal/60" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-sage/20 mb-8 pb-1">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition flex items-center gap-2 ${
              activeTab === "orders"
                ? "bg-forest text-offwhite shadow-sm"
                : "text-charcoal/70 hover:bg-cream"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order History ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("addresses")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition flex items-center gap-2 ${
              activeTab === "addresses"
                ? "bg-forest text-offwhite shadow-sm"
                : "text-charcoal/70 hover:bg-cream"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Delivery Addresses</span>
          </button>
          <button
            onClick={() => setActiveTab("care")}
            className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition flex items-center gap-2 ${
              activeTab === "care"
                ? "bg-forest text-offwhite shadow-sm"
                : "text-charcoal/70 hover:bg-cream"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-botanical" />
            <span>Plant Care Schedule</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-cream rounded-3xl p-10 text-center border border-sage/30">
                <ShoppingBag className="w-12 h-12 text-sage mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-forest mb-1">No Orders Yet</h3>
                <p className="text-xs text-charcoal/60 mb-5">
                  Explore our lush curated plant collection and bring nature indoors.
                </p>
                <Link
                  href="/products"
                  className="px-5 py-2.5 bg-forest text-offwhite text-xs font-medium rounded-full hover:bg-forest/90 transition inline-flex items-center gap-1.5"
                >
                  <span>Browse Plant Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              orders.map((ord: any) => (
                <div
                  key={ord._id || ord.orderNumber}
                  className="bg-cream rounded-3xl p-6 border border-sage/30 shadow-sm hover:shadow transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sage/20 gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-forest text-sm">
                          #{ord.orderNumber}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            ord.status === "Delivered"
                              ? "bg-botanical/20 text-forest"
                              : ord.status === "Processing"
                              ? "bg-amber-100 text-amber-800"
                              : ord.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-sage/20 text-forest"
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-charcoal/60 mt-1 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-botanical" />
                        Placed on{" "}
                        {new Date(ord.createdAt || Date.now()).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right sm:mr-3">
                        <span className="text-[10px] text-charcoal/50 uppercase tracking-wider block">
                          Total Paid
                        </span>
                        <span className="font-serif text-base font-bold text-forest">
                          {formatPrice(ord.total || 0)}
                        </span>
                      </div>

                      <Link
                        href={`/orders/${ord.orderNumber}`}
                        className="inline-flex items-center gap-1 px-3.5 py-2 bg-offwhite hover:bg-white text-forest text-xs font-semibold rounded-xl border border-sage/40 transition shadow-sm"
                      >
                        <span>Track Status</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="pt-4 flex flex-wrap gap-4 items-center">
                    {ord.items?.map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 bg-offwhite/60 p-2 rounded-xl border border-sage/15">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-sage/15 flex-shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-sage m-auto mt-2.5" />
                          )}
                        </div>
                        <div className="text-xs">
                          <p className="font-medium text-forest leading-tight line-clamp-1">{item.name}</p>
                          <p className="text-[10px] text-charcoal/60">
                            Qty: {item.quantity} · {item.size || "Standard"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Addresses */}
        {activeTab === "addresses" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-cream rounded-3xl p-6 border border-sage/30 shadow-sm relative">
              <span className="absolute top-6 right-6 px-2.5 py-0.5 rounded-full bg-forest text-offwhite text-[10px] font-semibold">
                Default Shipping
              </span>
              <div className="w-10 h-10 rounded-xl bg-sage/20 text-forest flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-forest mb-1">{user.name}</h3>
              <p className="text-xs text-charcoal/70 leading-relaxed">
                742 Evergreen Terrace<br />
                Portland, OR 97201<br />
                United States
              </p>
              <div className="mt-4 pt-4 border-t border-sage/20 text-[11px] text-charcoal/60">
                Phone: +1 (555) 349-8201
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Care Schedule */}
        {activeTab === "care" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-cream rounded-3xl p-6 border border-sage/30 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-forest">Hydration Cycle</h4>
                  <p className="text-xs text-charcoal/60">Every 7–10 days</p>
                </div>
              </div>
              <p className="text-xs text-charcoal/70 leading-relaxed mb-4">
                Check top 2 inches of soil before hydrating. If dry to the touch, water thoroughly until it drains freely from nursery pot holes.
              </p>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-botanical">
                Next Check: This Friday
              </span>
            </div>

            <div className="bg-cream rounded-3xl p-6 border border-sage/30 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-forest">Light Rotation</h4>
                  <p className="text-xs text-charcoal/60">Bi-weekly 90° Turn</p>
                </div>
              </div>
              <p className="text-xs text-charcoal/70 leading-relaxed mb-4">
                Rotate your planters a quarter-turn each fortnight so foliage grows uniformly and doesn&apos;t bend toward window light.
              </p>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-botanical">
                Status: In Balance
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

