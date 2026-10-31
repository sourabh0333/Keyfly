import { SceneLight } from "./scene-light";
import { Spotlight } from "./spotlight";
import { Scrubber } from "./scrubber";
import styles from "./scene.module.css";

/**
 * Holds the homepage's sections in one scene: the soft light behind them,
 * the page timeline in the margin and the spotlight edges on the main
 * panels (see SceneLight, Scrubber and Spotlight).
 */
export function Scene({ children }) {
  return (
    <div className={styles.page}>
      <SceneLight />
      {children}
      <Scrubber />
      <Spotlight />
    </div>
  );
}
