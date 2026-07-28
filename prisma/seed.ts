import { PrismaClient, FragranceCategory, Role } from "@prisma/client";
import { MOCK_PERFUMES } from "../src/lib/mock-perfumes";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Database Seeding...");

  // 1. Create Default Admin User
  const adminPassword = await bcrypt.hash("Admin@Perfume2026", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@maisondeaura.com" },
    update: {},
    create: {
      name: "Maison Admin",
      email: "admin@maisondeaura.com",
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log(`✅ Admin user seeded: ${adminUser.email}`);

  // 2. Create Default Customer User
  const customerPassword = await bcrypt.hash("Customer@123", 10);
  const customerUser = await prisma.user.upsert({
    where: { email: "collector@perfume.com" },
    update: {},
    create: {
      name: "Alexander Vance",
      email: "collector@perfume.com",
      passwordHash: customerPassword,
      role: Role.CUSTOMER,
    },
  });
  console.log(`✅ Customer user seeded: ${customerUser.email}`);

  // 3. Seed Products & Variants
  for (const mock of MOCK_PERFUMES) {
    const product = await prisma.product.upsert({
      where: { slug: mock.id },
      update: {
        name: mock.name,
        subtitle: mock.subtitle,
        brand: mock.brand,
        description: mock.description,
        story: mock.story,
        family: mock.family,
        concentration: mock.concentration,
        longevity: mock.longevity,
        sillage: mock.sillage,
        isBestseller: mock.isBestseller ?? false,
        isNewRelease: mock.isNewRelease ?? false,
        isLimitedEdition: mock.isLimitedEdition ?? false,
      },
      create: {
        slug: mock.id,
        name: mock.name,
        subtitle: mock.subtitle,
        brand: mock.brand,
        description: mock.description,
        story: mock.story,
        family: mock.family,
        concentration: mock.concentration,
        longevity: mock.longevity,
        sillage: mock.sillage,
        isBestseller: mock.isBestseller ?? false,
        isNewRelease: mock.isNewRelease ?? false,
        isLimitedEdition: mock.isLimitedEdition ?? false,
      },
    });

    // Seed Variants
    for (const vol of mock.volumes) {
      const sku = `${mock.id}-${vol.ml}ml`;
      await prisma.productVariant.upsert({
        where: { sku },
        update: {
          price: Math.round(vol.price * 100), // stored in cents/paise
          stockCount: mock.stockCount ?? 20,
          inStock: mock.inStock,
        },
        create: {
          productId: product.id,
          volumeMl: vol.ml,
          price: Math.round(vol.price * 100),
          sku,
          stockCount: mock.stockCount ?? 20,
          inStock: mock.inStock,
        },
      });
    }

    // Seed Images
    for (let i = 0; i < mock.images.length; i++) {
      const url = mock.images[i];
      await prisma.productImage.deleteMany({
        where: { productId: product.id, url },
      });

      await prisma.productImage.create({
        data: {
          productId: product.id,
          url,
          alt: `${mock.name} bottle image ${i + 1}`,
          isPrimary: i === 0,
          displayOrder: i,
        },
      });
    }

    // Seed Notes (Top, Heart, Base)
    const noteCategories: { list: string[]; category: FragranceCategory }[] = [
      { list: mock.pyramid.top, category: FragranceCategory.TOP },
      { list: mock.pyramid.heart, category: FragranceCategory.HEART },
      { list: mock.pyramid.base, category: FragranceCategory.BASE },
    ];

    for (const catGroup of noteCategories) {
      for (const noteName of catGroup.list) {
        const note = await prisma.fragranceNote.upsert({
          where: { name: noteName },
          update: { category: catGroup.category },
          create: {
            name: noteName,
            category: catGroup.category,
          },
        });

        await prisma.productNote.upsert({
          where: {
            productId_noteId: {
              productId: product.id,
              noteId: note.id,
            },
          },
          update: {},
          create: {
            productId: product.id,
            noteId: note.id,
          },
        });
      }
    }

    console.log(`📦 Seeded product: ${product.name}`);
  }

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
