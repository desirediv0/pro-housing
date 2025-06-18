import PropertiesPageClient from "./PropertiesPageClient";

// Generate metadata for properties page
export const metadata = {
  title: "Properties for Sale & Rent | Pro Housing - Premium Real Estate",
  description:
    "Browse premium properties for sale and rent. Find apartments, houses, villas, and commercial properties in top locations. Verified listings with detailed information and high-quality images.",
  keywords: [
    "properties for sale",
    "properties for rent",
    "real estate",
    "apartments",
    "houses",
    "villas",
    "commercial properties",
    "buy property",
    "rent property",
    "Pro Housing",
    "premium real estate",
    "property listing",
  ].join(", "),
  authors: [{ name: "Pro Housing" }],
  category: "Real Estate",
  openGraph: {
    title: "Properties for Sale & Rent | Pro Housing",
    description:
      "Browse premium properties for sale and rent. Find your dream home or investment property with Pro Housing.",
    type: "website",
    locale: "en_IN",
    siteName: "Pro Housing",
    url: `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://prohousing.com"
    }/properties`,
    images: [
      {
        url: `${
          process.env.NEXT_PUBLIC_SITE_URL || "https://prohousing.com"
        }/main.jpg`,
        width: 1200,
        height: 630,
        alt: "Pro Housing Properties",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Properties for Sale & Rent | Pro Housing",
    description:
      "Browse premium properties for sale and rent. Find your dream home or investment property.",
    creator: "@prohousing",
    site: "@prohousing",
    images: [
      `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://prohousing.com"
      }/main.jpg`,
    ],
  },
  alternates: {
    canonical: `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://prohousing.com"
    }/properties`,
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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// Server component that renders the client component
export default function PropertiesPage({ searchParams }) {
  return <PropertiesPageClient searchParams={searchParams} />;
}
