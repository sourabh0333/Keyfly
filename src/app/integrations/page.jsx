import { Divider } from "@/components/divider/divider";
import { Agents } from "@/components/integrations/agents";
import { ChatApps } from "@/components/integrations/chat-apps";
import { Cost } from "@/components/integrations/cost";
import { Destinations } from "@/components/integrations/destinations";
import { Editors } from "@/components/integrations/editors";
import { IntegrationsHero } from "@/components/integrations/integrations-hero";
import { Questions } from "@/components/integrations/questions";
import { Scene } from "@/components/scene/scene";
import { integrationsFaq, integrationsMeta } from "@/content/integrations";
import { publicRobots } from "@/config/site";
import { integrationsJsonLd, jsonLdHtml } from "@/lib/structured-data";

// The Integrations page, built section by section (see PLAN.md), in the
// same Scene as the other pages. Open to search
// (see siteConfig.indexable).
export const metadata = {
  title: integrationsMeta.title,
  description: integrationsMeta.description,
  alternates: { canonical: "/integrations" },
  // No openGraph here: it would replace the site's share image; Next fills
  // og:title and og:description from the title and description above.
  robots: publicRobots,
};

export default function IntegrationsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdHtml(integrationsJsonLd({ ...integrationsMeta, faq: integrationsFaq.items }))}
      />
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
    </>
  );
}
