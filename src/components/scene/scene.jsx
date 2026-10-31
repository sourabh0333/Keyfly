import { SceneLight } from "./scene-light";
import { Scrubber } from "./scrubber";
import styles from "./scene.module.css";

/**
 * Holds the homepage's sections in one scene: the soft light behind them
 * and the page timeline in the margin (see SceneLight and Scrubber). The
 * sections cut into each other with edit transitions (see cuts.module.css);
 * the scene clips them sideways so a push never widens the page.
 */
export function Scene({ children }) {
  return (
    <div className={styles.page}>
      <SceneLight />
      {children}
      <Scrubber />
    </div>
  );
}
