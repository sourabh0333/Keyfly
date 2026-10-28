<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Keyfly project standards

Read `PROJECT_CONTEXT.md` before any website work, and `PLAN.md` for the build order.

- JavaScript and JSX only. Do not add TypeScript or TSX files.
- pnpm only (`pnpm dev`, `pnpm lint`, `pnpm build`).
- Styles: brand tokens and element defaults in `src/app/globals.css`; everything else in a CSS Module next to its component. No Tailwind, no CSS-in-JS.
- Brand assets come from `brand-kit/` unchanged. Never recolour, redraw, rotate, stretch or add effects to the Keyfly mark or wordmark.
- Never invent customers, testimonials, metrics, integrations or pricing.
- Verify every visible change in the browser at desktop and mobile widths before calling it done.
