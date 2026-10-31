"use client";

import { useEffect, useRef } from "react";
import styles from "./scene.module.css";

// Each scene's light, as three colours: the deep, the body and the
// highlight. Dark on purpose: it sits behind text.
const PALETTES = {
  intro: [[0.03, 0.09, 0.07], [0.06, 0.22, 0.17], [0.25, 0.75, 0.58]],
  how: [[0.06, 0.06, 0.13], [0.2, 0.19, 0.36], [0.7, 0.5, 0.36]],
  launch: [[0.07, 0.07, 0.12], [0.24, 0.22, 0.36], [0.8, 0.58, 0.42]],
  ugc: [[0.08, 0.06, 0.05], [0.3, 0.22, 0.16], [0.85, 0.66, 0.48]],
  explainer: [[0.03, 0.07, 0.08], [0.1, 0.24, 0.26], [0.37, 0.88, 0.69]],
  montage: [[0.05, 0.07, 0.12], [0.17, 0.29, 0.42], [0.69, 0.38, 0.48]],
  demo: [[0.05, 0.06, 0.12], [0.18, 0.23, 0.45], [0.56, 0.77, 0.84]],
  podcast: [[0.03, 0.08, 0.06], [0.12, 0.3, 0.22], [0.37, 0.88, 0.69]],
  download: [[0.02, 0.08, 0.06], [0.05, 0.3, 0.21], [0.37, 0.88, 0.69]],
  footer: [[0.02, 0.05, 0.05], [0.04, 0.18, 0.13], [0.3, 0.75, 0.58]],
};

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

// A domain-warped flow of light (two layers of fbm warping a third), mixed
// from scene A to scene B by a "denoise": the screen breaks into blocks
// that grow coarse and fizz with static halfway, then refine as B
// resolves out of them, like a diffusion model rendering a frame.
const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform float uMix;
uniform float uScroll;
uniform float uVel;
uniform vec2 uMouse;
uniform vec3 uA0, uA1, uA2, uB0, uB1, uB2;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.02 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}
vec3 field(vec2 uv, vec3 c0, vec3 c1, vec3 c2, float seed) {
  vec2 p = uv * vec2(uRes.x / uRes.y, 1.0) * 1.5;
  p.y -= uScroll;
  float t = uTime * 0.045;
  vec2 q = vec2(fbm(p + vec2(seed, t)), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 1.4), fbm(p + 3.0 * q + vec2(8.3, 2.8) - t));
  float n = fbm(p + 2.4 * r);
  vec3 col = mix(c0, c1, smoothstep(0.3, 0.85, n));
  col = mix(col, c2, 0.55 * smoothstep(0.72, 1.1, n * (0.6 + length(q))));
  float band = 1.0 - smoothstep(0.0, 0.035, abs(fract(n * 3.0 + t * 2.0) - 0.5) - 0.45);
  col += c2 * band * 0.08 * n;
  return col * (0.2 + n * 0.55);
}
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 aspect = vec2(uRes.x / uRes.y, 1.0);
  float d = distance(uv * aspect, uMouse * aspect);
  vec2 wuv = uv + (uv - uMouse) * 0.05 * exp(-d * 5.0);
  vec2 split = vec2(clamp(uVel, 0.0, 1.0) * 0.006, 0.0);

  vec3 A = field(wuv, uA0, uA1, uA2, 0.0);
  if (uVel > 0.05) {
    A.r = field(wuv + split, uA0, uA1, uA2, 0.0).r;
  }
  vec3 col = A;
  if (uMix > 0.001) {
    vec3 B = field(wuv, uB0, uB1, uB2, 3.7);
    float wave = sin(uMix * 3.14159);
    float cell = mix(2.0, 14.0, wave);
    vec2 c = floor(gl_FragCoord.xy / cell);
    float r = hash(c);
    col = mix(B, A, smoothstep(uMix - 0.08, uMix + 0.08, r));
    float edge = 1.0 - smoothstep(0.0, 0.1, abs(r - uMix));
    float fizz = step(0.55, hash(c + floor(uTime * 20.0)));
    col += edge * fizz * mix(uA2, uB2, uMix) * 0.3 * wave;
    col *= 1.0 + 0.2 * wave * (hash(c * 1.3) - 0.5);
  }
  col *= 1.0 - 0.75 * length(uv - 0.5);
  col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.025;
  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// Which scene the middle of the screen is in, as a float: whole numbers
// inside a section, the fraction while crossing into the next.
function sceneAt(sections, vh) {
  let s = 0;
  for (let i = 1; i < sections.length; i++) {
    const top = sections[i].getBoundingClientRect().top;
    s += smooth(vh * 0.72, vh * 0.28, top);
  }
  return s;
}

/**
 * The page's light, live on the GPU: a slow flow of light in each scene's
 * colours (Use cases takes the preset on air, from html[data-feed]) that
 * bends round the pointer and splits its colour a touch when the page is
 * flung. Crossing into the next section, the light is "generated": it
 * breaks into blocks and static and the next scene's light resolves out of
 * them. Renders at reduced resolution and only while the tab is visible;
 * with reduced motion it holds a still frame per scene. Sets data-gl on
 * its parent so the CSS light (the fallback) steps aside.
 */
export function LightField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = Object.fromEntries(
      ["uRes", "uTime", "uMix", "uScroll", "uVel", "uMouse", "uA0", "uA1", "uA2", "uB0", "uB1", "uB2"].map((name) => [name, gl.getUniformLocation(program, name)]),
    );

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const parent = canvas.parentElement;
    parent.setAttribute("data-gl", "");

    const sections = [...document.querySelectorAll("main [data-section]"), document.querySelector("footer")].filter(Boolean);
    const keyOf = (el) => {
      if (el.tagName === "FOOTER") return "footer";
      const id = el.id;
      if (id === "product") return "how";
      if (id === "use-cases") return document.documentElement.dataset.feed || "launch";
      if (id === "download") return "download";
      return "intro";
    };
    // The Use cases light eases between presets as the wheel turns.
    const cases = PALETTES.launch.map((c) => [...c]);

    const state = { raf: 0, start: performance.now(), vel: 0, lastY: scrollY, mouse: [0.5, 0.5], target: [0.5, 0.5] };

    function size() {
      const scale = innerWidth < 700 ? 0.45 : 0.55;
      canvas.width = Math.max(1, Math.round(innerWidth * scale));
      canvas.height = Math.max(1, Math.round(innerHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function palette(i) {
      const el = sections[Math.min(sections.length - 1, Math.max(0, i))];
      const key = keyOf(el);
      if (el.id === "use-cases") {
        const goal = PALETTES[key] || PALETTES.launch;
        for (let k = 0; k < 3; k++) for (let j = 0; j < 3; j++) cases[k][j] += (goal[k][j] - cases[k][j]) * 0.04;
        return cases;
      }
      return PALETTES[key];
    }

    function draw(now) {
      state.raf = 0;
      const vh = innerHeight;
      const s = sceneAt(sections, vh);
      const i = Math.floor(s);
      const mix = s - i;
      const A = palette(i);
      const B = palette(i + 1);
      const dy = scrollY - state.lastY;
      state.lastY = scrollY;
      state.vel += (Math.min(1, Math.abs(dy) / 60) - state.vel) * 0.12;
      state.mouse[0] += (state.target[0] - state.mouse[0]) * 0.06;
      state.mouse[1] += (state.target[1] - state.mouse[1]) * 0.06;

      gl.uniform2f(u.uRes, canvas.width, canvas.height);
      gl.uniform1f(u.uTime, reduced ? 12 : (now - state.start) / 1000);
      gl.uniform1f(u.uMix, reduced ? Math.round(mix) : mix);
      gl.uniform1f(u.uScroll, (scrollY / vh) * 0.35);
      gl.uniform1f(u.uVel, reduced ? 0 : state.vel);
      gl.uniform2f(u.uMouse, state.mouse[0], state.mouse[1]);
      gl.uniform3fv(u.uA0, A[0]);
      gl.uniform3fv(u.uA1, A[1]);
      gl.uniform3fv(u.uA2, A[2]);
      gl.uniform3fv(u.uB0, B[0]);
      gl.uniform3fv(u.uB1, B[1]);
      gl.uniform3fv(u.uB2, B[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!reduced && !document.hidden) state.raf = requestAnimationFrame(draw);
    }
    const kick = () => {
      if (!state.raf) state.raf = requestAnimationFrame(draw);
    };

    const onMove = (event) => {
      state.target = [event.clientX / innerWidth, 1 - event.clientY / innerHeight];
    };
    const onResize = () => {
      size();
      kick();
    };

    size();
    kick();
    addEventListener("resize", onResize);
    addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", kick);
    // With reduced motion there is no loop: redraw on scroll instead.
    if (reduced) addEventListener("scroll", kick, { passive: true });
    return () => {
      cancelAnimationFrame(state.raf);
      removeEventListener("resize", onResize);
      removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", kick);
      removeEventListener("scroll", kick);
      parent.removeAttribute("data-gl");
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.field} aria-hidden="true" />;
}
