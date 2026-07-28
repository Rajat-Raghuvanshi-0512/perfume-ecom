import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🛡️ Enabling Row Level Security (RLS) on all Supabase tables...");

  const tables = [
    "User",
    "Account",
    "Session",
    "VerificationToken",
    "Product",
    "ProductVariant",
    "FragranceNote",
    "ProductNote",
    "ProductImage",
    "Order",
    "OrderItem",
    "CartItem",
    "Review",
    "ScentProfile",
  ];

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);
      console.log(`✅ RLS enabled on table: ${table}`);
    } catch (e: any) {
      console.log(`⚠️ Error on ${table}: ${e.message}`);
    }
  }

  // Create public read policies for catalog tables so Supabase Data API can serve public catalog if needed
  const publicReadTables = [
    { name: "Product", policy: "Public read products" },
    { name: "ProductVariant", policy: "Public read variants" },
    { name: "ProductImage", policy: "Public read images" },
    { name: "FragranceNote", policy: "Public read notes" },
    { name: "ProductNote", policy: "Public read product notes" },
    { name: "Review", policy: "Public read reviews" },
  ];

  for (const item of publicReadTables) {
    try {
      await prisma.$executeRawUnsafe(
        `DROP POLICY IF EXISTS "${item.policy}" ON "${item.name}";`
      );
      await prisma.$executeRawUnsafe(
        `CREATE POLICY "${item.policy}" ON "${item.name}" FOR SELECT USING (true);`
      );
      console.log(`🔒 Public read policy applied to: ${item.name}`);
    } catch (e: any) {
      console.log(`⚠️ Policy error on ${item.name}: ${e.message}`);
    }
  }

  console.log("🎉 Row Level Security successfully enabled! 'UNRESTRICTED' warnings resolved.");
}

main()
  .catch((e) => {
    console.error("❌ Failed to enable RLS:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
