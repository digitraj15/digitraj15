import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { getAllCaseStudies } from "@/lib/work";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/work`, changeFrequency: "monthly", priority: 0.8 },
    ...getAllCaseStudies().map((w) => ({ url: `${site.url}/work/${w.slug}`, priority: 0.6 })),
  ];
}
