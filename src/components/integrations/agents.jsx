import { PauseOffscreen } from "@/components/pause-offscreen";
import wipe from "@/components/scene/wipe.module.css";
import { integrationsAgents } from "@/content/integrations";
import { AgentStudio } from "./agent-studio";
import styles from "./agents.module.css";

/**
 * Integrations page, "Your own AI agent": one studio panel around a
 * playing video (see AgentStudio), then the app's three steps to set it up, in one line
 * between hairlines.
 */
export function Agents() {
  const { eyebrow, title, lead, setup, note, ...studio } = integrationsAgents;

  return (
    <section id="agents" className={styles.section} aria-labelledby="agents-title" data-section="Your AI">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="agents-title" className={`${styles.title} ${wipe.wipe}`}>
              {title.map((line, i) => (
                <span key={i} className={line.accent ? styles.accent : styles.plain}>
                  {line.text}
                  {i < title.length - 1 ? " " : null}
                </span>
              ))}
            </h2>
          </div>
          <p className={styles.lead}>{lead}</p>
        </div>

        <AgentStudio {...studio} />

        <div className={styles.setup}>
          <p className={styles.setupLabel}>{setup.label}</p>
          <ol className={styles.setupSteps}>
            {setup.steps.map((step, i) => (
              <li key={step.name}>
                <span className={styles.setupNum}>{i + 1}</span>
                <span>
                  <b>{step.name}</b>
                  <small>
                    {step.line}
                    {step.link ? (
                      <>
                        {" · "}
                        <a href={step.link.href}>{step.link.label}</a>
                      </>
                    ) : null}
                  </small>
                </span>
              </li>
            ))}
          </ol>
          <p className={styles.setupHelp}>{setup.help}</p>
        </div>

        <p className={styles.note}>{note}</p>
      </div>
    </section>
  );
}
