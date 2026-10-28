import Image from "next/image";
import styles from "./page.module.css";

// Temporary scaffold page: proves fonts, tokens and brand assets load.
// Replaced by the real homepage in build step 4 (PLAN.md).
export const metadata = {
  robots: { index: false, follow: false },
};

export default function Home() {
  return (
    <main className={styles.main}>
      <Image
        src="/brand/lockup-light.svg"
        alt="Keyfly"
        width={212}
        height={64}
        loading="eager"
      />
      <h1 className={styles.title}>The website is being built.</h1>
      <p className={styles.note}>Scaffold check: Syne 700 headings, Inter body, Paper and Ink.</p>
    </main>
  );
}
