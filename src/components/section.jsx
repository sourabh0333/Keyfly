import { cx } from "@/lib/cx";
import styles from "./section.module.css";

/**
 * A full-width page band with a centred content column.
 * - tone "paper" (default) or "night"; night re-colours everything inside.
 * - rule: a hairline across the top, the site's section divider (no boxes).
 */
export function Section({
  as: Tag = "section",
  tone = "paper",
  rule = false,
  id,
  labelledBy,
  className,
  innerClassName,
  children,
}) {
  return (
    <Tag
      id={id}
      data-tone={tone}
      aria-labelledby={labelledBy}
      className={cx(styles.section, className)}
    >
      <div className={cx(styles.inner, rule && styles.rule, innerClassName)}>{children}</div>
    </Tag>
  );
}

/**
 * Eyebrow, heading and lead for the top of a section. Pass `id` and give the
 * same value to Section's `labelledBy` so the region is named by its heading.
 */
export function SectionHeading({
  as: Heading = "h2",
  id,
  eyebrow,
  title,
  lead,
  align = "start",
  className,
}) {
  return (
    <header className={cx(styles.heading, align === "center" && styles.center, className)}>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <Heading id={id} className={styles.title}>
        {title}
      </Heading>
      {lead ? <p className={styles.lead}>{lead}</p> : null}
    </header>
  );
}
