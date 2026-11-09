# KeyFly website

The marketing site for KeyFly, the AI video editor by Cevrynt Inc., served at keyfly.si. The app itself lives at app.keyfly.si and is a separate project.

For the full history of every page, section and design decision, read [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md). [`PLAN.md`](PLAN.md) has the original build order, and [`AGENTS.md`](AGENTS.md) the rules for anyone (or any agent) changing the code.

## Stack

- Next.js 16.4 (App Router) and React 19.3, in JavaScript/JSX only (no TypeScript).
- pnpm 12.
- Plain CSS: tokens in `src/app/globals.css`, a CSS Module beside each component. No Tailwind.
- Self-hosted fonts (`src/fonts/`, with their licences).

## Run it

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm lint
pnpm build    # production build
pnpm start    # serve the production build
```

Don't run `pnpm build` while `pnpm dev` is running: they share `.next`, and the dev server can end up serving stale modules. Stop the dev server first, or restart it afterwards.

## Environment variables

None are required for a production build. Set them in the host, never in the repository.

| Variable | Where | What it does |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production, if the domain isn't keyfly.si | The site's address for canonicals, the sitemap, the share image and structured data. Defaults to `https://keyfly.si`. |
| `NEXT_PUBLIC_NOINDEX` | **Every preview and staging deploy:** `true` | Makes every page `noindex`, robots.txt `Disallow: /` and the sitemap empty, so a staging copy never competes with keyfly.si in Google. Leave unset in production. |
| `KEYFLY_PRICING_FIXTURE` | Development only; never production | Path to a saved copy of the pricing API's response, for working offline. |

## Hosting

The site was built for Cloudflare. Pick one:

- **OpenNext on Cloudflare Workers (recommended).** Prices come live from `https://api.keyfly.si/v1/public/pricing` and the homepage, Product and Pricing pages refresh them every 5 minutes (`revalidate = 300`). That needs a running Next server. The security headers in `next.config.mjs` also apply.
- **Static export on Cloudflare Pages.** This works only with scheduled rebuilds (hourly, say), because prices would otherwise freeze at build time. Set the headers from `next.config.mjs` in Cloudflare instead.

keyfly.si already serves an older site on Cloudflare. Replacing it changes some URLs; see the launch checklist.

## Where things live

| What | Where |
|---|---|
| All page copy | `src/content/*.js` (one file per page: `home.js`, `product.js`, `use-cases.js`, `integrations.js`, `pricing.js`, `blog.js`, `legal.js`, `errors.js`, `footer.js`, `navigation.js`) |
| Site-wide facts, robots, public pages | `src/config/site.js` |
| Prices | Never typed in: read from the pricing API by `src/lib/pricing.js` |
| Structured data (JSON-LD) | `src/lib/structured-data.js` |
| Sitemap and robots.txt | `src/app/sitemap.js`, `src/app/robots.js` |
| Blog posts | `src/content/blog.js`. Add an entry and it appears on `/blog`, in the sitemap and in `/blog/rss.xml`. |
| Terms and Privacy | `src/content/legal.js`. Each page has `draft: true` until approved. |
| Brand files | `brand-kit/` (originals) and `public/brand/` (web copies). Never recolour or redraw them. |
| Videos | `public/video/`. The scripts that made them are in `scripts/`. The stock clips they're cut from are not in the repository; each script's `record.mjs` lists its Mixkit pages. |

## Pages

`/`, `/product`, `/use-cases`, `/integrations`, `/pricing`, `/blog` and its posts, `/terms`, `/privacy`, plus a 404 page and error pages. `/styleguide` shows the design tokens in development and returns 404 in production.

## Launch checklist

Before switching keyfly.si to this site:

- [ ] **Old URLs.** The current keyfly.si has `/about`, `/contact`, `/download` and `/refunds`, which this site doesn't have yet. Add those pages, or redirect each one (in `next.config.mjs` → `redirects()`), so existing links and Google results don't hit a 404.
- [ ] **Legal text.** `/terms` and `/privacy` here are drafts (amber marks for facts to confirm). The current keyfly.si already publishes Terms, Privacy and a Refund policy (dated 29 October 2026). Decide which text is final, then set `draft: false` in `src/content/legal.js`.
- [ ] **Contact email.** This site uses help@keyfly.si; the current keyfly.si and the pricing API use hello@keyfly.si; the app's account-deletion line uses support@keyfly.si. Pick one, and replace it across `src/content/`.
- [ ] **Unsigned installers.** The current keyfly.si/download says the installers aren't code-signed yet and explains the one-time "Open Anyway" (Mac) and "Run anyway" (Windows) steps. This site's download note doesn't mention it. Add those steps (in `src/content/navigation.js` → `download.started`, and the homepage's Download section) until the installers are signed.
- [ ] **Hosting** chosen as above; `NEXT_PUBLIC_NOINDEX=true` on previews.
- [ ] After launch: add keyfly.si to Google Search Console and submit `https://keyfly.si/sitemap.xml`; run PageSpeed Insights (targets LCP ≤ 1.5 s, CLS ≤ 0.1, INP ≤ 200 ms) and Google's Rich Results Test.

Still open for the team, not blocking launch: real videos and customer stories (none may be invented), the ChatGPT and Claude app install links (shown as "Coming soon"), and automatic blog posts (plan in `PROJECT_CONTEXT.md`, Blog section).
