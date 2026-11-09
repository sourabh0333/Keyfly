import { allPosts, blogPage } from "@/content/blog";
import { siteConfig } from "@/config/site";

// The blog's RSS feed at /blog/rss.xml, built once at build time.
export const dynamic = "force-static";

const escape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const items = allPosts
    .map((post) => {
      const url = `${siteConfig.url}${post.path}`;
      return `    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escape(post.dek)}</description>
      <category>${escape(post.topicLabel)}</category>
      <pubDate>${new Date(`${post.date.iso}T09:00:00Z`).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(`${siteConfig.name} blog`)}</title>
    <link>${siteConfig.url}/blog</link>
    <description>${escape(blogPage.meta.description)}</description>
    <language>en</language>
    <atom:link href="${siteConfig.url}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
