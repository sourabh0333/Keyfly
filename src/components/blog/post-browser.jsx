"use client";

import { useEffect, useState } from "react";
import { PostCard, PostRow } from "./post-card";
import styles from "./blog.module.css";

const VIEW_KEY = "keyfly-blog-view";

/**
 * Every post, like an editor's media bin: topics to filter by (with
 * counts) and a Grid | List switch. "All posts" leaves out the featured
 * post (it's above); a topic shows every post in it. The chosen view is
 * remembered in this browser.
 */
export function PostBrowser({ posts, topics, featuredSlug, copy }) {
  const [topic, setTopic] = useState("all");
  const [view, setView] = useState("grid");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(VIEW_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restore a saved preference after hydration
      if (saved === "list" || saved === "grid") setView(saved);
    } catch {
      // storage unavailable: keep the grid
    }
  }, []);

  const chooseView = (next) => {
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      // ignore
    }
  };

  const shown = topic === "all" ? posts.filter((p) => p.slug !== featuredSlug) : posts.filter((p) => p.topic === topic);
  // Rows of three; when the last row would be short, the first cards go
  // two to a row instead (5 → 2 + 3, 4 → 2 + 2, 7 → 2 + 2 + 3).
  const rest = shown.length % 3;
  const wide = shown.length > 1 ? (rest === 2 ? 2 : rest === 1 ? 4 : 0) : 0;
  const counts = Object.fromEntries(topics.map((t) => [t.id, posts.filter((p) => p.topic === t.id).length]));
  const options = [{ id: "all", label: copy.all, count: posts.length }, ...topics.map((t) => ({ ...t, count: counts[t.id] }))];

  return (
    <div className={styles.browser}>
      <div className={styles.toolbar}>
        <div className={styles.topics} role="group" aria-label={copy.topicsLabel}>
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              className={styles.topicChip}
              aria-pressed={topic === o.id}
              onClick={() => setTopic(o.id)}
            >
              {o.label}
              <span>{o.count}</span>
            </button>
          ))}
        </div>

        <div className={styles.views} role="group" aria-label={copy.view.label}>
          <button
            type="button"
            className={styles.viewButton}
            aria-pressed={view === "grid"}
            onClick={() => chooseView("grid")}
            title={copy.view.grid}
          >
            <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
              <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.2" />
              <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.2" />
              <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.2" />
              <rect x="9" y="9" width="5.5" height="5.5" rx="1.2" />
            </svg>
            <span>{copy.view.grid}</span>
          </button>
          <button
            type="button"
            className={styles.viewButton}
            aria-pressed={view === "list"}
            onClick={() => chooseView("list")}
            title={copy.view.list}
          >
            <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
              <rect x="1.5" y="2.5" width="4" height="3" rx="0.8" />
              <rect x="1.5" y="10.5" width="4" height="3" rx="0.8" />
              <path d="M8 4h6.5M8 12h6.5" />
            </svg>
            <span>{copy.view.list}</span>
          </button>
        </div>
      </div>

      <p className={styles.srOnly} aria-live="polite">
        {shown.length} {shown.length === 1 ? "post" : "posts"}
      </p>

      {shown.length === 0 ? (
        <p className={styles.empty}>{copy.empty}</p>
      ) : view === "grid" ? (
        <div className={styles.grid} key={`g-${topic}`}>
          {shown.map((post, i) => (
            <div key={post.slug} className={styles.cell} data-wide={i < wide || undefined} style={{ "--i": i }}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.list} key={`l-${topic}`}>
          <div className={styles.listHead} aria-hidden="true">
            <span />
            <span>{copy.columns.title}</span>
            <span>{copy.columns.topic}</span>
            <span>{copy.columns.length}</span>
            <span>{copy.columns.date}</span>
          </div>
          <ul>
            {shown.map((post) => (
              <PostRow key={post.slug} post={post} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
