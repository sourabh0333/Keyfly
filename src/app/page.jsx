import { Hero } from "@/components/hero/hero";
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
  return <Hero />;
}
