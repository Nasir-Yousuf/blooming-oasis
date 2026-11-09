"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sprout, Mail, Lock, User, AlertCircle, Check } from "lucide-react";

export default function CustomerRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/account");
        router.refresh();
      } else {
        setError(data.message || "Registration failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-cream/40 flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-md w-full bg-offwhite rounded-3xl p-6 sm:p-10 border border-sage/40 shadow-card text-charcoal">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-forest text-offwhite flex items-center justify-center mx-auto mb-3 shadow-soft">
            <Sprout className="w-6 h-6 text-sage" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-botanical block mb-1">
            New Member
          </span>
          <h1 className="font-serif text-3xl font-bold text-forest">
            Join the Living Oasis
          </h1>
          <p className="text-xs text-charcoal/60 mt-1">
            Create an account to track shipments and access custom plant regimens.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-terracotta/15 border border-terracotta/40 text-charcoal text-xs flex items-center gap-2 mb-5">
            <AlertCircle className="w-4 h-4 text-terracotta flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-botanical absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Eleanor Vance"
                className="w-full bg-cream/60 border border-sage/40 rounded-xl pl-10 pr-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-botanical focus:bg-offwhite"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-botanical absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="eleanor@botanical.com"
                className="w-full bg-cream/60 border border-sage/40 rounded-xl pl-10 pr-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-botanical focus:bg-offwhite"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
              Password (min 6 chars) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-botanical absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
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
            className="w-full py-3.5 px-4 rounded-xl bg-forest hover:bg-forest-light text-offwhite text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-card hover:shadow-elevated active:scale-95 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? <span>Creating Account...</span> : <span>Create Account</span>}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-sage/20 text-center text-xs text-charcoal/70">
          <span>Already have an account? </span>
          <Link
            href="/login"
            className="font-bold text-forest hover:text-botanical underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

