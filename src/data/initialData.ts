export interface InitialCategory {
  name: string;
  slug: string;
  description: string;
  image: string;
  displayOrder: number;
  active: boolean;
}

export const INITIAL_CATEGORIES: InitialCategory[] = [
  {
    name: "Tropical",
    slug: "tropical",
    description: "Exotic lush foliage adapted for humid, luminous modern rooms.",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80",
    displayOrder: 1,
    active: true,
  },
  {
    name: "Foliage",
    slug: "foliage",
    description: "Architectural leaves, rhythmic variegations, and air-purifying icons.",
    image: "https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?auto=format&fit=crop&w=600&q=80",
    displayOrder: 2,
    active: true,
  },
  {
    name: "Trees",
    slug: "trees",
    description: "Towering indoor floor trees that command living room presence.",
    image: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80",
    displayOrder: 3,
    active: true,
  },
  {
    name: "Flowering",
    slug: "flowering",
    description: "Serene blooming plants that signal seasonal shifts and freshness.",
    image: "https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=600&q=80",
    displayOrder: 4,
    active: true,
  },
  {
    name: "Ferns",
    slug: "ferns",
    description: "Feather-light cascading fronds, natural bathroom and humidity lovers.",
    image: "https://images.unsplash.com/photo-1599685315640-9ceab2f58944?auto=format&fit=crop&w=600&q=80",
    displayOrder: 5,
    active: true,
  },
  {
    name: "Succulent",
    slug: "succulent",
    description: "Drought-resilient miniature sculptures for desks and sunny ledges.",
    image: "https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?auto=format&fit=crop&w=600&q=80",
    displayOrder: 6,
    active: true,
  },
];

export const INITIAL_COUPONS = [
  {
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 40,
    maxDiscount: 25,
    usageLimit: 500,
    usageCount: 14,
    expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    active: true,
  },
  {
    code: "BLOOM15",
    discountType: "percentage",
    discountValue: 15,
    minOrderAmount: 75,
    maxDiscount: 50,
    usageLimit: 200,
    usageCount: 42,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    active: true,
  },
  {
    code: "GREEN20",
    discountType: "fixed",
    discountValue: 20,
    minOrderAmount: 100,
    maxDiscount: 20,
    usageLimit: 100,
    usageCount: 8,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    active: true,
  },
];

