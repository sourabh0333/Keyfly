# Best practices for SaaS product / features pages (2024-2026), with emphasis on AI and video tools

Research date: 2026-11-04. Scope: structuring and writing a product/features page (distinct from the homepage and pricing) for KeyFly, an AI video editor. Source quality note: much of the open-web "best practice" literature on features pages comes from agencies and vendors with commercial interests. The most rigorous sources found were primary: NN/g's B2B report contents, Navattic's benchmark data (vendor, but large first-party dataset), FTC guidance, W3C WCAG, Google Search Central and web.dev. Where a claim rests only on agency opinion it is marked as such.

## 1. Role of the product/features page vs homepage, pricing and feature sub-pages; who lands there and why

### Takeaway
The product page is the "how does it actually work, and does it solve my problem" page for visitors who already understand the category from the homepage or an ad; the strongest current pattern (Linear, Descript, Runway) is a hub that summarises the product in a few grouped capabilities and deep-links each to its own sub-page, rather than a long single page that tries to say everything.

### Cited Findings
- NN/g's B2B usability report (3rd edition, 293 B2B sites tested in the US, UK and Singapore) has dedicated guidance on "Making product and service pages compelling", "Demonstrating how you solve your prospects' problems", "Including the right technical specifications", "Building comparison charts that win customers" and "Best practices for images, multimedia, and videos". The detailed guidelines are paywalled (419 pages, 188 guidelines). — [NN/g B2B Website Usability report](https://www.nngroup.com/reports/b2b-websites-usability/)
- The same NN/g report distinguishes "users" (people who use the product) from "choosers" (people who approve the purchase) and says sites must be designed for both. — [NN/g B2B Website Usability report](https://www.nngroup.com/reports/b2b-websites-usability/)
- Linear's /features page is a hub: one headline ("The system for modern product development"), eight feature cards split into a core pair (Planning, Building) and six secondary capabilities (AI, Insights, Mobile, Customer Requests, Asks, Security), each card linking to its own sub-page (/plan, /build, /ai, /insights, /mobile, /customer-requests, /asks, /security). CTAs ("Get started", "Contact sales") appear in the hero. — [Linear features](https://linear.app/features)
- Descript's tools page acts as a capability index: hero "Audio & Video Tools" with eight anchor tabs (Video, Audio, AI, Transcribe, Write, Record, Collaborate, Convert), each group a list of tool links with one-line descriptions, linking to product pages (/video-editing, /captions, /transcription, /templates), AI feature pages (/clips, /eye-contact, /studio-sound, /filler-words, /regenerate, /underlord) and hundreds of /tools/ pages. — [Descript tools](https://descript.com/tools)
- Runway's /product page is a showcase hub: full-width video hero with one "Get Started" CTA, then grouped sections (model showcase, latest tools, tool categories with example prompt chips, single-purpose apps, workflows), each card with "Try now" and often "Learn more" links to sub-pages. — [Runway product](https://runway.com/product)
- An agency round-up (updated 2026-10-14) notes that several strong SaaS sites (e.g. Baremetrics) use a separate page per feature with feature-specific imagery and testimonials and links onward to other features; Workplace uses a summary at the top and each feature explored in detail below. — [Powered by Search: best SaaS product features pages](https://poweredbysearch.com/learn/best-saas-product-features-pages)
- Agency guidance suggests multiple features pages can exist, one per solution or buyer persona, and that FAQs on features pages capture long-tail question searches (agency opinion, not data). — search summary of [8seneca](https://www.8seneca.com/blog/all-articles/create-best-b2b-saas-product-features-pages-examples) and [Andava](https://www.andava.com/learn/7-best-practices-of-saas-features-page/)

### Inferences
- Visitors to a Product page are mid-funnel evaluators: they clicked "Product" in the nav after the homepage, or arrived from search for a capability ("AI video editor that removes filler words"). They want mechanism and proof, not a second pitch.
- For KeyFly, whose homepage already narrates the whole story section by section (prompt, edit with words, your call, every format, brand kit, anywhere, tools, pricing, FAQ), the Product page should not repeat that scroll. It should be the organised reference: capabilities grouped, each explained concretely, with deep links to sub-pages once they exist (and anchors until then).
- Two audiences matter even for a prosumer tool: the person who edits (wants control, export formats, agent support) and the person who pays or approves (wants AI-minute costs, privacy, ownership).

### Gaps
- No public quantitative study was found comparing conversion of hub-style features pages vs single long features pages. NN/g's specific product-page guidelines are paywalled and could not be read.

## 2. Recommended structures: grouping, number of features, hero, sticky sub-nav, deep links

### Takeaway
Group features by the user's job or workflow stage (not by internal module names), lead with the few differentiating capabilities, keep each feature to a benefit headline plus one concrete visual, and give a long page in-page navigation; the leading examples show 6-10 top-level capabilities, not dozens.

### Cited Findings
- Linear: 8 capabilities, explicitly tiered into 2 primary and 6 secondary. — [Linear features](https://linear.app/features)
- Descript: 8 top-level groups surfaced as anchor tabs in the hero (in-page navigation), with the AI features further split in the nav by outcome: "Market/Promote", "Look Good", "Sound Good". — [Descript tools](https://descript.com/tools)
- Runway: groups by kind of offering (models, newest tools, task categories, single-purpose apps, workflows) and uses example prompt chips ("change outfit", "remove background") to show tasks rather than describing technology. — [Runway product](https://runway.com/product)
- Miro maps features to the stages of project management (workflow grouping); BambooHR groups features into broad categories with links to details; SmartRecruiters explains how the platform works first, then introduces feature functions as you scroll. — [Powered by Search](https://poweredbysearch.com/learn/best-saas-product-features-pages)
- Agency guidance: put features that solve core problems or differentiate you near the top; use a two-column layout pairing each benefit with a matching visual; lead with benefits, not technical terms; the first viewport decides whether the rest gets read (opinion). — search summary of [Yourcall.ai](https://yourcall.ai/blog/best-practices-for-showcasing-features), [Design Studio UI/UX 2026](https://www.designstudiouiux.com/blog/saas-website-best-practices/), [Blend B2B](https://www.blendb2b.com/blog/saas-product-page-design-7-best-practices-with-examples)
- April Dunford's positioning sequence (competitive alternatives, then differentiated capabilities, then value, then target customers, then market category) is widely used as the source for site copy; her framing is that the real alternative is often the status quo, not other logos. — [Miro: April Dunford's positioning template](https://miro.com/miroverse/april-dunfords-positioning-template); talk on "differentiated value" — [Business of Software Europe 2026](https://businessofsoftware.org/events/bos-europe-2026/differentiated-value-the-hardest-and-most-important-problem-in-positioning) (secondary summaries; her book "Obviously Awesome" is the primary source, not read here)

### Inferences
- Structure suggestion for KeyFly's Product page, derived from the above:
  1. Hero: what KeyFly is in one sentence (AI video editor for macOS, Windows and web), one primary CTA, one secondary; anchor tabs for the groups below.
  2. Groups by workflow stage, which matches how a video is made and how Dunford would frame the status quo (editing by hand): Create (prompt, templates, AI director: storyboard, voice-over, motion graphics) → Edit (edit with words, your footage: silences, filler words, captions, zooms) → Control (decisions you can change, Revert, the timeline is yours) → Brand (brand kit: logo, colours, font, tone, voice) → Deliver (formats, export, FCPXML/EDL/OTIO hand-off) → Work your way (desktop, browser, ChatGPT/Claude, own agents).
  3. Cap at about 6 groups with 2-4 features each; tier the differentiators (edit with words, keeps-the-timeline, own agents/no AI minutes) above commodity features (captions, aspect ratios).
  4. Each group: benefit headline, one sentence of mechanism, one real visual, a "learn more" link to its future sub-page.
- A sticky sub-nav (or anchor tabs in the hero, as Descript does) is justified once the page exceeds a few screens; it also gives sub-pages a natural URL plan (/product#edit now, /product/edit later).
- Avoid grouping by internal names (e.g. "Inspector", "Morph") that visitors don't know.

### Gaps
- No controlled study found on the optimal number of features per page; the 6-10 range is observed practice from exemplars, not tested evidence.
- Figma, Notion, Framer, Arc, Raycast, Loom and Superhuman pages were not fetched within the tool budget; their patterns are not verified here.

## 3. Proof and demos: video vs interactive demo vs looping UI vs screenshots; honest AI output; social proof; metrics

### Takeaway
Show the real product doing the real thing: AI video tools lead with actual output (looping clips), and interactive demos perform best when ungated, short (5-12 steps), mid-page and full-width; illustrations should be labelled as such, and social proof must be real and attached to the specific feature it supports.

### Cited Findings
- Navattic benchmark (28,000+ demos, 2025): top 1% of interactive demos have 84.4% engagement, 61.6% completion and 54.0% CTA click-through; top 25% have 50.1%, 28.9% and 12.8%. Average time spent is about 2 minutes. — [Navattic State of the Interactive Product Demo 2025](https://www.navattic.com/report/state-of-the-interactive-product-demo-2025)
- Same report: top-10% demos most commonly have 5-12 steps, 13-21 words per step and 1 CTA per flow; about 71% of top website demos are not gated by a form, and ungated demos have a 10% higher engagement rate; the most common entry CTA is "Take a tour"; 73% of entry CTAs are above the fold or in the navbar; embeds most often sit mid-page and full-screen. — [Navattic 2025](https://www.navattic.com/report/state-of-the-interactive-product-demo-2025)
- Same report: 88% of demo sessions are on desktop; desktop demos have a 52% higher CTR than mobile. — [Navattic 2025](https://www.navattic.com/report/state-of-the-interactive-product-demo-2025) (vendor data; selection bias toward companies that bought an interactive-demo tool)
- Runway uses a full-width video hero and looping video thumbnails for tools, i.e. shows output rather than describing it; it shows tasks via prompt chips. — [Runway product](https://runway.com/product)
- Descript's social proof on its tools page is specific and outcome-linked: SaaStr "Increased content production by 100%", LinkedIn "Produced 10+ clips from a single interview". Its AI feature descriptions say what each does but not how it works or its limits. — [Descript tools](https://descript.com/tools)
- Agency examples of feature-attached proof: Bench and Baremetrics show testimonials per feature; Bynder shows case studies with quantitative results; TravelPerk and Pleo link to review sites. — [Powered by Search](https://poweredbysearch.com/learn/best-saas-product-features-pages)
- Rytr was charged by the FTC (Operation AI Comply, 2024-09-25) for a tool that generated fake consumer reviews; the FTC has stressed deceptive reviews are unlawful whether or not AI writes them. — search summary of [Orrick](https://www.orrick.com/en/Insights/2024/10/FTC-Targets-Unfair-or-Deceptive-AI-Practices-With-Five-New-Enforcement-Actions) and [Skadden](https://skadden.com/insights/publications/2024/10/new-ftc-initiative-targets-deceptive-ai-claims-and-a-generative-ai-service)

### Inferences
- For a video product, the strongest proof is the output itself: short, muted, real clips of a prompt becoming a cut, and a before/after of footage (silences removed, captions added). KeyFly currently uses CSS-drawn illustrations labelled "Illustrative"; that labelling is the honest choice and should stay until real footage exists. A Product page is where real screen recordings matter most, so this is the main asset gap to close with the team.
- An interactive demo (clickable tour of the real editor) fits a Product page better than a homepage, but is desktop-led; provide a short video or static sequence as the mobile fallback.
- With no customers yet, use no logos or testimonials (project rule). Proof can instead come from verifiable facts: concrete specifics from the app (91 templates in 11 categories; FCPXML/EDL/OTIO exports; macOS and Windows builds with version and requirements; "Your projects stay yours and you can always export them").
- Metrics like "10x faster" need substantiation (see section 4/5); prefer counts and specifics that are simply true.

### Gaps
- No independent (non-vendor) study found comparing conversion of product video vs interactive demo vs static screenshots on SaaS features pages.
- No source found quantifying trust impact of "illustrative" labels vs real output for AI tools.

## 4. AI-specific trust: what the AI does and doesn't do, control/undo, privacy/data use, model choice, AI usage pricing

### Takeaway
Calibrate trust rather than maximise it: say plainly what the AI does and where a human stays in control, state limits, explain data use and ownership in plain language, and make any AI-usage pricing unit explicit; regulators treat unsupported AI claims as deceptive.

### Cited Findings
- Google's People + AI Guidebook: users should "calibrate their trust" rather than trust AI implicitly; be transparent about what the product can and cannot do; explainability and trust are inherently linked; trust is earned slowly. — [PAIR Explainability + Trust chapter](https://pair.withgoogle.com/chapter/explainability-trust/) (details via [PDF](https://pair.withgoogle.com/chapter/People%20+%20AI%20Guidebook%20-%20Explainability%20+%20Trust.pdf); older classic, 2019, updated 2021)
- FTC "Keep your AI claims in check" (Michael Atleson, 2023-02-27, older but still cited): asks whether you exaggerate what the AI can do, whether you claim it outperforms non-AI products without proof, whether you are aware of the risks, and whether the product uses AI at all; warns against baseless "AI-powered" claims; black-box design is no defence. — [FTC blog](https://www.ftc.gov/business-guidance/blog/2023/02/keep-your-ai-claims-check) (URL returned 404 on fetch; content per [Kelley Drye](https://www.kelleydrye.com/viewpoints/blogs/ad-law-access/ftc-reminds-advertisers-to-keep-ai-claims-in-check) and [Cooley](https://cdp.cooley.com/ftc-warns-to-keep-your-ai-claims-in-check-in-new-ai-guidance/))
- FTC Operation AI Comply (2024-09-25): five enforcement actions against exaggerated or fake AI claims, including DoNotPay's "robot lawyer" ($193,000 settlement) and Rytr (AI-generated fake reviews). — [Orrick](https://www.orrick.com/en/Insights/2024/10/FTC-Targets-Unfair-or-Deceptive-AI-Practices-With-Five-New-Enforcement-Actions); [Davis Polk](https://www.davispolk.com/insights/client-update/ftc-announces-new-enforcement-initiative-targeting-deceptive-ai-practices)
- Practitioner advice (opinion): explain AI in plain terms on a dedicated page or section, lead with outcomes, use expandable sections for technical depth, add a security/privacy section linking to the full policy, state what data is used and how it's stored. Secondary academic summaries report mixed effects: transparency raising trust in one study and "excessive transparency" lowering it in another, suggesting layered, concise disclosure. — search summary of [Webstacks](https://webstacks.com/blog/ai-transparency), [Lilach Bullock](https://www.lilachbullock.com/how-to-market-ai-products-to-a-sceptical-audience/), [Akyx](https://akyx.digital/blog/how-to-design-ai-landing-pages-that-convert) (figures unverified against originals)
- Runway lists the named models available ("Every model you need") and links to a Safety page, i.e. model choice and safety are surfaced on the product page. — [Runway product](https://runway.com/product)
- Linear gives AI its own capability page (/ai) and Security its own page (/security) rather than burying them. — [Linear features](https://linear.app/features)

### Inferences
- KeyFly already has the raw material for an honest AI section, all confirmed by the app (per PROJECT_CONTEXT): what the AI director makes (storyboard, voice-over, motion graphics); what you control (change any scene, Revert, the timeline stays editable and exportable to other editors); model choice (Cloud picks a model per step and uses AI minutes, or bring your own agents that don't use AI minutes); data ownership ("Your projects stay yours and you can always export them").
- A short "What the AI does / What you decide" pair, plus a "Your data" block linking to /privacy (currently "Being finalised"), would answer the main trust questions without overclaiming. Do not state privacy specifics (training on user content, retention) until the privacy policy confirms them.
- Explain "AI minutes" where AI features are presented, linking to pricing, using the API's wording; never "credits" (project rule).
- Avoid superlatives ("best", "perfect edits", "replaces your editor") that the FTC guidance flags as needing substantiation.

### Gaps
- No primary quantitative study found on how AI-limitation disclosures affect SaaS conversion; the 20%/25% figures circulating are second-hand and unverified.
- EU AI Act transparency obligations were mentioned in passing in search results but not verified for marketing pages.

## 5. Comparison sections and "vs" pages

### Takeaway
Comparisons help evaluators, and US regulators explicitly permit naming competitors if the comparison is truthful, clearly based and substantiated; for a new product without verified benchmarks, comparing against the status quo ("editing by hand") is lower risk and aligns with Dunford's view that the real alternative is often the status quo.

### Cited Findings
- FTC Statement of Policy Regarding Comparative Advertising (1979-08-13, older classic, still in force): the FTC encourages naming of or reference to competitors, requires clarity and, if necessary, disclosure; the bases of comparison should be clearly identified; truthful, non-deceptive comparisons (even disparaging ones) are allowed; the test is whether the ad has a tendency to deceive. — [FTC policy statement](https://www.ftc.gov/legal-library/browse/statement-policy-regarding-comparative-advertising)
- FTC AI guidance specifically asks whether claims that an AI product is better than non-AI alternatives are substantiated. — [Kelley Drye summary of FTC blog](https://www.kelleydrye.com/viewpoints/blogs/ad-law-access/ftc-reminds-advertisers-to-keep-ai-claims-in-check)
- NN/g's B2B report treats comparison charts as a distinct guideline area ("Building comparison charts that win customers"). — [NN/g B2B report](https://www.nngroup.com/reports/b2b-websites-usability/)
- Dunford: competitive alternatives are not necessarily competitors; the status quo is often the real competitor. — secondary summaries in search results incl. [Miro template](https://miro.com/miroverse/april-dunfords-positioning-template)

### Inferences
- KeyFly's homepage already uses a status-quo comparison (by hand vs with KeyFly) without naming competitors; the Product page can reuse that framing in a compact table (task → by hand → in KeyFly), qualitative only.
- Named "vs" pages (e.g. KeyFly vs Descript) belong as separate SEO pages later, only with dated, sourced, verifiable feature facts and a stated basis of comparison; trademarks used in text only, no competitor logos. Outside the US, comparative-advertising rules differ (e.g. EU directive on misleading and comparative advertising) and were not researched here.

### Gaps
- No data found on conversion lift from "vs" pages for early-stage products. EU/UK comparative advertising rules not verified in this pass.

## 6. CTA strategy on product pages

### Takeaway
Exemplars use one primary self-serve CTA (start free / get started) repeated at the hero and the end, a quieter secondary (contact sales, download, take a tour), and per-feature "try" or "learn more" links; ungated tours outperform gated ones.

### Cited Findings
- Linear: "Get started" plus "Contact sales" in the hero. — [Linear features](https://linear.app/features)
- Runway: a single "Get Started" in the hero, then per-card "Try now" and "Learn more"; "Contact sales" for enterprise. — [Runway product](https://runway.com/product)
- Descript: "Sign up" in header, "Contact sales", "Learn more" on customer stories. — [Descript tools](https://descript.com/tools)
- Agency examples: Goldcast places two CTAs at the top (book a demo or try the platform); Proposify repeats demo and trial CTAs throughout; ProductPlan puts a free trial offer prominently at the bottom. — [Powered by Search](https://poweredbysearch.com/learn/best-saas-product-features-pages)
- Navattic: in-demo CTA text "Learn more" had the highest CTR (63.3%), "Sign up" 53.4%, "Book a demo" 41.4% (small n, 34-92 per label); most top demos have one CTA per flow. — [Navattic 2025](https://www.navattic.com/report/state-of-the-interactive-product-demo-2025)

### Inferences
- For KeyFly (free plan, self-serve, web app plus desktop downloads): primary "Start free" (the Free plan sign-up link), secondary "Download" or "Open in your browser"; per-feature links that either try the thing (e.g. send a prompt to the app, "Browse templates") or go to its sub-page. Keep one solid mint button per view (existing design rule).
- No "Book a demo" unless the team offers one; a sales-led CTA would mismatch a free self-serve product.

### Gaps
- No rigorous data found on optimal CTA frequency on features pages.

## 7. Performance, accessibility and SEO for feature pages

### Takeaway
Heavy video must not hurt LCP: never lazy-load the above-the-fold hero media, use a poster image, defer offscreen video; autoplaying motion over five seconds needs a pause control (WCAG 2.2.2); use one H1, descriptive feature headings, and only valid structured data (SoftwareApplication rich results require real ratings or reviews).

### Cited Findings
- web.dev: lazy-loading images in the viewport is a pattern to avoid; eager-loading the first images reversed an LCP regression in tests; across CrUX, median p75 LCP was 2,922 ms without lazy loading and 3,546 ms with it (correlational). Data from 2020-2021 (older). — [web.dev: LCP and lazy loading](https://web.dev/articles/lcp-lazy-loading)
- WCAG 2.2 SC 2.2.2 Pause, Stop, Hide (Level A): moving content that starts automatically, lasts more than five seconds and is presented alongside other content needs a mechanism to pause, stop or hide it, unless the motion is essential. — [W3C Understanding 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
- Google SoftwareApplication structured data: required properties are name, offers.price (0 for free) and aggregateRating or review; operatingSystem and applicationCategory recommended; ratings must follow review-snippet guidelines, and violations can lead to manual action. — [Google Search Central: Software app structured data](https://developers.google.com/search/docs/appearance/structured-data/software-app)
- Navattic: 88% of interactive-demo sessions are desktop, with lower engagement on mobile, so heavy demos should not be the only mobile experience. — [Navattic 2025](https://www.navattic.com/report/state-of-the-interactive-product-demo-2025)

### Inferences
- KeyFly has no reviews, so it cannot validly earn SoftwareApplication rich results yet; do not add fake or self-written aggregateRating. Organization/WebPage/BreadcrumbList markup and a clean heading outline are the safe options.
- Each looping product clip: muted, `playsinline`, poster image, `preload="none"` or loaded on view, paused offscreen (KeyFly's `PauseOffscreen` pattern), with a visible pause control and a reduced-motion still. Hero media should not be lazy-loaded.
- One H1 naming the product category (e.g. "AI video editor" in words) and H2s that name capabilities in plain language help both search and scanning; animated or styled headings should still be real text.
- KeyFly's site is `noindex` until copy is confirmed (PROJECT_CONTEXT), so SEO work is preparatory.

### Gaps
- Did not fetch web.dev guidance specific to `<video>` as LCP element or `fetchpriority`; current Chrome behaviour for video posters as LCP candidates not verified here.

## 8. Common mistakes

### Takeaway
The recurring failures are feature dumps without hierarchy, jargon and internal names, unverifiable AI superlatives, logo walls or testimonials without context, and heavy autoplay video that harms speed and accessibility.

### Cited Findings
- Descript's tools hub lists several hundred tool links; useful as an SEO index but it explains little about how features work or their limits (an illustration of the feature-dump risk for a primary product page). — [Descript tools](https://descript.com/tools)
- Agency guidance warns against excess content that doesn't help a decision and recommends benefits over technical terms (opinion). — [Powered by Search](https://poweredbysearch.com/learn/best-saas-product-features-pages); search summary of [Yourcall.ai](https://yourcall.ai/blog/best-practices-for-showcasing-features)
- Unsupported AI claims, "AI-powered" labels without substance, and AI-generated fake reviews are enforcement targets. — [Kelley Drye on FTC blog](https://www.kelleydrye.com/viewpoints/blogs/ad-law-access/ftc-reminds-advertisers-to-keep-ai-claims-in-check); [Orrick on Operation AI Comply](https://www.orrick.com/en/Insights/2024/10/FTC-Targets-Unfair-or-Deceptive-AI-Practices-With-Five-New-Enforcement-Actions)
- Lazy-loaded hero media correlates with worse LCP. — [web.dev](https://web.dev/articles/lcp-lazy-loading)
- Auto-moving content over 5 s without a pause control fails WCAG Level A. — [W3C 2.2.2](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)
- Effective proof is attached to a specific outcome (Descript's per-customer results) or a specific feature (Bench, Baremetrics), not a bare logo strip. — [Descript tools](https://descript.com/tools); [Powered by Search](https://poweredbysearch.com/learn/best-saas-product-features-pages)

### Inferences
- KeyFly-specific risks: repeating the homepage's long animated scroll (the Product page should be faster to scan); too many simultaneous self-running demos (attention and performance); internal component names in headings; any time-saving number without data.

### Gaps
- NN/g's paywalled B2B report likely contains the strongest evidence on product-page mistakes; not accessible.

## 9. Exemplary product pages and what makes them work

### Takeaway
Linear (tiered capability hub with sub-pages), Runway (real output and task prompts), and Descript (outcome-grouped tools with anchor tabs and outcome-linked proof) are the most relevant verified exemplars for KeyFly; other named exemplars could not be checked in this pass.

### Cited Findings
- Linear /features: minimal copy, 8 capabilities in two tiers, every card a deep link, CTAs at top. — [Linear features](https://linear.app/features)
- Runway /product: video hero, "60M+ users" claim, named models, prompt chips showing tasks, single-purpose apps, links to Safety, Changelog and Research. — [Runway product](https://runway.com/product)
- Descript /tools: anchor-tab sub-navigation, AI features grouped by outcome (Market/Promote, Look Good, Sound Good), outcome-specific customer proof, deep links to feature pages. — [Descript tools](https://descript.com/tools)
- Other agency-cited examples: Squarespace (animation and a template carousel suited to a design product), Miro (features mapped to workflow stages, plus templates and learning links), ServiceNow (video demos, testimonial, FAQs). — [Powered by Search](https://poweredbysearch.com/learn/best-saas-product-features-pages)

### Inferences
- A KeyFly Product page combining Linear's hierarchy (few grouped capabilities, each deep-linked), Runway's "show the output and the prompt" and Descript's outcome grouping and anchor tabs, while keeping the project's honesty rules (labelled illustrations, no invented proof), would be distinct from the homepage and aligned with the evidence.
- Templates are a proven proof device for creative tools (Squarespace, Runway, Descript all surface them); KeyFly's real "91 templates in 11 categories" with a link to browse them fits here.

### Gaps
- Figma, Notion, Framer, Arc, Raycast, Loom, Superhuman, Captions, CapCut and Synthesia product pages were not fetched (tool budget); claims about them are not included. Growth.Design and CXL case studies specific to features pages were not found in this pass.
