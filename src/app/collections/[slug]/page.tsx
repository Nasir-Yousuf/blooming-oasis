import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CURATED_COLLECTIONS, INITIAL_PRODUCTS } from "@/data/initialProducts";
import { PlantCard } from "@/components/shared/PlantCard";
import { ArrowLeft, Sparkles } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CURATED_COLLECTIONS.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = CURATED_COLLECTIONS.find((c) => c.slug === slug);
  if (!collection) return { title: "Collection Not Found | Blooming Oasis" };

  return {
    title: `${collection.title} | Blooming Oasis Curated Edit`,
    description: collection.description,
  };
}

export default async function CollectionDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = CURATED_COLLECTIONS.find((c) => c.slug === slug);

  if (!collection) {
    notFound();
  }

  const matchingPlants = INITIAL_PRODUCTS.filter(collection.filterRule);

  return (
    <div className="bg-offwhite min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/#collections"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-botanical hover:text-forest uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Collections
          </Link>
        </div>

        {/* Hero Header */}
        <div className="relative rounded-3xl overflow-hidden bg-forest text-offwhite p-8 sm:p-14 mb-14 shadow-card">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-light text-sage text-xs font-semibold uppercase tracking-wider mb-4 border border-sage/30">
              <Sparkles className="w-3.5 h-3.5" />
              Themed Edit • {collection.subtitle}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-offwhite leading-tight mb-4">
              {collection.title}
            </h1>
            <p className="text-sm sm:text-base text-cream/90 leading-relaxed font-light">
              {collection.description}
            </p>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 hidden md:block">
            <Image
              src={collection.image}
              alt={collection.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/80 to-transparent" />
          </div>
        </div>

        {/* Matching Plants Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-sage/20">
            <h2 className="font-serif text-2xl font-bold text-forest">
              Plants in This Edit ({matchingPlants.length})
            </h2>
            <Link
              href="/products"
              className="text-xs font-semibold text-botanical hover:text-forest uppercase tracking-wider"
            >
              View Full Catalog →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {matchingPlants.map((plant) => (
              <PlantCard key={plant.slug} product={plant} />
            ))}
          </div>
        </div>

        {/* Other Curated Collections Navigation */}
        <div className="pt-12 border-t border-sage/20">
          <h3 className="font-serif text-xl font-bold text-forest mb-6">
            Explore Other Themed Edits
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {CURATED_COLLECTIONS.filter((c) => c.slug !== slug).map((c) => (
              <Link
                key={c.slug}
                href={`/collections/${c.slug}`}
                className="p-5 rounded-2xl bg-cream/60 hover:bg-cream border border-sage/30 hover:border-forest transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-botanical block mb-1">
                    {c.subtitle}
                  </span>
                  <h4 className="font-serif font-bold text-forest text-base">
                    {c.title}
                  </h4>
                </div>
                <span className="text-xs font-semibold text-botanical mt-4 block">
                  View Edit →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

