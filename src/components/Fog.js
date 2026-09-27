import { useEffect, useRef } from "react";

/**
 * Full-viewport atmospheric haze: domain-warped noise mixing mint,
 * sea-glass, lilac and a peach warm spot, bending toward the cursor.
 * Fixed behind the page; opaque sections cover it, so it only shows
 * through the hero and the contact close. Renders at reduced resolution
 * and stops drawing when offscreen, hidden, or under reduced motion.
 */
const VERT = `
attribute vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1,0)), u.x),
             mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++){ v += a * noise(p); p = p * 2.02 + 3.1; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 st = uv * vec2(uRes.x / uRes.y, 1.0) * 1.6;
  float t = uTime * 0.045;

  // cursor pulls the weather toward it
  vec2 m = uMouse * vec2(uRes.x / uRes.y, 1.0) * 1.6;
  float pull = exp(-2.2 * distance(st, m));
  st += (m - st) * pull * 0.18;

  vec2 q = vec2(fbm(st + t), fbm(st + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(st + 3.0 * q + vec2(1.7, 9.2) + t * 1.3),
                fbm(st + 3.0 * q + vec2(8.3, 2.8) - t));
  float f = fbm(st + 2.4 * r);

  vec3 ground = vec3(0.914, 0.937, 0.918);
  vec3 mint   = vec3(0.773, 0.922, 0.765);
  vec3 sea    = vec3(0.64, 0.86, 0.80);
  vec3 lilac  = vec3(0.85, 0.82, 0.95);
  vec3 peach  = vec3(0.97, 0.85, 0.78);

  // mint leads the field; lilac and peach stay in the corners
  float cornerTR = smoothstep(0.45, 1.0, uv.x) * smoothstep(0.45, 1.0, uv.y);
  float cornerBR = smoothstep(0.55, 1.0, uv.x) * (1.0 - smoothstep(0.0, 0.55, uv.y));
  vec3 col = mix(ground, mint, 0.45);
  col = mix(col, mint,  smoothstep(0.15, 0.7, f) * 0.9);
  col = mix(col, sea,   smoothstep(0.55, 0.95, r.x) * 0.45);
  col = mix(col, lilac, smoothstep(0.3, 0.8, q.y) * cornerTR * 0.8);
  col = mix(col, peach, smoothstep(0.25, 0.75, r.y) * cornerBR * 0.75);
  col = mix(col, vec3(0.96, 0.975, 0.96), pull * 0.35);

  // soft grain so gradients never band
  col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.018;
  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s);
    return null;
  }
  return s;
}

export default function Fog({ watch = [] }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas && canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return; // CSS fallback gradient stays visible

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SCALE = 0.5;
    const mouse = { x: 0.62, y: 0.55, tx: 0.62, ty: 0.55 };

    const resize = () => {
      const w = Math.max(1, Math.floor(window.innerWidth * SCALE));
      const h = Math.max(1, Math.floor(window.innerHeight * SCALE));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };
    resize();
    canvas.dataset.ready = "true";

    const start = performance.now();
    const draw = (now) => {
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      gl.uniform1f(uTime, reduced ? 12 : (now - start) / 1000 + 12);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    // only animate while a fog window (hero / contact) is on screen
    const visible = new Set();
    let raf = 0;
    const loop = (now) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const sync = () => {
      const should = !reduced && visible.size > 0 && !document.hidden;
      if (should && !raf) raf = requestAnimationFrame(loop);
      if (!should && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      sync();
    });
    watch.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    const onMove = (e) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = 1 - e.clientY / window.innerHeight;
    };
    const onResize = () => {
      resize();
      draw(performance.now());
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", sync);
    draw(start);
    sync();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(60% 70% at 15% 20%, #C5EBC3 0%, transparent 70%), radial-gradient(50% 60% at 80% 15%, #D9D2F2 0%, transparent 70%), radial-gradient(50% 60% at 85% 85%, #F6D9C6 0%, transparent 70%), radial-gradient(60% 60% at 30% 85%, #A9DCCB 0%, transparent 70%), #E9EFEA",
      }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
