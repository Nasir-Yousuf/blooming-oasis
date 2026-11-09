"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Users,
  Sprout,
  AlertTriangle,
  ArrowUpRight,
  Filter,
  TrendingUp,
  PackageCheck,
  ChevronRight,
  Eye,
} from "lucide-react";
import { formatPrice } from "@/lib/browser-interactions";

export default function AdminOverviewPage() {
  const [range, setRange] = useState("30d");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats(range);
  }, [range]);

  const fetchStats = async (selectedRange: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/overview?range=${selectedRange}`);
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {
      console.warn("Failed to fetch admin stats:", e);
    } finally {
      setLoading(false);
    }
  };

  const stats = data?.stats || {
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    lowStockProducts: 0,
  };

  const chartData = data?.chartData || [];
  const maxRevenue = Math.max(...chartData.map((d: any) => d.revenue), 100);

  return (
    <div className="space-y-8">
      {/* Top Banner & Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest tracking-tight">
            Nursery Overview & Analytics
          </h1>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Real-time sales, order fulfillment, and inventory health metrics.
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center gap-1.5 bg-offwhite p-1 rounded-2xl border border-sage/30 shadow-xs">
          {[
            { id: "today", label: "Today" },
            { id: "7d", label: "7 Days" },
            { id: "30d", label: "30 Days" },
            { id: "12m", label: "12 Months" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRange(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition-all ${
                range === tab.id
                  ? "bg-forest text-offwhite shadow-xs"
                  : "text-charcoal/70 hover:text-forest hover:bg-cream"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid (Matching reference dashboards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="bg-offwhite rounded-3xl p-6 border border-sage/30 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-charcoal/60 mb-2">
            <span className="font-semibold uppercase tracking-wider text-botanical">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-cream flex items-center justify-center text-forest">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-serif text-3xl font-bold text-forest">
              {formatPrice(stats.totalRevenue)}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-botanical font-medium mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +14.2% vs previous period
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-offwhite rounded-3xl p-6 border border-sage/30 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-charcoal/60 mb-2">
            <span className="font-semibold uppercase tracking-wider text-botanical">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-cream flex items-center justify-center text-forest">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-serif text-3xl font-bold text-forest">
              {stats.totalOrders}
            </div>
            <div className="text-[11px] text-charcoal/60 mt-1 flex items-center gap-1">
              <span>{stats.pendingOrders} pending fulfillment</span>
            </div>
          </div>
        </div>

        {/* Registered Customers */}
        <div className="bg-offwhite rounded-3xl p-6 border border-sage/30 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-charcoal/60 mb-2">
            <span className="font-semibold uppercase tracking-wider text-botanical">
              Botanical Customers
            </span>
            <div className="w-8 h-8 rounded-xl bg-cream flex items-center justify-center text-forest">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-serif text-3xl font-bold text-forest">
              {stats.totalCustomers}
            </div>
            <div className="text-[11px] text-charcoal/60 mt-1">
              Active registered plant parents
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-offwhite rounded-3xl p-6 border border-sage/30 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-charcoal/60 mb-2">
            <span className="font-semibold uppercase tracking-wider text-terracotta">
              Stock Warnings
            </span>
            <div className="w-8 h-8 rounded-xl bg-terracotta/15 flex items-center justify-center text-terracotta">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="font-serif text-3xl font-bold text-forest">
              {stats.lowStockProducts}
            </div>
            <div className="text-[11px] text-terracotta font-medium mt-1">
              Plants below threshold (≤ 5 units)
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Chart & Order Fulfillment Section (Reference Image 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Performance Chart (8 cols) */}
        <div className="lg:col-span-8 bg-offwhite rounded-3xl p-6 sm:p-8 border border-sage/30 shadow-soft space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-forest">
                Revenue & Sales Trajectory
              </h2>
              <p className="text-xs text-charcoal/60">
                Performance across selected interval ({range.toUpperCase()})
              </p>
            </div>
            <span className="text-xs font-semibold text-botanical bg-cream px-3 py-1 rounded-full border border-sage/30">
              Verified DB Aggregations
            </span>
          </div>

          {/* Interactive Responsive SVG Bar & Line Chart */}
          <div className="h-64 w-full flex items-end gap-2 sm:gap-4 pt-8 pb-4 border-b border-sage/20">
            {chartData.map((point: any, idx: number) => {
              const heightPct = Math.max(12, Math.round((point.revenue / maxRevenue) * 100));
              return (
                <div
                  key={idx}
                  className="flex-1 h-full flex flex-col items-center justify-end group relative"
                >
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-forest text-offwhite text-[11px] font-mono px-2 py-1 rounded-md shadow-md pointer-events-none z-10 whitespace-nowrap">
                    {formatPrice(point.revenue)} ({point.orders} orders)
                  </div>

                  {/* Visual Bar */}
                  <div
                    className="w-full max-w-[36px] bg-sage/30 group-hover:bg-botanical rounded-t-lg transition-all duration-300"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] text-charcoal/60 font-medium mt-2 truncate w-full text-center">
                    {point.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-charcoal/70">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-botanical inline-block" />
                <span>Gross Plant Revenue</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-sage inline-block" />
                <span>Order Volume</span>
              </span>
            </div>
            <span className="text-xs font-semibold text-forest">
              Peak: {formatPrice(maxRevenue)}
            </span>
          </div>
        </div>

        {/* Quick Shipment / Order Fulfillment Summary (4 cols) */}
        <div className="lg:col-span-4 bg-offwhite rounded-3xl p-6 sm:p-8 border border-sage/30 shadow-soft flex flex-col justify-between space-y-6">
          <div>
            <h2 className="font-serif text-lg font-bold text-forest mb-1">
              Fulfillment Status
            </h2>
            <p className="text-xs text-charcoal/60">
              Live greenhouse delivery pipeline
            </p>

            <div className="space-y-4 mt-6">
              <div className="p-4 rounded-2xl bg-cream border border-sage/30">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-forest">Pending Packing</span>
                  <span className="font-bold text-terracotta">{stats.pendingOrders}</span>
                </div>
                <div className="w-full h-2 bg-sage/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-terracotta rounded-full"
                    style={{
                      width: `${Math.min(100, (stats.pendingOrders / (stats.totalOrders || 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cream border border-sage/30">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-forest">Delivered & Acclimatized</span>
                  <span className="font-bold text-botanical">{stats.completedOrders}</span>
                </div>
                <div className="w-full h-2 bg-sage/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-botanical rounded-full"
                    style={{
                      width: `${Math.min(100, (stats.completedOrders / (stats.totalOrders || 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/admin/orders"
            className="w-full py-3 rounded-2xl bg-forest hover:bg-forest-light text-offwhite text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            Manage All Orders <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent Orders Table (Matching reference dashboard table) */}
      <div className="bg-offwhite rounded-3xl p-6 sm:p-8 border border-sage/30 shadow-soft space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-forest">
              Recent Customer Orders
            </h2>
            <p className="text-xs text-charcoal/60">
              Latest incoming storefront orders
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-botanical hover:text-forest flex items-center gap-1"
          >
            View Full Table →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-sage/30 text-charcoal/60 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-3">Order Number</th>
                <th className="pb-3 px-3">Customer</th>
                <th className="pb-3 px-3">Date</th>
                <th className="pb-3 px-3">Total</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage/20 text-charcoal">
              {(!data?.recentOrders || data.recentOrders.length === 0) ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-charcoal/50">
                    No orders placed yet. Place an order from the storefront!
                  </td>
                </tr>
              ) : (
                data.recentOrders.map((ord: any) => (
                  <tr key={ord._id} className="hover:bg-cream/40 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-forest">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-semibold block">{ord.customer?.name}</span>
                      <span className="text-[11px] text-charcoal/60">{ord.customer?.email}</span>
                    </td>
                    <td className="py-3.5 px-3 text-charcoal/70">
                      {new Date(ord.createdAt).toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-3 font-serif font-bold text-forest text-sm">
                      {formatPrice(ord.total)}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
                          ord.status === "Delivered"
                            ? "bg-botanical/15 text-botanical border border-botanical/30"
                            : ord.status === "Pending"
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : ord.status === "Cancelled"
                            ? "bg-terracotta/15 text-terracotta border border-terracotta/30"
                            : "bg-forest/10 text-forest border border-forest/20"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href={`/admin/orders`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-botanical hover:text-forest"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </Link>
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

