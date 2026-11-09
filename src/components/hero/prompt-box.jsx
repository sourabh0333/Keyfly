"use client";

import { useEffect, useRef, useState } from "react";
import { Studio } from "./studio";
import styles from "./prompt-box.module.css";

function Plus() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Sparkle() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
      <path d="M7 2.5 8.1 6 11.5 7 8.1 8 7 11.5 5.9 8 2.5 7 5.9 6Z" fill="currentColor" />
      <path d="M12 10.5l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5Z" fill="currentColor" />
    </svg>
  );
}

function ArrowUp() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path d="M8 13V3.5M3.5 8 8 3.5 12.5 8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// The motion style: a frame with a swoosh of motion through it.
function StyleIcon() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
      <rect x="2" y="3" width="12" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M4.5 10.5c2-3.5 4.5-3.5 7-5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// The brand kit: a swatch card.
function BrandIcon() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
      <rect x="2.5" y="2.5" width="11" height="11" rx="3" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="6" cy="6.5" r="1.4" fill="currentColor" />
      <path d="M5 11h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function Blank() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <rect x="2.5" y="3" width="11" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2.2 1.8" />
    </svg>
  );
}

function Close() {
  return (
    <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
      <path d="m3 3 6 6M9 3 3 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const hasFiles = (event) => Array.from(event.dataTransfer?.types || []).includes("Files");

/**
 * The prompt box from the KeyFly app's "New video" box, working on the
 * homepage: type a description or add media (with + or by dropping files
 * anywhere on the page), pick the aspect ratio, the motion style and the
 * brand kit, Enhance the prompt, or start from one of the use-case chips, which
 * types its example prompt into the box. Create opens the studio over the
 * page (a sketched plan and a storyboard preview); Blank project opens the
 * app.
 *
 * Enhance here can't call the app's AI: with an empty box it types a
 * preset's prompt; with a prompt, it rewrites it to name the chosen ratio
 * and style and the usual asks (a hook, captions, music).
 */
export function PromptBox({ label, placeholder, accept, addMedia, formats, styles: motion, brandKit, enhance, create, blank, presets, elsewhere, studio }) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [format, setFormat] = useState(formats.options[0]);
  const [style, setStyle] = useState(motion.options[0]);
  const [open, setOpen] = useState(null); // which picker's menu is open
  const [dragging, setDragging] = useState(false);
  const [typing, setTyping] = useState(null);
  const [request, setRequest] = useState(null); // what the studio is showing
  const field = useRef(null);
  const picker = useRef(null);
  const typer = useRef(0);

  const ready = text.trim().length > 0 || files.length > 0;

  // Grow the field with its text.
  useEffect(() => {
    const el = field.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, [text]);

  // Footage can be dropped anywhere on the page.
  useEffect(() => {
    let depth = 0;
    const enter = (event) => {
      if (!hasFiles(event)) return;
      depth += 1;
      setDragging(true);
    };
    const over = (event) => hasFiles(event) && event.preventDefault();
    const leave = (event) => {
      if (!hasFiles(event)) return;
      depth = Math.max(0, depth - 1);
      if (!depth) setDragging(false);
    };
    const drop = (event) => {
      if (!hasFiles(event)) return;
      event.preventDefault();
      depth = 0;
      setDragging(false);
      addFiles(event.dataTransfer.files);
      field.current?.focus();
    };
    window.addEventListener("dragenter", enter);
    window.addEventListener("dragover", over);
    window.addEventListener("dragleave", leave);
    window.addEventListener("drop", drop);
    return () => {
      window.removeEventListener("dragenter", enter);
      window.removeEventListener("dragover", over);
      window.removeEventListener("dragleave", leave);
      window.removeEventListener("drop", drop);
    };
  }, []);

  // Close an open picker on an outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (event) => !event.target.closest?.("[data-picker]") && setOpen(null);
    const onKey = (event) => event.key === "Escape" && setOpen(null);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => () => clearInterval(typer.current), []);

  // Other sections can hand a preset (by label) or any prompt (by text) to
  // the box ("Try this prompt" in Use cases and Who it's for): the page
  // scrolls back up to it and the prompt types itself in.
  const typeOutRef = useRef(null);
  useEffect(() => {
    typeOutRef.current = typeOut;
  });
  useEffect(() => {
    const onPrompt = (event) => {
      // A preset by its label, or any prompt's text (Who it's for).
      const text = event.detail?.text;
      const preset = text ? { label: null, prompt: text } : presets.find((p) => p.label === event.detail?.label);
      if (!preset) return;
      field.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => typeOutRef.current?.(preset), 700);
    };
    window.addEventListener("keyfly:prompt", onPrompt);
    return () => window.removeEventListener("keyfly:prompt", onPrompt);
  }, [presets]);

  function addFiles(list) {
    const added = Array.from(list || []).map((file) => ({ id: `${file.name}-${file.size}-${file.lastModified}`, name: file.name, file }));
    setFiles((current) => [...current, ...added.filter((file) => !current.some((c) => c.id === file.id))]);
  }

  // Types a preset's prompt into the box, a few letters per frame.
  function typeOut(preset) {
    clearInterval(typer.current);
    setTyping(preset.label);
    setText("");
    const full = preset.prompt;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setText(full);
      setTyping(null);
      field.current?.focus();
      return;
    }
    let shown = 0;
    typer.current = setInterval(() => {
      shown = Math.min(full.length, shown + 2);
      setText(full.slice(0, shown));
      if (shown >= full.length) {
        clearInterval(typer.current);
        setTyping(null);
        const el = field.current;
        el?.focus();
        el?.setSelectionRange(full.length, full.length);
      }
    }, 16);
  }

  // Enhance: a preset's prompt into an empty box, or the prompt rewritten
  // with the chosen ratio and style (once).
  function enhancePrompt() {
    const base = text.trim();
    if (!base) {
      const choices = presets.filter((preset) => preset.prompt !== text);
      typeOut(choices[Math.floor(Math.random() * choices.length)]);
      return;
    }
    if (base.includes("hook in the first two seconds")) return;
    const look = style.id === "ai" ? "in a style KeyFly picks" : `in the ${style.label} style`;
    const rewritten = `${base.replace(/[.\s]+$/, "")}. Make it ${format.label} ${format.name}, ${look}, with a hook in the first two seconds, captions and music that fits the mood.`;
    typeOut({ label: null, prompt: rewritten });
  }

  function toggle(name) {
    setOpen((current) => (current === name ? null : name));
  }

  // Create opens the studio over the page (it no longer leaves for the
  // app). The visitor's own video and pictures play in its preview, from
  // object URLs that go when it closes.
  function submit(event) {
    event.preventDefault();
    if (!ready || request) return;
    setOpen(null);
    setRequest({
      text,
      format,
      style,
      files: files.map(({ name, file }) => {
        const kind = file?.type.startsWith("video/") ? "video" : file?.type.startsWith("image/") ? "image" : "other";
        return { name, kind, url: kind === "other" ? null : URL.createObjectURL(file) };
      }),
    });
  }

  function closeStudio() {
    request?.files.forEach((f) => f.url && URL.revokeObjectURL(f.url));
    setRequest(null);
    field.current?.focus();
  }

  return (
    <div className={styles.wrap}>
      <form className={styles.box} onSubmit={submit} data-ready={ready ? "" : undefined} data-sending={request ? "" : undefined}>
        <span className={styles.ring} aria-hidden="true" />

        {files.length > 0 ? (
          <ul className={styles.files} aria-label="Added footage">
            {files.map((file) => (
              <li key={file.id} className={styles.file}>
                <span className={styles.fileIcon} aria-hidden="true" />
                <span className={styles.fileName}>{file.name}</span>
                <button type="button" aria-label={`Remove ${file.name}`} onClick={() => setFiles((current) => current.filter((c) => c.id !== file.id))}>
                  <Close />
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <label htmlFor="hero-prompt" className="visually-hidden">
          {label}
        </label>
        <textarea
          ref={field}
          id="hero-prompt"
          className={styles.field}
          rows={2}
          placeholder={placeholder}
          value={text}
          onChange={(event) => {
            clearInterval(typer.current);
            setTyping(null);
            setText(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) submit(event);
          }}
        />

        <div className={styles.toolbar}>
          <button type="button" className={styles.square} aria-label={addMedia} title={addMedia} onClick={() => picker.current?.click()}>
            <Plus />
          </button>
          <input
            ref={picker}
            type="file"
            accept={accept}
            multiple
            hidden
            onChange={(event) => {
              addFiles(event.target.files);
              event.target.value = "";
            }}
          />

          {/* Aspect ratio. */}
          <div className={styles.mode} data-picker="">
            <button
              type="button"
              className={styles.modeButton}
              aria-haspopup="listbox"
              aria-expanded={open === "format"}
              aria-label={`${formats.label}: ${format.label} ${format.name}`}
              onClick={() => toggle("format")}
            >
              <span className={styles.frame} data-mode={format.id} aria-hidden="true" />
              {format.label}
              <span className={styles.long}>{format.name}</span>
              <Chevron />
            </button>
            {open === "format" ? (
              <ul className={styles.menu} role="listbox" aria-label={formats.label}>
                {formats.options.map((option) => (
                  <li key={option.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={option.id === format.id}
                      onClick={() => {
                        setFormat(option);
                        setOpen(null);
                      }}
                    >
                      <span className={styles.frame} data-mode={option.id} aria-hidden="true" />
                      <span>{option.label}</span>
                      <span className={styles.note}>{option.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Motion style: the one picker whose label can run long ("Editorial
              Minimal"), so it gives way first (see .styleMode). */}
          <div className={`${styles.mode} ${styles.styleMode}`} data-picker="">
            <button
              type="button"
              className={styles.modeButton}
              aria-haspopup="listbox"
              aria-expanded={open === "style"}
              aria-label={`${motion.label}: ${style.label}`}
              data-named={style.id !== "ai" || undefined}
              onClick={() => toggle("style")}
            >
              <StyleIcon />
              <span className={`${styles.long} ${styles.stylePrefix}`}>{motion.prefix}</span>
              <span className={styles.styleLabel}>{style.label}</span>
              <Chevron />
            </button>
            {open === "style" ? (
              <ul className={`${styles.menu} ${styles.styleMenu}`} role="listbox" aria-label={motion.label}>
                {motion.options.map((option) => (
                  <li key={option.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={option.id === style.id}
                      onClick={() => {
                        setStyle(option);
                        setOpen(null);
                      }}
                    >
                      <span className={styles.swatch} data-style={option.id} aria-hidden="true" />
                      <span className={styles.styleText}>
                        <span>{option.label}</span>
                        <span className={styles.note}>{option.note}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Brand kit: visitors have none yet; the menu points to the app. */}
          <div className={styles.mode} data-picker="">
            <button
              type="button"
              className={styles.modeButton}
              aria-haspopup="listbox"
              aria-expanded={open === "brand"}
              aria-label={`${brandKit.label}: ${brandKit.none}`}
              onClick={() => toggle("brand")}
            >
              <BrandIcon />
              <span className={styles.long}>{brandKit.none}</span>
              <Chevron />
            </button>
            {open === "brand" ? (
              <ul className={styles.menu} role="listbox" aria-label={brandKit.label}>
                <li>
                  <button type="button" role="option" aria-selected="true" onClick={() => setOpen(null)}>
                    <BrandIcon />
                    <span>{brandKit.none}</span>
                    <span />
                  </button>
                </li>
                <li>
                  <a className={styles.menuLink} href={brandKit.href}>
                    <Plus />
                    <span>{brandKit.add}</span>
                    <span className={styles.note}>↗</span>
                  </a>
                </li>
              </ul>
            ) : null}
          </div>

          <button type="button" className={styles.enhance} title={enhance.title} onClick={enhancePrompt}>
            <Sparkle />
            <span className={styles.long}>{enhance.label}</span>
          </button>
          <button type="submit" className={styles.send} title={create} disabled={!ready}>
            <ArrowUp />
            {create}
          </button>
        </div>
      </form>

      <a className={styles.blank} href={blank.href} title={blank.title}>
        <Blank />
        {blank.label}
      </a>

      <div className={styles.presets}>
        <ul aria-label="Start from">
          {presets.map((preset, index) => (
            <li key={preset.label} style={{ "--i": index }}>
              <button type="button" className={styles.chip} data-active={typing === preset.label ? "" : undefined} onClick={() => typeOut(preset)}>
                {preset.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <p className={styles.elsewhere}>
        <span>or make it in</span>
        {elsewhere.map((place, index) => (
          <span key={place.label} className={styles.place}>
            {index > 0 ? (
              <span className={styles.dot} aria-hidden="true">
                ·
              </span>
            ) : null}
            {place.href ? <a href={place.href}>{place.label}</a> : <span>{place.label}</span>}
          </span>
        ))}
      </p>

      {request ? <Studio request={request} copy={studio} motionStyles={motion.options} onClose={closeStudio} /> : null}

      <div className={styles.drop} data-on={dragging ? "" : undefined} aria-hidden="true">
        <div className={styles.dropFrame}>
          <span className={styles.dropPlus}>
            <Plus />
          </span>
          Drop footage to start
        </div>
      </div>
    </div>
  );
}
