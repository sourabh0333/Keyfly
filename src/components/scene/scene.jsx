import { FocusFrame } from "./focus-frame";
import { SceneLight } from "./scene-light";
import { Scrubber } from "./scrubber";
import styles from "./scene.module.css";

/**
 * Holds the homepage's sections in one scene: the light behind them, the
 * camera's focus frame that travels between them and the page timeline in
 * the margin (see SceneLight, FocusFrame and Scrubber).
 */
export function Scene({ children }) {
  return (
    <div className={styles.page}>
      <SceneLight />
      {children}
      <FocusFrame />
      <Scrubber />
    </div>
  );
}
