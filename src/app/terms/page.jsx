import { LegalPage } from "@/components/legal/legal-page";
import { legal } from "@/content/legal";

// Linked from the app's sign-in. Kept out of search until the full terms
// are published.
export const metadata = {
  title: legal.terms.meta,
  description: legal.terms.description,
  alternates: { canonical: legal.terms.path },
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return <LegalPage page={legal.terms} />;
}
