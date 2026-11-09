import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CURATED_COLLECTIONS } from "@/data/initialProducts";
import { PlantCard } from "@/components/shared/PlantCard";
import { ArrowLeft, Sparkles } from "lucide-react";
import { getDbProducts } from "@/lib/data-access";

// Dynamic page so admin additions reflect immediately
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
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

  let matchingPlants: any[] = [];
  try {
    const liveProducts = await getDbProducts({ published: true });
    matchingPlants = liveProducts.filter((p) => collection.filterRule(p as any));
  } catch (err) {
    console.error("Failed to load collection products from DB:", err);
  }

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

          {matchingPlants.length === 0 ? (
            <div className="py-16 text-center text-charcoal/70 bg-cream/40 rounded-3xl border border-sage/30 p-8">
              No houseplants currently match this collection in the live nursery catalog.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {matchingPlants.map((plant) => (
                <PlantCard key={plant.slug} product={plant} />
              ))}
            </div>
          )}
        </div>

        {/* Other Curated Collections Navigation */}
        <div className="border-t border-sage/20 pt-12">
          <h3 className="font-serif text-xl font-bold text-forest mb-6">
            Explore Other Themed Edits
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CURATED_COLLECTIONS.filter((c) => c.slug !== slug)
              .slice(0, 4)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/collections/${c.slug}`}
                  className="p-4 rounded-2xl bg-cream hover:bg-sage/20 transition-all border border-sage/30 flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-[10px] font-semibold text-botanical uppercase tracking-wider block mb-1">
                      {c.subtitle}
                    </span>
                    <h4 className="font-serif font-bold text-forest group-hover:text-botanical transition-colors">
                      {c.title}
                    </h4>
                  </div>
                  <span className="text-xs text-forest/70 mt-3 font-medium">
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
