import { Divider } from "@/components/divider/divider";
import { Byo } from "@/components/pricing-page/byo";
import { Compare } from "@/components/pricing-page/compare";
import { MinutesExplained } from "@/components/pricing-page/minutes-explained";
import { PlanFit } from "@/components/pricing-page/plan-fit";
import { Teams } from "@/components/pricing-page/teams";
import { PricingHero } from "@/components/pricing-page/pricing-hero";
import { PricingQuestions, pricingFaqItems } from "@/components/pricing-page/pricing-questions";
import { Scene } from "@/components/scene/scene";
import { pricingMeta } from "@/content/pricing";
import { getPricing } from "@/lib/pricing";
import { jsonLdHtml, lowestPaidPrice, pricingJsonLd } from "@/lib/structured-data";
import { publicRobots } from "@/config/site";

// The Pricing page, built section by section (see PLAN.md), in the same
// Scene as the other pages. Every price comes from the pricing API, fetched
// on the server and refreshed at most every 5 minutes (ISR), as on the
// homepage. Open to search (see siteConfig.indexable).
export const revalidate = 300;

// The title names the lowest paid price, read from the pricing API, so it
// is never typed in; without the API it falls back to pricingMeta.title.
// No openGraph here: it would replace the site's share image.
export async function generateMetadata() {
  const price = lowestPaidPrice(await getPricing());
  return {
    title: { absolute: price ? pricingMeta.titleFrom.replace("{price}", () => price) : pricingMeta.title },
    description: pricingMeta.description,
    alternates: { canonical: "/pricing" },
    robots: publicRobots,
  };
}

export default async function PricingPage() {
  const data = await getPricing();
  const price = lowestPaidPrice(data);
  const title = price ? pricingMeta.titleFrom.replace("{price}", () => price) : pricingMeta.title;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdHtml(
          pricingJsonLd({ title, description: pricingMeta.description, pricing: data, faq: data ? pricingFaqItems(data) : [] }),
        )}
      />
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
    </>
  );
}
