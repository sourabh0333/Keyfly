import { Download } from "@/components/download/download";
import { Hero } from "@/components/hero/hero";
import { Scene } from "@/components/scene/scene";
import { HowItWorks } from "@/components/how-it-works/how-it-works";
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
      <UseCases />
      <Download />
    </Scene>
  );
}
