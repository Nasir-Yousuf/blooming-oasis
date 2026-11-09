export interface ProductData {
  _id?: string;
  name: string;
  slug: string;
  botanicalName: string;
  tagline: string;
  description: string;
  price: number;
  images: string[];
  category: "Tropical" | "Succulent" | "Foliage" | "Flowering" | "Ferns" | "Trees";
  sunlight: "Low light" | "Indirect sunlight" | "Bright indirect sunlight" | "Direct sunlight";
  watering: "Low maintenance" | "Weekly care" | "I enjoy regular plant care";
  humidity: "Normal (40-50%)" | "High (60%+)" | "Tolerates dry air";
  difficulty: "Beginner" | "Intermediate" | "Experienced";
  toxicity: string;
  petFriendly: boolean;
  growthRate: "Slow" | "Moderate" | "Fast";
  repottingFrequency: string;
  sizes: {
    name: "Small" | "Medium" | "Large";
    priceModifier: number;
    height: string;
  }[];
  accessories: {
    id: string;
    name: string;
    price: number;
    description: string;
    image?: string;
  }[];
  stock: number;
  featured: boolean;
  rating: number;
  reviewsCount: number;
  tags: string[];
}

export const INITIAL_PRODUCTS: ProductData[] = [
  {
    name: "Monstera Deliciosa",
    slug: "monstera-deliciosa",
    botanicalName: "Monstera deliciosa Liebm.",
    tagline: "The iconic Swiss Cheese Plant with striking fenestrated foliage",
    description:
      "Celebrated for its dramatic natural leaf perforations and sculptural grandeur, the Monstera Deliciosa instantly brings tropical architectural elegance to any modern living room or sunlit sanctuary. Known as the Swiss Cheese Plant, it thrives in warm, humid spaces with gentle indirect sunlight.",
    price: 68,
    images: [
      "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617173944883-6ffbd35d584d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1525498128493-380d1990a112?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1597055181300-e3633a917c9c?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Tropical",
    sunlight: "Bright indirect sunlight",
    watering: "Weekly care",
    humidity: "High (60%+)",
    difficulty: "Beginner",
    toxicity: "Mildly toxic to cats and dogs if ingested (contains calcium oxalate crystals). Keep elevated away from curious pets.",
    petFriendly: false,
    growthRate: "Fast",
    repottingFrequency: "Every 1-2 years in spring",
    sizes: [
      { name: "Small", priceModifier: 0, height: "14-18 inches tall (6\" nursery pot)" },
      { name: "Medium", priceModifier: 24, height: "24-30 inches tall (8\" nursery pot)" },
      { name: "Large", priceModifier: 55, height: "36-44 inches tall (10\" architectural pot)" },
    ],
    accessories: [
      {
        id: "ceramic-pot",
        name: "Handcrafted Artisan Ceramic Pot (Sage Green)",
        price: 34,
        description: "Minimalist stoneware with drainage hole and glazed matching drip saucer.",
      },
      {
        id: "wooden-stand",
        name: "Mid-Century Walnut Plant Stand",
        price: 38,
        description: "Sustainably harvested solid hardwood stand elevated for optimal air circulation.",
      },
    ],
    stock: 28,
    featured: true,
    rating: 4.9,
    reviewsCount: 142,
    tags: ["popular", "statement", "tropical", "monstera"],
  },
  {
    name: "Snake Plant Laurentii",
    slug: "snake-plant-laurentii",
    botanicalName: "Dracaena trifasciata",
    tagline: "Virtually indestructible architectural greenery with air-purifying prowess",
    description:
      "With erect, sword-like variegated leaves bordered in golden yellow, the Snake Plant Laurentii is universally heralded as the ultimate low-maintenance companion. Endures dim corners, infrequent watering, and actively filters indoor airborne toxins throughout the night.",
    price: 45,
    images: [
      "https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Foliage",
    sunlight: "Low light",
    watering: "Low maintenance",
    humidity: "Tolerates dry air",
    difficulty: "Beginner",
    toxicity: "Mildly toxic to pets due to saponins. Best placed on consoles or tables.",
    petFriendly: false,
    growthRate: "Slow",
    repottingFrequency: "Every 2-3 years",
    sizes: [
      { name: "Small", priceModifier: 0, height: "12-16 inches tall" },
      { name: "Medium", priceModifier: 18, height: "20-26 inches tall" },
      { name: "Large", priceModifier: 42, height: "32-38 inches tall" },
    ],
    accessories: [
      {
        id: "ceramic-pot",
        name: "Matte Terracotta Cylinder Pot",
        price: 28,
        description: "Earthy porous terracotta promoting healthy root drying cycles.",
      },
      {
        id: "wooden-stand",
        name: "Natural Oak Low Stand",
        price: 32,
        description: "Handcrafted natural oak riser with rubber protective feet.",
      },
    ],
    stock: 40,
    featured: true,
    rating: 4.8,
    reviewsCount: 96,
    tags: ["beginner", "low-light", "air-purifying"],
  },
  {
    name: "Fiddle Leaf Fig",
    slug: "fiddle-leaf-fig",
    botanicalName: "Ficus lyrata",
    tagline: "The designer's favorite statement tree with broad violin-shaped leaves",
    description:
      "The undisputed crown jewel of modern interior design. Featuring gigantic, heavily veined leathery foliage that commands attention. Prefers consistent bright indirect light, stable temperatures, and routine gentle dust-wiping to keep its glossy leaves photosynthesizing happily.",
    price: 89,
    images: [
      "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Trees",
    sunlight: "Bright indirect sunlight",
    watering: "Weekly care",
    humidity: "High (60%+)",
    difficulty: "Intermediate",
    toxicity: "Toxic to cats and dogs if chewed. Keep away from curious pets.",
    petFriendly: false,
    growthRate: "Moderate",
    repottingFrequency: "Every 2 years",
    sizes: [
      { name: "Small", priceModifier: 0, height: "24-30 inches tall" },
      { name: "Medium", priceModifier: 35, height: "36-48 inches tall" },
      { name: "Large", priceModifier: 80, height: "55-65 inches mature tree" },
    ],
    accessories: [
      {
        id: "ceramic-pot",
        name: "Off-White Fluted Planter",
        price: 48,
        description: "Substantial architectural ceramic pot tailored for tall tree stability.",
      },
      {
        id: "wooden-stand",
        name: "Mid-Century Walnut Plant Stand",
        price: 38,
        description: "Reinforced walnut cross-stand tested for heavy mature planters.",
      },
    ],
    stock: 19,
    featured: true,
    rating: 4.7,
    reviewsCount: 78,
    tags: ["statement", "trees", "editorial"],
  },
  {
    name: "Peace Lily 'Sensation'",
    slug: "peace-lily",
    botanicalName: "Spathiphyllum wallisii",
    tagline: "Graceful snow-white blooms that purify indoor air and communicate thirst",
    description:
      "A serene botanical classic featuring deep emerald ribbed leaves accented by pure white spathes. Peace Lilies are famous for gently nodding when thirsty and bouncing back within hours of watering, making them wonderful intuitive companions for indoor tranquility.",
    price: 42,
    images: [
      "https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Flowering",
    sunlight: "Indirect sunlight",
    watering: "Weekly care",
    humidity: "High (60%+)",
    difficulty: "Beginner",
    toxicity: "Contains insoluble calcium oxalates. Mild irritation if ingested by cats or dogs.",
    petFriendly: false,
    growthRate: "Moderate",
    repottingFrequency: "Every 1-2 years",
    sizes: [
      { name: "Small", priceModifier: 0, height: "14-18 inches tall" },
      { name: "Medium", priceModifier: 16, height: "22-28 inches tall" },
      { name: "Large", priceModifier: 38, height: "32-40 inches specimen" },
    ],
    accessories: [
      {
        id: "ceramic-pot",
        name: "Glossy Forest Green Ceramic",
        price: 26,
        description: "Rich enamel glazed vessel that complements white spathes.",
      },
    ],
    stock: 25,
    featured: true,
    rating: 4.8,
    reviewsCount: 64,
    tags: ["air-purifying", "flowering", "beginner"],
  },
  {
    name: "Golden Pothos Hanging Vine",
    slug: "golden-pothos",
    botanicalName: "Epipremnum aureum",
    tagline: "Cascading golden-marbled vines that thrive in almost any room condition",
    description:
      "The undisputed champion of easy indoor greenery. Heart-shaped leaves splashed with sunny gold cascade effortlessly over bookshelves, plant hangers, and mantels. Prunes easily and propagates readily in water.",
    price: 32,
    images: [
      "https://images.unsplash.com/photo-1596724817757-5e93345d3cf6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Foliage",
    sunlight: "Indirect sunlight",
    watering: "Low maintenance",
    humidity: "Normal (40-50%)",
    difficulty: "Beginner",
    toxicity: "Mildly toxic to pets if chewed. Hanging placement keeps pets safely out of reach.",
    petFriendly: false,
    growthRate: "Fast",
    repottingFrequency: "Every 2 years",
    sizes: [
      { name: "Small", priceModifier: 0, height: "Trailing 12-16 inches" },
      { name: "Medium", priceModifier: 12, height: "Trailing 24-36 inches" },
      { name: "Large", priceModifier: 28, height: "Extensive trail 48+ inches" },
    ],
    accessories: [
      {
        id: "macrame-hanger",
        name: "Organic Cotton Macramé Hanger",
        price: 22,
        description: "Hand-knotted unbleached natural cotton rope hanger with brass ring.",
      },
    ],
    stock: 50,
    featured: true,
    rating: 4.9,
    reviewsCount: 112,
    tags: ["beginner", "hanging", "trailing"],
  },
  {
    name: "Raven ZZ Plant",
    slug: "zz-plant",
    botanicalName: "Zamioculcas zamiifolia",
    tagline: "Glossy, sculpted foliage emerging vibrant green before turning deep obsidian",
    description:
      "A botanical marvel of resilience and dramatic contemporary aesthetics. Thick rhizomes store water reserves beneath the soil, making it virtually drought-proof. Flourishes in low-light office corners and bright indirect spaces alike.",
    price: 52,
    images: [
      "https://images.unsplash.com/photo-1632207691143-643e2a9a9361?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Foliage",
    sunlight: "Low light",
    watering: "Low maintenance",
    humidity: "Tolerates dry air",
    difficulty: "Beginner",
    toxicity: "Contains calcium oxalates. Safe to admire, but keep away from pets and toddlers.",
    petFriendly: false,
    growthRate: "Slow",
    repottingFrequency: "Every 2-3 years",
    sizes: [
      { name: "Small", priceModifier: 0, height: "14-18 inches tall" },
      { name: "Medium", priceModifier: 20, height: "22-28 inches tall" },
      { name: "Large", priceModifier: 45, height: "30-36 inches bushy" },
    ],
    accessories: [
      {
        id: "ceramic-pot",
        name: "Matte Charcoal Architectural Planter",
        price: 32,
        description: "Contemporary dark charcoal vessel accentuating obsidian foliage.",
      },
    ],
    stock: 33,
    featured: true,
    rating: 4.9,
    reviewsCount: 89,
    tags: ["low-light", "sculptural", "beginner"],
  },
  {
    name: "Calathea Orbifolia",
    slug: "calathea-orbifolia",
    botanicalName: "Goeppertia orbifolia",
    tagline: "Opulent oversized leaves with rhythmic silver-striped brushstrokes",
    description:
      "A prized prayer plant known for moving its giant striped leaves toward the heavens at dusk. Completely non-toxic and pet-friendly, making it the perfect botanical centerpiece for animal lovers who refuse to compromise on high-fashion foliage.",
    price: 58,
    images: [
      "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Tropical",
    sunlight: "Indirect sunlight",
    watering: "Weekly care",
    humidity: "High (60%+)",
    difficulty: "Intermediate",
    toxicity: "100% Non-toxic to cats and dogs (ASPCA Certified Pet-Safe).",
    petFriendly: true,
    growthRate: "Moderate",
    repottingFrequency: "Every 1-2 years",
    sizes: [
      { name: "Small", priceModifier: 0, height: "12-16 inches tall" },
      { name: "Medium", priceModifier: 22, height: "18-24 inches tall" },
      { name: "Large", priceModifier: 48, height: "26-32 inches full spread" },
    ],
    accessories: [
      {
        id: "ceramic-pot",
        name: "Warm Cream Stone Planter",
        price: 30,
        description: "Textured sandy stoneware creating soft contrast with orbicular leaves.",
      },
    ],
    stock: 22,
    featured: true,
    rating: 4.7,
    reviewsCount: 45,
    tags: ["pet-friendly", "prayer-plant", "statement"],
  },
  {
    name: "Boston Fern 'Nephrolepis'",
    slug: "boston-fern",
    botanicalName: "Nephrolepis exaltata",
    tagline: "Lush fountain of feather-light fronds, celebrated natural humidifier",
    description:
      "A classic Victorian parlor darling that thrives on bathroom steam and bright indirect misting. Certified 100% pet-safe, it gently cools indoor spaces and adds rich texture to pedestal displays and hanging planters.",
    price: 38,
    images: [
      "https://images.unsplash.com/photo-1599685315640-9ceab2f58944?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Ferns",
    sunlight: "Indirect sunlight",
    watering: "I enjoy regular plant care",
    humidity: "High (60%+)",
    difficulty: "Intermediate",
    toxicity: "100% Non-toxic and safe for all dogs and cats.",
    petFriendly: true,
    growthRate: "Fast",
    repottingFrequency: "Every spring",
    sizes: [
      { name: "Small", priceModifier: 0, height: "14-18 inches spread" },
      { name: "Medium", priceModifier: 14, height: "22-26 inches spread" },
      { name: "Large", priceModifier: 30, height: "30-36 inches dramatic cascade" },
    ],
    accessories: [
      {
        id: "macrame-hanger",
        name: "Artisan Macramé Fern Hanger",
        price: 24,
        description: "Triple-twist woven hanger engineered to cradle lush ferns securely.",
      },
    ],
    stock: 27,
    featured: true,
    rating: 4.8,
    reviewsCount: 52,
    tags: ["pet-friendly", "hanging", "bathroom"],
  },
  {
    name: "Majesty Palm",
    slug: "majesty-palm",
    botanicalName: "Ravenea rivularis",
    tagline: "Sweeping tropical palm fronds transforming urban interiors into sunlit retreats",
    description:
      "Standing tall with graceful arching fronds, the Majesty Palm brings effortless resort serenity to any well-lit living room. Non-toxic to household animals and a natural indoor air humidifier.",
    price: 76,
    images: [
      "https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Trees",
    sunlight: "Bright indirect sunlight",
    watering: "Weekly care",
    humidity: "High (60%+)",
    difficulty: "Intermediate",
    toxicity: "100% Non-toxic to cats and dogs.",
    petFriendly: true,
    growthRate: "Moderate",
    repottingFrequency: "Every 2-3 years",
    sizes: [
      { name: "Small", priceModifier: 0, height: "30-36 inches tall" },
      { name: "Medium", priceModifier: 30, height: "42-50 inches tall" },
      { name: "Large", priceModifier: 70, height: "58-68 inches statement tree" },
    ],
    accessories: [
      {
        id: "wooden-stand",
        name: "Solid Teak Stool Riser",
        price: 45,
        description: "Naturally moisture-resistant teak stand designed for statement palms.",
      },
    ],
    stock: 16,
    featured: false,
    rating: 4.6,
    reviewsCount: 38,
    tags: ["pet-friendly", "statement", "tropical"],
  },
  {
    name: "Peperomia Watermelon",
    slug: "peperomia-watermelon",
    botanicalName: "Peperomia argyreia",
    tagline: "Compact, succulent leaves resembling miniature watermelon rinds",
    description:
      "Irresistibly charming with peltate silver-and-green striped foliage supported by burgundy stems. Remains compact and desktop-friendly, demanding very little fuss while being completely pet-friendly.",
    price: 28,
    images: [
      "https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Succulent",
    sunlight: "Indirect sunlight",
    watering: "Weekly care",
    humidity: "Normal (40-50%)",
    difficulty: "Beginner",
    toxicity: "100% Pet-friendly and safe around curiosity-prone pets.",
    petFriendly: true,
    growthRate: "Moderate",
    repottingFrequency: "Every 2 years",
    sizes: [
      { name: "Small", priceModifier: 0, height: "6-8 inches desktop" },
      { name: "Medium", priceModifier: 10, height: "10-14 inches bushy" },
      { name: "Large", priceModifier: 22, height: "14-18 inches mature" },
    ],
    accessories: [
      {
        id: "ceramic-pot",
        name: "Terracotta Dish Planter",
        price: 18,
        description: "Low-profile rustic pot ideal for compact Peperomia roots.",
      },
    ],
    stock: 35,
    featured: false,
    rating: 4.9,
    reviewsCount: 61,
    tags: ["pet-friendly", "beginner", "compact"],
  },
  {
    name: "Rubber Tree Burgundy",
    slug: "rubber-tree-burgundy",
    botanicalName: "Ficus elastica 'Decora'",
    tagline: "Bold architectural leaves in opulent deep bronze and burgundy hues",
    description:
      "With thick, glossy oval leaves that shine like polished leather, the Burgundy Rubber Tree provides dramatic contrast against neutral cream and sage walls. Resilient and adaptable to various indoor lighting scenarios.",
    price: 64,
    images: [
      "https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Trees",
    sunlight: "Bright indirect sunlight",
    watering: "Weekly care",
    humidity: "Normal (40-50%)",
    difficulty: "Beginner",
    toxicity: "Contains milky latex sap that may irritate pets if chewed.",
    petFriendly: false,
    growthRate: "Moderate",
    repottingFrequency: "Every 2 years",
    sizes: [
      { name: "Small", priceModifier: 0, height: "16-22 inches tall" },
      { name: "Medium", priceModifier: 26, height: "28-36 inches tall" },
      { name: "Large", priceModifier: 60, height: "45-55 inches specimen" },
    ],
    accessories: [
      {
        id: "ceramic-pot",
        name: "Matte Sage Stoneware",
        price: 34,
        description: "Earthy sage ceramic pot contrasting with burgundy leaves.",
      },
      {
        id: "wooden-stand",
        name: "Mid-Century Walnut Plant Stand",
        price: 38,
        description: "Classic solid wood elevated stand.",
      },
    ],
    stock: 24,
    featured: false,
    rating: 4.8,
    reviewsCount: 47,
    tags: ["statement", "trees", "foliage"],
  },
  {
    name: "Bird of Paradise",
    slug: "bird-of-paradise",
    botanicalName: "Strelitzia nicolai",
    tagline: "Grand, majestic banana-like foliage evoking endless summer ease",
    description:
      "A quintessential tropical showstopper. Broad, paddle-like leaves split naturally along lateral veins to withstand breezes and bring vibrant architectural luxury into expansive light-filled spaces.",
    price: 95,
    images: [
      "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Tropical",
    sunlight: "Direct sunlight",
    watering: "I enjoy regular plant care",
    humidity: "High (60%+)",
    difficulty: "Experienced",
    toxicity: "Mildly toxic to pets if leaves or flowers are eaten.",
    petFriendly: false,
    growthRate: "Fast",
    repottingFrequency: "Every 1-2 years",
    sizes: [
      { name: "Small", priceModifier: 0, height: "24-32 inches tall" },
      { name: "Medium", priceModifier: 38, height: "38-50 inches tall" },
      { name: "Large", priceModifier: 95, height: "60-72 inches grand specimen" },
    ],
    accessories: [
      {
        id: "ceramic-pot",
        name: "Extra Large Hand-Thrown Planter",
        price: 58,
        description: "Heavyweight stoneware vessel providing grounding balance for tall leaves.",
      },
    ],
    stock: 14,
    featured: false,
    rating: 4.9,
    reviewsCount: 73,
    tags: ["statement", "tropical", "sun-lover"],
  },
];

export interface CuratedCollection {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  filterRule: (product: ProductData) => boolean;
  plantCount: number;
}

export const CURATED_COLLECTIONS: CuratedCollection[] = [
  {
    slug: "beginners-garden",
    title: "The Beginner's Garden",
    subtitle: "Forgiving & Hardy Companions",
    description:
      "Resilient, forgiving indoor plants engineered by nature to flourish even if you occasionally forget watering day.",
    image: "https://images.unsplash.com/photo-1593482892290-f54927ae1bf6?auto=format&fit=crop&w=800&q=80",
    filterRule: (p) => p.difficulty === "Beginner",
    plantCount: 6,
  },
  {
    slug: "pet-friendly-paradise",
    title: "Pet-Friendly Paradise",
    subtitle: "100% Non-Toxic Greenery",
    description:
      "Lush, sculptural houseplants certified safe for curious cats and playful dogs, with zero compromises on interior elegance.",
    image: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=800&q=80",
    filterRule: (p) => p.petFriendly === true,
    plantCount: 4,
  },
  {
    slug: "low-light-lovers",
    title: "Low-Light Lovers",
    subtitle: "Thriving in Ambient Glow",
    description:
      "Shade-tolerant botanical wonders tailored for north-facing apartments, cozy bedrooms, and home office nooks.",
    image: "https://images.unsplash.com/photo-1632207691143-643e2a9a9361?auto=format&fit=crop&w=800&q=80",
    filterRule: (p) => p.sunlight === "Low light" || p.sunlight === "Indirect sunlight",
    plantCount: 5,
  },
  {
    slug: "statement-plants",
    title: "Statement Plants",
    subtitle: "Architectural Showstoppers",
    description:
      "Large-scale foliage and floor trees that command attention and anchor living spaces with living grandeur.",
    image: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80",
    filterRule: (p) => p.tags.includes("statement") || p.price >= 65,
    plantCount: 4,
  },
  {
    slug: "air-purifying-edit",
    title: "The Air-Purifying Edit",
    subtitle: "Natural Living Air Filters",
    description:
      "Selected plants known for actively filtering indoor airborne impurities, producing fresh oxygen, and balancing humidity.",
    image: "https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=800&q=80",
    filterRule: (p) => p.tags.includes("air-purifying") || p.category === "Tropical",
    plantCount: 5,
  },
];

export interface CareArticle {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  image: string;
  author: string;
  date: string;
  keyTakeaways: string[];
}

export const CARE_ARTICLES: CareArticle[] = [
  {
    slug: "how-to-keep-your-monstera-thriving",
    title: "How to Keep Your Monstera Thriving Through Every Season",
    category: "Care Guide",
    readTime: "5 min read",
    summary:
      "From mastering indirect sunlight to guiding aerial roots with moss poles, discover the proven secrets to lush fenestrations and vibrant new growth.",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80",
    author: "Elena Vance, Lead Botanist",
    date: "November 2026",
    keyTakeaways: [
      "Position near an east or filtered south window for maximum hole development.",
      "Allow the top 2 inches of potting soil to dry between waterings.",
      "Gently guide aerial roots into the soil or wrap them around a coco-coir pole.",
    ],
  },
  {
    slug: "ultimate-beginners-guide-to-indoor-plants",
    title: "The Ultimate Beginner's Guide to Living with Indoor Plants",
    category: "Foundations",
    readTime: "7 min read",
    summary:
      "Avoid the dreaded overwatering cycle. Learn to read leaf signals, choose foolproof starters, and curate a serene green environment effortlessly.",
    image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80",
    author: "Julian Chen, Plant Architect",
    date: "October 2026",
    keyTakeaways: [
      "Drainage is non-negotiable: always use pots with drainage holes.",
      "Most indoor plant fatalities stem from too much love (overwatering) rather than drought.",
      "Start with Snake Plants or ZZ Plants to build intuitive care rhythms.",
    ],
  },
  {
    slug: "understanding-sunlight-for-houseplants",
    title: "Decoding Light: Low Light vs Indirect Sunlight Explained",
    category: "Lighting Masterclass",
    readTime: "4 min read",
    summary:
      "How to read shadows in your apartment to pinpoint optimal locations for every species, from sun-drenched sills to moody corners.",
    image: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80",
    author: "Elena Vance, Lead Botanist",
    date: "September 2026",
    keyTakeaways: [
      "Direct light casts a crisp, hard-edged shadow; bright indirect light casts a soft-edged shadow.",
      "Low light does not mean no light: all green plants require photons to survive.",
      "Rotate plants 90 degrees every week for uniform, symmetrical growth.",
    ],
  },
  {
    slug: "common-plant-care-mistakes",
    title: "5 Common Plant Care Mistakes (And How to Fix Them in 48 Hours)",
    category: "Troubleshooting",
    readTime: "6 min read",
    summary:
      "Yellowing leaves? Crispy brown edges? Fungus gnats? Here is your rapid-response diagnostic checklist to nurse struggling plants back to health.",
    image: "https://images.unsplash.com/photo-1596724817757-5e93345d3cf6?auto=format&fit=crop&w=800&q=80",
    author: "Marcus Thorne, Nursery Director",
    date: "August 2026",
    keyTakeaways: [
      "Yellow soft leaves indicate soggy roots; yellow crispy tips indicate low humidity or tap water minerals.",
      "Never repot a sick plant into a massive pot; excess damp soil accelerates root rot.",
      "Wiping leaves removes dust film that blocks up to 30% of usable light.",
    ],
  },
];

export interface InitialPlantTip {
  authorName: string;
  plantName: string;
  content: string;
  imageUrl?: string;
  likes: number;
  timeAgo: string;
}

export const INITIAL_PLANT_TIPS: InitialPlantTip[] = [
  {
    authorName: "Sarah M.",
    plantName: "Monstera Deliciosa",
    content:
      "I started misting the aerial roots and tucking them directly into the soil. Within three weeks, my Monstera popped out two huge new leaves with double fenestrations! Also, wiping leaves with a damp microfiber cloth made a massive difference.",
    imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80",
    likes: 42,
    timeAgo: "2 days ago",
  },
  {
    authorName: "David K.",
    plantName: "Fiddle Leaf Fig",
    content:
      "Whatever you do, do NOT move your Fiddle Leaf Fig once you find its happy spot! Mine dropped three leaves when I shifted it across the room. I moved it back near the east window and it immediately stabilized.",
    imageUrl: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80",
    likes: 38,
    timeAgo: "5 days ago",
  },
  {
    authorName: "Amara L.",
    plantName: "Calathea Orbifolia",
    content:
      "Calatheas hate hard tap water salts! Switched to distilled water and placed a pebble tray underneath. The crispy brown edges completely stopped forming. Worth the extra care because the silver leaves are stunning.",
    imageUrl: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=600&q=80",
    likes: 29,
    timeAgo: "1 week ago",
  },
];

