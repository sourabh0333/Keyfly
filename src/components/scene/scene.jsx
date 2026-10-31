"use client";

import { useRef } from "react";
import { FlightThread } from "./flight-thread";
import { SceneLight } from "./scene-light";
import { Scrubber } from "./scrubber";
import styles from "./scene.module.css";

/**
 * Holds the homepage's sections in one scene: the light behind them, the
 * flight thread that runs through them and the page timeline at the foot
 * of the screen (see SceneLight, FlightThread and Scrubber).
 */
export function Scene({ children }) {
  const pageRef = useRef(null);

  return (
    <div ref={pageRef} className={styles.page}>
      <SceneLight />
      {children}
      <FlightThread pageRef={pageRef} />
      <Scrubber />
    </div>
  );
}
