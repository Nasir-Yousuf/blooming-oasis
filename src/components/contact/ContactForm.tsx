"use client";

import React, { useState } from "react";
import { Send, AlertCircle } from "lucide-react";
import { ConfirmationModal } from "@/components/contact/ConfirmationModal";
import { triggerBotanicalConfetti } from "@/lib/browser-interactions";

const CATEGORIES = [
  "General Inquiry",
  "Plant Care Help",
  "Order Assistance",
  "Custom Interior Consultation",
  "Wholesale & Corporate",
];

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "Plant Care Help",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [lastSubmittedHash, setLastSubmittedHash] = useState<string>("");
  const [modalData, setModalData] = useState<{
    name: string;
    email: string;
    category: string;
    subject: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Client-Side Validation
    if (!formData.name.trim() || formData.name.length < 2) {
      setErrorMessage("Please enter your full name (minimum 2 characters).");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!formData.subject.trim() || formData.subject.length < 3) {
      setErrorMessage("Subject must be at least 3 characters.");
      return;
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      setErrorMessage("Your message must be at least 10 characters long.");
      return;
    }

    // 2. Prevent duplicate submissions
    const currentHash = `${formData.email}_${formData.subject}_${formData.message}`;
    if (currentHash === lastSubmittedHash) {
      setErrorMessage(
        "You have already submitted this inquiry. A plant specialist is reviewing your message!"
      );
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setLastSubmittedHash(currentHash);
        // Explicitly trigger the JavaScript Confirmation Popup Modal!
        setModalData({
          name: formData.name,
          email: formData.email,
          category: formData.category,
          subject: formData.subject,
        });

        // Trigger celebratory confetti effect
        triggerBotanicalConfetti();

        // Reset form inputs
        setFormData({
          name: "",
          email: "",
          subject: "",
          category: "Plant Care Help",
          message: "",
        });
      } else {
        setErrorMessage(
          result.message || "Could not submit your message. Please check the fields."
        );
      }
    } catch {
      setErrorMessage(
        "A network connection error occurred. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-offwhite rounded-3xl p-6 sm:p-10 border border-sage/30 shadow-card">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-botanical block mb-1">
            Send an Inquiry
          </span>
          <h3 className="font-serif text-2xl font-bold text-forest">
            Send a Botanical Message
          </h3>
          <p className="text-xs text-charcoal/70 mt-1">
            Every submission triggers a confirmation modal and is securely persisted.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-terracotta/15 border border-terracotta/40 text-charcoal text-xs flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 text-terracotta flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Eleanor Vance"
                className="w-full bg-cream/60 border border-sage/40 rounded-xl px-4 py-3 text-xs text-charcoal focus:outline-none focus:border-botanical focus:bg-offwhite"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="eleanor@botanical.com"
                className="w-full bg-cream/60 border border-sage/40 rounded-xl px-4 py-3 text-xs text-charcoal focus:outline-none focus:border-botanical focus:bg-offwhite"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                Inquiry Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-cream/60 border border-sage/40 rounded-xl px-3.5 py-3 text-xs text-charcoal focus:outline-none focus:border-botanical focus:bg-offwhite"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Monstera repotting advice"
                className="w-full bg-cream/60 border border-sage/40 rounded-xl px-4 py-3 text-xs text-charcoal focus:outline-none focus:border-botanical focus:bg-offwhite"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
              Your Message *
            </label>
            <textarea
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              placeholder="Describe your plant question, space dimensions, lighting details, or order query..."
              className="w-full bg-cream/60 border border-sage/40 rounded-xl p-3.5 text-xs text-charcoal focus:outline-none focus:border-botanical focus:bg-offwhite"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-forest hover:bg-forest-light text-offwhite text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-card hover:shadow-elevated active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Validating & Sending...</span>
              ) : (
                <>
                  <Send className="w-4 h-4 text-sage" /> Submit Inquiry & Trigger Confirmation
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* JavaScript Confirmation Modal Popup (Section 8 Requirement) */}
      {modalData && (
        <ConfirmationModal
          isOpen={Boolean(modalData)}
          onClose={() => setModalData(null)}
          data={modalData}
        />
      )}
    </>
  );
}

