import { BlogIndex } from "@/components/blog/blog-index";
import { allPosts, blogPage } from "@/content/blog";
import { publicRobots, siteConfig } from "@/config/site";
import { blogJsonLd, jsonLdHtml } from "@/lib/structured-data";

// The blog's index: every post, newest first (src/content/blog.js).
export const metadata = {
  title: blogPage.meta.title,
  description: blogPage.meta.description,
  alternates: {
    canonical: blogPage.path,
    types: { "application/rss+xml": [{ url: "/blog/rss.xml", title: `${siteConfig.name} blog` }] },
  },
  robots: publicRobots,
};

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdHtml(blogJsonLd({ ...blogPage.meta, posts: allPosts }))}
      />
      <BlogIndex />
    </>
  );
}
