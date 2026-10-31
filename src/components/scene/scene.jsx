import { SceneLight } from "./scene-light";
import { Scrubber } from "./scrubber";
import styles from "./scene.module.css";

/**
 * Holds the homepage's sections in one scene: the generated light behind
 * them and the page timeline in the margin (see SceneLight, LightField and
 * Scrubber).
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
