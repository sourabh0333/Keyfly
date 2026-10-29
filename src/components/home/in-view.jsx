"use client";

import { useEffect, useRef } from "react";

/**
 * Marks its element data-inview="true" the first time it is well inside the
 * viewport, so CSS can play a panel's animation then. Server HTML has no
 * attribute and CSS shows the finished state for it, so nothing is lost
 * without JS; reduced motion keeps the finished state too.
 */
export function InView({ as: Tag = "div", threshold = 0.35, children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.dataset.inview = "false";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.inview = "true";
        observer.disconnect();
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
