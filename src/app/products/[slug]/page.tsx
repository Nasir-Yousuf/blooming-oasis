import { Metadata } from "next";
import { notFound } from "next/navigation";
import { INITIAL_PRODUCTS } from "@/data/initialProducts";
import { MonsteraDetail } from "@/components/products/MonsteraDetail";
import { MonsteraGrowthVideo } from "@/components/products/MonsteraGrowthVideo";
import { PlantParentTips } from "@/components/products/PlantParentTips";
import { PlantCard } from "@/components/shared/PlantCard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return INITIAL_PRODUCTS.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = INITIAL_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: "Product Not Found | Blooming Oasis",
    };
  }

  return {
    title: `${product.name} | Blooming Oasis Botanical Store`,
    description: product.tagline || product.description,
    openGraph: {
      title: `${product.name} - ${product.botanicalName}`,
      description: product.tagline,
      images: [
        {
          url: product.images[0],
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = INITIAL_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Related plants from same category or popular highlights
  const related = INITIAL_PRODUCTS.filter((p) => p.slug !== slug).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Main Product Showcase & Specifications */}
      <MonsteraDetail product={product} />

      {/* 2. Monstera Growth Video (Showcased prominently for Monstera, or general botanical growth showcase) */}
      <MonsteraGrowthVideo />

      {/* 3. Community Plant Parent Tips & Story Submission */}
      <PlantParentTips />

      {/* 4. Related Botanical Companions */}
      <section className="py-20 sm:py-24 bg-cream/30 border-t border-sage/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-botanical block mb-2">
              Complementary Greenery
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest">
              You May Also Adore
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {related.map((relPlant) => (
              <PlantCard key={relPlant.slug} product={relPlant} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

