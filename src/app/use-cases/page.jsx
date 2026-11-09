import { Divider } from "@/components/divider/divider";
import { Scene } from "@/components/scene/scene";
import { Browse } from "@/components/use-cases-page/browse";
import { Fill } from "@/components/use-cases-page/fill";
import { Questions } from "@/components/use-cases-page/questions";
import { Roles } from "@/components/use-cases-page/roles";
import { UseCasesHero } from "@/components/use-cases-page/use-cases-hero";
import { categories, useCasesFaq, useCasesMeta } from "@/content/use-cases";
import { publicRobots } from "@/config/site";
import { jsonLdHtml, useCasesJsonLd } from "@/lib/structured-data";

// The Use cases page, built section by section (see PLAN.md), in the same
// Scene as the homepage and the Product page. Organised the way the KeyFly
// app is: its templates, in their ten categories. Open to search
// (see siteConfig.indexable).
export const metadata = {
  title: useCasesMeta.title,
  description: useCasesMeta.description,
  alternates: { canonical: "/use-cases" },
  // No openGraph here: it would replace the site's share image; Next fills
  // og:title and og:description from the title and description above.
  robots: publicRobots,
};

export default function UseCasesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdHtml(useCasesJsonLd({ ...useCasesMeta, categories, faq: useCasesFaq.items }))}
      />
      <Scene>
        <UseCasesHero />
        <Divider ruler={false} up="96px" down="84px" />
        <Browse />
        <Divider />
        <Roles />
        <Divider />
        <Fill />
        <Divider />
        <Questions />
      </Scene>
    </>
  );
}
