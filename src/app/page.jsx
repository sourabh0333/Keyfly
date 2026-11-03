import { Divider } from "@/components/divider/divider";
import { Download } from "@/components/download/download";
import { Faq } from "@/components/faq/faq";
import { EditWithWords } from "@/components/edit-with-words/edit-with-words";
import { EveryFormat } from "@/components/every-format/every-format";
import { OnBrand } from "@/components/on-brand/on-brand";
import { Anywhere } from "@/components/anywhere/anywhere";
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
export const metadata = {
  title: { absolute: "Keyfly · The AI video editor" },
  description: siteConfig.description,
  robots: { index: false, follow: false },
};

export default function Home() {
  return (
    <Scene>
      <Hero />
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
      <UseCases />
      <Divider />
      <Download />
      <Divider />
      <Faq />
    </Scene>
  );
}
