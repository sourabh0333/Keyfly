import { looks } from "@/content/use-cases";
import styles from "./template-card.module.css";

export const ratio = (shape) => {
  const [w, h] = shape.split(":").map(Number);
  return w / h;
};

/**
 * One template, as the app's card shows it: its preview from the app (a
 * muted loop that stays on its still until a parent plays it) or, without
 * one, a picture drawn in its look; its shape and length; its name, and
 * its type and look. The parent sets the picture's height (--h).
 */
export function TemplateCard({ template }) {
  const look = looks[template.look];
  return (
    <figure className={styles.card} data-look={template.look} style={{ "--r": ratio(template.shape) }}>
      <div className={styles.pic}>
        {template.clip ? (
          <video className={styles.clip} src={`${template.clip}.mp4`} poster={`${template.clip}.webp`} muted loop playsInline preload="none" aria-hidden="true" />
        ) : (
          <>
            <i className={styles.m1} />
            <i className={styles.m2} />
            <i className={styles.m3} />
          </>
        )}
        <span className={styles.chip}>
          {template.shape} · {template.seconds}s
        </span>
      </div>
      <figcaption>
        <b>{template.name}</b>
        <em>
          <span className={styles.capShape}>
            {template.shape} · {template.seconds}s ·{" "}
          </span>
          {template.type ? `${template.type} · ${look}` : look}
        </em>
      </figcaption>
    </figure>
  );
}
