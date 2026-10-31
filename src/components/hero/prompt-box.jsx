"use client";

import { useEffect, useRef, useState } from "react";
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

function Close() {
  return (
    <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
      <path d="m3 3 6 6M9 3 3 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const hasFiles = (event) => Array.from(event.dataTransfer?.types || []).includes("Files");

/**
 * The prompt box from the Keyfly app, working on the homepage: type a
 * description or add footage (with + or by dropping files anywhere on the
 * page), pick a format, or start from one of the presets, which types its
 * example prompt into the box. Sending opens the app.
 */
export function PromptBox({ label, placeholder, action, accept, modes, presets, elsewhere }) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [mode, setMode] = useState(modes[0]);
  const [menu, setMenu] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [typing, setTyping] = useState(null);
  const [sending, setSending] = useState(false);
  const field = useRef(null);
  const picker = useRef(null);
  const modeRef = useRef(null);
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

  // Close the format menu on an outside click or Escape.
  useEffect(() => {
    if (!menu) return;
    const onDown = (event) => !modeRef.current?.contains(event.target) && setMenu(false);
    const onKey = (event) => event.key === "Escape" && setMenu(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  useEffect(() => () => clearInterval(typer.current), []);

  // Other sections can hand a preset to the box ("Try this prompt"): the
  // page scrolls back up to it and the prompt types itself in.
  const typeOutRef = useRef(null);
  useEffect(() => {
    typeOutRef.current = typeOut;
  });
  useEffect(() => {
    const onPrompt = (event) => {
      const preset = presets.find((p) => p.label === event.detail?.label);
      if (!preset) return;
      field.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => typeOutRef.current?.(preset), 700);
    };
    window.addEventListener("keyfly:prompt", onPrompt);
    return () => window.removeEventListener("keyfly:prompt", onPrompt);
  }, [presets]);

  function addFiles(list) {
    const added = Array.from(list || []).map((file) => ({ id: `${file.name}-${file.size}-${file.lastModified}`, name: file.name }));
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

  function inspire() {
    const choices = presets.filter((preset) => preset.prompt !== text);
    typeOut(choices[Math.floor(Math.random() * choices.length)]);
  }

  function submit(event) {
    event.preventDefault();
    if (!ready || sending) return;
    setSending(true);
    window.location.assign(action);
  }

  return (
    <div className={styles.wrap}>
      <form className={styles.box} onSubmit={submit} data-ready={ready ? "" : undefined} data-sending={sending ? "" : undefined}>
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
          <button type="button" className={styles.square} aria-label="Add footage" title="Add footage" onClick={() => picker.current?.click()}>
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

          <div className={styles.mode} ref={modeRef}>
            <button
              type="button"
              className={styles.modeButton}
              aria-haspopup="listbox"
              aria-expanded={menu}
              aria-label={`Format: ${mode.label}`}
              onClick={() => setMenu((open) => !open)}
            >
              {mode.label}
              <Chevron />
            </button>
            {menu ? (
              <ul className={styles.menu} role="listbox" aria-label="Format">
                {modes.map((option) => (
                  <li key={option.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={option.id === mode.id}
                      onClick={() => {
                        setMode(option);
                        setMenu(false);
                      }}
                    >
                      <span className={styles.frame} data-mode={option.id} aria-hidden="true" />
                      <span>{option.label}</span>
                      <span className={styles.note}>{option.note}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <button type="button" className={styles.square} data-quiet="" aria-label="Inspire me" title="Inspire me" onClick={inspire}>
            <Sparkle />
          </button>
          <button type="submit" className={styles.send} aria-label="Create video" title="Create video" disabled={!ready}>
            <ArrowUp />
          </button>
        </div>
      </form>

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
