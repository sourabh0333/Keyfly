import Link from "next/link";
import lab from "./lab.module.css";

const LINKS = [
  ["/lab", "Lab"],
  ["/lab/morph", "A · Transform"],
  ["/lab/stack", "B · Stack"],
];

/** The switcher at the foot of every lab page. */
export function LabBar({ current }) {
  return (
    <nav className={lab.labBar} aria-label="Lab">
      {LINKS.map(([href, label]) => (
        <Link key={href} href={href} aria-current={href === current ? "page" : undefined}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
