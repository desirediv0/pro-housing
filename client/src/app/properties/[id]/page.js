import { Suspense } from "react";
import { notFound } from "next/navigation";
import PropertyDetailClient from "./PropertyDetailClient";

// Server-side function to fetch property data
async function getProperty(id) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    // Try fetching by slug first, then by ID
    let response = await fetch(`${baseUrl}/properties/public/slug/${id}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    // If slug fetch fails, try ID
    if (!response.ok) {
      response = await fetch(`${baseUrl}/properties/public/${id}`, {
        next: { revalidate: 60 },
      });
    }

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching property:", error);
    return null;
  }
}

// Server-side function to fetch sidebar content
async function getSidebarContent() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${baseUrl}/sidebar/public`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return Array.isArray(data.data) ? data.data : [];
  } catch (error) {
    console.error("Error fetching sidebar content:", error);
    return [];
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
  const property = await getProperty(params.id);

  if (!property) {
    return {
      title: "Property Not Found | Pro Housing",
      description: "The requested property could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${property.title} | Pro Housing`;
  const description = `${property.description?.substring(
    0,
    155
  )}... Located in ${property.address}, ${
    property.city
  }. Price: ₹${new Intl.NumberFormat("en-IN").format(property.price)}. ${
    property.bedrooms ? `${property.bedrooms} BHK` : ""
  } ${property.propertyType} for ${property.listingType}.`;

  const images = [];
  if (property.mainImage) {
    images.push({
      url: property.mainImage,
      width: 1200,
      height: 630,
      alt: property.title,
    });
  }

  return {
    title,
    description,
    keywords: [
      property.title,
      property.city,
      property.locality,
      property.state,
      property.propertyType,
      property.listingType,
      "real estate",
      "property",
      "housing",
      "buy property",
      "rent property",
      "Pro Housing",
    ]
      .filter(Boolean)
      .join(", "),
    authors: [{ name: "Pro Housing" }],
    category: "Real Estate",
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_IN",
      siteName: "Pro Housing",
      images,
      url: `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://prohousing.com"
      }/properties/${params.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
      creator: "@prohousing",
      site: "@prohousing",
    },
    alternates: {
      canonical: `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://prohousing.com"
      }/properties/${params.id}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_VERIFICATION,
    },
  };
}

// Generate static params for build optimization (optional)
export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${baseUrl}/properties/public?limit=100`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const properties = data.data?.data || [];

    return properties.map((property) => ({
      id: property.id.toString(),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Generate structured data (JSON-LD) for SEO
function generateStructuredData(property) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://prohousing.com"
    }/properties/${property.id}`,
    image: property.mainImage ? [property.mainImage] : [],
    datePosted: property.createdAt,
    dateModified: property.updatedAt || property.createdAt,
    mainEntity: {
      "@type":
        property.propertyType === "Commercial"
          ? "CommercialRealEstate"
          : "House",
      name: property.title,
      description: property.description,
      address: {
        "@type": "PostalAddress",
        streetAddress: property.address,
        addressLocality: property.city,
        addressRegion: property.state,
        postalCode: property.pincode,
        addressCountry: "IN",
      },
      geo:
        property.latitude && property.longitude
          ? {
              "@type": "GeoCoordinates",
              latitude: property.latitude,
              longitude: property.longitude,
            }
          : undefined,
      numberOfRooms: property.bedrooms,
      numberOfBathroomsTotal: property.bathrooms,
      floorSize: property.area
        ? {
            "@type": "QuantitativeValue",
            value: property.area,
            unitCode: "FTK",
          }
        : undefined,
      yearBuilt: property.builtYear,
      amenityFeature: [],
    },
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "INR",
      availability:
        property.status === "AVAILABLE"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 90 days from now
      seller: {
        "@type": "Organization",
        name: "Pro Housing",
      },
    },
    provider: {
      "@type": "Organization",
      name: "Pro Housing",
      url: process.env.NEXT_PUBLIC_SITE_URL || "https://prohousing.com",
    },
  };

  // Add amenities to structured data
  const amenities = [];
  const amenityMapping = {
    furnished: "Furnished",
    parking: "Parking",
    balcony: "Balcony",
    garden: "Garden",
    swimming: "Swimming Pool",
    gym: "Gym",
    security: "24/7 Security",
    elevator: "Elevator",
    powerBackup: "Power Backup",
  };

  Object.entries(amenityMapping).forEach(([key, label]) => {
    if (property[key]) {
      amenities.push({
        "@type": "LocationFeatureSpecification",
        name: label,
        value: true,
      });
    }
  });

  // Add custom amenities
  if (property.customAmenities) {
    try {
      const customAmenities = JSON.parse(property.customAmenities);
      customAmenities.forEach((amenity) => {
        amenities.push({
          "@type": "LocationFeatureSpecification",
          name: amenity,
          value: true,
        });
      });
    } catch (error) {
      console.error("Error parsing custom amenities:", error);
    }
  }

  structuredData.mainEntity.amenityFeature = amenities;

  // Remove undefined fields
  return JSON.parse(JSON.stringify(structuredData));
}

// Loading component
function PropertyLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-white to-primary/5 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
        <p className="text-text-secondary">Loading property details...</p>
      </div>
    </div>
  );
}

// Main server component
export default async function PropertyDetail({ params }) {
  const [property, sidebarContent] = await Promise.all([
    getProperty(params.id),
    getSidebarContent(),
  ]);

  if (!property) {
    notFound();
  }

  const structuredData = generateStructuredData(property);

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <Suspense fallback={<PropertyLoading />}>
        <PropertyDetailClient
          property={property}
          sidebarContent={sidebarContent}
        />
      </Suspense>
    </>
  );
}
