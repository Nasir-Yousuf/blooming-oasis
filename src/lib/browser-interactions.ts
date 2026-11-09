/**
 * External JavaScript utility for client-side interactions (Assessment Section 8 Requirement).
 * Handles celebratory effects, modals, clipboard copying, smooth scrolling, and accessibility alerts.
 */

import confetti from "canvas-confetti";

/**
 * Fires a botanical celebratory confetti shower (green, sage, cream, gold petals).
 */
export function triggerBotanicalConfetti(): void {
  if (typeof window === "undefined") return;

  try {
    const end = Date.now() + 1.5 * 1000;
    const colors = ["#183D32", "#547B55", "#A8B99A", "#C98568", "#F7F5EF"];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch (err) {
    console.warn("Confetti animation omitted:", err);
  }
}

/**
 * Safely copies text to the user's clipboard and returns a boolean.
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof window === "undefined" || !navigator.clipboard) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Smoothly scrolls the window to an element by ID with top offset.
 */
export function smoothScrollTo(elementId: string, offset = 80): void {
  if (typeof window === "undefined") return;
  const target = document.getElementById(elementId);
  if (!target) return;

  const bodyRect = document.body.getBoundingClientRect().top;
  const elementRect = target.getBoundingClientRect().top;
  const elementPosition = elementRect - bodyRect;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
}

/**
 * Formats USD currency with optional cents.
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

