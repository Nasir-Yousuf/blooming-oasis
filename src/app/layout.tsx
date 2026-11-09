import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "@/styles/custom-requirements.css";
import { CartProvider } from "@/context/CartContext";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { LiveChat } from "@/components/shared/LiveChat";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blooming Oasis | Premium Indoor Plant E-Commerce",
  description:
    "Transform ordinary spaces into beautiful, calming, green living environments with premium indoor plants, curated collections, and botanical care guides.",
  keywords: [
    "indoor plants",
    "monstera deliciosa",
    "houseplants",
    "botanical decor",
    "pet friendly plants",
    "low light plants",
    "blooming oasis",
  ],
  authors: [{ name: "Blooming Oasis Collective" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <body className="font-sans bg-offwhite text-charcoal antialiased selection:bg-sage/40 selection:text-forest flex flex-col min-h-screen">
        <CartProvider>
          {/* Announcement Bar */}
          <AnnouncementBar />

          {/* Full-width Responsive Navigation */}
          <Navbar />

          {/* Main Page Route Content */}
          <main className="flex-1">{children}</main>

          {/* Quick Sliding Cart Drawer */}
          <CartDrawer />

          {/* Floating Plant Specialist Live Chat Widget */}
          <LiveChat />

          {/* Master Footer with Live Clock & Social Links */}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
