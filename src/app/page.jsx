import { AnimatedLogo } from "@/components/logo/animated-logo";
import styles from "./page.module.css";

// Temporary page while the site is built: the logo on its own. Replaced by
// the real homepage in build step 4 (PLAN.md).
export const metadata = {
  robots: { index: false, follow: false },
};

export default function Home() {
  return (
    <section data-tone="night" className={styles.stage}>
      <h1 className="visually-hidden">Keyfly</h1>
      <AnimatedLogo height={260} label={null} className={styles.logo} />
    </section>
  );
}
