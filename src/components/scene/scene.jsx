"use client";

import { useRef } from "react";
import { FlightThread } from "./flight-thread";
import { SceneLight } from "./scene-light";
import styles from "./scene.module.css";

/**
 * Holds the homepage's sections in one scene: the light behind them and the
 * flight thread that runs through them (see SceneLight and FlightThread).
 */
export function Scene({ children }) {
  const pageRef = useRef(null);

  return (
    <div ref={pageRef} className={styles.page}>
      <SceneLight />
      {children}
      <FlightThread pageRef={pageRef} />
    </div>
  );
}
