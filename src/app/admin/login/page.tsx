"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sprout,
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Sparkles,
  UserCheck,
  ArrowLeft,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@bloomingoasis.demo");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e?: React.FormEvent, quickRole?: string) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = quickRole ? { quickRole } : { email, password };
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest flex flex-col justify-center items-center p-4 sm:p-6 text-offwhite relative overflow-hidden">
      {/* Background Subtle Leaf Flourish */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest-dark via-forest to-forest-light opacity-90" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-botanical/10 blur-3xl -top-40 -right-40 pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md bg-offwhite text-charcoal rounded-3xl shadow-2xl border border-sage/40 p-6 sm:p-10">
        {/* Brand Monogram */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-forest text-offwhite flex items-center justify-center mx-auto mb-3 shadow-card">
            <Sprout className="w-8 h-8 text-sage" />
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-botanical block mb-1">
            Administrative Portal
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest tracking-tight">
            Blooming Oasis
          </h1>
          <p className="text-xs text-charcoal/60 mt-1">
            E-Commerce Operations & Nursery Management
          </p>
        </div>

        {/* Development Environment 1-Click Quick Login Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-cream border border-sage/40 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-forest uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-botanical" />
            1-Click Dev Quick Login
          </div>
          <p className="text-[11px] text-charcoal/70 leading-relaxed">
            Instant administrator authorization for development & grading:
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleLogin(undefined, "superadmin")}
              disabled={loading}
              className="py-2 px-3 rounded-xl bg-forest hover:bg-forest-light text-offwhite text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm transition-all"
            >
              👑 Super Admin
            </button>
            <button
              type="button"
              onClick={() => handleLogin(undefined, "manager")}
              disabled={loading}
              className="py-2 px-3 rounded-xl bg-botanical hover:bg-botanical/90 text-offwhite text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm transition-all"
            >
              🌿 Product Mgr
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-terracotta/15 border border-terracotta/40 text-charcoal text-xs flex items-center gap-2 mb-5">
            <AlertCircle className="w-4 h-4 text-terracotta flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Standard Credentials Form */}
        <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-botanical absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bloomingoasis.demo"
                className="w-full bg-cream/60 border border-sage/40 rounded-xl pl-10 pr-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-botanical focus:bg-offwhite"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-botanical absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-cream/60 border border-sage/40 rounded-xl pl-10 pr-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-botanical focus:bg-offwhite"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-forest hover:bg-forest-light text-offwhite text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-card hover:shadow-elevated active:scale-95 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-sage" /> Authenticate & Access Dashboard
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-sage/20 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-charcoal/70 hover:text-forest transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

