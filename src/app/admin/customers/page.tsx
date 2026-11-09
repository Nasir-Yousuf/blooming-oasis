"use client";

import React, { useState, useEffect } from "react";
import { Search, Users, ShieldAlert, ShieldCheck, Mail, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/browser-interactions";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/customers");
      const data = await res.json();
      if (data.success && data.customers) {
        setCustomers(data.customers);
      }
    } catch (e) {
      console.warn("Failed to fetch customers:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      const res = await fetch("/api/admin/customers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status: nextStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchCustomers();
      }
    } catch (e) {
      console.error("Status toggle error:", e);
    }
  };

  const displayed = customers.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest tracking-tight">
            Customer Directory
          </h1>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Registered indoor plant collectors, order records, and lifetime value.
          </p>
        </div>
      </div>

      <div className="bg-offwhite rounded-3xl p-4 sm:p-5 border border-sage/30 shadow-soft">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-botanical absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer by name or email..."
            className="w-full bg-cream/70 border border-sage/40 rounded-xl pl-10 pr-4 py-2 text-xs text-charcoal focus:outline-none focus:border-botanical focus:bg-offwhite"
          />
        </div>
      </div>

      <div className="bg-offwhite rounded-3xl border border-sage/30 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-cream/50 border-b border-sage/30 text-charcoal/70 uppercase text-[10px] font-semibold tracking-wider">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Orders Placed</th>
                <th className="py-3.5 px-4">Total Spent</th>
                <th className="py-3.5 px-4">Registered Date</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage/20 text-charcoal">
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-charcoal/50">
                    No customers found.
                  </td>
                </tr>
              ) : (
                displayed.map((c) => (
                  <tr key={c._id} className="hover:bg-cream/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-forest text-offwhite font-bold text-xs flex items-center justify-center">
                          {c.name?.charAt(0) || "C"}
                        </div>
                        <div>
                          <span className="font-bold text-forest block">{c.name}</span>
                          <span className="text-[11px] text-charcoal/60">{c.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-forest">
                      {c.orderCount ?? 0} orders
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-forest text-sm">
                      {formatPrice(c.totalSpend ?? 0)}
                    </td>
                    <td className="py-3.5 px-4 text-charcoal/70">
                      {new Date(c.createdAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          c.status === "active"
                            ? "bg-botanical/15 text-botanical border border-botanical/30"
                            : "bg-terracotta/15 text-terracotta border border-terracotta/30"
                        }`}
                      >
                        {c.status || "active"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(c._id, c.status || "active")}
                        className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${
                          c.status === "active"
                            ? "text-terracotta hover:bg-terracotta/10"
                            : "text-botanical hover:bg-botanical/10"
                        }`}
                      >
                        {c.status === "active" ? "Suspend" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

