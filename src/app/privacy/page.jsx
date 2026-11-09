import { LegalPage } from "@/components/legal/legal-page";
import { legal } from "@/content/legal";
import { publicRobots } from "@/config/site";

// Linked from the app's sign-in. While the text is a draft for review it
// stays out of search (and out of the sitemap); set `draft: false` in
// src/content/legal.js once it's approved.
const page = legal.privacy;

export const metadata = {
  title: page.meta,
  description: page.description,
  alternates: { canonical: page.path },
  robots: page.draft ? { index: false, follow: true } : publicRobots,
};

export default function PrivacyPage() {
  return <LegalPage page={page} />;
}
