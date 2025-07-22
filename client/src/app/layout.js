import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ToastProvider from "@/components/providers/toast-provider";
import ConditionalLayout from "@/components/ConditionalLayout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://prohousing.com"
  ),
  title: {
    default: "Pro Housing - Premium Real Estate Platform",
    template: "%s | Pro Housing",
  },
  description:
    "Find your dream property with Pro Housing - the premium real estate platform offering luxury homes, apartments, and commercial properties with verified listings and expert guidance.",
  keywords: [
    "real estate",
    "property",
    "buy house",
    "rent apartment",
    "commercial property",
    "luxury homes",
    "Pro Housing",
    "property listing",
    "real estate agent",
    "house for sale",
    "apartment for rent",
  ].join(", "),
  authors: [{ name: "Pro Housing", url: process.env.NEXT_PUBLIC_SITE_URL }],
  creator: "Pro Housing",
  publisher: "Pro Housing",
  category: "Real Estate",
  classification: "Real Estate Platform",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://prohousing.com",
    siteName: "Pro Housing",
    title: "Pro Housing - Premium Real Estate Platform",
    description:
      "Find your dream property with Pro Housing - the premium real estate platform offering luxury homes, apartments, and commercial properties.",
    images: [
      {
        url: "/main.jpg",
        width: 1200,
        height: 630,
        alt: "Pro Housing - Premium Real Estate Platform",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pro Housing - Premium Real Estate Platform",
    description:
      "Find your dream property with Pro Housing - the premium real estate platform.",
    creator: "@prohousing",
    site: "@prohousing",
    images: ["/main.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://prohousing.com",
    languages: {
      "en-IN": process.env.NEXT_PUBLIC_SITE_URL || "https://prohousing.com",
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
  other: {
    "msapplication-TileColor": "#5E4CBB",
    "theme-color": "#5E4CBB",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#5E4CBB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <AuthProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
          <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
