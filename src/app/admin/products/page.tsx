"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Sparkles,
  Check,
  X,
  AlertCircle,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { formatPrice } from "@/lib/browser-interactions";

interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  botanicalName?: string;
  sku?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  category: string;
  images: string[];
  published: boolean;
  featured: boolean;
  petFriendly: boolean;
  difficulty: string;
  sunlight: string;
  watering: string;
  toxicity: string;
  tagline: string;
  description: string;
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form inputs
  const [formData, setFormData] = useState<any>({
    name: "",
    slug: "",
    botanicalName: "",
    sku: "",
    price: 45,
    discountPrice: 0,
    stock: 25,
    category: "Tropical",
    tagline: "",
    description: "",
    imagesText: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80",
    sunlight: "Bright indirect sunlight",
    watering: "Weekly care",
    difficulty: "Beginner",
    petFriendly: false,
    toxicity: "Mildly toxic to pets if chewed.",
    published: true,
    featured: false,
  });

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, statusFilter]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.warn("Could not load categories in admin products:", err);
      }
    }
    loadCategories();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/products", window.location.origin);
      if (categoryFilter !== "All") url.searchParams.set("category", categoryFilter);
      if (statusFilter !== "All") url.searchParams.set("status", statusFilter);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success && data.products) {
        setProducts(data.products);
      }
    } catch (e) {
      console.warn("Failed to fetch products:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      botanicalName: "",
      sku: `BO-${Math.floor(1000 + Math.random() * 9000)}`,
      price: 45,
      discountPrice: 0,
      stock: 25,
      category: "Tropical",
      tagline: "",
      description: "",
      imagesText:
        "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80",
      sunlight: "Bright indirect sunlight",
      watering: "Weekly care",
      difficulty: "Beginner",
      petFriendly: false,
      toxicity: "Mildly toxic to pets if chewed.",
      published: true,
      featured: false,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: ProductItem) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      slug: p.slug,
      botanicalName: p.botanicalName || "",
      sku: p.sku || `BO-${Math.floor(1000 + Math.random() * 9000)}`,
      price: p.price,
      discountPrice: p.discountPrice || 0,
      stock: p.stock,
      category: p.category,
      tagline: p.tagline,
      description: p.description,
      imagesText: p.images?.join("\n") || "",
      sunlight: p.sunlight,
      watering: p.watering,
      difficulty: p.difficulty,
      petFriendly: p.petFriendly,
      toxicity: p.toxicity,
      published: p.published,
      featured: p.featured,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError("");

    const imagesArray = formData.imagesText
      .split("\n")
      .map((s: string) => s.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      price: Number(formData.price),
      discountPrice: Number(formData.discountPrice) || 0,
      stock: Number(formData.stock),
      images: imagesArray.length > 0 ? imagesArray : ["https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80"],
    };

    try {
      if (editingProduct) {
        // Update product
        const res = await fetch(`/api/admin/products/${editingProduct._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const resData = await res.json();
        if (res.ok && resData.success) {
          setIsModalOpen(false);
          fetchProducts();
          showToast(`Plant "${payload.name}" updated successfully!`);
        } else {
          setFormError(resData.message || "Failed to update product");
        }
      } else {
        // Create product
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const resData = await res.json();
        if (res.ok && resData.success) {
          setIsModalOpen(false);
          fetchProducts();
          showToast(`Plant "${payload.name}" published to catalog!`);
        } else {
          setFormError(resData.message || "Failed to create product");
        }
      }
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchProducts();
        showToast("Plant removed safely.");
      }
    } catch (e) {
      console.error("Delete failed:", e);
    } finally {
      setDeleteConfirmId(null);
    }
  };

  // Filter products by search
  const displayed = products.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-forest text-offwhite px-4 py-3 rounded-2xl shadow-elevated border border-sage/40 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-4">
          <Check className="w-4 h-4 text-sage" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest tracking-tight">
            Plant Catalog Management
          </h1>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Create, price, and maintain indoor botanical inventory.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-forest hover:bg-forest-light text-offwhite text-xs font-semibold uppercase tracking-wider shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-sage" /> Add New Plant
        </button>
      </div>

      {/* Search & Filter Bar (Matching reference image 3) */}
      <div className="bg-offwhite rounded-3xl p-4 sm:p-5 border border-sage/30 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-botanical absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search plant by name, botanical species, SKU..."
            className="w-full bg-cream/70 border border-sage/40 rounded-xl pl-10 pr-4 py-2 text-xs text-charcoal focus:outline-none focus:border-botanical focus:bg-offwhite"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-cream/70 border border-sage/40 rounded-xl px-3 py-2 text-xs text-charcoal font-medium focus:outline-none focus:border-botanical"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c._id || c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-cream/70 border border-sage/40 rounded-xl px-3 py-2 text-xs text-charcoal font-medium focus:outline-none focus:border-botanical"
          >
            <option value="All">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="low_stock">Low Stock (≤5)</option>
          </select>
        </div>
      </div>

      {/* Products Table (Reference Image 3: SaaS Plant Management Table) */}
      <div className="bg-offwhite rounded-3xl border border-sage/30 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-cream/50 border-b border-sage/30 text-charcoal/70 uppercase text-[10px] font-semibold tracking-wider">
                <th className="py-3 px-4">Plant & Botanical Name</th>
                <th className="py-3 px-4">SKU & Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage/20 text-charcoal">
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-charcoal/50">
                    No botanical products found matching filters.
                  </td>
                </tr>
              ) : (
                displayed.map((p) => {
                  const isLow = p.stock <= 5;
                  const isOut = p.stock === 0;

                  return (
                    <tr key={p._id} className="hover:bg-cream/30 transition-colors">
                      {/* Thumbnail & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-cream flex-shrink-0 border border-sage/30 shadow-xs">
                            <Image
                              src={p.images?.[0] || "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=400&q=80"}
                              alt={p.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="font-serif font-bold text-forest block truncate text-sm">
                              {p.name}
                            </span>
                            <span className="text-[11px] text-charcoal/60 italic truncate block">
                              {p.botanicalName || "Botanical specimen"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU & Category */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-charcoal/70 block text-[11px]">
                          {p.sku || "BO-GEN"}
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-botanical">
                          {p.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-serif font-bold text-forest text-sm">
                        {formatPrice(p.price)}
                        {p.discountPrice && p.discountPrice > 0 ? (
                          <span className="block text-[10px] text-terracotta line-through font-normal">
                            {formatPrice(p.discountPrice)}
                          </span>
                        ) : null}
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-semibold ${
                            isOut
                              ? "text-terracotta"
                              : isLow
                              ? "text-amber-600 font-bold"
                              : "text-forest"
                          }`}
                        >
                          {p.stock} units
                        </span>
                        {isLow && !isOut && (
                          <span className="text-[10px] text-amber-600 block">Low stock</span>
                        )}
                        {isOut && (
                          <span className="text-[10px] text-terracotta block">Out of stock</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                            !p.published
                              ? "bg-gray-100 text-gray-700 border border-gray-300"
                              : isOut
                              ? "bg-terracotta/15 text-terracotta border border-terracotta/30"
                              : isLow
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : "bg-botanical/15 text-botanical border border-botanical/30"
                          }`}
                        >
                          {!p.published
                            ? "Draft"
                            : isOut
                            ? "Out of Stock"
                            : isLow
                            ? "Low Stock"
                            : "Published"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/products/${p.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-charcoal/60 hover:text-forest hover:bg-cream transition-colors"
                            title="View on Storefront"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg text-charcoal/60 hover:text-botanical hover:bg-cream transition-colors"
                            title="Edit Plant"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(p._id)}
                            className="p-1.5 rounded-lg text-charcoal/60 hover:text-terracotta hover:bg-cream transition-colors"
                            title="Delete Plant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest/80 backdrop-blur-sm">
          <div className="bg-offwhite rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-sage/40 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-terracotta/20 text-terracotta flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-forest">
              Confirm Plant Deletion
            </h3>
            <p className="text-xs text-charcoal/70">
              Are you sure you want to delete this plant? This action will remove it from the catalog.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-sage/40 text-xs font-semibold text-charcoal hover:bg-cream"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-terracotta hover:bg-terracotta-dark text-offwhite text-xs font-semibold uppercase tracking-wider"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Plant Modal Drawer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-forest/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative max-w-2xl w-full bg-offwhite rounded-3xl shadow-2xl border border-sage/40 p-6 sm:p-8 z-10 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-sage/20 mb-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-forest">
                  {editingProduct ? "Edit Botanical Plant" : "Add New Botanical Plant"}
                </h3>
                <p className="text-xs text-charcoal/60">
                  Update plant biology, specifications, pricing, and photos.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-charcoal/60 hover:text-forest"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-terracotta/15 border border-terracotta/40 text-charcoal text-xs flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-terracotta flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                    Plant Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Monstera Deliciosa"
                    className="w-full bg-cream/60 border border-sage/40 rounded-xl px-3.5 py-2.5 text-xs text-charcoal focus:outline-none focus:border-botanical"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                    Botanical Latin Species
                  </label>
                  <input
                    type="text"
                    value={formData.botanicalName}
                    onChange={(e) => setFormData({ ...formData, botanicalName: e.target.value })}
                    placeholder="e.g. Monstera deliciosa Liebm."
                    className="w-full bg-cream/60 border border-sage/40 rounded-xl px-3.5 py-2.5 text-xs text-charcoal focus:outline-none focus:border-botanical"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-cream/60 border border-sage/40 rounded-xl px-3.5 py-2.5 text-xs text-charcoal focus:outline-none focus:border-botanical"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-cream/60 border border-sage/40 rounded-xl px-3.5 py-2.5 text-xs text-charcoal focus:outline-none focus:border-botanical"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-cream/60 border border-sage/40 rounded-xl px-2.5 py-2.5 text-xs text-charcoal focus:outline-none focus:border-botanical"
                  >
                    {categories.length > 0 ? (
                      categories.map((c) => (
                        <option key={c._id || c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Tropical">Tropical</option>
                        <option value="Foliage">Foliage</option>
                        <option value="Trees">Trees</option>
                        <option value="Flowering">Flowering</option>
                        <option value="Ferns">Ferns</option>
                        <option value="Succulent">Succulent</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                  Tagline (Short Summary)
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. The iconic Swiss Cheese Plant with striking fenestrated foliage"
                  className="w-full bg-cream/60 border border-sage/40 rounded-xl px-3.5 py-2.5 text-xs text-charcoal focus:outline-none focus:border-botanical"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                  Full Botanical Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe architectural characteristics, origin, and aesthetic impact..."
                  className="w-full bg-cream/60 border border-sage/40 rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-botanical"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                    Sunlight
                  </label>
                  <select
                    value={formData.sunlight}
                    onChange={(e) => setFormData({ ...formData, sunlight: e.target.value })}
                    className="w-full bg-cream/60 border border-sage/40 rounded-xl p-2.5 text-xs text-charcoal"
                  >
                    <option value="Low light">Low light</option>
                    <option value="Indirect sunlight">Indirect sunlight</option>
                    <option value="Bright indirect sunlight">Bright indirect sunlight</option>
                    <option value="Direct sunlight">Direct sunlight</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                    Watering
                  </label>
                  <select
                    value={formData.watering}
                    onChange={(e) => setFormData({ ...formData, watering: e.target.value })}
                    className="w-full bg-cream/60 border border-sage/40 rounded-xl p-2.5 text-xs text-charcoal"
                  >
                    <option value="Low maintenance">Low maintenance</option>
                    <option value="Weekly care">Weekly care</option>
                    <option value="I enjoy regular plant care">Regular care</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full bg-cream/60 border border-sage/40 rounded-xl p-2.5 text-xs text-charcoal"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Experienced">Experienced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                  Product Image URLs (One URL per line)
                </label>
                <textarea
                  rows={2}
                  value={formData.imagesText}
                  onChange={(e) => setFormData({ ...formData, imagesText: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-cream/60 border border-sage/40 rounded-xl p-3 text-xs text-charcoal font-mono"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-charcoal/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.petFriendly}
                    onChange={(e) => setFormData({ ...formData, petFriendly: e.target.checked })}
                    className="w-4 h-4 rounded text-forest accent-forest"
                  />
                  <span>100% ASPCA Pet Safe</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-charcoal/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-forest accent-forest"
                  />
                  <span>Featured on Homepage</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-charcoal/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded text-forest accent-forest"
                  />
                  <span>Published to Storefront</span>
                </label>
              </div>

              <div className="pt-4 border-t border-sage/20 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-sage/40 text-xs font-semibold text-charcoal hover:bg-cream"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-forest hover:bg-forest-light text-offwhite text-xs font-semibold uppercase tracking-wider shadow-sm disabled:opacity-50"
                >
                  {formSubmitting
                    ? "Saving..."
                    : editingProduct
                    ? "Save Changes"
                    : "Publish Plant"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

