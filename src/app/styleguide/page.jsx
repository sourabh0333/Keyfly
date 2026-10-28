import { notFound } from "next/navigation";
import { Button } from "@/components/button";
import { FlightPath } from "@/components/flight-path";
import { Logo } from "@/components/logo";
import { Section, SectionHeading } from "@/components/section";
import styles from "./page.module.css";

// Internal reference for the design foundations. Development only: the
// production build serves a 404 here.
export const metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const COLOURS = [
  ["Tungsten amber", "--tungsten-amber", "#FFB23E", "Accent on Night: point, primary button"],
  ["Deep amber", "--deep-amber", "#D97E00", "The point on Paper"],
  ["Amber UI", "--amber-ui", "#C27400", "Primary button on Paper"],
  ["Amber text", "--amber-text", "#935400", "Accent used as text on Paper"],
  ["Night", "--night", "#0B0B0D", "Dark surfaces: the app itself"],
  ["Night top", "--night-top", "#202026", "Top of dark gradients"],
  ["Paper", "--paper", "#F4F1EA", "Page background, text on Night"],
  ["Ink", "--ink", "#141416", "Text on Paper, text on amber"],
];

const TYPE = [
  ["--text-display", "Display · h1", "Every shot, landed.", "display"],
  ["--text-h2", "Heading · h2", "A section heading in Syne", "h2"],
  ["--text-h3", "Heading · h3", "A smaller heading for a point", "h3"],
  ["--text-lead", "Lead", "A lead paragraph introduces a section in one or two calm sentences.", "lead"],
  ["--text-body", "Body", "Body copy is set in Inter for long reading at comfortable sizes.", "body"],
  ["--text-small", "Small", "Small text for captions, notes and metadata.", "small"],
  ["--text-label", "Label", "Eyebrow label", "label"],
];

const SPACING = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function StyleguidePage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main>
      <Section>
        <div className={styles.top}>
          <Logo eager height={40} />
          <p className={styles.tag}>Design foundations · internal</p>
        </div>
        <h1 className={styles.h1}>Paper and tungsten</h1>
        <p className={styles.intro}>
          Every token and building block the Keyfly website is made from. Reload the page to replay
          the flight paths.
        </p>
      </Section>

      <Section rule labelledBy="sg-colour">
        <SectionHeading id="sg-colour" eyebrow="Brand kit" title="Colour" />
        <ul className={styles.list}>
          {COLOURS.map(([name, token, hex, use]) => (
            <li key={token} className={styles.row}>
              <span className={styles.swatch} style={{ background: `var(${token})` }} />
              <span className={styles.name}>{name}</span>
              <code className={styles.code}>
                {token} · {hex}
              </code>
              <span className={styles.use}>{use}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section rule labelledBy="sg-type">
        <SectionHeading
          id="sg-type"
          eyebrow="Syne 700 + Inter"
          title="Type"
          lead="Syne carries the headings only. Inter does all the reading."
        />
        <ul className={styles.list}>
          {TYPE.map(([token, name, sample, kind]) => (
            <li key={token} className={styles.typeRow}>
              <code className={styles.code}>
                {name} · {token}
              </code>
              <p className={styles[`t_${kind}`]}>{sample}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section rule labelledBy="sg-space">
        <SectionHeading id="sg-space" eyebrow="4px base" title="Spacing" />
        <ul className={styles.list}>
          {SPACING.map((step) => (
            <li key={step} className={styles.spaceRow}>
              <code className={styles.code}>--space-{step}</code>
              <span className={styles.bar} style={{ width: `var(--space-${step})` }} />
            </li>
          ))}
        </ul>
      </Section>

      <Section rule labelledBy="sg-actions">
        <SectionHeading
          id="sg-actions"
          eyebrow="Calls to action"
          title="Buttons"
          lead="One solid amber action per view. Everything else is a link with a drawn underline."
        />
        <div className={styles.actions}>
          <Button href="/" arrow>
            Primary action
          </Button>
          <Button href="/" size="l" arrow>
            Large primary
          </Button>
          <Button href="/" variant="link" arrow>
            Secondary link
          </Button>
          <Button variant="link">Button element</Button>
        </div>
      </Section>

      <Section rule labelledBy="sg-flight">
        <SectionHeading
          id="sg-flight"
          eyebrow="Signature motion"
          title="Flight path"
          lead="The line draws in 0.9s, then the point lands with a 0.35s settle. With reduced motion it simply fades in."
        />
        <div className={styles.flights}>
          <figure className={styles.flight}>
            <FlightPath play="load" size={160} />
            <figcaption className={styles.caption}>play=&quot;load&quot;</figcaption>
          </figure>
          <figure className={styles.flight}>
            <FlightPath play={false} size={160} />
            <figcaption className={styles.caption}>static</figcaption>
          </figure>
          <figure className={styles.flight}>
            <FlightPath play="load" size={48} />
            <figcaption className={styles.caption}>48px</figcaption>
          </figure>
        </div>
      </Section>

      <Section tone="night" labelledBy="sg-night">
        <div className={styles.night}>
          <div className={styles.nightCopy}>
            <Logo on="night" height={40} />
            <SectionHeading
              id="sg-night"
              eyebrow="Tone: night"
              title="Where the product lives"
              lead="Night is reserved for showing the app. Inside it, every component switches to Paper and tungsten amber automatically."
            />
            <div className={styles.actions}>
              <Button href="/" arrow>
                Primary on Night
              </Button>
              <Button href="/" variant="link" arrow>
                Secondary link
              </Button>
            </div>
          </div>
          <figure className={styles.flight}>
            <FlightPath play="view" size={200} label="Keyfly flight path symbol" />
            <figcaption className={styles.caption}>play=&quot;view&quot; (draws on scroll)</figcaption>
          </figure>
        </div>
      </Section>
    </main>
  );
}
