"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Boxes, AlertTriangle, Check, RefreshCw, X, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatPrice } from "@/lib/browser-interactions";

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Stock Adjustment Modal
  const [selectedPlant, setSelectedPlant] = useState<any | null>(null);
  const [newStock, setNewStock] = useState<number>(0);
  const [reason, setReason] = useState<string>("Restock");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetchInventory();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/inventory");
      const data = await res.json();
      if (data.success) {
        setInventory(data.inventory || []);
        setLogs(data.logs || []);
      }
    } catch (e) {
      console.warn("Failed to fetch inventory:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdjust = (item: any) => {
    setSelectedPlant(item);
    setNewStock(item.stock);
    setReason("Restock");
  };

  const handleSaveStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlant) return;

    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedPlant._id,
          newStock: Number(newStock),
          reason,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        fetchInventory();
        setSelectedPlant(null);
        showToast(`Stock updated for ${selectedPlant.name}!`);
      }
    } catch (e) {
      console.error("Stock update failed:", e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-forest text-offwhite px-4 py-3 rounded-2xl shadow-elevated border border-sage/40 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-4">
          <Check className="w-4 h-4 text-sage" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest tracking-tight">
            Inventory & Stock Control
          </h1>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Monitor nursery bench counts, low-stock thresholds, and replenishment logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inventory Table (8 cols) */}
        <div className="lg:col-span-8 bg-offwhite rounded-3xl border border-sage/30 shadow-soft overflow-hidden">
          <div className="p-5 border-b border-sage/20 flex items-center justify-between">
            <span className="font-serif font-bold text-forest text-base">
              Bench Stock Levels
            </span>
            <span className="text-xs text-charcoal/60">
              Low stock threshold: ≤ 5 units
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-cream/50 border-b border-sage/30 text-charcoal/70 uppercase text-[10px] font-semibold tracking-wider">
                  <th className="py-3 px-4">Plant</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Units in Bench</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage/20 text-charcoal">
                {inventory.map((item) => {
                  const isLow = item.stock <= 5;
                  const isOut = item.stock === 0;

                  return (
                    <tr key={item._id} className="hover:bg-cream/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-forest text-sm">
                        {item.name}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-charcoal/60">
                        {item.sku || "BO-GEN"}
                      </td>
                      <td className="py-3.5 px-4 text-botanical uppercase text-[10px] font-semibold">
                        {item.category}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isOut
                              ? "bg-terracotta/20 text-terracotta"
                              : isLow
                              ? "bg-amber-100 text-amber-800"
                              : "bg-botanical/15 text-botanical"
                          }`}
                        >
                          {item.stock} in stock
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenAdjust(item)}
                          className="px-3 py-1 rounded-xl bg-forest hover:bg-forest-light text-offwhite text-xs font-semibold uppercase tracking-wider transition-colors"
                        >
                          Adjust
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory Logs (4 cols) */}
        <div className="lg:col-span-4 bg-offwhite rounded-3xl p-6 border border-sage/30 shadow-soft flex flex-col justify-between space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-botanical block">
              Audit Trail
            </span>
            <h2 className="font-serif text-lg font-bold text-forest mb-4">
              Recent Stock Movements
            </h2>

            <div className="space-y-3">
              {logs.length === 0 ? (
                <p className="text-xs text-charcoal/50 italic">
                  No adjustments recorded yet.
                </p>
              ) : (
                logs.map((log) => (
                  <div
                    key={log._id}
                    className="p-3 rounded-2xl bg-cream/40 border border-sage/20 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-forest">{log.productName}</span>
                      <span
                        className={`font-mono font-bold flex items-center ${
                          log.changeAmount > 0
                            ? "text-botanical"
                            : "text-terracotta"
                        }`}
                      >
                        {log.changeAmount > 0 ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        )}
                        {log.changeAmount > 0 ? `+${log.changeAmount}` : log.changeAmount}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-charcoal/60">
                      <span>{log.reason}</span>
                      <span>Now: {log.newStock} units</span>
                    </div>
                    <div className="text-[10px] text-charcoal/40 pt-0.5">
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {selectedPlant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest/80 backdrop-blur-sm">
          <div className="bg-offwhite rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-sage/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sage/20">
              <h3 className="font-serif text-xl font-bold text-forest">
                Adjust Plant Stock
              </h3>
              <button
                onClick={() => setSelectedPlant(null)}
                className="p-1 text-charcoal/60 hover:text-forest"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStock} className="space-y-3.5">
              <div>
                <span className="text-xs text-charcoal/70 block">Plant:</span>
                <span className="font-serif font-bold text-forest text-base">
                  {selectedPlant.name}
                </span>
                <span className="text-[11px] text-charcoal/50 block font-mono">
                  Current Stock: {selectedPlant.stock} units
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                  New Stock Count *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newStock}
                  onChange={(e) => setNewStock(Number(e.target.value))}
                  className="w-full bg-cream/60 border border-sage/40 rounded-xl px-3.5 py-2.5 text-xs text-charcoal font-bold text-base focus:outline-none focus:border-botanical"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                  Reason for Adjustment
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-cream/60 border border-sage/40 rounded-xl px-3 py-2 text-xs text-charcoal font-medium"
                >
                  <option value="Restock">Nursery Restock Delivery</option>
                  <option value="Manual Adjustment">Manual Audit Correction</option>
                  <option value="Damage/Waste">Damaged / Transit Loss</option>
                  <option value="Order Cancellation">Cancelled Order Return</option>
                </select>
              </div>

              <div className="pt-3 border-t border-sage/20 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedPlant(null)}
                  className="px-4 py-2 rounded-xl border border-sage/40 text-xs font-semibold text-charcoal hover:bg-cream"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-forest hover:bg-forest-light text-offwhite text-xs font-semibold uppercase tracking-wider"
                >
                  Update Bench Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

