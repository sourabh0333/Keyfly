import { Download } from "@/components/home/download";
import { Glance } from "@/components/home/glance";
import { Hero } from "@/components/home/hero";
import { ToolsShowcase } from "@/components/home/tools-showcase";
import { siteConfig } from "@/config/site";

// Kept out of search until the product details and download links are
// confirmed (see the PLACEHOLDER notes in src/content/home.js).
// Built step by step: each section is added once the one before is agreed.
export const metadata = {
  title: { absolute: "Keyfly · Video editor for macOS, Windows and Linux" },
  description: siteConfig.description,
  robots: { index: false, follow: false },
};

export default function Home() {
  return (
    <>
      <Hero />
      <ToolsShowcase />
      <Glance />
      <Download />
    </>
  );
}
