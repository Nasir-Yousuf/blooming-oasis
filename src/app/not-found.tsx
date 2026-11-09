import React from "react";
import Link from "next/link";
import { Sprout, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-3xl bg-forest-light/20 border border-sage/40 flex items-center justify-center text-forest mb-4">
        <Sprout className="w-8 h-8 text-botanical" />
      </div>
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest mb-2">
        Plant Not Found
      </h1>
      <p className="text-xs sm:text-sm text-charcoal/70 max-w-md mb-6 leading-relaxed">
        The botanical specimen or sanctuary page you are looking for has been pruned or moved to a different greenhouse section.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-full bg-forest hover:bg-forest-light text-offwhite text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm"
      >
        <ArrowLeft className="w-4 h-4 text-sage" />
        <span>Return to Conservatory</span>
      </Link>
    </div>
  );
}

