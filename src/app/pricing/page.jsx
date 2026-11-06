import { PricingHero } from "@/components/pricing-page/pricing-hero";
import { Scene } from "@/components/scene/scene";
import { pricingMeta } from "@/content/pricing";
import { getPricing } from "@/lib/pricing";

// The Pricing page, built section by section (see PLAN.md), in the same
// Scene as the other pages. Every price comes from the pricing API, fetched
// on the server and refreshed at most every 5 minutes (ISR), as on the
// homepage. Kept out of search with the rest of the site for now.
export const revalidate = 300;

export const metadata = {
  title: pricingMeta.title,
  description: pricingMeta.description,
  alternates: { canonical: "/pricing" },
  robots: { index: false, follow: false },
};

export default async function PricingPage() {
  const data = await getPricing();
  return (
    <Scene>
      <PricingHero data={data} />
    </Scene>
  );
}
