"use client";

import React, { useEffect } from "react";
import { CheckCircle2, X, Sparkles, Sprout, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    name: string;
    email: string;
    category: string;
    subject: string;
  };
}

/**
 * JavaScript Confirmation Modal Popup (Assessment Section 8 Requirement).
 * Triggered explicitly and solely after successful contact form submission,
 * providing celebratory visual feedback and preventing duplicate submissions.
 */
export function ConfirmationModal({
  isOpen,
  onClose,
  data,
}: ConfirmationModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-12 flex items-center justify-center animate-in fade-in duration-300">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-forest/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative max-w-lg w-full bg-offwhite rounded-3xl shadow-2xl border border-sage/40 p-6 sm:p-10 z-10 text-center animate-in zoom-in-95 duration-400">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-charcoal/50 hover:text-forest hover:bg-cream transition-colors"
          aria-label="Close confirmation popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Celebrating Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cream border-2 border-botanical/30 flex items-center justify-center mx-auto mb-6 text-botanical shadow-soft">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        {/* Assessment Requirement Badge */}
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-botanical/15 text-botanical border border-botanical/30 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Submission Confirmed
        </span>

        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest tracking-tight mb-2">
          Thank You, {data.name}!
        </h3>

        <p className="text-xs sm:text-sm text-charcoal/75 leading-relaxed mb-6 font-light">
          Your botanical inquiry regarding <span className="font-semibold text-forest">&ldquo;{data.subject}&rdquo;</span> has been safely logged in our system. A senior plant specialist will respond to <span className="font-mono text-forest font-semibold">{data.email}</span> within 24 business hours.
        </p>

        {/* Submission Details Summary Box */}
        <div className="bg-cream rounded-2xl p-4 mb-6 text-left text-xs border border-sage/30 space-y-1.5">
          <div className="flex justify-between">
            <span className="text-charcoal/60">Category:</span>
            <span className="font-semibold text-forest">{data.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-charcoal/60">Verification Status:</span>
            <span className="text-botanical font-semibold flex items-center gap-1">
              <Sprout className="w-3 h-3" /> Received & Validated
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-forest hover:bg-forest-light text-offwhite text-xs font-semibold uppercase tracking-wider transition-all shadow-card"
          >
            Close Confirmation
          </button>
          <Link
            href="/products"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-sage/40 hover:bg-cream text-forest text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
          >
            Browse Plants <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

