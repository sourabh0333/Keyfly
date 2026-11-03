import { LegalPage } from "@/components/legal/legal-page";
import { legal } from "@/content/legal";

// Linked from the app's sign-in. Kept out of search until the full policy
// is published.
export const metadata = {
  title: legal.privacy.meta,
  description: legal.privacy.description,
  alternates: { canonical: legal.privacy.path },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return <LegalPage page={legal.privacy} />;
}
