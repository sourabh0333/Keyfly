import { notFound } from "next/navigation";
import { PostArticle } from "@/components/blog/post-article";
import { allPosts, getPost } from "@/content/blog";
import { publicRobots } from "@/config/site";
import { jsonLdHtml, postJsonLd } from "@/lib/structured-data";

// One blog post, built at build time for every post in src/content/blog.js.
// Any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return allPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.seoTitle ?? post.title,
    description: post.dek,
    alternates: { canonical: post.path },
    // A post shares its own cover, not the site's image.
    openGraph: {
      type: "article",
      title: post.title,
      description: post.dek,
      url: post.path,
      publishedTime: post.date.iso,
      section: post.topicLabel,
      images: [{ url: post.cover.poster, alt: post.cover.alt }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.dek, images: [post.cover.poster] },
    robots: publicRobots,
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(postJsonLd(post))} />
      <PostArticle post={post} />
    </>
  );
}
