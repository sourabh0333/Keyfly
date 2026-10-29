"use client";

import { useEffect, useRef } from "react";
import styles from "./light-field.module.css";

/*
 * The light field: a bundle of glowing strands that flows behind the whole
 * homepage. Its shape is keyframed against the page's scroll position, so
 * it gathers into a bright pinch beside the hero, loosens into a soft
 * aurora through the middle of the page and settles into low waves at the
 * end. Over time each strand ripples, and specks of light travel along it.
 *
 * Drawn on one fixed <canvas> in two passes: a soft glow drawn small and
 * scaled up (a blur without filters), then the sharp strands on top, both
 * with additive blending. Paused while the tab is hidden; reduced motion
 * gets a single still frame.
 */

// A scene is one cubic Bézier (viewport fractions) plus how the bundle sits
// on it: where it pinches, how narrow and wide it gets, how much it ripples,
// how bright the strands are, how much soft haze and how strong the focal
// light at the pinch. `at` is the page scroll fraction where it is reached.
const SCENES = [
  {
    at: 0,
    p: [0.76, 1.14, 0.27, 0.74, 0.36, 0.42, 1.12, 0.0],
    pinch: 0.36,
    narrow: 0.004,
    wide: 0.34,
    wave: 0.01,
    bright: 1,
    haze: 0.55,
    focal: 1,
  },
  {
    at: 0.16,
    p: [0.0, 1.2, 0.3, 0.56, 0.6, 0.72, 0.98, -0.22],
    pinch: 0.5,
    narrow: 0.07,
    wide: 0.24,
    wave: 0.03,
    bright: 0.34,
    haze: 1,
    focal: 0.15,
  },
  {
    at: 0.48,
    p: [1.12, 1.06, 0.6, 0.8, 0.92, 0.26, 0.58, -0.2],
    pinch: 0.55,
    narrow: 0.05,
    wide: 0.2,
    wave: 0.025,
    bright: 0.42,
    haze: 0.9,
    focal: 0.2,
  },
  {
    at: 0.8,
    p: [-0.12, 0.66, 0.3, 0.4, 0.66, 0.9, 1.12, 0.5],
    pinch: 0.5,
    narrow: 0.025,
    wide: 0.13,
    wave: 0.035,
    bright: 0.8,
    haze: 0.7,
    focal: 0.35,
  },
  {
    at: 1,
    p: [-0.12, 0.7, 0.3, 0.46, 0.66, 0.92, 1.12, 0.56],
    pinch: 0.5,
    narrow: 0.03,
    wide: 0.14,
    wave: 0.035,
    bright: 0.7,
    haze: 0.6,
    focal: 0.3,
  },
];

// On portrait screens the copy fills the width, so the hero's bundle
// sweeps in from the right edge instead of pinching beside the text.
const PORTRAIT_HERO = { ...SCENES[0], p: [1.05, 1.1, 0.68, 0.88, 0.7, 0.52, 1.25, 0.12], wide: 0.26, bright: 0.8 };

// Strand colours: mint first, with paler and cooler mint for depth.
const COLOURS = [
  [95, 224, 176],
  [95, 224, 176],
  [95, 224, 176],
  [130, 232, 194],
  [214, 255, 238],
  [88, 196, 214],
  [36, 168, 120],
];

const TAU = Math.PI * 2;
const mix = (a, b, f) => a + (b - a) * f;
const smooth = (f) => f * f * (3 - 2 * f);

// Deterministic pseudo-random numbers, so the field looks the same each visit.
function random(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Strands are drawn in a few layers (a colour, weight and opacity each), one
// path per layer, so a frame costs a handful of strokes, not one per strand.
const LAYERS = Array.from({ length: 8 }, (_, i) => {
  const rand = random(100 + i);
  return {
    rgb: COLOURS[i % COLOURS.length].join(" "),
    width: 0.55 + rand() * 1.05,
    alpha: 0.18 + rand() * 0.38,
  };
});

function makeStrands(count) {
  const rand = random(7);
  return Array.from({ length: count }, (_, i) => {
    const u = (i / (count - 1)) * 2 - 1;
    return {
      // Denser towards the middle of the bundle.
      offset: Math.sign(u) * Math.abs(u) ** 1.25 + (rand() - 0.5) * 0.06,
      layer: Math.floor(rand() * LAYERS.length),
      freq: 1.2 + rand() * 2.6,
      speed: 0.25 + rand() * 0.6,
      phase: rand() * TAU,
      amp: 0.5 + rand(),
    };
  });
}

function makeSpecks(count, strands) {
  const rand = random(11);
  return Array.from({ length: count }, () => ({
    strand: Math.floor(rand() * strands),
    t: rand(),
    speed: 0.012 + rand() * 0.035,
    size: 0.6 + rand() * 1.4,
    twinkle: rand() * TAU,
  }));
}

/** The scene at scroll fraction `progress`, blended between keyframes. */
function sceneAt(progress, time, portrait) {
  const scenes = portrait ? [PORTRAIT_HERO, ...SCENES.slice(1)] : SCENES;
  let i = 0;
  while (i < scenes.length - 2 && progress > scenes[i + 1].at) i++;
  const a = scenes[i];
  const b = scenes[i + 1];
  const f = smooth(Math.min(1, Math.max(0, (progress - a.at) / (b.at - a.at))));
  const p = a.p.map((v, k) => mix(v, b.p[k], f));
  // The two inner control points drift slowly, so the bundle breathes.
  p[2] += Math.sin(time * 0.11) * 0.025;
  p[3] += Math.cos(time * 0.09) * 0.02;
  p[4] += Math.sin(time * 0.07 + 1.3) * 0.025;
  p[5] += Math.cos(time * 0.13 + 0.4) * 0.02;
  const out = { p };
  for (const key of ["pinch", "narrow", "wide", "wave", "bright", "haze", "focal"]) {
    out[key] = mix(a[key], b[key], f);
  }
  return out;
}

export function LightField() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const glow = document.createElement("canvas");
    const gctx = glow.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const GLOW_SCALE = 0.2;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let segments = 72;
    let strands = [];
    let specks = [];
    // Base curve samples: x, y, normal x, normal y per segment.
    let base = new Float32Array(0);

    // Lite mode: set when frames run slow (no GPU raster), it drops to 1×
    // resolution and draws every other frame, so scrolling stays smooth.
    let lite = false;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const small = width < 768;
      dpr = small || lite ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      segments = small ? 48 : 72;
      if (strands.length !== (small ? 30 : 52)) {
        strands = makeStrands(small ? 30 : 52);
        specks = makeSpecks(small ? 40 : 90, strands.length);
      }
      base = new Float32Array((segments + 1) * 4);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      glow.width = Math.max(1, Math.round(width * GLOW_SCALE));
      glow.height = Math.max(1, Math.round(height * GLOW_SCALE));
    };

    const scrollProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    /** Samples the scene's curve and its normals into `base`. */
    const sample = (scene) => {
      const [x0, y0, x1, y1, x2, y2, x3, y3] = scene.p;
      for (let j = 0; j <= segments; j++) {
        const t = j / segments;
        const u = 1 - t;
        const x = u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3;
        const y = u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3;
        const dx = 3 * u * u * (x1 - x0) + 6 * u * t * (x2 - x1) + 3 * t * t * (x3 - x2);
        const dy = 3 * u * u * (y1 - y0) + 6 * u * t * (y2 - y1) + 3 * t * t * (y3 - y2);
        const len = Math.hypot(dx * width, dy * height) || 1;
        base[j * 4] = x * width;
        base[j * 4 + 1] = y * height;
        base[j * 4 + 2] = (-dy * height) / len;
        base[j * 4 + 3] = (dx * width) / len;
      }
    };

    /** Offset of strand `s` from the curve at parameter t, in pixels. */
    const offsetAt = (scene, s, t, time, scale) => {
      const reach = Math.max(scene.pinch, 1 - scene.pinch);
      const away = Math.abs(t - scene.pinch) / reach;
      const spread = scene.narrow + (scene.wide - scene.narrow) * away ** 1.45;
      const ripple =
        Math.sin(t * s.freq * TAU + time * s.speed + s.phase) * scene.wave * s.amp * (0.25 + 0.75 * away);
      return (s.offset * spread + ripple) * scale;
    };

    // Adds strand `s` to the current path as its own subpath.
    const strandPath = (target, scene, s, time, scale) => {
      for (let j = 0; j <= segments; j++) {
        const t = j / segments;
        const o = offsetAt(scene, s, t, time, scale);
        const x = base[j * 4] + base[j * 4 + 2] * o;
        const y = base[j * 4 + 1] + base[j * 4 + 3] * o;
        if (j === 0) target.moveTo(x, y);
        else target.lineTo(x, y);
      }
    };

    const draw = (progress, time) => {
      const scene = sceneAt(progress, time, height > width);
      const scale = Math.hypot(width, height) * 0.5;
      sample(scene);

      // Soft pass: wide, faint strokes on the small canvas, scaled up.
      gctx.setTransform(1, 0, 0, 1, 0, 0);
      gctx.clearRect(0, 0, glow.width, glow.height);
      gctx.setTransform(GLOW_SCALE, 0, 0, GLOW_SCALE, 0, 0);
      gctx.globalCompositeOperation = "lighter";
      gctx.lineCap = "round";
      gctx.lineWidth = 22;
      for (let l = 0; l < LAYERS.length; l++) {
        gctx.beginPath();
        for (let i = 0; i < strands.length; i += 2) {
          if (strands[i].layer === l) strandPath(gctx, scene, strands[i], time, scale);
        }
        gctx.strokeStyle = `rgb(${LAYERS[l].rgb} / ${0.07 * scene.haze})`;
        gctx.stroke();
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";
      // Plain bilinear scaling is soft enough for the glow, and much cheaper.
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "low";
      ctx.drawImage(glow, 0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Focal light where the bundle pinches.
      if (scene.focal > 0.02) {
        const j = Math.round(scene.pinch * segments) * 4;
        const r = scale * 0.22;
        const g = ctx.createRadialGradient(base[j], base[j + 1], 0, base[j], base[j + 1], r);
        g.addColorStop(0, `rgb(200 255 230 / ${0.32 * scene.focal})`);
        g.addColorStop(0.18, `rgb(95 224 176 / ${0.16 * scene.focal})`);
        g.addColorStop(1, "rgb(95 224 176 / 0)");
        ctx.fillStyle = g;
        ctx.fillRect(base[j] - r, base[j + 1] - r, r * 2, r * 2);
      }

      // Sharp pass: the strands themselves, one path per layer.
      ctx.lineCap = "round";
      for (let l = 0; l < LAYERS.length; l++) {
        ctx.beginPath();
        for (const s of strands) {
          if (s.layer === l) strandPath(ctx, scene, s, time, scale);
        }
        ctx.lineWidth = LAYERS[l].width;
        ctx.strokeStyle = `rgb(${LAYERS[l].rgb} / ${LAYERS[l].alpha * scene.bright})`;
        ctx.stroke();
      }

      // Specks of light travelling along the strands.
      for (const p of specks) {
        const s = strands[p.strand];
        const j = Math.min(segments, Math.round(p.t * segments));
        const o = offsetAt(scene, s, p.t, time, scale);
        const x = base[j * 4] + base[j * 4 + 2] * o;
        const y = base[j * 4 + 1] + base[j * 4 + 3] * o;
        const a = (0.35 + 0.65 * Math.abs(Math.sin(time * 1.7 + p.twinkle))) * scene.bright;
        ctx.fillStyle = `rgb(220 255 240 / ${a * 0.8})`;
        ctx.fillRect(x - p.size / 2, y - p.size / 2, p.size, p.size);
      }
    };

    resize();
    let progress = reduced ? 0 : scrollProgress();
    let frame = 0;
    let last = performance.now();
    let time = 0;
    let count = 0;
    let average = 1 / 60;

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt;
      count++;
      average += (dt - average) * 0.05;
      if (!lite && count > 90 && average > 0.026) {
        lite = true;
        resize();
      }
      // Ease towards the scroll position, so the field flows rather than jumps.
      progress += (scrollProgress() - progress) * Math.min(1, dt * 3.2);
      for (const p of specks) p.t = (p.t + p.speed * dt) % 1;
      if (!lite || count % 2 === 0) draw(progress, time);
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame || document.hidden) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    // Reduced motion: a still frame, redrawn for the new place on the page
    // once scrolling settles (a cut, not a move).
    let settle = 0;
    const drawStill = () => draw(scrollProgress(), 0);
    const onScrollStill = () => {
      clearTimeout(settle);
      settle = setTimeout(drawStill, 180);
    };

    const onResize = () => {
      resize();
      if (reduced) drawStill();
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    window.addEventListener("resize", onResize);
    if (reduced) {
      drawStill();
      window.addEventListener("scroll", onScrollStill, { passive: true });
    } else {
      document.addEventListener("visibilitychange", onVisibility);
      start();
    }
    canvas.dataset.ready = "true";

    return () => {
      stop();
      clearTimeout(settle);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScrollStill);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <>
      <canvas ref={ref} className={styles.field} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
    </>
  );
}
