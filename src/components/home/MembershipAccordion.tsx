"use client";

import React, { useState } from "react";
import { ChevronDown, Sparkles, CheckCircle2, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { CustomStyledList } from "@/components/shared/CustomStyledList";
import { triggerBotanicalConfetti } from "@/lib/browser-interactions";

export function MembershipAccordion() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    setLoading(true);
    setStatus({ type: "idle", message: "" });

    try {
      const res = await fetch("/api/membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus({
          type: "success",
          message:
            data.message ||
            "Welcome to Blooming Oasis Circle! Your member welcome guide has been dispatched.",
        });
        setEmail("");
        setName("");
        triggerBotanicalConfetti();
      } else {
        setStatus({
          type: "error",
          message: data.message || "Subscription failed. Please check your email.",
        });
      }
    } catch {
      setStatus({
        type: "error",
        message: "Network error. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 sm:py-28 bg-forest text-offwhite border-b border-forest-light/40 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Accordion Container */}
        <div className="bg-forest-dark/70 rounded-3xl border border-sage/30 overflow-hidden shadow-elevated">
          {/* Accordion Toggle Header */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-6 sm:p-10 flex items-center justify-between text-left hover:bg-forest-light/20 transition-colors focus:outline-none"
            aria-expanded={isExpanded}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-forest-light border border-sage/40 flex items-center justify-center text-sage flex-shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-sage block mb-1">
                  Complimentary Membership Club
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-offwhite tracking-tight">
                  Grow With Us.
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs text-sage font-medium uppercase tracking-wider">
                {isExpanded ? "Collapse View" : "Expand Perks"}
              </span>
              <div
                className={`w-9 h-9 rounded-full bg-forest-light border border-sage/30 flex items-center justify-center text-sage transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              >
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>
          </button>

          {/* Accordion Collapsible Content */}
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isExpanded ? "max-h-[1400px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-6 sm:px-10 pb-8 sm:pb-12 pt-2 border-t border-forest-light/40 space-y-8">
              <p className="text-sm sm:text-base text-cream/90 max-w-2xl leading-relaxed">
                Join our circle of passionate indoor gardeners. Receive curated botanical guides, early access to rare nursery releases, exclusive 15% subscriber discounts, and personalized monthly seasonal care checklists.
              </p>

              {/* SPECIAL REQUIREMENT: Dedicated Custom Unordered List (Section 8) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-sage flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Member Privileges & Guarantees
                  </span>
                  <span className="text-[10px] text-sage/70 font-mono">
                    External CSS Custom List
                  </span>
                </div>

                {/* Rendered via pure external CSS in src/styles/custom-requirements.css */}
                <CustomStyledList />
              </div>

              {/* Email Membership Subscription Form */}
              <div className="bg-forest-light/60 rounded-2xl p-6 sm:p-8 border border-sage/30">
                <h3 className="font-serif text-xl font-bold text-offwhite mb-2">
                  Activate Your Complimentary Membership
                </h3>
                <p className="text-xs text-cream/80 mb-6">
                  No subscription fee. Cancel or adjust delivery frequencies anytime.
                </p>

                {status.type === "success" ? (
                  <div className="p-4 rounded-xl bg-botanical/20 border border-botanical/50 text-offwhite flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-sage flex-shrink-0" />
                    <p className="text-xs sm:text-sm font-medium">{status.message}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium uppercase tracking-wider text-sage mb-1">
                          First Name (Optional)
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Oliver"
                          className="w-full bg-forest-dark/80 border border-sage/40 rounded-xl px-4 py-3 text-xs text-offwhite placeholder-cream/40 focus:outline-none focus:border-sage"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium uppercase tracking-wider text-sage mb-1">
                          Email Address (Required)
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="oliver@sanctuary.com"
                          className="w-full bg-forest-dark/80 border border-sage/40 rounded-xl px-4 py-3 text-xs text-offwhite placeholder-cream/40 focus:outline-none focus:border-sage"
                        />
                      </div>
                    </div>

                    {status.type === "error" && (
                      <p className="text-xs text-terracotta bg-terracotta/20 p-2.5 rounded-lg border border-terracotta/40">
                        {status.message}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-offwhite hover:bg-cream text-forest font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-card hover:shadow-elevated active:scale-95 disabled:opacity-50"
                    >
                      {loading ? (
                        <span>Activating Membership...</span>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 text-botanical" /> Join The Blooming Oasis Circle
                          <ArrowRight className="w-4 h-4 text-forest" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

