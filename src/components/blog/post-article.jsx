import Link from "next/link";
import { Button } from "@/components/button";
import { InlineText } from "@/components/inline-text";
import { siteConfig } from "@/config/site";
import { blogPage, postPage, relatedPosts } from "@/content/blog";
import { CopyLink } from "./copy-link";
import { CoverVideo } from "./cover-video";
import { PostCard } from "./post-card";
import { ReadingTimeline } from "./reading-timeline";
import styles from "./post.module.css";

const classes = { link: styles.link, code: styles.code };

function Text({ text }) {
  return <InlineText text={text} classes={classes} />;
}

function Block({ block }) {
  if (typeof block === "string") {
    return (
      <p>
        <Text text={block} />
      </p>
    );
  }
  if (block.list) {
    return (
      <ul className={styles.bullets}>
        {block.list.map((item, i) => (
          <li key={i}>
            <Text text={item} />
          </li>
        ))}
      </ul>
    );
  }
  if (block.steps) {
    return (
      <ol className={styles.steps}>
        {block.steps.map(([title, text], i) => (
          <li key={title}>
            <span className={styles.stepKey} aria-hidden="true">
              <i />
              {String(i + 1).padStart(2, "0")}
            </span>
            <strong>
              <Text text={title} />
            </strong>
            <span>
              <Text text={text} />
            </span>
          </li>
        ))}
      </ol>
    );
  }
  if (block.table) {
    return (
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {block.table.head.map((h) => (
                <th key={h} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.table.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c} data-label={block.table.head[c]}>
                    <Text text={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (block.tip) {
    return (
      <aside className={styles.tip}>
        <span className={styles.tipLabel}>
          {/* The brand kit's symbol, unchanged. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/symbol-dark.svg" alt="" width="14" height="14" />
          {postPage.tipLabel}
        </span>
        <p>
          <Text text={block.tip} />
        </p>
      </aside>
    );
  }
  if (block.quote) {
    return (
      <blockquote className={styles.quote}>
        <Text text={block.quote} />
      </blockquote>
    );
  }
  return null;
}

/**
 * A blog post: breadcrumb, title, dek and byline; the cover playing in a
 * viewer; then the text beside its reading timeline; then the call to
 * action and more posts.
 */
export function PostArticle({ post }) {
  const url = `${siteConfig.url}${post.path}`;
  const related = relatedPosts(post);
  const bodyId = "post-body";

  return (
    <article className={styles.page}>
      <header className={styles.head}>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href={blogPage.path}>{postPage.breadcrumb}</Link>
          <span aria-hidden="true">/</span>
          <span>{post.topicLabel}</span>
        </nav>
        <h1 className={styles.title}>{post.title}</h1>
        <p className={styles.dek}>{post.dek}</p>
        <div className={styles.byline}>
          <span className={styles.author}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/symbol-dark.svg" alt="" width="18" height="18" />
            {postPage.by} {post.author.name}
          </span>
          <time dateTime={post.date.iso}>{post.date.text}</time>
          <span>
            {post.minutes} {postPage.minRead}
          </span>
          <CopyLink url={url} copy={postPage.share} />
        </div>
      </header>

      <figure className={styles.cover}>
        <div className={styles.coverFrame}>
          <CoverVideo cover={post.cover} mode="view" className={styles.coverVideo} />
        </div>
        <figcaption>{blogPage.coverNote}</figcaption>
      </figure>

      <div className={styles.layout}>
        <ReadingTimeline sections={post.sections} minutes={post.minutes} bodyId={bodyId} label={postPage.contents} />

        <div className={styles.body} id={bodyId}>
          {post.sections.map((section) => (
            <section key={section.id} id={section.id} className={styles.section}>
              <h2>
                <a href={`#${section.id}`}>{section.title}</a>
              </h2>
              {section.blocks.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </section>
          ))}
        </div>
      </div>

      <section className={styles.cta} aria-labelledby="post-cta">
        <p className={styles.ctaEyebrow}>{postPage.cta.eyebrow}</p>
        <h2 id="post-cta" className={styles.ctaTitle}>
          {postPage.cta.title.map((line) => (
            <span key={line.text} className={line.accent ? styles.accent : undefined}>
              {line.text}
            </span>
          ))}
        </h2>
        <p className={styles.ctaLine}>{postPage.cta.line}</p>
        <div className={styles.ctaActions}>
          <Button href={postPage.cta.primary.href} arrow>
            {postPage.cta.primary.label}
          </Button>
          <Button href={postPage.cta.secondary.href} variant="ghost">
            {postPage.cta.secondary.label}
          </Button>
        </div>
      </section>

      {related.length ? (
        <section className={styles.related} aria-labelledby="related-title">
          <div className={styles.relatedHead}>
            <h2 id="related-title">{postPage.related}</h2>
            <Link href={postPage.back.href} className={styles.allLink}>
              {postPage.back.label} →
            </Link>
          </div>
          <div className={styles.relatedGrid}>
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
