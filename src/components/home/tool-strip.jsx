import { toolStrip } from "@/content/home";
import rise from "./rise.module.css";
import styles from "./tool-strip.module.css";

/**
 * Keyfly's nine tools as a row of tiles on one line. A mint light hops
 * from tile to tile along it, the way a playhead moves along a timeline.
 */
export function ToolStrip() {
  const count = toolStrip.tools.length;
  return (
    <section className={styles.strip} aria-label="Keyfly's own tools">
      <div className={`${styles.inner} ${rise.rise}`}>
        <p className={styles.label}>{toolStrip.label}</p>
        <ol className={styles.tiles} style={{ "--count": count }}>
          {toolStrip.tools.map((tool, i) => (
            <li key={tool.name} className={styles.tool} style={{ "--i": i }}>
              <span className={styles.tile} aria-hidden="true">
                {tool.short}
              </span>
              <span className={styles.name}>{tool.name}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
