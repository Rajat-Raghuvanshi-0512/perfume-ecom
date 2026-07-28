import { Perfume, FragranceFamily, Concentration } from "@/types/perfume";

export function formatPrismaProductToPerfume(p: any): Perfume {
  if (!p) throw new Error("Invalid product data");

  const volumes = (p.variants && p.variants.length > 0)
    ? p.variants.map((v: any) => ({
        ml: v.volumeMl,
        price: v.price > 100000 ? Math.round(v.price / 100) : (v.price > 1000 ? v.price : Math.round(v.price * 100)),
      }))
    : [{ ml: 30, price: 16500 }, { ml: 50, price: 24500 }, { ml: 100, price: 34000 }];

  const basePrice = volumes.find((v: any) => v.ml === 50)?.price || volumes[0]?.price || 24500;

  const images = (p.images && p.images.length > 0)
    ? p.images.map((img: any) => img.url)
    : ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop"];

  const topNotes: string[] = [];
  const heartNotes: string[] = [];
  const baseNotes: string[] = [];

  if (p.notes && Array.isArray(p.notes)) {
    p.notes.forEach((pn: any) => {
      const cat = pn.note?.category;
      const name = pn.note?.name || pn.name;
      if (!name) return;
      if (cat === "TOP") topNotes.push(name);
      else if (cat === "HEART") heartNotes.push(name);
      else if (cat === "BASE") baseNotes.push(name);
      else topNotes.push(name);
    });
  }

  const reviewsCount = p.reviews ? p.reviews.length : 12;
  const rating = p.reviews && p.reviews.length > 0
    ? Number((p.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / p.reviews.length).toFixed(1))
    : 4.9;

  return {
    id: p.slug || p.id,
    name: p.name,
    subtitle: p.subtitle || "Artisanal Extrait de Parfum",
    brand: p.brand || "PARFUM ATELIER",
    price: basePrice,
    volumes,
    rating,
    reviewsCount,
    family: (p.family || "Woody & Warm") as FragranceFamily,
    concentration: (p.concentration || "Extrait de Parfum (30%)") as Concentration,
    description: p.description || "",
    story: p.story || "Distilled in small batches in Grasse, France.",
    images,
    pyramid: {
      top: topNotes.length > 0 ? topNotes : ["Bergamot", "Pink Pepper"],
      heart: heartNotes.length > 0 ? heartNotes : ["Damask Rose", "Jasmine"],
      base: baseNotes.length > 0 ? baseNotes : ["Cambodian Oud", "Amber", "Vanilla"],
    },
    longevity: (p.longevity || "12-16 Hours") as any,
    sillage: (p.sillage || "Heavy") as any,
    season: ["Autumn", "Winter"],
    vibe: ["Regal", "Sensual"],
    isBestseller: Boolean(p.isBestseller),
    isNewRelease: Boolean(p.isNewRelease),
    isLimitedEdition: Boolean(p.isLimitedEdition),
    inStock: p.isActive !== false,
    stockCount: p.variants?.reduce((sum: number, v: any) => sum + (v.stockCount || 0), 0) || 20,
  };
}
