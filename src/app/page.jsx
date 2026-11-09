import { Creates } from "@/components/creates/creates";
import { Divider } from "@/components/divider/divider";
import { Download } from "@/components/download/download";
import { Faq } from "@/components/faq/faq";
import { EditWithWords } from "@/components/edit-with-words/edit-with-words";
import { EveryFormat } from "@/components/every-format/every-format";
import { OnBrand } from "@/components/on-brand/on-brand";
import { Pricing } from "@/components/pricing/pricing";
import { Tools } from "@/components/tools/tools";
import { Audience } from "@/components/audience/audience";
import { YourCall } from "@/components/your-call/your-call";
import { Hero } from "@/components/hero/hero";
import { Scene } from "@/components/scene/scene";
import { HowItWorks } from "@/components/how-it-works/how-it-works";
import { OldWay } from "@/components/old-way/old-way";
import { UseCases } from "@/components/use-cases/use-cases";
import { publicRobots, siteConfig } from "@/config/site";
import { faq, homeMeta } from "@/content/home";
import { getPricing } from "@/lib/pricing";
import { homeJsonLd, jsonLdHtml } from "@/lib/structured-data";

// Open to search (see siteConfig.indexable). Built step by step: each
// section is added once the one before is agreed.
// The pricing section reads KeyFly's pricing API; refresh the page's data
// at most every 5 minutes (see src/lib/pricing.js).
export const revalidate = 300;

export const metadata = {
  title: { absolute: homeMeta.title },
  description: homeMeta.description,
  alternates: { canonical: "/" },
  openGraph: { title: homeMeta.title, description: homeMeta.description, url: "/" },
  robots: publicRobots,
};

export default async function Home() {
  // The same request the pricing section makes (Next shares the cached
  // response), for the plans in the structured data.
  const pricing = await getPricing();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdHtml(homeJsonLd({ description: siteConfig.description, faq: faq.items, pricing }))}
      />
      <Scene>
        <Hero />
        <Divider ruler={false} up="120px" down="84px" />
        <HowItWorks />
        <Divider />
        <Creates />
        <Divider />
        <OldWay />
        <Divider />
        <EditWithWords />
        <Divider />
        <YourCall />
        <Divider />
        <EveryFormat />
        <Divider />
        <OnBrand />
        <Divider />
        <Tools />
        <Divider />
        <Audience />
        <Divider />
        <UseCases />
        <Divider />
        <Download />
        <Divider />
        <Pricing />
        <Divider />
        <Faq />
      </Scene>
    </>
  );
}
