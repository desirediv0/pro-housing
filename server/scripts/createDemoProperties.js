import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const demoProperties = [
  {
    title: "Luxury 3BHK Apartment in Bandra West",
    description:
      "Spacious and modern 3BHK apartment with sea view, premium amenities, and excellent connectivity. Perfect for families looking for luxury living in Mumbai's prime location.",
    price: 15000000,
    propertyType: "APARTMENT",
    listingType: "SALE",
    bedrooms: 3,
    bathrooms: 2,
    area: 1200,
    builtYear: 2020,
    floor: 8,
    totalFloors: 15,
    address: "Carter Road, Bandra West",
    locality: "Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400050",
    furnished: true,
    parking: true,
    balcony: true,
    gym: true,
    security: true,
    elevator: true,
    powerBackup: true,
    status: "AVAILABLE",
    highlight: "FEATURED",
    mainImage: "/placeholder-property.jpg",
    contactName: "Real Estate Expert",
    contactPhone: "+91 98765 43210",
    contactEmail: "contact@prohousing.com",
    slug: "luxury-3bhk-apartment-bandra-west",
  },
  {
    title: "Modern 2BHK House in Pune",
    description:
      "Well-designed 2BHK independent house with garden and parking. Located in a peaceful residential area with all modern amenities nearby.",
    price: 8500000,
    propertyType: "HOUSE",
    listingType: "SALE",
    bedrooms: 2,
    bathrooms: 2,
    area: 900,
    builtYear: 2019,
    floor: 1,
    totalFloors: 2,
    address: "Koregaon Park, Pune",
    locality: "Koregaon Park",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411001",
    furnished: false,
    parking: true,
    balcony: true,
    garden: true,
    security: true,
    powerBackup: true,
    status: "AVAILABLE",
    highlight: "TRENDING",
    mainImage: "/placeholder-property.jpg",
    contactName: "Property Consultant",
    contactPhone: "+91 87654 32109",
    contactEmail: "pune@prohousing.com",
    slug: "modern-2bhk-house-pune",
  },
  {
    title: "Spacious 4BHK Villa in Gurgaon",
    description:
      "Magnificent 4BHK villa with swimming pool, garden, and premium interiors. Located in a gated community with 24/7 security and world-class amenities.",
    price: 45000,
    propertyType: "VILLA",
    listingType: "RENT",
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    builtYear: 2021,
    floor: 1,
    totalFloors: 3,
    address: "DLF Phase 2, Gurgaon",
    locality: "DLF Phase 2",
    city: "Gurgaon",
    state: "Haryana",
    pincode: "122002",
    furnished: true,
    parking: true,
    balcony: true,
    garden: true,
    swimming: true,
    gym: true,
    security: true,
    elevator: true,
    powerBackup: true,
    status: "AVAILABLE",
    highlight: "PREMIUM",
    mainImage: "/placeholder-property.jpg",
    contactName: "Villa Specialist",
    contactPhone: "+91 76543 21098",
    contactEmail: "gurgaon@prohousing.com",
    slug: "spacious-4bhk-villa-gurgaon",
  },
  {
    title: "Commercial Office Space in Bangalore",
    description:
      "Prime commercial office space in the heart of Bangalore's IT corridor. Ideal for startups and established businesses. Modern infrastructure with high-speed connectivity.",
    price: 25000,
    propertyType: "COMMERCIAL",
    listingType: "RENT",
    bedrooms: 0,
    bathrooms: 2,
    area: 800,
    builtYear: 2018,
    floor: 5,
    totalFloors: 12,
    address: "Electronic City, Bangalore",
    locality: "Electronic City",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560100",
    furnished: false,
    parking: true,
    elevator: true,
    security: true,
    powerBackup: true,
    status: "AVAILABLE",
    highlight: "HOT_DEAL",
    mainImage: "/placeholder-property.jpg",
    contactName: "Commercial Expert",
    contactPhone: "+91 65432 10987",
    contactEmail: "bangalore@prohousing.com",
    slug: "commercial-office-space-bangalore",
  },
  {
    title: "1BHK Apartment for Rent in Delhi",
    description:
      "Cozy 1BHK apartment perfect for young professionals. Located near metro station with easy access to major commercial areas and entertainment hubs.",
    price: 18000,
    propertyType: "APARTMENT",
    listingType: "RENT",
    bedrooms: 1,
    bathrooms: 1,
    area: 550,
    builtYear: 2017,
    floor: 3,
    totalFloors: 8,
    address: "Lajpat Nagar, Delhi",
    locality: "Lajpat Nagar",
    city: "Delhi",
    state: "Delhi",
    pincode: "110024",
    furnished: true,
    parking: false,
    balcony: true,
    security: true,
    elevator: true,
    powerBackup: true,
    status: "AVAILABLE",
    highlight: "NEW",
    mainImage: "/placeholder-property.jpg",
    contactName: "Rental Specialist",
    contactPhone: "+91 54321 09876",
    contactEmail: "delhi@prohousing.com",
    slug: "1bhk-apartment-rent-delhi",
  },
];

async function createDemoProperties() {
  try {
    console.log("Creating demo properties...");

    for (const propertyData of demoProperties) {
      // Check if property already exists
      const existing = await prisma.property.findUnique({
        where: { slug: propertyData.slug },
      });

      if (existing) {
        console.log(
          `Property "${propertyData.title}" already exists, skipping...`
        );
        continue;
      }

      const property = await prisma.property.create({
        data: propertyData,
      });

      console.log(`✅ Created: ${property.title}`);
    }

    console.log("\n🎉 Demo properties created successfully!");
    console.log("You can now visit:");
    console.log("🏠 Properties Page: http://localhost:3000/properties");
    console.log("🏆 Featured Properties: http://localhost:3000 (Home page)");
    console.log("🔧 Admin Panel: http://localhost:3000/admin");
  } catch (error) {
    console.error("❌ Error creating demo properties:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoProperties();
