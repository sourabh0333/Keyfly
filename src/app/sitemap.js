import { publicPages, siteConfig } from "@/config/site";
import { categories } from "@/content/use-cases";
import { legal } from "@/content/legal";

// sitemap.xml, served at /sitemap.xml and named in robots.txt.
//
// Built to Google's guidance (developers.google.com/search/docs/crawling-
// indexing/sitemaps/build-sitemap):
// - Only the canonical URLs of indexable pages, absolute, exactly as each
//   page's canonical tag gives them. Terms and Privacy stay out while they
//   are drafts (noindex); the styleguide is development only.
// - lastmod from each page's `updated` date in src/config/site.js, which
//   changes only when the page really changes (Google ignores a lastmod it
//   can't trust).
// - No changefreq or priority: Google ignores both.
// - An image sitemap for Use cases: a still of each of the 91 templates,
//   recorded from the KeyFly app itself, so Google Images can find them.
//   The reels elsewhere are illustrative stock footage, so they're left out,
//   and there is no video sitemap: Google indexes a video only where it is
//   the page's main content, which none of these pages is.
// An empty list when the site isn't indexable (previews and staging).

const absolute = (path) => (path === "/" ? siteConfig.url : `${siteConfig.url}${path}`);

// Each template's still, once (some templates sit in two places).
const templateStills = [
  ...new Set(categories.flatMap((c) => c.templates.map((t) => `${siteConfig.url}${t.clip}.webp`))),
];

const images = { "/use-cases": templateStills };

export default function sitemap() {
  if (!siteConfig.indexable) return [];

  // Terms and Privacy join once they're approved (`draft: false`).
  const legalPages = [legal.terms, legal.privacy]
    .filter((p) => !p.draft)
    .map((p) => ({ path: p.path, updated: p.updated.iso }));

  return [...publicPages, ...legalPages].map(({ path, updated }) => ({
    url: absolute(path),
    lastModified: updated,
    ...(images[path] ? { images: images[path] } : {}),
  }));
}
