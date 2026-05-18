import type { MetadataRoute } from "next";
import { TEMPLATES } from "@/lib/templates";

const BASE = "https://zefaf.online";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/templates`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/dashboard`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];
  const templatePages: MetadataRoute.Sitemap = TEMPLATES.map((t) => ({
    url: `${BASE}/templates/${t.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  return [...staticPages, ...templatePages];
}
