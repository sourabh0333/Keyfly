import { PauseOffscreen } from "@/components/pause-offscreen";
import wipe from "@/components/scene/wipe.module.css";
import { integrationsChat } from "@/content/integrations";
import { ChatThread } from "./chat-thread";
import styles from "./chat-apps.module.css";

/**
 * Integrations page, "Chat apps": KeyFly in ChatGPT and Claude, as one
 * thread down the page (see ChatThread): the ask, KeyFly's reply in the
 * chat, the project in KeyFly, and where each app stands.
 */
export function ChatApps() {
  const { eyebrow, title, lead, note, ...thread } = integrationsChat;

  return (
    <section id="chat" className={styles.section} aria-labelledby="chat-title" data-section="Chat apps">
      <PauseOffscreen />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 id="chat-title" className={`${styles.title} ${wipe.wipe}`}>
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

        <ChatThread {...thread} />

        <p className={styles.note}>{note}</p>
      </div>
    </section>
  );
}
