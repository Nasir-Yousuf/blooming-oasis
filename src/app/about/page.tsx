import { Metadata } from "next";
import {
  AboutHero,
  OurStory,
  SustainableSourcing,
  MeetTheTeam,
  BrandValues,
} from "@/components/about/AboutSections";

export const metadata: Metadata = {
  title: "About Us | Blooming Oasis Botanical Living",
  description:
    "Learn about our founders, our passion for living architecture, and our mission to provide sustainably cultivated houseplants that thrive in modern sanctuaries.",
  openGraph: {
    title: "About Blooming Oasis | Rooted in Nature. Made for Living.",
    description:
      "The story, sustainable sourcing ethos, and passionate team behind Blooming Oasis.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Blooming Oasis Greenhouse",
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero */}
      <AboutHero />

      {/* 2. Our Story */}
      <OurStory />

      {/* 3. Sustainable Sourcing & Zero-Plastic Packaging */}
      <SustainableSourcing />

      {/* 4. Meet The Founding Team */}
      <MeetTheTeam />

      {/* 5. Brand Values */}
      <BrandValues />
    </div>
  );
}

