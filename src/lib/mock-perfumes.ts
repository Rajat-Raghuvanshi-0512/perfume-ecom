import { Perfume } from "@/types/perfume";

export const MOCK_PERFUMES: Perfume[] = [
  {
    id: "oud-royal-extrait",
    name: "Oud Impérial Extrait",
    subtitle: "Sacred Cambodian Oud & Smoked Amber",
    brand: "MAISON DE AURA",
    price: 24500,
    volumes: [
      { ml: 30, price: 16500 },
      { ml: 50, price: 24500 },
      { ml: 100, price: 36000 },
    ],
    rating: 4.9,
    reviewsCount: 128,
    family: "Oriental & Amber",
    concentration: "Extrait de Parfum (30%)",
    description: "An opulent, magnetic nectar distilled from rare aged Cambodian Oud wood, enveloped in velvety Madagascan vanilla and smoldering frankincense.",
    story: "Crafted in small batch copper stills in Grasse, Oud Impérial captures the moonlit aura of ancient royal sanctuaries. A fragrance of undeniable majesty and deep warmth.",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1200&auto=format&fit=crop"
    ],
    pyramid: {
      top: ["Italian Bergamot", "Saffron Threads", "Cardamom Seed"],
      heart: ["Damask Rose Absolu", "Smoked Incense", "Cashmere Wood"],
      base: ["Cambodian Oud", "Black Amber", "Madagascan Vanilla", "Wild Leather"]
    },
    longevity: "Eternal (18+ Hrs)",
    sillage: "Enormous",
    season: ["Autumn", "Winter"],
    vibe: ["Regal", "Sensual", "Mysterious"],
    isBestseller: true,
    isLimitedEdition: true,
    inStock: true,
    stockCount: 14
  },
  {
    id: "velvet-rose-noir",
    name: "Velvet Rose & Smoked Iris",
    subtitle: "Midnight Damascena & Smoked Vetiver",
    brand: "MAISON DE AURA",
    price: 18500,
    volumes: [
      { ml: 30, price: 12500 },
      { ml: 50, price: 18500 },
      { ml: 100, price: 27000 }
    ],
    rating: 4.8,
    reviewsCount: 94,
    family: "Floral & Botanical",
    concentration: "Eau de Parfum (20%)",
    description: "A dark romantic bouquet featuring rare midnight-harvested Damask Rose petals dipped in black plum liqueur and velvet iris root.",
    story: "Harvested at 4 AM before dawn breaks over the rose fields of Grasse, preserving the nocturnal dew and heady intoxicating fragrance.",
    images: [
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=1200&auto=format&fit=crop"
    ],
    pyramid: {
      top: ["Black Plum Liqueur", "Pink Peppercorn", "Mandarin Zest"],
      heart: ["Midnight Damask Rose", "Florentine Iris Orris", "Jasmine Sambac"],
      base: ["Haitian Vetiver", "Golden Amber", "White Musk", "Cedarwood"]
    },
    longevity: "12-16 Hours",
    sillage: "Heavy",
    season: ["Autumn", "Winter", "Spring"],
    vibe: ["Romantic", "Sophisticated", "Alluring"],
    isBestseller: true,
    inStock: true,
    stockCount: 22
  },
  {
    id: "soleil-de-santale",
    name: "Soleil de Santal",
    subtitle: "Mysore Sandalwood & Solar Bergamot",
    brand: "MAISON DE AURA",
    price: 16500,
    volumes: [
      { ml: 30, price: 11000 },
      { ml: 50, price: 16500 },
      { ml: 100, price: 24000 }
    ],
    rating: 4.9,
    reviewsCount: 162,
    family: "Woody & Warm",
    concentration: "Eau de Parfum (20%)",
    description: "Creamy sustainable Mysore Sandalwood kissed by Mediterranean sunlit bergamot, coconut water, and warm cedarwood.",
    story: "An homage to golden hour on the French Riviera. Clean, luminous, effortlessly refined.",
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1200&auto=format&fit=crop"
    ],
    pyramid: {
      top: ["Calabrian Bergamot", "Violet Leaf", "Coconut Water"],
      heart: ["Australian Sandalwood", "Cardamom", "Fig Bark"],
      base: ["Mysore Sandalwood", "Virginia Cedar", "Clean Musk", "Tonka Bean"]
    },
    longevity: "8-12 Hours",
    sillage: "Moderate",
    season: ["Spring", "Summer", "Autumn"],
    vibe: ["Clean", "Warm", "Luminous"],
    isBestseller: true,
    inStock: true,
    stockCount: 38
  },
  {
    id: "fleur-de-cythere",
    name: "Fleur de Cythère",
    subtitle: "Neroli Elixir & Crisp Sea Salt",
    brand: "MAISON DE AURA",
    price: 14900,
    volumes: [
      { ml: 30, price: 9800 },
      { ml: 50, price: 14900 },
      { ml: 100, price: 21500 }
    ],
    rating: 4.7,
    reviewsCount: 76,
    family: "Fresh & Citrus",
    concentration: "Eau de Parfum (20%)",
    description: "Sun-drenched Tunisian Neroli and orange blossom bathed in coastal Mediterranean breezes, crisp sea salt, and white amber.",
    story: "Capturing the serene feeling of a private villa overlooking turquoise sea cliffs in early summer.",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop"
    ],
    pyramid: {
      top: ["Tunisian Neroli", "Sun-ripened Lemon", "Crisp Sea Salt"],
      heart: ["Moroccan Orange Blossom", "Petitgrain", "White Tea"],
      base: ["Sun-baked Amber", "Driftwood", "Solar Musk"]
    },
    longevity: "6-8 Hours",
    sillage: "Moderate",
    season: ["Spring", "Summer"],
    vibe: ["Fresh", "Elevating", "Effortless"],
    isNewRelease: true,
    inStock: true,
    stockCount: 19
  },
  {
    id: "vanille-cuir-smokey",
    name: "Vanille & Cuir Obscur",
    subtitle: "Smoked Bourbon Vanilla & Raw Saddle Leather",
    brand: "MAISON DE AURA",
    price: 21000,
    volumes: [
      { ml: 30, price: 14500 },
      { ml: 50, price: 21000 },
      { ml: 100, price: 31000 }
    ],
    rating: 4.95,
    reviewsCount: 210,
    family: "Gourmand & Sweet",
    concentration: "Extrait de Parfum (30%)",
    description: "An irresistible intoxicating blend of dark roasted bourbon vanilla bean, worn leather jacket, tonka, and roasted cocoa shell.",
    story: "Sensual and hypnotic. Designed for late nights in intimate jazz lounges and velvet-lined dimly lit sanctuaries.",
    images: [
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1200&auto=format&fit=crop"
    ],
    pyramid: {
      top: ["Bourbon Rum", "Dark Cocoa Shell", "Toasted Almond"],
      heart: ["Smoked Leather", "Madagascan Vanilla Bean", "Cinnamon Bark"],
      base: ["Aged Tonka Bean", "Benzoin Resin", "Patchouli Noir", "Cacao Wood"]
    },
    longevity: "Eternal (18+ Hrs)",
    sillage: "Heavy",
    season: ["Autumn", "Winter"],
    vibe: ["Hypnotic", "Cozy", "Addictive"],
    isBestseller: true,
    inStock: true,
    stockCount: 8
  },
  {
    id: "cuir-de-russie",
    name: "Cuir de Russie & Birch Wood",
    subtitle: "Tanned Birch Leather & Wild Tobacco",
    brand: "MAISON DE AURA",
    price: 19500,
    volumes: [
      { ml: 30, price: 13200 },
      { ml: 50, price: 19500 },
      { ml: 100, price: 28500 }
    ],
    rating: 4.85,
    reviewsCount: 52,
    family: "Leather & Smoked",
    concentration: "Eau de Parfum (20%)",
    description: "A bold, avant-garde fragrance with notes of imperial Russian leather boots, charred birch wood, and Havana tobacco leaves.",
    story: "Inspired by vintage leather trunks and secret library archives.",
    images: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1200&auto=format&fit=crop"
    ],
    pyramid: {
      top: ["Dry Birch Tar", "Bergamot", "Black Pepper"],
      heart: ["Russian Leather", "Cigar Tobacco", "Styrax"],
      base: ["Cade Wood", "Oakmoss", "Labdanum", "Castoreum Accord"]
    },
    longevity: "12-16 Hours",
    sillage: "Heavy",
    season: ["Autumn", "Winter"],
    vibe: ["Bold", "Avant-garde", "Distinguished"],
    isLimitedEdition: true,
    inStock: true,
    stockCount: 11
  }
];

export const MOCK_REVIEWS = [
  {
    id: "r1",
    author: "Genevieve De Vance",
    rating: 5,
    date: "2 days ago",
    comment: "Oud Impérial is absolute perfection. I get complimented everywhere I go. The longevity is incredible—I could still smell it on my cashmere sweater 2 days later!",
    verifiedPurchase: true
  },
  {
    id: "r2",
    author: "Julian Thorne",
    rating: 5,
    date: "1 week ago",
    comment: "Soleil de Santal is the cleanest, most luxurious sandalwood scent I have ever owned. Smells like a 5-star hotel in St. Tropez.",
    verifiedPurchase: true
  },
  {
    id: "r3",
    author: "Claire Sterling",
    rating: 5,
    date: "2 weeks ago",
    comment: "The packaging alone is work of art. Opening the velvet box was an experience in itself. 10/10!",
    verifiedPurchase: true
  }
];
