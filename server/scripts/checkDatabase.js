import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log("=== Database Check ===");

    // Get total properties count
    const totalProperties = await prisma.property.count();
    console.log(`Total properties: ${totalProperties}`);

    // Get properties by type
    const propertiesByType = await prisma.property.groupBy({
      by: ["propertyType"],
      _count: {
        propertyType: true,
      },
    });
    console.log("\nProperties by type:");
    propertiesByType.forEach((item) => {
      console.log(`${item.propertyType}: ${item._count.propertyType}`);
    });

    // Get properties by highlight
    const propertiesByHighlight = await prisma.property.groupBy({
      by: ["highlight"],
      _count: {
        highlight: true,
      },
    });
    console.log("\nProperties by highlight:");
    propertiesByHighlight.forEach((item) => {
      console.log(`${item.highlight || "NULL"}: ${item._count.highlight}`);
    });

    // Get properties by listing type
    const propertiesByListingType = await prisma.property.groupBy({
      by: ["listingType"],
      _count: {
        listingType: true,
      },
    });
    console.log("\nProperties by listing type:");
    propertiesByListingType.forEach((item) => {
      console.log(`${item.listingType}: ${item._count.listingType}`);
    });

    // Check invest category criteria
    const investProperties = await prisma.property.findMany({
      where: {
        isActive: true,
        propertyType: {
          in: ["APARTMENT", "HOUSE", "VILLA", "COMMERCIAL", "PLOT"],
        },
        OR: [
          { highlight: "PREMIUM" },
          { highlight: "FEATURED" },
          { highlight: "TRENDING" },
          { listingType: "LEASE" },
        ],
      },
      select: {
        id: true,
        title: true,
        propertyType: true,
        listingType: true,
        highlight: true,
        price: true,
        isActive: true,
      },
    });

    console.log(`\nInvest category properties: ${investProperties.length}`);
    investProperties.forEach((prop) => {
      console.log(
        `- ${prop.title} (${prop.propertyType}, ${prop.listingType}, ${
          prop.highlight || "no highlight"
        }, ${prop.price})`
      );
    });

    // Check if there are any properties at all
    const allProperties = await prisma.property.findMany({
      select: {
        id: true,
        title: true,
        propertyType: true,
        listingType: true,
        highlight: true,
        price: true,
        isActive: true,
      },
      take: 5,
    });

    console.log(`\nSample properties (first 5):`);
    allProperties.forEach((prop) => {
      console.log(
        `- ${prop.title} (${prop.propertyType}, ${prop.listingType}, ${
          prop.highlight || "no highlight"
        }, ${prop.price})`
      );
    });
  } catch (error) {
    console.error("Error checking database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
