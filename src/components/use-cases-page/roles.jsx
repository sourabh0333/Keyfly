import { PauseOffscreen } from "@/components/pause-offscreen";
import wipe from "@/components/scene/wipe.module.css";
import { useCasesRoles } from "@/content/use-cases";
import { RoleBento } from "./role-bento";
import styles from "./roles.module.css";

/**
 * Use cases page, "By role": four kinds of people who make videos, the
 * template categories that fit each, and their real templates, as a
 * bento of four cards (see RoleBento).
 */
export function Roles() {
  const { eyebrow, title, lead, ...picker } = useCasesRoles;

  return (
    <section id="by-role" className={styles.section} aria-labelledby="roles-title" data-section="By role">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="roles-title" className={`${styles.title} ${wipe.wipe}`}>
              {title.map((line, i) => (
                <span key={i} className={line.accent ? styles.accent : styles.plain}>
                  {line.text}
                  {i < title.length - 1 ? " " : null}
                </span>
              ))}
            </h2>
          </div>
          <p className={styles.lead}>{lead}</p>
        </div>

        <RoleBento {...picker} />
      </div>
    </section>
  );
}
