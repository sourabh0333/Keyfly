import Link from "next/link";
import { Button } from "@/components/button";
import { allPosts, blogPage, topics } from "@/content/blog";
import { FeaturedViewer } from "./featured-viewer";
import { PostBrowser } from "./post-browser";
import styles from "./blog.module.css";

/**
 * The blog's index: the heading, the newest post "now playing" in a viewer,
 * then every post in a bin with topics and a Grid | List switch.
 */
export function BlogIndex() {
  const [featured] = allPosts;
  const copy = blogPage;

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>
            <span className={styles.light} aria-hidden="true" />
            {copy.eyebrow}
          </p>
          <h1 className={styles.title}>
            {copy.title.map((line) => (
              <span key={line.text} className={line.accent ? styles.accent : styles.plain}>
                {line.text}
              </span>
            ))}
          </h1>
        </div>
        <div className={styles.heroSide}>
          <p className={styles.lead}>{copy.lead}</p>
          <p className={styles.stats}>
            <span>
              <b>{allPosts.length}</b> posts
            </span>
            <span>
              <b>{topics.length}</b> topics
            </span>
            <a href={copy.rss.href} className={styles.rss}>
              <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                <circle cx="3.5" cy="12.5" r="1.6" />
                <path d="M2 7.2a6.8 6.8 0 0 1 6.8 6.8M2 2.5A11.5 11.5 0 0 1 13.5 14" />
              </svg>
              {copy.rss.label}
            </a>
          </p>
        </div>
      </header>

      {featured ? (
        <section className={styles.featured} aria-labelledby="featured-title" data-cover-host>
          <FeaturedViewer post={featured} note={copy.coverNote} />
          <div className={styles.featuredText}>
            <p className={styles.nowPlaying}>
              <i aria-hidden="true" />
              {copy.featuredLabel}
            </p>
            <p className={styles.featuredMeta}>
              <span>{featured.topicLabel}</span>
              <time dateTime={featured.date.iso}>{featured.date.text}</time>
              <span>{featured.minutes} min read</span>
            </p>
            <h2 id="featured-title" className={styles.featuredTitle}>
              <Link href={featured.path}>{featured.title}</Link>
            </h2>
            <p className={styles.featuredDek}>{featured.dek}</p>
            <Button href={featured.path} arrow>
              {copy.read}
            </Button>
          </div>
        </section>
      ) : null}

      <PostBrowser posts={allPosts} topics={topics} featuredSlug={featured?.slug} copy={copy} />
    </div>
  );
}
