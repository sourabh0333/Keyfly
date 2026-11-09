import { Divider } from "@/components/divider/divider";
import { Scene } from "@/components/scene/scene";
import { Browse } from "@/components/use-cases-page/browse";
import { Fill } from "@/components/use-cases-page/fill";
import { Questions } from "@/components/use-cases-page/questions";
import { Roles } from "@/components/use-cases-page/roles";
import { UseCasesHero } from "@/components/use-cases-page/use-cases-hero";
import { useCasesMeta } from "@/content/use-cases";
import { publicRobots } from "@/config/site";

// The Use cases page, built section by section (see PLAN.md), in the same
// Scene as the homepage and the Product page. Organised the way the KeyFly
// app is: its templates, in their ten categories. Open to search
// (see siteConfig.indexable).
export const metadata = {
  title: useCasesMeta.title,
  description: useCasesMeta.description,
  alternates: { canonical: "/use-cases" },
  robots: publicRobots,
};

export default function UseCasesPage() {
  return (
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
  );
}
