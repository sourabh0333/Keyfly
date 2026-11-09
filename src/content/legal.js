import { siteConfig } from "@/config/site";

// The legal pages. The app's sign-in links to keyfly.si/terms and
// keyfly.si/privacy.
//
// DRAFT FOR REVIEW (2026-11-09). Written at the team's request, following
// the structure of AI video editors' current Terms and Privacy pages, and
// built only on what the KeyFly app, its help, its data notes and the
// pricing API state. Anything they don't state (the company's address and
// jurisdiction, payment processor, providers, retention periods, refunds,
// training policy, liability cap…) is wrapped in {{…}} and shows in amber
// on the page: the team (and a lawyer) must confirm or replace each one,
// then set `draft: false`, which removes the chip, opens the page to search
// and adds it to the sitemap.
//
// Inline markup: [label](href) links, **text** emphasis, {{text}} to confirm.

const name = siteConfig.name;
const company = siteConfig.company;
const help = "[help@keyfly.si](mailto:help@keyfly.si)";

export const legal = {
  draftLabel: "Draft for review",
  tocLabel: "On this page",
  plainLabel: "In plain words",
  back: { label: "Back to KeyFly", href: "/" },

  terms: {
    path: "/terms",
    draft: true,
    eyebrow: "Legal",
    title: [{ text: "Terms of" }, { text: "Service.", accent: true }],
    meta: "Terms of Service",
    description: `The terms for using ${name}: your account, plans and AI minutes, what you own, and how to use the AI fairly.`,
    updated: { iso: "2026-11-09", text: "9 November 2026" },
    effective: null,
    intro: [
      `These terms are the agreement between you and ${company} for using ${name}: the website, the web app at app.keyfly.si, the desktop apps for Mac and Windows, and ${name} inside other apps such as ChatGPT and Claude. We've kept them as plain as we can. The summary below and the \"In plain words\" notes are a guide, not part of the terms; the sections themselves are the terms.`,
    ],
    summary: {
      title: "In short",
      items: [
        { title: "Your videos are yours", text: "You own what you upload and what you make. We use it only to run KeyFly for you." },
        { title: "You can always leave", text: "Cancel any time. Your projects stay yours and you can always export them, even after you cancel." },
        { title: "AI minutes, shown first", text: "Each AI action shows its cost before it runs, and failed jobs are refunded automatically." },
        { title: "Use the AI fairly", text: "Only use footage, voices and faces you have the right to use. No deceptive deepfakes." },
        { title: "Check what the AI makes", text: "AI can get things wrong. Review every video before you publish it." },
        { title: "Your own AI, your own plan", text: "Agents you connect, such as Claude Code or Codex, run under their own terms." },
      ],
    },
    sections: [
      {
        id: "agreement",
        title: "Who we are and these terms",
        plain: `By using ${name}, you agree to these terms. If you use it for a company, the company agrees too.`,
        blocks: [
          `${name} is made by ${company}, {{a company incorporated in [state or country], registered address [address]}} ("we", "us"). These terms cover every part of ${name} we offer, together called the **Services**.`,
          "By creating an account or using the Services, you accept these terms and our [Privacy Policy](/privacy). If you use the Services for an organisation, you confirm you're allowed to accept these terms for it, and \"you\" means the organisation too.",
          "Enterprise customers may sign an order form or agreement with us. Where it differs from these terms, it takes priority.",
        ],
      },
      {
        id: "account",
        title: "Your account",
        plain: "Be old enough, keep your sign-in safe, and tell us if something's wrong.",
        blocks: [
          "You can sign in with Google, GitHub or LinkedIn, or with your email address. You must be at least {{16}} years old, and old enough to agree to these terms where you live. If you're under 18, a parent or guardian must agree to them for you. Voice cloning and features that use a real person's voice or likeness are for adults (18 or over) only.",
          "Keep your account details accurate and your sign-in secure. You're responsible for what happens in your account. If you think someone else has used it, write to " + help + " straight away.",
          "On a team plan, the team's admins can invite and remove members, manage shared brand kits and the library, and see and manage the team's projects. The team's owner is responsible for the team's use and its bill.",
        ],
      },
      {
        id: "plans",
        title: "Plans, AI minutes and payment",
        plain: "Prices are on the pricing page. Paid plans renew until you cancel. AI minutes count only while KeyFly's AI works.",
        blocks: [
          "Our plans, what each includes and their prices are on the [pricing page](/pricing). Prices are in US dollars and {{exclude / include}} taxes such as VAT or sales tax, which are added where the law requires.",
          "Paid plans are billed in advance, monthly or yearly, and **renew automatically** at the end of each period until you cancel. Payments are handled by {{our payment provider, [name]}}; we don't store your full card details.",
          "**AI minutes** are the unit for the work KeyFly's cloud AI does: building, editing, voice, captions and images. They count only the AI's actual work, never idle time, waiting or time on the clock. Each action shows its cost before it runs, and if a job fails, its AI minutes come back automatically. Editing by hand, exporting and edits made by your own AI agent use none.",
          "Your plan's AI minutes are added each billing period. {{Unused plan minutes do not roll over to the next period.}} You can buy an AI-minute pack at any time; {{packs don't expire while your account is open}}. Your plan's minutes are used first, then pack minutes. AI minutes have no cash value and can't be transferred or exchanged.",
          "On a Team plan, you pay per seat. {{Seats you add are charged straight away for the rest of the billing period.}} If a payment fails, {{we'll retry it and tell you; if it still fails after [7] days, the account may move to the Free plan until it's paid}}.",
          "We may change prices or plans. We'll tell you at least {{30 days}} before a price change applies to you, and it takes effect at your next renewal. If you don't agree, you can cancel before then.",
        ],
      },
      {
        id: "free",
        title: "The free plan and free trial",
        plain: "Free is free for good, with no card. The trial needs no card and ends without a charge.",
        blocks: [
          "The Free plan costs nothing, needs no card and doesn't expire. Videos exported on it carry a small KeyFly mark; please don't remove or hide it.",
          "New accounts start with a 7-day trial of the Creator plan, with no card needed. When it ends, the account moves to the Free plan: no charge, and nothing you made is locked. One trial per person; please don't create extra accounts to get more.",
          "We may change or end free plans and trials for the future, but never in a way that takes away projects you've made.",
        ],
      },
      {
        id: "cancel",
        title: "Cancelling and refunds",
        plain: "Cancel whenever you like. You keep your plan to the end of the period you paid for, and you keep your projects.",
        blocks: [
          "You can cancel a paid plan at any time {{in Settings → Plan and billing}}. It stays active until the end of the period you've paid for, then moves to the Free plan. Your projects stay yours, and you can always export them, even if you cancel. {{If they use more storage than the Free plan includes, you can still open and export them, but can't add new files until you're under the limit.}}",
          "{{Payments are non-refundable, except where the law requires a refund or we decide otherwise. If something has gone wrong, write to us and we'll look at it.}}",
          "**If you're a consumer in the EU or UK:** you normally have 14 days to withdraw from a purchase of digital services. {{By starting to use a paid plan or pack straight away, you ask us to begin at once and accept that you lose this right for what you've already used.}}",
        ],
      },
      {
        id: "your-content",
        title: "Your content",
        plain: "What you put in and what you make is yours. We only use it to run KeyFly for you.",
        blocks: [
          "**Your content** is everything you add to the Services: footage, audio, pictures, prompts, scripts, brand kits, voice samples, comments and projects, and the videos made from them.",
          "**You own your content.** You give us a worldwide, non-exclusive, royalty-free licence to host, store, copy, process, change (for example, cut, caption and encode) and display it, only as needed to provide the Services to you and the people you share it with, keep them secure, and meet the law. The licence ends when you delete the content or your account, except for copies we must keep by law or that sit in backups until they're overwritten.",
          "{{We don't use your content to train AI models, and we don't allow our AI providers to train on it.}}",
          "In the desktop app, your footage stays on your computer; it's uploaded only when a cloud AI step needs it, and exports are made on your device.",
          "When you share a review link, anyone with the link can watch the video, comment at a moment and approve it or ask for changes. They can't edit it. Only share links with people you want to see the video.",
          "You're responsible for your content: you must have the rights to use it, including any music, footage, people and brands in it.",
        ],
      },
      {
        id: "ai-output",
        title: "What KeyFly's AI makes",
        plain: "The video the AI makes for you is yours to use. Check it before you publish: AI can be wrong.",
        blocks: [
          "KeyFly's AI makes storyboards, scripts, voice-overs, captions, motion graphics, images and video from what you give it (the **Output**). As between you and us, **you own the Output**, and you may use it for any lawful purpose, including commercially, subject to the rights of others and to the next points.",
          "AI is not perfect. Output can be inaccurate, incomplete or unexpected, and it may resemble what others make, because AI can produce similar results for similar requests. Review every video before you publish it, and don't rely on it for facts, legal, medical or financial advice.",
          "Music beds, sound effects, templates and other material we provide inside the Services are licensed to you for use in videos you make with KeyFly. {{You may not extract them and use or sell them on their own.}}",
          "Where the law requires it, you must tell viewers that a video, voice or image was made or changed with AI. Don't remove or hide any label or mark that shows a video was made with AI or with KeyFly.",
        ],
      },
      {
        id: "consent",
        title: "Voices, faces and consent",
        plain: "Only clone a voice or show a person if you have their permission.",
        blocks: [
          "Voice cloning and any feature that uses a real person's voice or likeness may only be used with **your own voice or likeness, or with the clear, documented permission** of the person concerned (or of whoever can give it for them).",
          "You must not use the Services to make anyone appear to say or do something they didn't, in a way that could deceive people or harm them, or to impersonate anyone.",
          "Consent must be informed: the person must know their voice will be cloned, what it will say and where it will be used, and that AI can make it say things they never recorded. Owning a recording, employing someone or finding their voice online is **not** consent.",
          {
            list: [
              "Never clone the voice of anyone under 18.",
              "Public figures, political candidates and people who have died need the permission of whoever can give it, and must never be used to mislead.",
              "Keep proof of consent, and show it to us if we ask.",
              "If the person withdraws consent, stop using their cloned voice and delete it.",
              "Never use a cloned voice for fraud, false endorsements, or to get past voice-based security.",
            ],
          },
          "We may ask you to confirm consent, and may remove a cloned voice or suspend the feature if we believe consent is missing. To report a voice or likeness used without permission, write to " + help + ".",
        ],
      },
      {
        id: "acceptable-use",
        title: "Acceptable use",
        plain: "Don't use KeyFly to harm people, break the law or break KeyFly.",
        blocks: [
          "You must not use the Services, or let others use them, to:",
          {
            list: [
              "break the law, or infringe anyone's copyright, trademark, privacy or other rights;",
              "make or share sexual content involving minors, or any content that exploits or endangers children;",
              "make sexual or intimate content of a real person without their consent;",
              "harass, threaten, bully or incite violence or hatred against anyone;",
              "make deceptive deepfakes, impersonate people or organisations, or spread misinformation meant to mislead, including about elections or public health;",
              "make spam, scams, phishing or malware;",
              "get around usage limits, AI-minute counting, the Free plan's mark or any security measure;",
              "copy, scrape, reverse engineer or resell the Services, share or sell accounts, or use the Services or their Output to build or train a competing product or AI model, except where the law allows it;",
              "overload, disrupt or test the security of the Services without our written permission.",
            ],
          },
          "If we believe content or activity breaks these rules, we may remove the content, limit features or suspend the account, as set out below.",
          "**Reporting content.** Anyone can report content they believe is illegal or breaks these rules by writing to " + help + " with a link and the reason. When we act on content or an account, we tell the person affected why, and they can ask us to look again by replying.",
        ],
      },
      {
        id: "third-party",
        title: "Your own AI agents and other services",
        plain: "When you connect another service, its own terms and bills apply to what it does.",
        blocks: [
          "You can connect your own AI agents (such as Claude Code, Codex, Cursor, Antigravity or other ACP agents) through the desktop app, use KeyFly inside apps such as ChatGPT and Claude, sign in with Google, GitHub or LinkedIn, and take your timeline to editors such as Final Cut Pro, DaVinci Resolve, Premiere Pro and Avid.",
          "Those services belong to other companies. Your use of them is under their terms and plans, not ours, and any content you send to them is handled by them. Edits your own agent makes use your plan with its provider, not your AI minutes. Other services are used at your own risk: we're not responsible for them, their availability or what they do with your content.",
          "Your agent acts on your instructions. You're responsible for what you ask it to do in your projects.",
        ],
      },
      {
        id: "our-property",
        title: "Our software and brand",
        plain: "KeyFly itself is ours. You get to use it, not own it.",
        blocks: [
          `${name}, its software, apps, designs, templates, the ${name} name and logo belong to ${company} or our licensors. We give you a personal, non-exclusive, non-transferable, revocable licence to use the Services, including installing the desktop apps on devices you use, while you follow these terms.`,
          "If you send us ideas or feedback, we may use them without owing you anything.",
        ],
      },
      {
        id: "copyright",
        title: "Copyright complaints",
        plain: "If you think something on KeyFly infringes your copyright, tell us and we'll act on it.",
        blocks: [
          `If you believe content in the Services infringes your copyright, send a notice to ${help} {{or our designated copyright agent, [name and address]}} with:`,
          {
            list: [
              "your name and contact details, and your signature (typing your name is enough);",
              "the work you say is infringed, and where the infringing material is (a link is best);",
              "a statement that you believe in good faith the use isn't authorised;",
              "a statement that your notice is accurate and, under penalty of perjury, that you're the owner or allowed to act for them.",
            ],
          },
          "We'll remove or disable access to material where appropriate, tell the person who posted it, and consider a counter-notice. We close the accounts of repeat infringers.",
        ],
      },
      {
        id: "changes-to-service",
        title: "Changes to the Services",
        plain: "KeyFly keeps improving, so features change. Early features may be rough.",
        blocks: [
          "We're always improving the Services, so features may change, be added or be removed. If we remove a major paid feature, we'll tell you in advance {{and, where fair, offer a pro-rata refund}}.",
          "Some features may be marked beta, preview or coming soon. They may be incomplete, change or stop, and are provided as they are.",
          "We aim to keep the Services available but can't promise they'll always be uninterrupted. Enterprise customers may have an uptime commitment in their agreement.",
        ],
      },
      {
        id: "termination",
        title: "Suspension and closing accounts",
        plain: "You can close your account any time. We'll only suspend yours for a good reason, and we'll tell you why.",
        blocks: [
          "You can stop using the Services and close your account at any time (see the [Privacy Policy](/privacy#delete) for how). Export anything you want to keep first.",
          "We may suspend or close an account, or remove content, if you seriously or repeatedly break these terms, if we must by law, or to protect people or the Services. Where we reasonably can, we'll tell you first, explain why and give you a chance to fix it and export your projects.",
          "Sections that by their nature should survive closing (such as ownership, disclaimers, limits of liability and disputes) survive it.",
        ],
      },
      {
        id: "disclaimers",
        title: "Disclaimers",
        plain: "We work hard on KeyFly, but we can't promise it's perfect.",
        blocks: [
          "To the extent the law allows, the Services and Output are provided **\"as is\" and \"as available\"**, without warranties of any kind, express or implied, including fitness for a particular purpose, merchantability and non-infringement. We don't promise the Services will be error-free or that Output will be accurate or unique.",
          "Nothing in these terms limits rights you have as a consumer that can't be limited by contract.",
        ],
      },
      {
        id: "liability",
        title: "Limits of liability",
        plain: "If something goes wrong, what we owe is capped, except where the law says it can't be.",
        blocks: [
          "To the extent the law allows, we're not liable for indirect, incidental, special or consequential losses, or for lost profits, revenue, data or goodwill.",
          "Our total liability for any claims about the Services is limited to the greater of {{the amount you paid us in the 12 months before the claim, or US$100}}.",
          "These limits don't apply to liability that can't be limited by law, such as for death or personal injury caused by negligence, or fraud.",
        ],
      },
      {
        id: "indemnity",
        title: "Indemnity",
        plain: "If your content or misuse gets us sued, you cover it. (Doesn't apply to consumers where the law forbids it.)",
        blocks: [
          `If you use the Services for business, you'll defend and compensate ${company} against claims by others arising from your content or your breach of these terms, including reasonable legal costs.`,
        ],
      },
      {
        id: "law",
        title: "Governing law and disputes",
        plain: "Talk to us first. If we can't settle it, the courts named here decide.",
        blocks: [
          `If you have a problem, write to ${help} first; most things can be solved quickly. If we can't settle it within 30 days, either of us may take it further as below.`,
          "These terms are governed by {{the laws of [jurisdiction]}}, and disputes go to {{the courts of [place]}}. {{[If the team chooses arbitration for US users: individual arbitration, a class-action waiver, a small-claims exception and a 30-day opt-out.]}}",
          "If you're a consumer in the EU or UK, you also keep the protection of your country's mandatory consumer laws and can bring a claim in your local courts.",
        ],
      },
      {
        id: "changes",
        title: "Changes to these terms",
        plain: "If we change these terms in a way that matters, we'll tell you before it applies.",
        blocks: [
          "We may update these terms. If a change is material, we'll tell you by email or in the app at least {{30 days}} before it takes effect. The date at the top shows when they last changed. If you keep using the Services after the change applies, you accept the new terms; if you don't agree, you can cancel and close your account.",
        ],
      },
      {
        id: "general",
        title: "General",
        plain: "The usual small print.",
        blocks: [
          {
            list: [
              "These terms, with the Privacy Policy and any order form, are the whole agreement between us about the Services.",
              "You may not transfer them without our consent; we may transfer them to a company that takes over the Services, and will tell you.",
              "If part of these terms can't be enforced, the rest still applies. If we don't enforce a term straight away, we haven't given up the right to.",
              "Neither of us is responsible for delays caused by events beyond reasonable control.",
              "You must follow export control and sanctions laws that apply to your use of the Services.",
              "These terms are written in English. If we translate them, the English version applies.",
            ],
          },
        ],
      },
    ],
    contact: {
      line: "Questions about these terms? Write to us and we'll answer within one working day.",
      label: "help@keyfly.si",
      href: "mailto:help@keyfly.si",
    },
    related: [{ kicker: "Also read", label: "Privacy Policy", href: "/privacy" }],
    company: `KeyFly.si is a ${company} product.`,
  },

  privacy: {
    path: "/privacy",
    draft: true,
    eyebrow: "Legal",
    title: [{ text: "Privacy" }, { text: "Policy.", accent: true }],
    meta: "Privacy Policy",
    description: `How ${name} handles your footage and data: what we collect, why, who processes it, how long we keep it and your rights.`,
    updated: { iso: "2026-11-09", text: "9 November 2026" },
    effective: null,
    intro: [
      `This policy explains what personal data ${company} collects when you use ${name} (the website, the web app, the desktop apps for Mac and Windows, and ${name} inside apps such as ChatGPT and Claude), why, who helps us process it, and the choices and rights you have.`,
    ],
    summary: {
      title: "In short",
      items: [
        { title: "Your footage stays put", text: "In the desktop app, footage stays on your computer. It's uploaded only when a cloud AI step needs it." },
        { title: "Usage data, never content", text: "We learn which features are used. Never your videos, prompts or files." },
        { title: "No selling, no ads", text: "We don't sell your personal data or share it for advertising." },
        { title: "Exports stay local", text: "Videos are encoded on your device. Nothing is uploaded to export." },
        { title: "This site sets no cookies", text: "keyfly.si runs no analytics or advertising trackers." },
        { title: "Your data, your call", text: "See, export, correct or delete your data. Just ask." },
      ],
    },
    sections: [
      {
        id: "who-we-are",
        title: "Who we are",
        plain: `${company} makes ${name} and is responsible for your data.`,
        blocks: [
          `${company}, {{[registered address]}}, is the controller of the personal data described here. You can reach us at ${help} {{(or privacy@keyfly.si)}}.`,
          "{{Our representative in the EU / UK under the GDPR is [name, address], and our data protection officer is [name or \"not required\"].}}",
          "If your organisation uses KeyFly on an Enterprise plan under a data processing agreement (DPA), we process its team's content on its behalf, and its own privacy notice applies too.",
        ],
      },
      {
        id: "what-we-collect",
        title: "What we collect",
        plain: "What you give us, what we need to run KeyFly, and basic usage data. Never your videos in our usage data.",
        blocks: [
          {
            terms: [
              ["Account", "Your name, email address, profile picture and sign-in method (Google, GitHub, LinkedIn or email). For teams: your role and which team you belong to."],
              ["Your content", "Footage, audio, pictures, prompts, scripts, projects, brand kits (logo, colours, font, tone of voice), voice samples for voice cloning, comments, and the videos made from them."],
              ["Voice samples", "If you clone a voice: the recordings you give us and the voice model made from them. This can count as biometric data, so we only process it with explicit consent."],
              ["Brand from a website", "If you ask KeyFly to fill a brand kit from a website, the public pages of that website."],
              ["Payment", "Your plan, billing history and billing address. Card details go straight to {{our payment provider}}; we never see the full number."],
              ["Usage data", "Which features you use, so we can make KeyFly better. **Never your videos, prompts or files.**"],
              ["Device and logs", "Device and app version, operating system, IP address, approximate location from it, crash reports, and logs of requests, kept for security and to fix problems."],
              ["Support", "What you write to us and our replies."],
              ["Review links", "When someone comments on a video through a review link: their comments {{and the name they give}}."],
            ],
          },
          "We don't knowingly collect special categories of data (such as health or beliefs). Your footage could show such things; we process it only to make your videos.",
        ],
      },
      {
        id: "desktop",
        title: "Your footage in the desktop app",
        plain: "Your computer does most of the work. Only what a cloud AI step needs leaves it.",
        blocks: [
          {
            list: [
              "Footage stays on your computer. Nothing uploads unless an AI step needs it.",
              "Exports are made on your device. Nothing is uploaded to export.",
              "Packages for other editors (a .zip with the timeline and its media) are downloaded to your computer.",
            ],
          },
          "In the web app, your files are uploaded so they can be edited in the browser.",
        ],
      },
      {
        id: "how-we-use",
        title: "How we use it, and why we're allowed to",
        plain: "To run KeyFly, bill you, keep it safe and improve it. Never to sell to advertisers.",
        blocks: [
          {
            table: {
              head: ["Purpose", "Data", "Legal basis (GDPR)"],
              rows: [
                ["Provide KeyFly: accounts, editing, AI, storage, sharing", "Account, content, device", "Contract"],
                ["Bill you and keep records", "Account, payment", "Contract; legal obligation"],
                ["Support", "Account, support, relevant content", "Contract; legitimate interests"],
                ["Keep KeyFly secure and prevent abuse", "Account, device and logs", "Legitimate interests; legal obligation"],
                ["Improve KeyFly", "Usage data (never content)", "Legitimate interests"],
                ["Make a cloned voice", "Voice samples", "Explicit consent (withdraw it by deleting the voice)"],
                ["Product emails you can switch off", "Account", "{{Consent or legitimate interests}}"],
                ["Meet the law", "As needed", "Legal obligation"],
              ],
            },
          },
          "Where we rely on legitimate interests, we've weighed them against your rights, and you can object (see Your rights).",
        ],
      },
      {
        id: "ai",
        title: "AI and your content",
        plain: "AI providers process your content only to make what you asked for.",
        blocks: [
          "When you use KeyFly's cloud AI, the parts of your content the task needs (a prompt, a clip, a transcript) are sent to the AI model providers that do that step, for example Anthropic for the Claude models behind the AI director. {{Other providers for voice, images and generated video: [names].}} They process it on our instructions, only to return the result.",
          "{{We don't use your content to train AI models, and our contracts don't allow our AI providers to train on it.}}",
          "Voice samples are used only to make your cloned voice, never to train shared or other people's voices, and you can delete them at any time.",
          "We don't make decisions about you by automated means that have legal or similarly significant effects.",
          "If you connect your own AI agent, or use KeyFly inside ChatGPT or Claude, what you send there is handled by that provider under its own terms and privacy policy.",
        ],
      },
      {
        id: "sharing",
        title: "Who we share it with",
        plain: "Only the companies that help run KeyFly, people you choose, and the law when it requires. We don't sell your data.",
        blocks: [
          "**We don't sell your personal data, and we don't share it for cross-context behavioural advertising.** We share it only with:",
          {
            table: {
              head: ["Who", "Why"],
              rows: [
                ["Cloud hosting {{[provider]}}", "To store and run your projects"],
                ["AI model providers (Anthropic {{and [others]}})", "To do the AI steps you ask for"],
                ["Payments {{[provider]}}", "To take payments and handle tax"],
                ["Email {{[provider]}}", "To send account and product emails"],
                ["Google, GitHub, LinkedIn", "Only if you sign in with them"],
                ["People you share with", "Your team, and anyone with a review link you share"],
                ["Authorities and advisers", "When the law requires it, or to protect rights and safety"],
                ["A buyer of our business", "If KeyFly is sold or merged; this policy keeps applying"],
              ],
            },
          },
          "{{A full list of our subprocessors is available on request at help@keyfly.si.}}",
        ],
      },
      {
        id: "transfers",
        title: "International transfers",
        plain: "Your data may be processed outside your country, with safeguards.",
        blocks: [
          "We and our providers may process data in {{the United States and other countries}}. When data leaves the EEA, UK or Switzerland, we use safeguards such as the European Commission's Standard Contractual Clauses {{or the EU-U.S. Data Privacy Framework}}. Enterprise plans can choose data residency.",
        ],
      },
      {
        id: "retention",
        title: "How long we keep it",
        plain: "As long as you use KeyFly, then we delete it, except what the law makes us keep.",
        blocks: [
          {
            table: {
              head: ["Data", "Kept"],
              rows: [
                ["Account", "While your account is open"],
                ["Projects and content", "Until you delete them or your account. Projects don't expire."],
                ["Cloned voices and voice samples", "Until you delete them or your account {{(or [3 years] after last use)}}"],
                ["Deleted content", "Removed from backups within {{30 days}}"],
                ["Billing records", "{{As long as tax law requires, usually up to 7 years}}"],
                ["Logs", "{{Up to 90 days}}, longer if needed to investigate abuse"],
                ["Support messages", "{{Up to 2 years}} after the conversation ends"],
              ],
            },
          },
        ],
      },
      {
        id: "rights",
        title: "Your rights",
        plain: "Ask us to see, fix, export or delete your data, and we'll do it.",
        blocks: [
          "Depending on where you live (for example under the GDPR, the UK GDPR or US state laws such as California's), you can:",
          {
            list: [
              "see the personal data we hold about you and get a copy;",
              "correct it;",
              "delete it;",
              "take it with you in a portable format (your projects can always be exported);",
              "object to, or ask us to limit, how we use it;",
              "withdraw consent you've given, at any time;",
              "opt out of sale or sharing for advertising (we don't do either).",
            ],
          },
          `Write to ${help} from the address you sign in with. We may need to confirm it's you. We'll answer within one month, and we won't treat you differently for using your rights. In US states that allow it, an authorised agent can ask for you. You can also complain to your local data protection authority.`,
        ],
      },
      {
        id: "delete",
        title: "Deleting your account",
        plain: "One email, and your account and videos go.",
        blocks: [
          "Email {{support@keyfly.si}} from the address you sign in with, and we'll remove your account and your videos. Export anything you want to keep first. Copies in backups are overwritten within {{30 days}}; billing records we must keep by law stay for as long as required.",
        ],
      },
      {
        id: "cookies",
        title: "Cookies",
        plain: "This website sets no cookies. The app uses only what it needs to keep you signed in.",
        blocks: [
          "**keyfly.si** (this website) sets no cookies and runs no analytics or advertising trackers.",
          "**The KeyFly app** uses cookies and local storage that are strictly necessary to keep you signed in and remember your settings. {{It uses no advertising cookies. [List any other cookies or analytics the app uses.]}}",
        ],
      },
      {
        id: "other-sites",
        title: "Other sites and services",
        plain: "Other companies' sites and apps have their own privacy policies.",
        blocks: [
          "KeyFly links to, and connects with, services run by others (such as Google, GitHub and LinkedIn sign-in, your own AI agents, ChatGPT and Claude, and the editors you export to). Their privacy policies, not this one, cover what they do with your data.",
        ],
      },
      {
        id: "children",
        title: "Children",
        plain: "KeyFly isn't for children.",
        blocks: [
          "KeyFly is not meant for anyone under {{16}}, and voice cloning is for adults only. We don't knowingly collect children's data. If you believe a child has given us personal data, write to us and we'll delete it.",
        ],
      },
      {
        id: "security",
        title: "Security",
        plain: "We protect your data, and keep as little of it as we can.",
        blocks: [
          "We protect data with encryption in transit {{and at rest}}, access limited to people who need it, and regular reviews. Enterprise plans add SSO and SCIM. No system is perfectly secure; if a breach affects you, we'll tell you as the law requires.",
        ],
      },
      {
        id: "changes",
        title: "Changes to this policy",
        plain: "If it changes in a way that matters, we'll tell you first.",
        blocks: [
          "We may update this policy. The date at the top shows the latest version. If a change is material, we'll tell you by email or in the app before it applies. Earlier versions are available on request.",
        ],
      },
    ],
    contact: {
      line: "Questions about privacy, or want to use your rights? Write to us and we'll answer within one working day.",
      label: "help@keyfly.si",
      href: "mailto:help@keyfly.si",
    },
    related: [{ kicker: "Also read", label: "Terms of Service", href: "/terms" }],
    company: `KeyFly.si is a ${company} product.`,
  },
};
