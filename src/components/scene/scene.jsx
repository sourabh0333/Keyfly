"use client";

import { useRef } from "react";
import { SceneLight } from "./scene-light";
import { SceneCuts } from "./scene-cuts";
import { Scrubber } from "./scrubber";
import { TrimPins } from "./trim-pins";
import styles from "./scene.module.css";

/**
 * Holds the homepage's sections in one scene: the light behind them, the
 * cuts between them (each divider's playhead sweeps as it passes, and the
 * next section arrives; see Divider and SceneCuts) and the page timeline
 * in the margin (Scrubber); TrimPins evens out the gaps after pinned
 * sections.
 */
export function Scene({ children }) {
  const pageRef = useRef(null);

  return (
    <div ref={pageRef} className={styles.page}>
      <SceneLight />
      {children}
      <SceneCuts pageRef={pageRef} />
      <Scrubber />
      <TrimPins pageRef={pageRef} />
    </div>
  );
}
