// Server-side function to fetch all properties for sitemap
async function getAllProperties() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    // Skip API call during build if not properly configured or localhost
    if (!baseUrl || baseUrl.includes("localhost")) {
      console.log(
        "Skipping property fetch for sitemap during build (localhost API)"
      );
      return [];
    }

    const response = await fetch(`${baseUrl}/properties/public?limit=1000`, {
      next: { revalidate: 3600 }, // Revalidate every hour
      headers: {
        "User-Agent": "NextJS-Sitemap-Generator",
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch properties for sitemap:", response.status);
      return [];
    }

    const data = await response.json();
    return data.data?.data || [];
  } catch (error) {
    console.error("Error fetching properties for sitemap:", error);
    return [];
  }
}

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://prohousing.com";

  // Fetch all properties
  const properties = await getAllProperties();

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/emi-calculator`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // Property pages (use slug if available, fallback to ID)
  const propertyPages = properties.map((property) => ({
    url: `${baseUrl}/properties/${property.slug || property.id}`,
    lastModified: new Date(property.updatedAt || property.createdAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Property location pages (by city)
  const cities = [...new Set(properties.map((property) => property.city))];
  const cityPages = cities.map((city) => ({
    url: `${baseUrl}/properties?location=${encodeURIComponent(city)}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // Property type pages
  const propertyTypes = [
    ...new Set(properties.map((property) => property.propertyType)),
  ];
  const typePages = propertyTypes.map((type) => ({
    url: `${baseUrl}/properties?type=${encodeURIComponent(type)}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // Listing type pages
  const listingTypes = [
    ...new Set(properties.map((property) => property.listingType)),
  ];
  const listingPages = listingTypes.map((type) => ({
    url: `${baseUrl}/properties?listingType=${encodeURIComponent(type)}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  // Combine all pages
  return [
    ...staticPages,
    ...propertyPages,
    ...cityPages,
    ...typePages,
    ...listingPages,
  ];
}
