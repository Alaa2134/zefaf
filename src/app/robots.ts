import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api/*", "/editor/*", "/checkout/*"],
      },
    ],
    sitemap: "https://zefaf.online/sitemap.xml",
    host: "https://zefaf.online",
  };
}
