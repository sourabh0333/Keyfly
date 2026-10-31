import { useCases } from "@/content/home";
import wipe from "@/components/scene/wipe.module.css";
import { PresetReel } from "./preset-reel";
import styles from "./use-cases.module.css";

/**
 * "Use cases": laid out like "How it works" (the copy and a rail of six
 * presets on the left, the Keyfly editor on the right), with the presets
 * from the prompt box as a reel the playhead plays through (see
 * PresetReel).
 */
export function UseCases() {
  const { eyebrow, title, lead, note, ...reel } = useCases;

  return (
    <section id="use-cases" className={styles.section} aria-labelledby="cases-title" data-section="Use cases">
      <PresetReel {...reel}>
        <p className={styles.eyebrow} data-landing>
          <span className={styles.eyebrowMark} aria-hidden="true" />
          {eyebrow}
        </p>
        <h2 id="cases-title" className={`${styles.title} ${wipe.wipe}`}>
          {title.map((line, i) => (
            <span key={i} className={line.accent ? styles.accent : styles.plain}>
              {line.text}
              {i < title.length - 1 ? " " : null}
            </span>
          ))}
        </h2>
        <p className={styles.lead}>{lead}</p>
      </PresetReel>
      <p className={styles.note}>{note}</p>
    </section>
  );
}
