import { publicPages, siteConfig } from "@/config/site";

// sitemap.xml: the public pages. Legal pages stay out until their text is
// final (they are noindex), and the styleguide is development only.
export default function sitemap() {
  return publicPages.map((path) => ({
    url: path === "/" ? siteConfig.url : `${siteConfig.url}${path}`,
    changeFrequency: path === "/pricing" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
