"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  XCircle,
  X,
  Sparkles,
  Send,
  AlertCircle,
  FileText,
} from "lucide-react";
import { formatPrice } from "@/lib/browser-interactions";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Selected Order for View/Edit Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [statusNote, setStatusNote] = useState<string>("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/orders", window.location.origin);
      if (statusFilter !== "All") url.searchParams.set("status", statusFilter);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.warn("Failed to fetch orders:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusNote("");
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          note: statusNote || `Status updated to ${newStatus}`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.order) {
          setSelectedOrder(data.order);
        }
        fetchOrders();
        showToast(`Order status updated to ${newStatus}!`);
      }
    } catch (e) {
      console.error("Status update failed:", e);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const displayed = orders.filter((o) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      o.orderNumber?.toLowerCase().includes(q) ||
      o.customer?.name?.toLowerCase().includes(q) ||
      o.customer?.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-forest text-offwhite px-4 py-3 rounded-2xl shadow-elevated border border-sage/40 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-sage" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest tracking-tight">
            Order Fulfillment Center
          </h1>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Process, inspect, and track botanical orders through the delivery lifecycle.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-offwhite rounded-3xl p-4 sm:p-5 border border-sage/30 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-botanical absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer name, email..."
            className="w-full bg-cream/70 border border-sage/40 rounded-xl pl-10 pr-4 py-2 text-xs text-charcoal focus:outline-none focus:border-botanical focus:bg-offwhite"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            "All",
            "Pending",
            "Confirmed",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled",
          ].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? "bg-forest text-offwhite font-semibold"
                  : "bg-cream/60 hover:bg-cream text-charcoal/70"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table (Matching Reference Image 2) */}
      <div className="bg-offwhite rounded-3xl border border-sage/30 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-cream/50 border-b border-sage/30 text-charcoal/70 uppercase text-[10px] font-semibold tracking-wider">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Order Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage/20 text-charcoal">
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-charcoal/50">
                    No orders found matching criteria.
                  </td>
                </tr>
              ) : (
                displayed.map((ord) => (
                  <tr key={ord._id} className="hover:bg-cream/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-forest">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold block">{ord.customer?.name}</span>
                      <span className="text-[11px] text-charcoal/60">{ord.customer?.email}</span>
                    </td>
                    <td className="py-3.5 px-4 text-charcoal/70">
                      {new Date(ord.createdAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-forest">
                        {ord.items?.length || 1} {ord.items?.length === 1 ? "specimen" : "specimens"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-forest text-sm">
                      {formatPrice(ord.total)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cream border border-sage/30">
                        {ord.paymentMethod?.toUpperCase() || "COD"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
                          ord.status === "Delivered"
                            ? "bg-botanical/15 text-botanical border border-botanical/30"
                            : ord.status === "Pending"
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : ord.status === "Confirmed"
                            ? "bg-blue-100 text-blue-800 border border-blue-300"
                            : ord.status === "Shipped"
                            ? "bg-indigo-100 text-indigo-800 border border-indigo-300"
                            : "bg-terracotta/15 text-terracotta border border-terracotta/30"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(ord)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cream hover:bg-sage/20 text-forest font-semibold text-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-botanical" /> Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Status Changer Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-forest/80 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="relative max-w-2xl w-full bg-offwhite rounded-3xl shadow-2xl border border-sage/40 p-6 sm:p-8 z-10 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-sage/20 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-botanical block">
                  Order Inspection
                </span>
                <h3 className="font-serif text-2xl font-bold text-forest">
                  Order #{selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-full text-charcoal/60 hover:text-forest"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
              {/* Customer & Address Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-cream/40 p-4 rounded-2xl border border-sage/30 text-xs">
                <div>
                  <span className="font-semibold text-botanical uppercase text-[10px] block mb-1">
                    Customer Information
                  </span>
                  <div className="font-bold text-forest">{selectedOrder.customer?.name}</div>
                  <div className="text-charcoal/70">{selectedOrder.customer?.email}</div>
                  <div className="text-charcoal/70">{selectedOrder.customer?.phone}</div>
                </div>

                <div>
                  <span className="font-semibold text-botanical uppercase text-[10px] block mb-1">
                    Shipping Destination
                  </span>
                  <div className="text-charcoal/80">
                    {selectedOrder.shippingAddress?.street}
                    <br />
                    {selectedOrder.shippingAddress?.city},{" "}
                    {selectedOrder.shippingAddress?.state}{" "}
                    {selectedOrder.shippingAddress?.postalCode}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <span className="font-semibold text-forest text-xs uppercase tracking-wider block">
                  Ordered Botanical Specimens
                </span>
                <div className="divide-y divide-sage/20 border border-sage/30 rounded-2xl p-4 bg-cream/20 text-xs">
                  {selectedOrder.items?.map((item: any, i: number) => (
                    <div key={i} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-forest">{item.productName}</div>
                        <div className="text-[11px] text-charcoal/60">
                          Size: {item.size} • Qty: {item.quantity}
                        </div>
                        {item.accessories?.map((a: any, aIdx: number) => (
                          <div key={aIdx} className="text-[10px] text-botanical">
                            + {a.name} ({formatPrice(a.price)})
                          </div>
                        ))}
                      </div>
                      <div className="font-serif font-bold text-forest text-sm">
                        {formatPrice(item.totalPrice)}
                      </div>
                    </div>
                  ))}

                  {/* Summary Totals */}
                  <div className="pt-3 border-t border-sage/30 space-y-1 text-xs">
                    <div className="flex justify-between text-charcoal/70">
                      <span>Subtotal</span>
                      <span>{formatPrice(selectedOrder.subtotal)}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between text-botanical">
                        <span>Discount ({selectedOrder.couponCode})</span>
                        <span>-{formatPrice(selectedOrder.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-charcoal/70">
                      <span>Nationwide Delivery</span>
                      <span>
                        {selectedOrder.deliveryCharge === 0
                          ? "FREE"
                          : formatPrice(selectedOrder.deliveryCharge)}
                      </span>
                    </div>
                    <div className="flex justify-between font-serif font-bold text-forest text-base pt-1">
                      <span>Total</span>
                      <span>{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Timeline History */}
              <div>
                <span className="font-semibold text-forest text-xs uppercase tracking-wider block mb-2">
                  Fulfillment Timeline
                </span>
                <div className="space-y-2 bg-offwhite p-4 rounded-2xl border border-sage/30 text-xs">
                  {selectedOrder.statusTimeline?.map((t: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-botanical mt-1.5 flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-forest">{t.status}</span>
                          <span className="text-[10px] text-charcoal/50">
                            {new Date(t.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[11px] text-charcoal/70">{t.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Update Form */}
              <form onSubmit={handleUpdateStatus} className="bg-cream/60 p-4 rounded-2xl border border-sage/30 space-y-3">
                <span className="font-semibold text-forest text-xs uppercase tracking-wider block">
                  Update Order Status
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-charcoal/70 mb-1">
                      Select Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full bg-offwhite border border-sage/40 rounded-xl px-3 py-2 text-xs text-charcoal font-semibold"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-charcoal/70 mb-1">
                      Timeline Note
                    </label>
                    <input
                      type="text"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="e.g. Packed in moisture box #4"
                      className="w-full bg-offwhite border border-sage/40 rounded-xl px-3 py-2 text-xs text-charcoal"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={updatingStatus}
                    className="px-5 py-2 rounded-xl bg-forest hover:bg-forest-light text-offwhite text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {updatingStatus ? "Updating..." : "Update Status"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

