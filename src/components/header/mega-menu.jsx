import Link from "next/link";
import styles from "./header.module.css";

// Small stroked icons for the Product menu's six parts.
const ICONS = {
  make: "M3 4.5h7M3 8h5M3 11.5h4M11.5 7.5l1 2.2 2.2 1-2.2 1-1 2.2-1-2.2-2.2-1 2.2-1Z",
  direct: "M2.5 3.5h11v7h-6l-3.5 2.5v-2.5h-1.5ZM5.5 6.5h5M5.5 8.5h3",
  footage: "M2.5 4h11v8h-11ZM2.5 6.5h11M5 4l1.2 2.5M8.5 4l1.2 2.5M7 8.5v2l2-1Z",
  brand: "M8 2.5a5.5 5.5 0 1 0 0 11c.9 0 1.2-.6 1.2-1.2 0-.8-.6-1-.6-1.8 0-.7.5-1.2 1.3-1.2h1.3a2.3 2.3 0 0 0 2.3-2.3C13.5 4.6 11 2.5 8 2.5ZM5 7.5h.01M6.5 5h.01M9.5 5h.01",
  deliver: "M8 2.5v7M5 6.5l3 3 3-3M3 10.5v2.5h10v-2.5",
  yourWay: "M4 7.5h8v6H4ZM5.8 7.5V5.2a2.2 2.2 0 0 1 4.3-.7M8 10v1.2",
};

function Icon({ name }) {
  return (
    <svg className={styles.menuIcon} viewBox="0 0 16 16" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

export function Out() {
  return (
    <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
      <path d="M5 11 11 5M6.5 5H11v4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ItemLink({ item, onPick, className, children }) {
  const click = () => onPick?.();
  if (item.external) {
    return (
      <a href={item.href} className={className} onClick={click} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={item.href} className={className} onClick={click}>
      {children}
    </Link>
  );
}

/**
 * One header menu's contents: its groups of links (an icon and a line each
 * where the content gives them), a featured card and a link to everything.
 * Shared by the desktop panel and, without the card's art, the phone menu.
 */
export function MenuBody({ menu, onPick, compact = false }) {
  return (
    <div className={compact ? styles.menuBodyCompact : styles.menuBody} data-groups={menu.groups.length}>
      <div className={styles.groups}>
        {menu.groups.map((group) => (
          <div key={group.title} className={styles.group} data-columns={group.columns || 1}>
            <p className={styles.groupTitle}>
              {group.title}
              {group.tag ? <span className={styles.groupTag}>{group.tag}</span> : null}
            </p>
            <ul>
              {group.items.map((item, index) => (
                <li key={item.label}>
                  <ItemLink item={item} onPick={onPick} className={styles.menuItem}>
                    {item.icon && !compact ? <Icon name={item.icon} /> : null}
                    <span className={styles.menuItemText}>
                      <b>
                        {group.numbered ? <span className={styles.menuNum}>{String(index + 1).padStart(2, "0")}</span> : null}
                        {item.label}
                        {item.external ? <Out /> : null}
                      </b>
                      {item.line ? <em>{item.line}</em> : null}
                    </span>
                  </ItemLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {menu.feature ? (
        <ItemLink item={menu.feature} onPick={onPick} className={styles.feature}>
          <span className={styles.featureEyebrow}>
            <i />
            {menu.feature.eyebrow}
          </span>
          <b className={styles.featureTitle}>{menu.feature.title}</b>
          <span className={styles.featureLine}>{menu.feature.line}</span>
          {menu.feature.meta ? <span className={styles.featureMeta}>{menu.feature.meta}</span> : null}
          <span className={styles.featureCta}>
            {menu.feature.cta} {menu.feature.external ? <Out /> : "→"}
          </span>
        </ItemLink>
      ) : null}

      {compact ? null : (
        <Link href={menu.all.href} className={styles.menuAll} onClick={onPick}>
          {menu.all.label} →
        </Link>
      )}
    </div>
  );
}
