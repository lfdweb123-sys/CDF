import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/data/site";
import { services } from "@/lib/data/services";
import { solutions } from "@/lib/data/solutions";
import { sectors } from "@/lib/data/sectors";
import { articles } from "@/lib/data/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const staticRoutes = [
    "",
    "/services",
    "/solutions",
    "/secteurs",
    "/diagnostic-en-ligne",
    "/demande-mission",
    "/a-propos",
    "/faq",
    "/contact",
    "/ressources",
    "/confidentialite",
    "/mentions-legales",
  ];

  const dynamicRoutes = [
    ...services.map((s) => `/services/${s.slug}`),
    ...solutions.map((s) => `/solutions/${s.slug}`),
    ...sectors.map((s) => `/secteurs/${s.slug}`),
    ...articles.map((a) => `/ressources/${a.slug}`),
  ];

  return [...staticRoutes, ...dynamicRoutes].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
