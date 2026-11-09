import { Divider } from "@/components/divider/divider";
import { Agents } from "@/components/integrations/agents";
import { ChatApps } from "@/components/integrations/chat-apps";
import { Cost } from "@/components/integrations/cost";
import { Destinations } from "@/components/integrations/destinations";
import { Editors } from "@/components/integrations/editors";
import { IntegrationsHero } from "@/components/integrations/integrations-hero";
import { Questions } from "@/components/integrations/questions";
import { Scene } from "@/components/scene/scene";
import { integrationsMeta } from "@/content/integrations";
import { publicRobots } from "@/config/site";

// The Integrations page, built section by section (see PLAN.md), in the
// same Scene as the other pages. Open to search
// (see siteConfig.indexable).
export const metadata = {
  title: integrationsMeta.title,
  description: integrationsMeta.description,
  alternates: { canonical: "/integrations" },
  robots: publicRobots,
};

export default function IntegrationsPage() {
  return (
    <Scene>
      <IntegrationsHero />
      <Divider ruler={false} up="96px" down="84px" />
      <Agents />
      <Divider />
      <Editors />
      <Divider />
      <Destinations />
      <Divider />
      <ChatApps />
      <Divider />
      <Cost />
      <Divider />
      <Questions />
    </Scene>
  );
}
