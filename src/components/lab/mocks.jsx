import { Preview } from "@/components/use-cases/preview";
import styles from "./lab.module.css";

// The visuals both lab demos show: the prompt box, the editor, a preview
// on air and the app icon. Stills, sized by their parent.

export function PromptMock({ placeholder }) {
  return (
    <div className={styles.promptMock}>
      <p className={styles.promptText}>
        {placeholder}
        <i className={styles.caret} />
      </p>
      <div className={styles.promptBar}>
        <span className={styles.chipBtn}>+</span>
        <span className={styles.auto}>Auto ⌄</span>
        <span className={styles.spacer} />
        <span className={styles.chipBtn}>✦</span>
        <span className={styles.send}>↑</span>
      </div>
    </div>
  );
}

export function EditorMock() {
  return (
    <div className={styles.editorMock}>
      <div className={styles.chrome}>
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        <span>Launch Video · Keyfly</span>
        <span className={styles.code}>00:00:12:20</span>
      </div>
      <div className={styles.editorBody}>
        <div className={styles.viewer}>
          <Preview kind="launch" format="16:9" bleed />
        </div>
        <div className={styles.side}>
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className={styles.tracks}>
        <span style={{ "--w": "62%" }} />
        <span style={{ "--w": "88%" }} />
        <span style={{ "--w": "100%" }} />
        <i className={styles.playhead} />
      </div>
    </div>
  );
}

export function PreviewMock({ kind = "ugc", format = "16:9" }) {
  return (
    <div className={styles.previewMock}>
      <Preview kind={kind} format={format} bleed />
    </div>
  );
}

export function IconMock() {
  // The unaltered app icon from the brand kit.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/brand/app-icon-macos.svg" alt="" className={styles.iconMock} />;
}

export function Title({ lines, as: Tag = "h2", className }) {
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className={line.accent ? styles.accent : styles.plain}>
          {line.text}
          {i < lines.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
