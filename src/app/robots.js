import { siteConfig } from "@/config/site";

// robots.txt: crawl everything public and point to the sitemap. A deploy with
// NEXT_PUBLIC_NOINDEX=true (previews, staging) asks crawlers to stay out.
export default function robots() {
  if (!siteConfig.indexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: "/styleguide" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
