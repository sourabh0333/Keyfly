import { Divider } from "@/components/divider/divider";
import { Download } from "@/components/download/download";
import { Faq } from "@/components/faq/faq";
import { EditWithWords } from "@/components/edit-with-words/edit-with-words";
import { EveryFormat } from "@/components/every-format/every-format";
import { OnBrand } from "@/components/on-brand/on-brand";
import { Prompts } from "@/components/prompts/prompts";
import { Pricing } from "@/components/pricing/pricing";
import { Anywhere } from "@/components/anywhere/anywhere";
import { Audience } from "@/components/audience/audience";
import { YourCall } from "@/components/your-call/your-call";
import { Hero } from "@/components/hero/hero";
import { Scene } from "@/components/scene/scene";
import { HowItWorks } from "@/components/how-it-works/how-it-works";
import { OldWay } from "@/components/old-way/old-way";
import { UseCases } from "@/components/use-cases/use-cases";
import { siteConfig } from "@/config/site";

// Kept out of search until the product details are confirmed (see the
// PLACEHOLDER notes in src/content/home.js). Built step by step: each
// section is added once the one before is agreed.
// The pricing section reads Keyfly's pricing API; refresh the page's data
// at most every 5 minutes (see src/lib/pricing.js).
export const revalidate = 300;

export const metadata = {
  title: { absolute: "Keyfly · The AI video editor" },
  description: siteConfig.description,
  robots: { index: false, follow: false },
};

export default function Home() {
  return (
    <Scene>
      <Hero />
      <Divider ruler={false} up="120px" down="84px" />
      <HowItWorks />
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
      <Anywhere />
      <Divider />
      <Audience />
      <Divider />
      <UseCases />
      <Divider />
      <Prompts />
      <Divider />
      <Download />
      <Divider />
      <Pricing />
      <Divider />
      <Faq />
    </Scene>
  );
}
