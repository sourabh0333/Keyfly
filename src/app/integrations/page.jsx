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

// The Integrations page, built section by section (see PLAN.md), in the
// same Scene as the other pages. Kept out of search with the rest of the
// site until the copy is confirmed.
export const metadata = {
  title: integrationsMeta.title,
  description: integrationsMeta.description,
  alternates: { canonical: "/integrations" },
  robots: { index: false, follow: false },
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
