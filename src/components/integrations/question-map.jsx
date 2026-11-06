"use client";

import { useLayoutEffect, useRef, useState } from "react";
import styles from "./questions.module.css";

const WIDE = "(min-width: 981px)";
// ↑ for this page, ↗ for email, ↓ for the homepage's sections, → for another page.
const arrow = (href) => (href.startsWith("#") ? "↑" : href.startsWith("mailto:") ? "↗" : href.startsWith("/#") ? "↓" : "→");

/**
 * The questions as a map of three columns, read left to right: the topic,
 * its questions, and the answer, joined by mint wires measured from the
 * layout (topic → question → answer) that draw themselves on each change.
 * Picking a topic picks its first question. Only one topic's questions
 * show at a time, so the three columns stay level and the section stays
 * compact. Nothing changes by itself. On narrow screens the topics become
 * a row of underlined tabs and the answer opens under its question.
 */
export function QuestionMap({ labels, topics, items, help }) {
  const [topic, setTopic] = useState(topics[0].id);
  const [current, setCurrent] = useState(0);
  const [wires, setWires] = useState(null);
  const rootRef = useRef(null);
  const topicRefs = useRef({});
  const qRefs = useRef({});
  const answerRef = useRef(null);

  const list = items.map((it, i) => ({ it, i })).filter(({ it }) => it.topic === topic);
  const item = items[current];

  useLayoutEffect(() => {
    const root = rootRef.current;
    const wide = matchMedia(WIDE);
    const measure = () => {
      if (!wide.matches) return setWires(null);
      const box = root.getBoundingClientRect();
      const t = topicRefs.current[topic]?.getBoundingClientRect();
      const q = qRefs.current[current]?.getBoundingClientRect();
      const a = answerRef.current?.getBoundingClientRect();
      if (!t || !q || !a) return;
      const curve = (x1, y1, x2, y2) => {
        const m = (x1 + x2) / 2;
        return `M ${x1} ${y1} C ${m} ${y1} ${m} ${y2} ${x2} ${y2}`;
      };
      const tx = t.right - box.left + 12;
      const ty = t.top - box.top + t.height / 2;
      const qx1 = q.left - box.left - 12;
      const qx2 = q.right - box.left + 12;
      const qy = q.top - box.top + q.height / 2;
      const ax = a.left - box.left - 14;
      const ay = a.top - box.top + 22;
      setWires({ w: box.width, h: box.height, one: curve(tx, ty, qx1, qy), two: curve(qx2, qy, ax, ay), dots: [[tx, ty], [qx1, qy], [qx2, qy], [ax, ay]] });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    wide.addEventListener("change", measure);
    return () => {
      observer.disconnect();
      wide.removeEventListener("change", measure);
    };
  }, [topic, current]);

  const pickTopic = (id) => {
    setTopic(id);
    setCurrent(items.findIndex((it) => it.topic === id));
  };
  const countOf = (id) => items.filter((it) => it.topic === id).length;
  const topicLabel = topics.find((t) => t.id === item.topic)?.label;

  return (
    <div ref={rootRef} className={styles.map} data-main="">
      {wires ? (
        <svg className={styles.wires} viewBox={`0 0 ${wires.w} ${wires.h}`} aria-hidden="true">
          <path key={`a-${topic}`} d={wires.one} pathLength="1" />
          <path key={`b-${current}`} d={wires.two} pathLength="1" data-late="" />
          {wires.dots.map(([x, y], i) => (
            <circle key={`${current}-${i}`} cx={x} cy={y} r="3.5" style={{ "--i": i }} />
          ))}
        </svg>
      ) : null}

      {/* 1. The topics. */}
      <div className={styles.col}>
        <p className={styles.colLabel}>{labels.topic}</p>
        <div className={styles.topics} role="tablist" aria-label={labels.topic}>
          {topics.map((t) => (
            <button
              key={t.id}
              ref={(el) => (topicRefs.current[t.id] = el)}
              type="button"
              role="tab"
              aria-selected={t.id === topic}
              className={styles.topic}
              onClick={() => pickTopic(t.id)}
            >
              <span>{t.label}</span>
              <em>{String(countOf(t.id)).padStart(2, "0")}</em>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Its questions. */}
      <div className={styles.col}>
        <p className={styles.colLabel}>{labels.question}</p>
        <ul className={styles.questions} key={topic}>
          {list.map(({ it, i }, k) => {
            const on = i === current;
            return (
              <li key={it.q} className={styles.qRow} data-on={on ? "" : undefined} style={{ "--k": k }}>
                <button
                  ref={(el) => (qRefs.current[i] = el)}
                  type="button"
                  className={styles.q}
                  aria-expanded={on}
                  aria-controls="integrations-answer"
                  onClick={() => setCurrent(i)}
                >
                  {it.q}
                </button>
                {/* Narrow screens: the answer opens under its question. */}
                {on ? (
                  <div className={styles.inline}>
                    <p>{it.a}</p>
                    {it.link ? (
                      <a href={it.link.href}>
                        {it.link.label} {arrow(it.link.href)}
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>

      {/* 3. The answer. */}
      <div className={`${styles.col} ${styles.answerCol}`}>
        <p className={styles.colLabel}>{labels.answer}</p>
        <div ref={answerRef} id="integrations-answer" className={styles.answer} aria-live="polite">
          <div key={current} className={styles.answerIn}>
            <p className={styles.answerTopic}>{topicLabel}</p>
            <h3 className={styles.answerQ}>{item.q}</h3>
            <p className={styles.answerText}>{item.a}</p>
            {item.link ? (
              <a className={styles.answerLink} href={item.link.href}>
                {item.link.label} {arrow(item.link.href)}
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <p className={styles.help}>
        <b>{help.title}</b> {help.line} <a href={`mailto:${help.email}`}>{help.email}</a>
      </p>
    </div>
  );
}
