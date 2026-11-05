import { Divider } from "@/components/divider/divider";
import { Brand } from "@/components/product/brand";
import { Close } from "@/components/product/close";
import { Deliver } from "@/components/product/deliver";
import { Direct } from "@/components/product/direct";
import { Footage } from "@/components/product/footage";
import { Make } from "@/components/product/make";
import { Minutes } from "@/components/product/minutes";
import { ProductHero } from "@/components/product/product-hero";
import { YourWay } from "@/components/product/your-way";
import { Scene } from "@/components/scene/scene";
import { productMeta } from "@/content/product";

// The Product page, built section by section (see PLAN.md), in the same
// Scene as the homepage: the links between sections, the focus pull, the
// dissolve, the page timeline and the footer's arrival. Kept out of search
// with the rest of the site until the copy is confirmed.
// AI minutes reads each plan's allowance from KeyFly's pricing API;
// refresh it at most every 5 minutes, as the homepage does (src/lib/pricing.js).
export const revalidate = 300;

export const metadata = {
  title: productMeta.title,
  description: productMeta.description,
  alternates: { canonical: "/product" },
  robots: { index: false, follow: false },
};

export default function ProductPage() {
  return (
    <Scene>
      <ProductHero />
      <Divider ruler={false} up="96px" down="84px" />
      <Make />
      <Divider />
      <Direct />
      <Divider />
      <Footage />
      <Divider />
      <Brand />
      <Divider />
      <Deliver />
      <Divider />
      <YourWay />
      <Divider />
      <Minutes />
      <Divider />
      <Close />
    </Scene>
  );
}
