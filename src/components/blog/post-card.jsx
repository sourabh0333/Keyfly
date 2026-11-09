import Link from "next/link";
import { CoverVideo } from "./cover-video";
import styles from "./post-card.module.css";

/** A read time as a timecode: 6 minutes → "06:00". */
export function readTimecode(minutes) {
  return `${String(minutes).padStart(2, "0")}:00`;
}

/**
 * A post in the grid: its cover as a clip in the bin (the reel plays while
 * a mouse rests on it), the topic and read time on the frame, then the
 * date, title and dek.
 */
export function PostCard({ post, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  return (
    <article className={styles.card} data-cover-host>
      <Link href={post.path} className={styles.link}>
        <span className={styles.thumb}>
          <CoverVideo cover={post.cover} mode="hover" className={styles.video} />
          <span className={styles.topic}>{post.topicLabel}</span>
          <span className={styles.duration}>
            <i aria-hidden="true" />
            {readTimecode(post.minutes)}
          </span>
        </span>
        <span className={styles.meta}>
          <time dateTime={post.date.iso}>{post.date.text}</time>
          <span aria-hidden="true">·</span>
          <span>{post.minutes} min read</span>
        </span>
        <Heading className={styles.title}>{post.title}</Heading>
        <span className={styles.dek}>{post.dek}</span>
        <span className={styles.more} aria-hidden="true">
          Read →
        </span>
      </Link>
    </article>
  );
}

/**
 * A post in the list view: a row like a media browser's, with a thumbnail,
 * the title and dek, then the topic, read time and date in columns.
 */
export function PostRow({ post }) {
  return (
    <li className={styles.row} data-cover-host>
      <Link href={post.path} className={styles.rowLink}>
        <span className={styles.rowThumb}>
          <CoverVideo cover={post.cover} mode="hover" className={styles.video} />
        </span>
        <span className={styles.rowMain}>
          <strong>{post.title}</strong>
          <span>{post.dek}</span>
        </span>
        <span className={styles.rowTopic}>{post.topicLabel}</span>
        <span className={styles.rowTime}>{readTimecode(post.minutes)}</span>
        <time className={styles.rowDate} dateTime={post.date.iso}>
          {post.date.text}
        </time>
      </Link>
    </li>
  );
}
