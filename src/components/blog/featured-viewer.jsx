"use client";

import { useRef } from "react";
import { CoverVideo } from "./cover-video";
import { readTimecode } from "./post-card";
import styles from "./blog.module.css";

/**
 * The featured post's cover as a viewer: the reel playing while it's on
 * screen, over a player bar whose scrub line follows the video.
 */
export function FeaturedViewer({ post, note }) {
  const bar = useRef(null);
  return (
    <div className={styles.viewer}>
      <div className={styles.screen}>
        <CoverVideo cover={post.cover} mode="view" progressRef={bar} className={styles.screenVideo} />
        <span className={styles.screenNote}>{note}</span>
      </div>
      <div className={styles.player} ref={bar} aria-hidden="true">
        <span className={styles.playGlyph} />
        <span className={styles.scrub}>
          <i />
        </span>
        <span className={styles.playTime}>{readTimecode(post.minutes)} read</span>
      </div>
    </div>
  );
}
