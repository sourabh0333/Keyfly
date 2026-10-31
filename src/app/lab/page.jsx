import Link from "next/link";
import { notFound } from "next/navigation";
import { LabBar } from "@/components/lab/lab-bar";
import lab from "@/components/lab/lab.module.css";

// Test pages for the page-wide motion ideas, to feel before one goes into
// the homepage. Development only: the production build serves a 404 here.
export const metadata = {
  title: "Lab",
  robots: { index: false, follow: false },
};

export default function LabPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <div className={lab.lab}>
      <div className={lab.index}>
        <p className={lab.eyebrow}>Lab · motion tests</p>
        <h1 className={lab.indexTitle}>Scroll each one and feel which fits.</h1>
        <div className={lab.cards}>
          <Link href="/lab/morph" className={lab.card}>
            <span className={lab.cardTag}>Idea A</span>
            <span className={lab.cardTitle}>One object that transforms</span>
            <span className={lab.cardBody}>The prompt box grows into the editor, the editor settles into the preview, and the preview folds into the app icon that lands on the desktop. Your prompt becomes the video.</span>
          </Link>
          <Link href="/lab/stack" className={lab.card}>
            <span className={lab.cardTag}>Idea B</span>
            <span className={lab.cardTitle}>Stacking scenes</span>
            <span className={lab.cardBody}>Each section is a full-screen scene. The next slides up over it while the one beneath sinks back, like cards onto a stack, with smooth inertia scrolling throughout.</span>
          </Link>
        </div>
      </div>
      <LabBar current="/lab" />
    </div>
  );
}
