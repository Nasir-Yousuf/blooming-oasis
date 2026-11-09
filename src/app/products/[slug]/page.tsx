import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDbProductBySlug, getDbProducts } from "@/lib/data-access";
import { MonsteraDetail } from "@/components/products/MonsteraDetail";
import { MonsteraGrowthVideo } from "@/components/products/MonsteraGrowthVideo";
import { PlantParentTips } from "@/components/products/PlantParentTips";
import { PlantCard } from "@/components/shared/PlantCard";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getDbProductBySlug(slug, true);
    if (!product) {
      return { title: "Product Not Found | Blooming Oasis" };
    }

    return {
      title: `${product.name} | Blooming Oasis Botanical Store`,
      description: product.tagline || product.description,
      openGraph: {
        title: `${product.name} - ${product.botanicalName}`,
        description: product.tagline,
        images: [
          {
            url: product.images[0] || "",
            width: 800,
            height: 1000,
            alt: product.name,
          },
        ],
      },
    };
  } catch {
    return { title: "Plant Details | Blooming Oasis" };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let product = null;
  let related = [];

  try {
    product = await getDbProductBySlug(slug, true);
    if (!product) {
      notFound();
    }

    // Related plants from MongoDB
    const allCategoryPlants = await getDbProducts({
      published: true,
      category: product.category,
    });
    related = allCategoryPlants.filter((p) => p.slug !== slug).slice(0, 4);

    if (related.length === 0) {
      const generalPlants = await getDbProducts({ published: true });
      related = generalPlants.filter((p) => p.slug !== slug).slice(0, 4);
    }
  } catch (err) {
    console.error("Product detail load error:", err);
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Main Product Showcase & Specifications */}
      <MonsteraDetail product={product as any} />

      {/* 2. Botanical Growth Showcase */}
      <MonsteraGrowthVideo />

      {/* 3. Community Plant Parent Tips & Story Submission */}
      <PlantParentTips />

      {/* 4. Related Botanical Companions */}
      {related.length > 0 && (
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
                <PlantCard key={relPlant.slug} product={relPlant as any} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
