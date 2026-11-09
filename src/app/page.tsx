import { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { BotanicalCollage } from "@/components/home/BotanicalCollage";
import { PopularPlants } from "@/components/home/PopularPlants";
import { PlantMatchmaker } from "@/components/home/PlantMatchmaker";
import { CuratedCollections } from "@/components/home/CuratedCollections";
import { PlantCareGuides } from "@/components/home/PlantCareGuides";
import { MembershipAccordion } from "@/components/home/MembershipAccordion";
import { AboutPreview } from "@/components/home/AboutPreview";
import { SocialSection } from "@/components/home/SocialSection";

export const metadata: Metadata = {
  title: "Blooming Oasis | Premium Indoor Plants & Modern Botanical Living",
  description:
    "Discover thoughtfully selected indoor plants, artisanal ceramics, and expert botanist care guides to transform ordinary spaces into calming green living environments.",
  openGraph: {
    title: "Blooming Oasis | Premium Indoor Plant E-Commerce",
    description:
      "Transform ordinary spaces into calming living environments with premium indoor plants, curated collections, and botanical care guides.",
    url: "https://bloomingoasis.demo",
    siteName: "Blooming Oasis",
    images: [
      {
        url: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Blooming Oasis Botanical Interior",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Botanical Photography Collage */}
      <BotanicalCollage />

      {/* 3. Popular Houseplants Showcase */}
      <PopularPlants />

      {/* 4. Interactive Plant Matchmaker Quiz */}
      <PlantMatchmaker />

      {/* 5. Curated Themed Collections */}
      <CuratedCollections />

      {/* 6. Magazine-Style Plant Care Guides */}
      <PlantCareGuides />

      {/* 7. Collapsible "Grow With Us" Membership with Custom Unordered List */}
      <MembershipAccordion />

      {/* 8. About Blooming Oasis Preview */}
      <AboutPreview />

      {/* 9. Engaging Social Community Feed */}
      <SocialSection />
    </div>
  );
}
