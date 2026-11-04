# Cardboard and Descript: product and feature pages beyond the homepage (researched 2026-11-04)

Method: sitemaps (cardboard.ai/sitemap.xml, descript.com/lp/sitemap-pages.xml), direct fetches of the main product pages, one comparison page per vendor, changelog, recipes/templates, pricing, plus two web searches for third-party reviews. Page contents were read through a fetch tool that converts pages to text, so animations, video content and image-only content (logo images, badges) are described only as far as the markup reveals. No page shows a publish date except blog posts and the Cardboard changelog; everything else carries only "© 2026".

## Q1. Which product/feature URLs exist?

### Takeaway
Cardboard has **no /product or /features page at all**: its product story is the homepage plus four satellite pages (/desktop, /mcp, /recipes, /changelog) and pricing, with a large recipe library (~86 recipe pages + 5 guides) and SEO "vs" blog posts. Descript has a classic large SaaS site: a /features hub, ~19 core feature pages, 18 /ai/* pages, ~300+ /tools/* SEO pages, use-case, team, template, integration and 11 /compare pages, and no on-site changelog.

### Cited Findings
**Cardboard (sitemap: 137 URLs; 13 core pages)** — [cardboard.ai sitemap](https://cardboard.ai/sitemap.xml)
- Core: `/`, `/pricing`, `/desktop`, `/mcp`, `/recipes`, `/recipes/guides`, `/changelog`, `/blog`, `/careers`, `/hard-problems`, `/support`, `/privacy`, `/terms` — [sitemap](https://cardboard.ai/sitemap.xml)
- No /product, /features, /use-cases, /compare or /integrations URL exists in the sitemap — [sitemap](https://cardboard.ai/sitemap.xml)
- Header nav: Recipes, Mac (/desktop), Plugins (/mcp, with sub-items "ChatGPT plugin" /mcp?agent=chatgpt and "Claude plugin" /mcp?agent=claude), Pricing, Changelog, Login, Get started — [cardboard.ai](https://cardboard.ai/)
- Footer: Product (Pricing, Recipes, Plugins, Changelog, Support, Status at status.cardboard.ai); Company (Blog, Careers, Hard problems, Y Combinator link, humans@cardboard.ai); socials X, Instagram, LinkedIn — [cardboard.ai](https://cardboard.ai/)
- Recipes: ~86 individual recipe URLs (e.g. /recipes/founder-launch-video, /recipes/screen-product-demo, /recipes/saas-walkthrough, /recipes/podcast-highlight-guide, /recipes/mrbeast-style-clip, /recipes/claude-tokens-reel, /recipes/thermal-vision, /recipes/double-exposure) — [sitemap](https://cardboard.ai/sitemap.xml)
- Recipe guides (use-case-ish SEO pages): /recipes/guides/talking-head-video, /podcast-clips, /captioned-ugc-video, /travel-vlog, /product-demo-video — [sitemap](https://cardboard.ai/sitemap.xml)
- Blog: 27 posts, all lastmod 2026-11-03, including comparison posts /blog/invideo-vs-cardboard-footage-edits, /blog/premiere-pro-cardboard-ai-compared, /blog/opus-clip-vs-cardboard-compared, /blog/best-descript-alternatives, /blog/runway-ai-alternatives-creators, /blog/best-ai-video-editors — [sitemap](https://cardboard.ai/sitemap.xml)

**Descript** — [descript.com pages sitemap](https://www.descript.com/lp/sitemap-pages.xml)
- Features hub: `/features`; core feature pages: /underlord, /captions, /clips, /filler-words, /eye-contact, /studio-sound, /screen-recording, /transcription, /text-to-speech, /video-editing, /publishing, /rooms, /regenerate, /video-regenerate, /mcp, /api, /brand-studio, /zoom — [sitemap](https://www.descript.com/lp/sitemap-pages.xml)
- AI pages: /ai-video, /ai-avatars, /ai-voices, /ai-video-enhancer, and /ai/automatic-multicam, /ai/chapter-generator, /ai/edit-for-clarity, /ai/find-good-clips, /ai/generate-video, /ai/podcast-show-notes, /ai/remove-retakes, /ai/script-generator, /ai/script-rewriter, /ai/social-post-writer, /ai/summarizer, /ai/translate-video, /ai/turn-into-blog-post, /ai/youtube-description — [sitemap](https://www.descript.com/lp/sitemap-pages.xml)
- /tools hub plus roughly 300+ /tools/* long-tail SEO pages (format conversion, compress, trim, transcription by language, dubbing by language pair, title/hashtag/script generators) — [sitemap](https://www.descript.com/lp/sitemap-pages.xml)
- Use cases: /podcasting, /video-editing, /use-case/{case-studies, educational-video, marketing-video, product-demo, tutorial-video, webinar-recording}; 20 /video-generator/* pages (explainer, demo, promo, onboarding, testimonial, lyric video, etc.) — [sitemap](https://www.descript.com/lp/sitemap-pages.xml)
- Teams: /teams + 8 team pages (marketing, sales, sales-enablement, customer-success, customer-support, L&D, media, tech); /customers + 7 case studies (Algolia, Cloudinary, HubSpot, LinkedIn, Revelo, SaaStr, Shopify); /enterprise — [sitemap](https://www.descript.com/lp/sitemap-pages.xml)
- Compare (11): /compare/descript-vs-{camtasia, canva, capcut, captions-ai, google-vids, heygen, kapwing, loom, opus-clip, riverside, synthesia} — [sitemap](https://www.descript.com/lp/sitemap-pages.xml)
- Integrations: /integrations, /integrations/claude-motion, /integrations/edit-in-descript/{captivate, restream, squadcast} — [sitemap](https://www.descript.com/lp/sitemap-pages.xml)
- Templates: /templates + ~31 template pages (e.g. /templates/article-to-video, /slides-to-video, /real-estate-listing-video) — [sitemap](https://www.descript.com/lp/sitemap-pages.xml)
- Downloads: /download, /download/mac, /download/windows — [sitemap](https://www.descript.com/lp/sitemap-pages.xml)
- Webinars include /webinar/Edit-video-in-Claude-or-ChatGPT — [sitemap](https://www.descript.com/lp/sitemap-pages.xml)
- No changelog/what's-new page in the marketing sitemap; a public changelog exists on Canny — [descript.canny.io/changelog](https://descript.canny.io/changelog) (indexed; not opened, latest entries seen in search referenced 2025)

### Inferences
- Cardboard puts its "product page" energy into the homepage plus concrete artefacts (recipes, weekly changelog). A dedicated KeyFly Product page would be a structural difference from Cardboard, not a copy.
- Descript's breadth is SEO-driven (hundreds of thin tool pages); its depth for an agentic story is concentrated in /underlord, /mcp, /features and /video-editing.

### Gaps
- Did not fetch Descript's Canny changelog or any of the /ai/* or /tools/* sub-pages individually.
- Did not open Cardboard's /recipes/guides, /hard-problems or /support pages.

## Q2. Section structure and feature grouping of the main product pages

### Takeaway
Both vendors group features by **workflow stage**. Cardboard uses three stages ("Build the story / Shape the edit / Work and publish your way") and three steps ("Describe it / Direct it / Share it"); Descript uses five numbered stages (Record, Edit, Refine, Share, Multiply) on /features and an "AI does it vs. do it yourself" split on /underlord and /video-editing.

### Cited Findings
**Cardboard homepage (serves as product page)** — [cardboard.ai](https://cardboard.ai/)
1. Hero "Make any video you can think of." Prompt box + preset chips (Launch Video, UGC, Explainer, ...); CTA Get started.
2. "Remarkable video quality.": example video grid.
3. "Your first video in three steps": Describe it / Direct it (chat or timeline) / Share it (link or export).
4. "Everything you need to make videos", three groups: **Build the story** (generate video, images, music, SFX; motion graphics; voice cloning; web-sourced B-roll; reference links); **Shape the edit** (cut dead air, filler words, retakes; extract moments from long recordings; captions and reframing); **Work and publish your way** (connect Claude Code or Codex; share by link; fast rendering).
5. "Make videos the way you do everything else": Mac app promo, "Learn more".
6. "Your next product video, made in Cardboard": use-case categories (Product Showcases, Viral Trends, Launch Videos, UGC Ads, Explainers, Vlogs, Podcast Clips).
7. Pricing (four plans), 8. FAQ (devices, local vs cloud, own agent, footage privacy, sharing/export), 9. closing "Get started with one prompt."

**Cardboard /desktop** ("The AI video editor for your Mac"; subhead: drop in footage, say what you want) — [cardboard.ai/desktop](https://www.cardboard.ai/desktop)
- Order: hero with app screenshot → "Cardboard for Mac comes with Lite, included" → 1:05 product demo video ("Watch with sound") → "Faster editing, straight from your Mac" (4 points: bring your own agent, footage stays on your Mac, faster edits using fewer credits, large camera files) → "Made with Cardboard on the Mac" grid → "Your first edit in three steps" (download, drop footage, describe; the Director shows its plan, undo, timeline) → "Use your own agents" (paid Claude/ChatGPT plan, no API keys, no terminal) → "Connect in three steps" (model-picker mockup) → closing CTA → FAQ (free app, Intel, agents, Windows, vs Descript/CapCut/iMovie, export, web vs Mac projects, data).

**Cardboard /mcp (Plugins)** ("Your video editor, now in ChatGPT") — [cardboard.ai/mcp](https://www.cardboard.ai/mcp)
- Order: hero → animated mock ChatGPT window with three clip thumbnails → 3-step connect (find, install and connect, mention in chat; UI steps, no commands) → "What Cardboard can do in the chat" (categories: launch video, trendy edits, effects, product video, talking heads, vlogs; ~12 recipe cards each with "Try in ChatGPT"/"Try in Claude") → "Edit from your browser, desktop or phone" device mockups → "What users are asking" sample @Cardboard prompts → closing connect CTAs → 8-question FAQ.

**Cardboard /recipes** ("AI video editing recipes and examples"; "See a video you like? Make your own version of it.") — [cardboard.ai/recipes](https://www.cardboard.ai/recipes)
- Canvas and Grid views plus search (⌘F); cards show video preview, category, aspect ratio (16:9/9:16), title, one-line description and a "Remix" button. Categories: Launch video, Clipping, Effect, Viral trends, Travel montage, Talking-head, Product showcase. Only 11 cards rendered in the fetched markup, versus ~86 recipe URLs in the sitemap.

**Descript /features** ("From first take to final cut") — [descript.com/features](https://www.descript.com/features)
- Order: "What's new" (3 promos: Descript MCP, Underlord, Smooth Jump Cuts) → 01 Record → 02 Edit (edit the transcript like a doc) → 03 Refine (Studio Sound, Eye Contact, Green Screen) → 04 Share (captions, publishing, export, descriptions/chapters/show notes) → 05 Multiply (clips, translation, social posts, MCP, API) → "Every feature defined" glossary of **22 features** → Plans → 4-question FAQ → closing "Record, refine, and release. All in Descript."
- ~30 feature cards across the five stages (six each, some overlap).
- Nav also groups AI features by capability: Market/Promote, Look Good, Sound Good; Solutions menu by industry, team and use case.

**Descript /underlord** ("Your all-in-one video agent"; frames it as "vibe editing") — [descript.com/underlord](https://www.descript.com/underlord)
- Order: "Say what you want. Underlord makes it happen." (3 cards on judgment, Descript knowledge, endurance) → "Any job. Any video." rotating carousel of **16 example prompts** → "Create something impressive—fast" (4 workflows: scriptwriting, content-to-video, bulk edits, find clips) → "Rather do it yourself? That's easy too." (text editing, scenes/layouts, one-click AI actions) → AI templates → Pricing.

**Descript /video-editing** ("All-in-one video editing"; "Text-based editing makes it easy, your AI co-editor, Underlord, makes it fast.") — [descript.com/video-editing](https://www.descript.com/video-editing)
- Order: "Never edit alone" (Underlord) → AI for impressive pitches/demos (script, design, generated video) → "Want to do it yourself?" (text-based editing, scenes) → "Wildly useful AI tools" grid of 11 → logo wall → "Whatever your business needs" (9 use cases) → "Video editing at its finest" (precision controls, timeline) → AI templates → FAQ (14 Qs) → testimonials/G2 → pricing.

**Descript /mcp** ("Video editing MCP"; edit video without opening a video editor) — [descript.com/mcp](https://www.descript.com/mcp)
- Order: hero → "Setup in seconds" (connect, ask, open Descript to review) → scrolling example prompts → "Put Descript to work" (5 paths) → "Works in the assistant you use" → "What is an MCP, actually?" explainer → capability list (import, run edits, publish share link, export transcripts TXT/MD/HTML/RTF/SRT, export timelines EDL/AAF/SESX/FCPXML/Premiere XML/Resolve XML, manage projects, track jobs) → G2 + testimonials → FAQ (7).

**Descript /templates** ("...make it faster with AI templates") — [descript.com/templates](https://www.descript.com/templates)
- 32 cards, no categories or filters; each "By Descript", title, one line, "Use template"; framed as "battle-tested" workflows that guide Underlord; "Submit your template" community CTA.

### Inferences
- Both competitors converge on a 3-step "describe / refine / share" explainer and a stage-grouped feature list. KeyFly's site already uses "Describe it / Keyfly edits / Export anywhere"; a Product page that shows each stage as a live demo (rather than a card list) would differ from both.
- Descript's "AI does it / or do it yourself" pairing is a direct answer to "black box" worries, similar to KeyFly's "You make the calls" section.

### Gaps
- Feature card counts on Cardboard's homepage groups are approximate (the text listing doesn't separate cards cleanly).
- Recipe library count discrepancy (11 rendered vs ~86 in sitemap) could be lazy loading; not verified in a browser.

## Q3. Proof devices

### Takeaway
Cardboard relies on product artefacts (demo video, mockups, recipe gallery, weekly changelog with videos) and **has no customer logos or testimonials** on its product pages; Descript leans on enterprise social proof (15-logo wall, G2 4.6 from 837 reviews, named-initial testimonials, SaaStr/LinkedIn metrics).

### Cited Findings
- Cardboard homepage: no customer logos or testimonials; speed claims "Render an hour of footage in about five minutes" (demo shows "12× faster than real time") and footer "Create stunning content 10x faster"; demo counters (132 clips watched, 73 shots matched) are illustrative — [cardboard.ai](https://cardboard.ai/)
- Cardboard /desktop: one 1:05 demo video, app/timeline/menu-bar/model-picker mockups, "Made with Cardboard on the Mac" grid; only integration logos (Claude, Codex, Chrome, Apple); YC link — [cardboard.ai/desktop](https://www.cardboard.ai/desktop)
- Cardboard /mcp: animated mock chat demo, device mockups, recipe posters, sample user prompts; "Made within SF" footer line — [cardboard.ai/mcp](https://www.cardboard.ai/mcp)
- Cardboard changelog: weekly, numbered issues, hero image or video per entry, "Improvements" and "Fixes" lists; recent entries embed short demo videos — [cardboard.ai/changelog](https://www.cardboard.ai/changelog)
- Third-party: a YC W26 company; vendor-adjacent profiles name PostHog, Hyperspell and Autumn AI as users (unverified); Toolradar reports 4.1/5 from 15 G2 reviews — [YC](https://www.ycombinator.com/companies/cardboard); [Toolradar](https://toolradar.com/tools/cardboard) (aggregator; treat with caution)
- Descript /video-editing: 15-logo wall shown twice ("These companies use Descript. Not bad!": Amazon, Canva, Salesforce, Figma, Apple, Okta, Spotify, Vox, Reuters, CBS, Microsoft, NYT, GitHub, KPMG, Coke); G2 4.6/5 and a 2026 "Best Software" badge; 6 testimonials; product screenshots — [descript.com/video-editing](https://www.descript.com/video-editing)
- Descript metrics reused across pages: SaaStr "Increased content production by 100%, publishing 3-4 videos/day"; LinkedIn "10+ clips from a single interview" — [descript.com/features](https://www.descript.com/features)
- Descript /features: six embedded Wistia videos near the close; illustrations; no testimonials; unbacked "Industry-leading accuracy & speed" for transcription — [descript.com/features](https://www.descript.com/features)
- Descript /underlord: illustrative images, prompt carousel; no product video or interactive demo in the markup — [descript.com/underlord](https://www.descript.com/underlord)
- Descript /mcp: G2 4.6 from 837 reviews, three testimonials (e.g. editing time cut to about a quarter) — [descript.com/mcp](https://www.descript.com/mcp)

### Inferences
- Cardboard's proof is "show the product, ship weekly"; Descript's is "big brands use us". KeyFly cannot use logos or testimonials it doesn't have (project rule), so the Cardboard model (real artefacts, changelog cadence, honest illustrative labels) is the realistic path; a real KeyFly changelog would be a credible proof device.
- Cardboard's "hour of footage in about five minutes" is the one concrete speed claim on either site's product pages; Descript's speed claims are vague ("seconds", "fast").

### Gaps
- Could not view the actual videos, so their length/content (other than the 1:05 Mac demo) is unknown.
- Could not see whether Descript's G2 badge images match the claimed text.

## Q4. CTAs, pricing and trial mentions

### Takeaway
Cardboard repeats one CTA ("Get started", plus "Free download for Mac" on /desktop) and embeds full pricing on the homepage; Descript pairs "Get started for free" with sales CTAs ("Contact sales", "Book a demo", "Request a demo") and embeds a pricing block on nearly every product page.

### Cited Findings
- Cardboard homepage CTAs: "Get started" (hero, showcase, each plan, closing "Get started with one prompt"), "Learn more" (Mac), "Compare all plans" — [cardboard.ai](https://cardboard.ai/)
- Cardboard /desktop CTAs: "Free download for Mac" (primary, repeated 4 times), "Email me the Mac link", "Use in browser", "See all plans" — [cardboard.ai/desktop](https://www.cardboard.ai/desktop)
- Cardboard /mcp CTAs: "Connect to ChatGPT", "Connect to Claude", per-recipe "Try in ChatGPT"/"Try in Claude" (pre-fills a prompt) — [cardboard.ai/mcp](https://www.cardboard.ai/mcp)
- Cardboard pricing: Lite $5 first month then $8–10/mo (no generative AI); Starter $9 then $29–40 (400 generative credits, watermark-free, NLE export); Creator (recommended) $30 then $59–100 (1,500 credits, voice cloning, web B-roll, 4K, style/audio matching from links); Pro $89 then $175–250 (5,000 credits, all models). Annual saves up to 61%; launch pricing up to 78% off the first month. Two credit types: "usage credits" (agent analysis, edits, captions, cloud time) and "generative credits" (AI video/image/music/SFX). Named models: Hailuo, Kling 2.5, Kling 3, Veo, "Seed Dance 2.5" — [cardboard.ai/pricing](https://www.cardboard.ai/pricing)
- Cardboard: no standard free trial; Lite is free only in the Mac app (one-time usage allowance, "Made with Cardboard" watermark, 3 watermarked 1080p exports) — [cardboard.ai/pricing](https://www.cardboard.ai/pricing); [cardboard.ai/desktop](https://www.cardboard.ai/desktop). The changelog mentions a "3-day free trial" added Jul 20, which conflicts with the current pricing page — [cardboard.ai/changelog](https://www.cardboard.ai/changelog)
- Descript CTAs: "Get started for free" (hero/closing), "Compare plans", per-stage CTAs ("Start recording free", "Try text-based editing", "Clean up a recording", "Publish your first video", "Make your first clip"), "Book a demo", nav "Contact sales" — [descript.com/features](https://www.descript.com/features)
- Descript plans: Free $0 (1 media hour/mo, 100 one-time AI credits, 720p watermarked, limited Underlord); Hobbyist $16/$24 (10 hrs, 400 credits, 1080p); Creator $24/$35 "Most Popular" (30 hrs, 800 credits, 4K, full Underlord); Business $50/$65 (40 hrs, 1,500 credits, SLA). The two prices per tier are unlabelled on the page (checkout link implies annual) — [descript.com/underlord](https://www.descript.com/underlord); [descript.com/features](https://www.descript.com/features)
- Descript: "Start free, no credit card required" — [descript.com/features](https://www.descript.com/features)

### Inferences
- Both put pricing inside product pages, so a product page without a pricing block would be unusual; KeyFly already has a Pricing section fed by its API.
- Cardboard's two credit types and model-name lists are complex; KeyFly's single "AI minutes" unit is a simpler story worth stating plainly.

### Gaps
- Did not verify whether Cardboard's 3-day trial was later withdrawn (changelog vs pricing conflict).

## Q5. Comparison ("vs") content

### Takeaway
Descript publishes 11 dedicated /compare pages built around one-sided tables (CapCut page: Descript wins 13 rows, 0 losses, 5 ties) plus enterprise rows (SOC 2, SSO, encryption). Cardboard has no /compare section; it runs blog-format comparisons (Premiere Pro, Opus Clip, InVideo, "best Descript alternatives") that are more balanced and admit weaknesses.

### Cited Findings
- Descript vs CapCut: headline "Descript vs. CapCut"; logo bar → "Quick comparison guide" table → three "Learn more" subsections (text editing, Underlord, layouts) → demo CTA → FAQ incl. "Is Descript better than CapCut?". Rows include AI clips, highlight reel, recording, multi-track, Studio Sound, eye contact, SOC 2, GDPR, SSO/SCIM, encryption (256-bit vs 128-bit), seats (unlimited vs 1), storage. No Descript weaknesses admitted; says "better than CapCut, hands down" — [descript.com/compare/descript-vs-capcut](https://www.descript.com/compare/descript-vs-capcut)
- Descript compare targets: Camtasia, Canva, CapCut, Captions AI, Google Vids, HeyGen, Kapwing, Loom, Opus Clip, Riverside, Synthesia (no Cardboard page) — [sitemap](https://www.descript.com/lp/sitemap-pages.xml)
- Cardboard "Premiere Pro vs Cardboard AI" (Nov 3, 2026, Cardboard Team): use-case scorecards (Cardboard wins podcast/webinar clips and ad variations; Premiere wins long-form finishing); admits no free trial, watermarked Lite, no real-time co-editing or Teams plan, Mac app Apple Silicon only with no Windows, plugin access not guaranteed and uses credits — [cardboard.ai blog](https://www.cardboard.ai/blog/premiere-pro-cardboard-ai-compared)
- Cardboard "Best Descript Alternatives ... in 2026" (Sep 7, updated Nov 3, 2026): ranks Cardboard #1, then Premiere Pro, CapCut, Pictory, Kapwing, VEED; says Descript "breaks down with complex raw footage workflows" (transcript-bound search, multicam, non-dialogue footage); table marks Descript as lacking natural-language first cuts, semantic search, 4K and XML export — [cardboard.ai blog](https://www.cardboard.ai/blog/best-descript-alternatives). Note: Descript's own pages contradict parts of this (Descript lists 4K export on Creator and FCPXML/Premiere/Resolve XML export via MCP) — [descript.com/mcp](https://www.descript.com/mcp); [descript.com/video-editing](https://www.descript.com/video-editing)
- Cardboard /desktop FAQ compares with Descript, CapCut and iMovie — [cardboard.ai/desktop](https://www.cardboard.ai/desktop)

### Inferences
- Cardboard's anti-Descript angle is "raw, non-dialogue footage" vs "transcript-first", and its claims about Descript's export/4K appear inaccurate, a risk for any vendor-written comparison.
- Descript's tables win on enterprise checkboxes; KeyFly can't match those yet and shouldn't claim them (project rule against invented claims).

### Gaps
- Did not open Cardboard's Opus Clip and InVideo comparison posts or any other Descript compare page.

## Q6. Distinctive ideas and how prominently they're shown

### Takeaway
Cardboard's differentiators are agent-native: bring-your-own Claude/Codex agent, ChatGPT/Claude plugins, local footage on Mac, web-sourced B-roll, reference-video style matching, and an agent that "got eyes" (reviews rendered frames). Descript's are Underlord as an "agentic co-editor", text-based editing, Studio Sound/Eye Contact, a full MCP server with timeline exports, an API (open beta May 2026), and a Claude Motion integration.

### Cited Findings
**Cardboard**
- Bring-your-own agent: homepage says "connect Claude Code or Codex" — [cardboard.ai](https://cardboard.ai/); the /desktop page and the Sep 28 changelog say Claude and Codex via a paid Claude/ChatGPT plan, "no API keys, no terminal" and do not name Claude Code — [cardboard.ai/desktop](https://www.cardboard.ai/desktop); [changelog](https://www.cardboard.ai/changelog). Also "any agent that supports the CLI or MCP" — [cardboard.ai](https://cardboard.ai/)
- ChatGPT and Claude plugins (Oct 26, 2026): edit in chat, then open the project in Cardboard; clips up to 512 MB in chat, 2.5 GB in Cardboard upload (10 GB on Pro) — [changelog](https://www.cardboard.ai/changelog); [cardboard.ai/mcp](https://www.cardboard.ai/mcp)
- Local processing on Mac ("footage stays on your Mac", no upload round trip); FAQ qualifies that frames and transcript are sent for edits — [cardboard.ai/desktop](https://www.cardboard.ai/desktop)
- Web-sourced B-roll: agent searches stock libraries and public archives and adds credited clips (Jun 29) — [changelog](https://www.cardboard.ai/changelog); a Creator-tier feature — [pricing](https://www.cardboard.ai/pricing)
- References: attach a reference video/image so the agent matches colour, pacing and fonts (Jul 27) — [changelog](https://www.cardboard.ai/changelog)
- "The Agent Got Eyes": reviews rendered frames to catch and fix problems (Jul 20); "Director checks its own work" (Aug 24) — [changelog](https://www.cardboard.ai/changelog)
- Voice cloning (introduced Jan 11), 3D scenes (Oct 5), photos to video (Oct 20), Recipes/remix (Oct 13), share links with timestamped comments (Jul 6) — [changelog](https://www.cardboard.ai/changelog)
- NLE export: Premiere Pro, Final Cut Pro, DaVinci Resolve (paid plans); import from X, Instagram, YouTube, Vimeo links (Creator+) — [cardboard.ai](https://cardboard.ai/)
- The agent is called "the Director"; it shows its plan and allows undo — [cardboard.ai/desktop](https://www.cardboard.ai/desktop)

**Descript**
- Underlord framed as "video agent", "agentic video co-editor", "collaborator"; "vibe editing" — [descript.com/underlord](https://www.descript.com/underlord)
- MCP works in Claude (desktop, web, Claude Code), ChatGPT, Cursor and any MCP client; Codex not named; no on-demand MP4 export via MCP (share link instead), no YouTube imports — [descript.com/mcp](https://www.descript.com/mcp)
- Claude Motion integration: send an Anthropic Claude Motion animation (beta, Team/Enterprise) to Descript as a flat MP4 to add voice, footage, captions — [descript.com/integrations/claude-motion](https://www.descript.com/integrations/claude-motion)
- API open beta announced May 14, 2026 — [Newsfile](https://www.newsfilecorp.com/release/297461/Descript-Launches-API-in-Open-Beta-with-Editing-and-Workflow-Updates)
- Underlord originally launched June 2025 (search summary; not verified on a primary page) — [Product Hunt](https://www.producthunt.com/p/descript/underlord-by-descript)

### Inferences
- The "bring your own agent" and "edit in ChatGPT/Claude" stories are now table stakes between these two; KeyFly's "Works with your tools" (Claude Code, Codex, Cursor, Antigravity, ACP agents; FCPXML/EDL/OTIO export) is broader on agents than Cardboard's /desktop page and matches Descript on timeline formats.
- Cardboard's web B-roll, reference matching and self-checking agent are shown mainly in the changelog and pricing table, not as hero features; a KeyFly Product page can surface comparable capabilities more visibly (only if KeyFly confirms them).

### Gaps
- Could not confirm whether Cardboard actually supports Claude Code (homepage vs /desktop conflict).
- Did not verify Descript 2026 Underlord model updates; only aggregator sources mentioned them.

## Q7. What feels weak, generic or missing

### Takeaway
Cardboard: no Windows app, no customer proof, confusing two-credit pricing and conflicting free/trial messaging, and its Product story is scattered across homepage, changelog and pricing. Descript: generic stock-SaaS structure, one-sided comparison tables, unlabelled prices, recycled two-customer metrics, and a thin Underlord page with no real demo.

### Cited Findings
- Cardboard has no Windows app ("coming"; Windows users sent to browser); Mac app is Apple Silicon only; phones/tablets unsupported in the editor — [cardboard.ai/desktop](https://www.cardboard.ai/desktop); [cardboard.ai](https://cardboard.ai/)
- Cardboard Lite shown free on Mac but $5 first month on web — [cardboard.ai](https://cardboard.ai/); [pricing](https://www.cardboard.ai/pricing)
- Cardboard's own comparison admits no real-time co-editing, no Teams plan, Google Drive folder links import only the first file — [cardboard.ai blog](https://www.cardboard.ai/blog/premiere-pro-cardboard-ai-compared)
- Cardboard's "footage stays on your Mac" is partly qualified in the FAQ (frames and transcript are sent) without a clear explanation — [cardboard.ai/desktop](https://www.cardboard.ai/desktop)
- Cardboard's "10x faster" tagline has no source — [cardboard.ai/desktop](https://www.cardboard.ai/desktop)
- Third-party review flags premium pricing for small teams; ratings base is small — [Outlier Kit](https://outlierkit.com/resources/cardboard-review/); [Toolradar](https://toolradar.com/tools/cardboard) (aggregators)
- Descript prices shown as two unlabelled numbers per tier — [descript.com/underlord](https://www.descript.com/underlord)
- Descript /features doesn't name platforms (desktop download exists for Mac and Windows per /video-editing FAQ) — [descript.com/features](https://www.descript.com/features); [descript.com/video-editing](https://www.descript.com/video-editing)
- Descript compare pages concede no weaknesses — [descript.com/compare/descript-vs-capcut](https://www.descript.com/compare/descript-vs-capcut)
- Descript /underlord has no product video or interactive demo in its markup; claims are generic ("tireless", "views roll in") — [descript.com/underlord](https://www.descript.com/underlord)
- Descript MCP can't export MP4 on demand or import YouTube links — [descript.com/mcp](https://www.descript.com/mcp)
- Descript templates page has no categories or filters across 32 cards — [descript.com/templates](https://www.descript.com/templates)

### Inferences
- KeyFly's confirmed Windows desktop build is a clear, citable difference from Cardboard (whose Mac app is Apple Silicon only and Windows "coming").
- Neither competitor's Underlord/Director page shows a working, interactive demo of the agent editing; KeyFly's working prompt box and scroll demos are a gap to exploit on a Product page.
- Honest, specific limits (Cardboard's comparison posts) read as more credible than Descript's clean-sweep tables.

### Gaps
- Did not evaluate page performance, accessibility or mobile layouts of either site.
- No 2026 independent (non-aggregator) review of Cardboard was found; Descript reviews found were aggregator sites, so not used.
