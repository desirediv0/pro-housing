export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/admin/*",
          "/api/",
          "/api/*",
          "/_next/",
          "/_next/*",
          "/temp/",
          "/temp/*",
          "/private/",
          "/private/*",
        ],
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "ChatGPT-User",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "anthropic-ai",
        disallow: "/",
      },
    ],
    sitemap: `${
      process.env.NEXT_PUBLIC_SITE_URL || "https://prohousing.com"
    }/sitemap.xml`,
    host: process.env.NEXT_PUBLIC_SITE_URL || "https://prohousing.com",
  };
}
