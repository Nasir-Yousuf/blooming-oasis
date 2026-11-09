"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Check, X, AlertCircle, FolderTree } from "lucide-react";

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  displayOrder: number;
  active: boolean;
  productCount?: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80",
    displayOrder: 1,
    active: true,
  });

  const [formError, setFormError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success && data.categories) {
        setCategories(data.categories);
      }
    } catch (e) {
      console.warn("Failed to fetch categories:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80",
      displayOrder: categories.length + 1,
      active: true,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: CategoryItem) => {
    setEditingCategory(c);
    setFormData({
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: c.image,
      displayOrder: c.displayOrder,
      active: c.active,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    try {
      if (editingCategory) {
        const res = await fetch(`/api/admin/categories/${editingCategory._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setIsModalOpen(false);
          fetchCategories();
          showToast(`Category "${formData.name}" updated!`);
        } else {
          setFormError(data.message || "Failed to update category");
        }
      } else {
        const res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setIsModalOpen(false);
          fetchCategories();
          showToast(`Category "${formData.name}" created!`);
        } else {
          setFormError(data.message || "Failed to create category");
        }
      }
    } catch {
      setFormError("Network error. Please try again.");
    }
  };

  const handleDelete = async (cat: CategoryItem) => {
    if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${cat._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchCategories();
        showToast(data.message);
      } else {
        alert(data.message || "Could not delete category.");
      }
    } catch (e) {
      console.error("Delete failed:", e);
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
            Category Management
          </h1>
          <p className="text-xs text-charcoal/60 mt-0.5">
            Organize plants into botanical taxonomies that reflect across the storefront.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-forest hover:bg-forest-light text-offwhite text-xs font-semibold uppercase tracking-wider shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-sage" /> Create Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="bg-offwhite rounded-3xl p-5 border border-sage/30 shadow-soft flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-4 bg-cream border border-sage/20">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-forest/80 text-offwhite text-[10px] font-semibold uppercase">
                  Order #{cat.displayOrder}
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-forest">
                    {cat.name}
                  </h3>
                  <span className="font-mono text-[11px] text-charcoal/50 block">
                    /{cat.slug}
                  </span>
                </div>
                <span className="text-xs font-semibold bg-cream px-2.5 py-1 rounded-xl text-forest border border-sage/30">
                  {cat.productCount ?? 0} plants
                </span>
              </div>

              <p className="text-xs text-charcoal/70 line-clamp-2 mt-2 leading-relaxed">
                {cat.description || "No description provided."}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-sage/20 flex items-center justify-between text-xs">
              <span
                className={`font-semibold uppercase text-[10px] px-2 py-0.5 rounded-full ${
                  cat.active
                    ? "bg-botanical/15 text-botanical"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {cat.active ? "Active" : "Inactive"}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 rounded-lg text-charcoal/60 hover:text-botanical hover:bg-cream"
                  title="Edit Category"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat)}
                  className="p-1.5 rounded-lg text-charcoal/60 hover:text-terracotta hover:bg-cream"
                  title="Delete Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest/80 backdrop-blur-sm">
          <div className="bg-offwhite rounded-3xl p-6 sm:p-8 max-w-md w-full border border-sage/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sage/20">
              <h3 className="font-serif text-xl font-bold text-forest">
                {editingCategory ? "Edit Category" : "Create New Category"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-charcoal/60 hover:text-forest"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-terracotta/15 border border-terracotta/40 text-charcoal text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-terracotta flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Air-Purifying Plants"
                  className="w-full bg-cream/60 border border-sage/40 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-botanical"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                  Category Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-cream/60 border border-sage/40 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-botanical font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief botanical category description..."
                  className="w-full bg-cream/60 border border-sage/40 rounded-xl p-2.5 text-xs text-charcoal focus:outline-none focus:border-botanical"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        displayOrder: Number(e.target.value),
                      })
                    }
                    className="w-full bg-cream/60 border border-sage/40 rounded-xl px-3.5 py-2 text-xs text-charcoal"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-charcoal/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) =>
                        setFormData({ ...formData, active: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-forest accent-forest"
                    />
                    <span>Active on Store</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-sage/20 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-sage/40 text-xs font-semibold text-charcoal hover:bg-cream"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-forest hover:bg-forest-light text-offwhite text-xs font-semibold uppercase tracking-wider"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

