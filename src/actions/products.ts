"use server";

import { db } from "@/lib/db";
import { revalidatePath, unstable_cache, revalidateTag } from "next/cache";
import { formatPrismaProductToPerfume } from "@/lib/products";
import { MOCK_PERFUMES } from "@/lib/mock-perfumes";
import { Perfume } from "@/types/perfume";

export interface GetProductsFilter {
  family?: string;
  concentration?: string;
  search?: string;
  isBestseller?: boolean;
  isNewRelease?: boolean;
  limit?: number;
}

export async function getProducts(filter?: GetProductsFilter): Promise<{ success: boolean; products: Perfume[]; error?: string }> {
  try {
    const fetchCached = unstable_cache(
      async () => {
        const where: any = { isActive: true };

        if (filter?.family && filter.family !== "ALL") {
          where.family = { contains: filter.family, mode: "insensitive" };
        }

        if (filter?.concentration && filter.concentration !== "ALL") {
          where.concentration = { contains: filter.concentration, mode: "insensitive" };
        }

        if (filter?.isBestseller) {
          where.isBestseller = true;
        }

        if (filter?.isNewRelease) {
          where.isNewRelease = true;
        }

        if (filter?.search) {
          where.OR = [
            { name: { contains: filter.search, mode: "insensitive" } },
            { subtitle: { contains: filter.search, mode: "insensitive" } },
            { description: { contains: filter.search, mode: "insensitive" } },
            { family: { contains: filter.search, mode: "insensitive" } },
          ];
        }

        return await db.product.findMany({
          where,
          take: filter?.limit,
          include: {
            variants: true,
            images: { orderBy: { displayOrder: "asc" } },
            notes: { include: { note: true } },
            reviews: true,
          },
          orderBy: { createdAt: "desc" },
        });
      },
      [`products-query-${JSON.stringify(filter || {})}`],
      { revalidate: 3600, tags: ["products"] }
    );

    const rawProducts = await fetchCached();
    const products = rawProducts.map(formatPrismaProductToPerfume);
    return { success: true, products };
  } catch (error: any) {
    console.error("Error fetching products from DB:", error);
    return { success: false, products: [], error: error.message };
  }
}

export async function getProductBySlug(slug: string): Promise<{ success: boolean; product?: Perfume; error?: string }> {
  try {
    const rawProduct = await db.product.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
      include: {
        variants: { orderBy: { volumeMl: "asc" } },
        images: { orderBy: { displayOrder: "asc" } },
        notes: { include: { note: true } },
        reviews: { include: { user: { select: { name: true, image: true } } } },
      },
    });

    if (!rawProduct) {
      return { success: false, error: "Product not found in database" };
    }

    return { success: true, product: formatPrismaProductToPerfume(rawProduct) };
  } catch (error: any) {
    console.error(`Error fetching product ${slug}:`, error);
    return { success: false, error: error.message };
  }
}

export async function createProduct(data: {
  name: string;
  subtitle: string;
  price: number;
  family: string;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
}) {
  try {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();

    const product = await db.product.create({
      data: {
        slug,
        name: data.name,
        subtitle: data.subtitle,
        brand: "PARFUM ATELIER",
        description: "An exquisite artisanal perfume hand-distilled for connoisseurs.",
        story: "Macerated and aged in cold rosewood casks.",
        family: data.family,
        concentration: "Extrait de Parfum (30%)",
        longevity: "12-16 Hours",
        sillage: "Heavy",
        isBestseller: false,
        isNewRelease: true,
        variants: {
          create: [
            { volumeMl: 30, price: Math.round(data.price * 0.7 * 100), sku: `${slug}-30ml`, stockCount: 15 },
            { volumeMl: 50, price: Math.round(data.price * 100), sku: `${slug}-50ml`, stockCount: 20 },
            { volumeMl: 100, price: Math.round(data.price * 1.5 * 100), sku: `${slug}-100ml`, stockCount: 10 },
          ],
        },
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1200&auto=format&fit=crop",
              alt: data.name,
              isPrimary: true,
              displayOrder: 0,
            },
          ],
        },
      },
    });

    revalidatePath("/admin");
    revalidatePath("/products");
    revalidateTag("products", "max-age");
    return { success: true, product: formatPrismaProductToPerfume(product) };
  } catch (error: any) {
    console.error("Error creating product:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(productId: string) {
  try {
    await db.product.deleteMany({
      where: {
        OR: [{ id: productId }, { slug: productId }],
      },
    });

    revalidatePath("/admin");
    revalidatePath("/products");
    revalidateTag("products", "max-age");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return { success: false, error: error.message };
  }
}

