import { Divider } from "@/components/divider/divider";
import { Byo } from "@/components/pricing-page/byo";
import { Compare } from "@/components/pricing-page/compare";
import { MinutesExplained } from "@/components/pricing-page/minutes-explained";
import { PlanFit } from "@/components/pricing-page/plan-fit";
import { Teams } from "@/components/pricing-page/teams";
import { PricingHero } from "@/components/pricing-page/pricing-hero";
import { PricingQuestions } from "@/components/pricing-page/pricing-questions";
import { Scene } from "@/components/scene/scene";
import { pricingMeta } from "@/content/pricing";
import { getPricing } from "@/lib/pricing";
import { publicRobots } from "@/config/site";

// The Pricing page, built section by section (see PLAN.md), in the same
// Scene as the other pages. Every price comes from the pricing API, fetched
// on the server and refreshed at most every 5 minutes (ISR), as on the
// homepage. Open to search (see siteConfig.indexable).
export const revalidate = 300;

export const metadata = {
  title: pricingMeta.title,
  description: pricingMeta.description,
  alternates: { canonical: "/pricing" },
  robots: publicRobots,
};

export default async function PricingPage() {
  const data = await getPricing();
  return (
    <Scene>
      <PricingHero data={data} />
      {data ? (
        <>
          <Divider ruler={false} up="96px" down="84px" />
          <PlanFit data={data} />
          <Divider />
          <Byo data={data} />
          <Divider />
          <MinutesExplained data={data} />
          <Divider />
          <Compare data={data} />
          <Divider />
          <Teams data={data} />
          <Divider />
          <PricingQuestions data={data} />
        </>
      ) : null}
    </Scene>
  );
}
