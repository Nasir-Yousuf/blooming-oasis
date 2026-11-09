"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Sprout,
  FolderTree,
  ShoppingBag,
  Users,
  Boxes,
  Tag,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Search,
  Bell,
  CheckCircle2,
  ChevronRight,
  Shield,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);

  // If on admin login page, render children directly without dashboard shell
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoginPage) {
      fetchCurrentUser();
    }
  }, [isLoginPage]);

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.authenticated && data.user) {
        setCurrentUser(data.user);
      } else {
        // Dev convenience: set default admin if not logged in
        setCurrentUser({
          name: "Master Botanist Admin",
          email: "admin@bloomingoasis.demo",
          role: "superadmin",
        });
      }
    } catch {
      setCurrentUser({
        name: "Admin Specialist",
        email: "admin@bloomingoasis.demo",
        role: "superadmin",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Sprout },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Inventory", href: "/admin/inventory", icon: Boxes },
    { name: "Promotions", href: "/admin/promotions", icon: Tag },
    { name: "Plant Tips", href: "/admin/plant-tips", icon: MessageSquare },
    { name: "Store Settings", href: "/admin/settings", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F4] text-charcoal flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-forest text-offwhite border-r border-forest-light/30 flex-shrink-0 justify-between">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-forest-light/40 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest-light border border-sage/30 flex items-center justify-center text-sage shadow-sm">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <span className="font-serif text-lg font-bold tracking-tight text-offwhite block leading-tight">
                  Blooming Oasis
                </span>
                <span className="text-[10px] font-sans uppercase tracking-widest text-sage block mt-0.5">
                  Admin Console
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-sage/70">
              E-Commerce Management
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    active
                      ? "bg-forest-light text-offwhite shadow-sm border border-sage/30"
                      : "text-cream/75 hover:bg-forest-light/40 hover:text-offwhite"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${active ? "text-sage" : "text-cream/60"}`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile & Storefront Link */}
        <div className="p-4 border-t border-forest-light/40 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-forest-light/40 hover:bg-forest-light text-cream hover:text-offwhite text-xs font-medium transition-colors border border-sage/20"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-sage" /> View Storefront
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-sage/60" />
          </Link>

          <div className="pt-2 flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-botanical text-offwhite font-bold text-xs flex items-center justify-center flex-shrink-0">
                {currentUser?.name?.charAt(0) || "A"}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-offwhite block truncate">
                  {currentUser?.name || "Administrator"}
                </span>
                <span className="text-[10px] text-sage uppercase font-medium tracking-wider block truncate">
                  {currentUser?.role || "superadmin"}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-forest-light text-cream/70 hover:text-terracotta transition-colors"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-offwhite border-b border-sage/30 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-charcoal hover:bg-cream"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold text-forest uppercase tracking-wider hidden sm:inline">
              Nursery Operations Center
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-botanical font-semibold bg-cream px-3 py-1 rounded-full border border-sage/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-botanical" />
              <span>Live Database Sync</span>
            </div>

            <Link
              href="/"
              className="text-xs font-semibold text-charcoal/70 hover:text-forest transition-colors hidden md:flex items-center gap-1"
            >
              <span>Storefront</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-forest/80 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-forest text-offwhite p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-forest-light/40 mb-4">
                <div className="flex items-center gap-2">
                  <Sprout className="w-6 h-6 text-sage" />
                  <span className="font-serif text-lg font-bold">
                    Blooming Oasis
                  </span>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded-lg text-sage hover:text-offwhite"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      isActive(item.href)
                        ? "bg-forest-light text-offwhite"
                        : "text-cream/70 hover:bg-forest-light/40"
                    }`}
                  >
                    <item.icon className="w-4 h-4 text-sage" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-forest-light/40">
              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl bg-forest-light text-offwhite text-xs font-semibold flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

