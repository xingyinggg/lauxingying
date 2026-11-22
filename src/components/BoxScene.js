import { Component, createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { mergeGeometries, mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import qrcode from "qrcode-generator";
import { EMAIL, LID_ROLE, LINKEDIN, ROLES, experience } from "../data/site";
import { ORBIT } from "../orbit";

/* ── palette (matches DESIGN.md) ── */
const C = {
  styrofoam: "#FAF8F2",
  shade: "#E4E0D5",
  rice: "#FFFFFF",
  curry: "#F0A21C",
  sambal: "#D8372E",
  kangkong: "#2F8F3E",
  bagRed: "#E5484D",
  table: "#F28A4B",
  steel: "#C5CCD2",
  steelDark: "#9AA3AB",
  ink: "#1C1B19",
  inkSoft: "#4A4742",
};

/* ── layout, in world units; the table top is y = 0 ── */
// a long hawker table, so the scene fills a wide screen; deep enough at the front for the side plates
const TABLE = { w: 14.2, d: 11.6, z: 1.2 };
const BOX = { w: 4.9, d: 3.9, h: 1.0, pos: [0, 0, 0.35] };
const BOX_S = 1.32; // the box is drawn larger than its parts were modelled
const LID_H = 0.85;
const FOOD_Y = 0.62; // top of the rice
const LID_OPEN = -2.12; // leans well back, so the open lid is not too tall for wide screens
/* The three featured dishes, served large and heaped over the rice: the first
   fills the left half of the box, the other two share the right. */
const SLOTS = [
  { pos: [-0.92, FOOD_Y + 0.02, 0.12], scale: 1.95, turn: 0.3 },
  { pos: [0.98, FOOD_Y + 0.02, -0.6], scale: 1.75, turn: -0.3 },
  { pos: [1.0, FOOD_Y + 0.02, 0.72], scale: 1.7, turn: 0.2 },
];
const world = (x, y, z) => [BOX.pos[0] + x * BOX_S, y * BOX_S, BOX.pos[2] + z * BOX_S];
const POTS = { curry: [-5.25, 0, -0.9], sambal: [-5.0, 0, 1.5] };
const BAG_POS = [5.35, 0, -1.1];
const QR_POS = [4.35, 0, 1.85]; // in from the end of the table, so a phone's overview keeps it in frame
const SLIP_POS = [2.9, 0.012, 3.3];
/* The side plates: a row along the front edge of the table, like a stall's display. */
const PLATE_Z = 5.45;
const PLATE_X = [-5, -3, -1, 1, 3, 5];

/* Where the page's DOM tags get pinned. */
export const TAG_POS = {
  about: world(-2.6, 0.85, -0.35), // on the left wall, clear of the featured label at the front
  projects: world(0.9, 0.8, 2.85),
  skills: [-5.15, 1.95, 0.2],
  experience: world(0.6, 4.25, -4.0),
  contact: [4.9, 3.4, -1.1], // nearer the middle, so it stays on a narrow screen
  connect: [4.55, 0.0, 2.45], // hangs just in front of the stand
  resume: [2.3, 0.0, 3.95], // hangs just in front of the voucher slip
  open: world(0, 2.6, -1.6),
};
/* featured labels pulled apart, so all three show at once: left dish low at the
   front-left, the back dish high, the front-right dish low at the front */
const DISH_TAG = [
  [-1.55, 1.25, 1.05],
  [1.25, 2.3, -1.0],
  [1.45, 1.2, 1.5],
];
DISH_TAG.forEach(([x, y, z], i) => {
  TAG_POS[`dish-${i}`] = world(x, y, z);
});
/* plate names alternate: one stands behind its plate, the next hangs in front, so
   neighbours never collide however narrow the screen */
PLATE_X.forEach((x, i) => {
  TAG_POS[`side-${i}`] = i % 2 ? [x, 0.02, PLATE_Z + 0.95] : [x, 0.3, PLATE_Z - 0.9];
});
/* labels that hang below their point instead of standing on it */
const HANG = new Set([...PLATE_X.map((_, i) => `side-${i}`).filter((_, i) => i % 2), "connect", "resume"]);

/* Camera stops round the orbit. `look` is what the camera centres on, `az` is
   where round the table it stands (0 is the front, 90 the right-hand end) and
   `el` how high. `r` is how much of the scene must stay in view around `look`;
   the camera backs off as far as the window needs, so nothing is cut off. */
const CLOSED_STOP = { look: [0, 0.8, 1.4], r: 6.4, el: 40 }; // the shut box, with the side plates in front
const STOPS = {
  // the three featured dishes, close up, one after another across the box
  "dish-0": { look: world(-0.92, 1.0, 0.12), r: 1.85, el: 66, az: 18 },
  "dish-1": { look: world(0.98, 1.0, -0.6), r: 1.7, el: 68, az: 10 },
  "dish-2": { look: world(1.0, 1.0, 0.72), r: 1.7, el: 64, az: 2 },
  // the side plates along the front
  // on a phone the row is framed edge to edge, so all six names have room
  projects: { look: [0, 0.4, PLATE_Z - 0.3], r: 6.7, rPhone: 5.5, syPhone: 0.31, el: 44, az: -2 },
  // the whole box from above: rice round the dishes
  about: { look: world(0, 0.8, 0.1), r: 3.5, el: 64, az: -5 },
  experience: { look: world(0, 2.6, -3.0), r: 3.1, el: 28, az: -8 },
  // round to the left-hand end: the pots, with the open box behind them
  skills: { look: [-3.9, 1.0, 0.3], r: 4.3, el: 32, az: -95 },
  // round the back to the right-hand end: the bag, the box shut beside it
  contact: { look: [4.1, 1.1, -0.7], r: 4.5, el: 30, az: 112 },
  connect: { look: [4.35, 0.9, 1.85], r: 2.4, el: 28, az: 58 },
};

const clamp01 = (n) => Math.min(1, Math.max(0, n));
const rad = THREE.MathUtils.degToRad;

function rng(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* A light gust every few seconds: 0 at rest, 1 at its peak. */
const GUST_EVERY = 5.2;
function gustAt(t) {
  const ph = (t % GUST_EVERY) / GUST_EVERY;
  return ph < 0.3 ? Math.pow(Math.sin((ph / 0.3) * Math.PI), 2) : 0;
}

/* ── geometry helpers ── */
function rrPath(path, w, d, r, cx = 0, cy = 0) {
  const x = cx - w / 2;
  const y = cy - d / 2;
  path.moveTo(x + r, y);
  path.lineTo(x + w - r, y);
  path.quadraticCurveTo(x + w, y, x + w, y + r);
  path.lineTo(x + w, y + d - r);
  path.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
  path.lineTo(x + r, y + d);
  path.quadraticCurveTo(x, y + d, x, y + d - r);
  path.lineTo(x, y + r);
  path.quadraticCurveTo(x, y, x + r, y);
  return path;
}

/* A rounded slab lying flat: bottom at y=0, top at y=h, optional holes. */
function slabGeo(w, d, h, r, bevel = 0.03, holes = []) {
  const shape = rrPath(new THREE.Shape(), w - bevel * 2, d - bevel * 2, r);
  holes.forEach(([hw, hd, hr, cx, cz]) =>
    shape.holes.push(rrPath(new THREE.Path(), hw, hd, hr, cx, -cz)),
  );
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: h - bevel * 2,
    bevelEnabled: true,
    bevelSize: bevel,
    bevelThickness: bevel,
    bevelSegments: 6,
    curveSegments: 14,
  });
  g.rotateX(-Math.PI / 2);
  g.translate(0, bevel, 0);
  return g;
}

/* Foam boxes are moulded with sloping walls: narrower at the base. */
function taper(g, h, k, flip = false) {
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const t = Math.min(1, Math.max(0, p.getY(i) / h));
    const f = k + (1 - k) * (flip ? 1 - t : t);
    p.setX(i, p.getX(i) * f);
    p.setZ(i, p.getZ(i) * f);
  }
  g.computeVertexNormals();
  return g;
}

const GEO = {
  table: slabGeo(TABLE.w, TABLE.d, 0.45, 1.1, 0.1),
  boxRim: taper(slabGeo(BOX.w, BOX.d, BOX.h, 0.7, 0.2, [[BOX.w - 0.95, BOX.d - 0.95, 0.36, 0, 0]]), BOX.h, 0.82),
  boxBase: slabGeo(BOX.w - 0.9, BOX.d - 0.9, 0.08, 0.4, 0.01),
  tab: slabGeo(1.5, 0.6, 0.2, 0.18, 0.08),
  flange: slabGeo(BOX.w + 0.42, BOX.d + 0.42, 0.2, 0.86, 0.09, [[BOX.w - 0.95, BOX.d - 0.95, 0.36, 0, 0]]),
  hinge: slabGeo(BOX.w * 0.72, 0.3, 0.1, 0.12, 0.04),
  lidRim: taper(slabGeo(BOX.w, BOX.d, LID_H, 0.7, 0.2, [[BOX.w - 0.95, BOX.d - 0.95, 0.36, 0, 0]]), LID_H, 0.84, true),
  lidTop: slabGeo(BOX.w - 0.95, BOX.d - 0.95, 0.07, 0.4, 0.01),
  rice: slabGeo(BOX.w - 1.0, BOX.d - 1.0, 0.56, 0.34, 0.1),
  box: new THREE.BoxGeometry(1, 1, 1),
  sph: new THREE.SphereGeometry(0.5, 20, 14),
  ico: new THREE.IcosahedronGeometry(0.5, 1),
  rock: new THREE.IcosahedronGeometry(0.5, 0),
  cyl: new THREE.CylinderGeometry(0.5, 0.5, 1, 20),
  ring: new THREE.TorusGeometry(1, 0.1, 8, 28),
  plane: new THREE.PlaneGeometry(1, 1),
  // a small white side plate with a raised rim, and a deeper bowl for steamed egg
  plate: new THREE.LatheGeometry(
    [[0, 0], [0.55, 0], [0.62, 0.02], [0.75, 0.08], [0.88, 0.15], [0.9, 0.17], [0.86, 0.18], [0.74, 0.11], [0.6, 0.06], [0, 0.06]].map(
      ([x, y]) => new THREE.Vector2(x, y),
    ),
    48,
  ),
  bowl: new THREE.LatheGeometry(
    [[0, 0], [0.36, 0], [0.4, 0.03], [0.5, 0.2], [0.6, 0.42], [0.62, 0.46], [0.58, 0.47], [0.5, 0.28], [0.38, 0.1], [0, 0.1]].map(
      ([x, y]) => new THREE.Vector2(x, y),
    ),
    48,
  ),
};

/* A craggy fried nugget: a ball with a lumpy, uneven crust. */
{
  const g = new THREE.IcosahedronGeometry(0.5, 3);
  const pos = g.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n =
      Math.sin(v.x * 9.1 + v.y * 3.3) * 0.5 + Math.sin(v.y * 11.7 + v.z * 5.1) * 0.3 + Math.sin(v.z * 15.3 + v.x * 7.7) * 0.2;
    v.multiplyScalar(1 + n * 0.16);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  GEO.nug = g;
}

/* A ragged, cupped piece of cooked leaf, wilted and wavy at the edge. */
{
  const g = new THREE.PlaneGeometry(1, 1, 16, 16);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const a = Math.atan2(y, x);
    const edge = 1 + 0.14 * Math.sin(a * 5) + 0.06 * Math.sin(a * 11);
    const r2 = x * x + y * y;
    pos.setXYZ(i, x * edge, y * edge, r2 * 0.7 + Math.sin(a * 5 + r2 * 6) * 0.02 * r2 * 4);
  }
  g.rotateX(-Math.PI / 2);
  g.computeVertexNormals();
  GEO.leaf = g;
}

/* Pooled sauce: a glaze, thickest in the middle and thinning to nothing at an
   uneven, lobed edge, so it runs into the rice instead of sitting on it as a disc. */
{
  const RINGS = 10;
  const SEGS = 56;
  const pos = [];
  const idx = [];
  for (let r = 0; r <= RINGS; r++) {
    const t = r / RINGS;
    for (let k = 0; k < SEGS; k++) {
      const a = (k / SEGS) * Math.PI * 2;
      const edge = 1 + 0.14 * Math.sin(a * 3 + 1) + 0.08 * Math.sin(a * 7 + 2) + 0.04 * Math.sin(a * 13);
      const rad = 0.5 * t * edge;
      // a soft dome that meets the rice at a feather edge
      const y = Math.pow(1 - t * t, 1.6) * (1 + 0.06 * t * Math.sin(a * 3 + 1)); // smooth in the middle, a gentle wobble outward
      pos.push(Math.cos(a) * rad, y, Math.sin(a) * rad);
      if (r < RINGS) {
        const i0 = r * SEGS + k;
        const i1 = r * SEGS + ((k + 1) % SEGS);
        idx.push(i0, i1 + SEGS, i0 + SEGS, i0, i1, i1 + SEGS);
      }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  GEO.pool = g;
}

/* A tomato wedge: a slice of a sphere (the skin) and its two cut faces (the
   flesh), kept apart so the flesh can be a lighter colour. Slightly squashed and
   softened, the way tomato goes in a pan. */
{
  const ARC = 1.25; // how much of the round the wedge takes
  const skin = new THREE.SphereGeometry(0.5, 12, 10, 0, ARC);
  const p = skin.attributes.position;
  for (let i = 0; i < p.count; i++) p.setY(i, p.getY(i) * 0.86);
  skin.computeVertexNormals();
  GEO.wedgeSkin = skin;
  const cut = [];
  for (const phi of [0, ARC]) {
    for (let k = 0; k < 10; k++) {
      const pt = (th) => [-0.5 * Math.cos(phi) * Math.sin(th), 0.5 * Math.cos(th) * 0.86, 0.5 * Math.sin(phi) * Math.sin(th)];
      cut.push(0, 0, 0, ...pt((k / 10) * Math.PI), ...pt(((k + 1) / 10) * Math.PI));
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(cut, 3));
  g.computeVertexNormals();
  GEO.wedgeCut = g;
}

/* Styrofoam's fine pebbled surface, as a bump texture. */
const FOAM_BUMP = (() => {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const x = c.getContext("2d");
  x.fillStyle = "#808080";
  x.fillRect(0, 0, 256, 256);
  const rnd = rng(77);
  for (let i = 0; i < 2600; i++) {
    const g = 100 + Math.floor(rnd() * 110);
    x.fillStyle = `rgb(${g},${g},${g})`;
    x.beginPath();
    x.arc(rnd() * 256, rnd() * 256, 1.2 + rnd() * 2.2, 0, Math.PI * 2);
    x.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1.6, 1.6);
  return t;
})();

function Foam() {
  return <meshStandardMaterial color="#FFFFFF" roughness={0.62} bumpMap={FOAM_BUMP} bumpScale={1.4} />;
}

/* ── the nine dishes ──
   After design/refs/caifan-dishes.png: irregular pieces of uneven size that pile
   up and overlap, glossy sauce pooled under them and caught between them. Each
   dish is built once from many small parts, then merged into one mesh per kind
   of surface, so a whole dish draws in two or three calls. */

/* A soft irregular lump: a sphere pushed in and out by a few overlapping waves,
   with smooth normals so glaze catches the light. Variants are cached by key. */
const LUMPS = {};
function lump(seed, detail = 2, amp = 0.2, freq = 1) {
  const key = `${seed}:${detail}:${amp}:${freq}`;
  if (LUMPS[key]) return LUMPS[key];
  const r = rng(seed * 7919 + 13);
  const waves = Array.from({ length: 5 }, () => {
    const w = new THREE.Vector3(r() * 2 - 1, r() * 2 - 1, r() * 2 - 1).normalize().multiplyScalar((2.2 + r() * 3.5) * freq);
    return { w, ph: r() * Math.PI * 2, k: 0.5 + r() * 0.5 };
  });
  let g = new THREE.IcosahedronGeometry(0.5, detail);
  g.deleteAttribute("normal");
  g.deleteAttribute("uv");
  g = mergeVertices(g);
  const p = g.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    let n = 0;
    waves.forEach(({ w, ph, k }) => {
      n += Math.sin(v.dot(w) * 2 + ph) * k;
    });
    v.multiplyScalar(1 + (amp * n) / 2.5);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return (LUMPS[key] = g);
}

/* A bumpy solid: anywhere from a ball (box 0) to a rounded cube (box 1), with
   bumps over it, fine (high freq) for batter and crust, coarse for curds. */
const BUMPY = {};
function bumpy(seed, box = 0, freq = 6, amp = 0.08, detail = 3) {
  const key = `${seed}:${box}:${freq}:${amp}:${detail}`;
  if (BUMPY[key]) return BUMPY[key];
  const r = rng(seed * 4099 + 7);
  const waves = Array.from({ length: 9 }, (_, i) => ({
    w: new THREE.Vector3(r() * 2 - 1, r() * 2 - 1, r() * 2 - 1).normalize().multiplyScalar(freq * (0.6 + r() * 0.9) * (i < 3 ? 0.4 : 1)),
    ph: r() * Math.PI * 2,
    k: i < 3 ? 1 : 0.5,
  }));
  let g = new THREE.IcosahedronGeometry(0.5, detail);
  g.deleteAttribute("normal");
  g.deleteAttribute("uv");
  g = mergeVertices(g);
  const p = g.attributes.position;
  const v = new THREE.Vector3();
  const c = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    // toward a rounded cube: push out to the cube's surface, softened at the corners
    const m = Math.max(Math.abs(v.x), Math.abs(v.y), Math.abs(v.z));
    c.copy(v).multiplyScalar(0.5 / m);
    c.lerp(v.clone().normalize().multiplyScalar(0.6), 0.25);
    v.lerp(c, box);
    let n = 0;
    waves.forEach(({ w, ph, k }) => {
      n += Math.sin(v.dot(w) + ph) * k;
    });
    v.multiplyScalar(1 + (amp * n) / 3);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return (BUMPY[key] = g);
}

const SHAPES = {
  pool: GEO.pool,
  leaf: GEO.leaf,
  bean: new THREE.CapsuleGeometry(0.5, 1, 4, 10),
  shell: new THREE.CylinderGeometry(0.5, 0.5, 1, 14, 1, true, 0, 1.9), // a curved piece of pepper or onion
  coin: new THREE.CylinderGeometry(0.5, 0.5, 1, 24),
  strip: new THREE.BoxGeometry(1, 1, 1),
  prism: new THREE.CylinderGeometry(0.5, 0.5, 1, 3), // a pineapple wedge
  wedgeSkin: GEO.wedgeSkin,
  wedgeCut: GEO.wedgeCut,
  ring: new THREE.TorusGeometry(0.5, 0.12, 6, 16), // a slice of spring onion
  chunk: (() => {
    // a cut chunk with softened corners: pineapple, potato
    const g = new THREE.BoxGeometry(1, 1, 1, 3, 3, 3);
    const p = g.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const n = v.clone().normalize().multiplyScalar(0.5);
      v.lerp(n, 0.35);
      p.setXYZ(i, v.x, v.y, v.z);
    }
    g.computeVertexNormals();
    return g;
  })(),
};

/* Surfaces: glaze and sauce are glossy; fried crust and egg are soft; thin
   leaves and shells are seen from both sides. */
const DISH_MAT = {
  gloss: new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.34, clearcoat: 1, clearcoatRoughness: 0.14 }),
  soft: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.72 }),
  egg: new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.55, sheen: 0.6, sheenRoughness: 0.5, sheenColor: new THREE.Color("#FFF6D8") }),
  crisp: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.92 }),
  thin: new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.42, clearcoat: 0.6, clearcoatRoughness: 0.25, side: THREE.DoubleSide }),
};

/* Points spread over an ellipse, heaped toward the middle: a pile, not a grid. */
function heap(n, rnd, rx, rz, y0, h) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 * 2.618 + rnd() * 0.9; // golden-ish spiral, jittered
    const d = Math.sqrt((i + 0.5) / n) * (0.85 + rnd() * 0.25);
    const x = Math.cos(a) * d * rx;
    const z = Math.sin(a) * d * rz;
    return [x, y0 + (1 - Math.min(1, d * d)) * h + rnd() * 0.05, z];
  });
}

function buildDish(kind) {
  const rnd = rng(kind.length * 977 + kind.charCodeAt(0) * 31 + kind.charCodeAt(2));
  const parts = [];
  const turn = () => rnd() * Math.PI * 2;
  const pick = (list) => list[Math.floor(rnd() * list.length)];
  // a part: shape (a geometry), where, how big, which way, colour, surface
  const add = (geo, p, s, c, mat, r = [turn(), turn(), turn()]) => parts.push({ geo, p, s, c, mat, r });
  const lumpAt = (p, s, c, mat = "gloss", detail = 2, amp = 0.22, freq = 1) =>
    add(lump(Math.floor(rnd() * 8), detail, amp, freq), p, s, c, mat);
  // sauce pooled under the food, with a few drops caught between the pieces
  const sauce = (c, rx, rz, drops = 5, edge) => {
    parts.push({ geo: SHAPES.pool, p: [0, -0.01, 0], s: [rx * 2.15, 0.08, rz * 2.15], c, rim: edge || c, mat: "gloss", r: [0, turn(), 0] });
    // glaze caught between the pieces: flat smears, not beads
    for (let i = 0; i < drops; i++) {
      const a = turn();
      const d = 0.12 + rnd() * 0.28;
      add(SHAPES.pool, [Math.cos(a) * d, 0.1 + rnd() * 0.1, Math.sin(a) * d], [0.22 + rnd() * 0.12, 0.035, 0.18 + rnd() * 0.08], c, "gloss", [
        (rnd() - 0.5) * 0.5,
        turn(),
        (rnd() - 0.5) * 0.5,
      ]);
    }
  };
  const vary = (s) => [s * (0.85 + rnd() * 0.35), s * (0.7 + rnd() * 0.3), s * (0.85 + rnd() * 0.3)];

  switch (kind) {
    case "sweetsour":
      // bright red battered cubes, bumpy like popcorn, in a thick glaze; pineapple, green pepper, onion
      sauce("#D23A1A", 0.5, 0.42, 6, "#EE7A4A");
      heap(14, rnd, 0.44, 0.36, 0.13, 0.2).forEach((p, i) =>
        add(bumpy(i % 4, 0.45, 22, 0.34, 4), p, vary(0.22), pick(["#E84F22", "#EE5E2A", "#DD441E", "#EA5626"]), "gloss"),
      );
      heap(3, rnd, 0.4, 0.32, 0.3, 0.12).forEach((p) =>
        add(SHAPES.prism, p, [0.15, 0.12, 0.15], pick(["#F7C843", "#F5BE30"]), "gloss", [Math.PI / 2 + (rnd() - 0.5) * 0.5, turn(), 0]),
      );
      heap(3, rnd, 0.42, 0.34, 0.27, 0.12).forEach((p) =>
        add(SHAPES.chunk, p, [0.2, 0.06, 0.16], pick(["#4FAF3E", "#5DBA48"]), "gloss", [(rnd() - 0.5) * 0.9, turn(), (rnd() - 0.5) * 0.9]),
      );
      add(SHAPES.wedgeSkin, heap(1, rnd, 0.3, 0.25, 0.22, 0.05)[0], [0.18, 0.2, 0.18], "#F3EEE6", "thin", [Math.PI / 2, turn(), 0.4]);
      break;
    case "cabbage":
      sauce("#E9DDA0", 0.6, 0.5, 3);
      heap(20, rnd, 0.5, 0.42, 0.06, 0.14).forEach((p) => {
        const r = [(rnd() - 0.5) * 0.8, turn(), (rnd() - 0.5) * 0.8];
        parts.push({
          geo: SHAPES.leaf,
          p,
          s: [0.56 + rnd() * 0.2, 0.3 + rnd() * 0.18, 0.46 + rnd() * 0.16],
          c: pick(["#F1F5DA", "#EDF2CF", "#F5F7E4", "#E7EFC4"]), // pale, nearly white at the thick middle
          rim: pick(["#B9D67C", "#A9CC6A", "#C4DD8C"]), // greener toward the thin, ruffled edge
          mat: "thin",
          r,
        });
      });
      heap(8, rnd, 0.42, 0.34, 0.16, 0.12).forEach((p) =>
        add(SHAPES.strip, p, [0.34, 0.035, 0.06], pick(["#F2792A", "#EE6C22"]), "gloss", [(rnd() - 0.5) * 0.4, turn(), (rnd() - 0.5) * 0.3]),
      );
      heap(5, rnd, 0.35, 0.3, 0.24, 0.12).forEach((p) => lumpAt(p, [0.05, 0.04, 0.05], "#F3E6B5", "soft", 1));
      break;
    case "tomatoegg":
      // a mound of fluffy yellow scrambled egg, big orange-red tomato chunks, a little sauce
      sauce("#E8622E", 0.44, 0.38, 4, "#F2A06A");
      heap(9, rnd, 0.42, 0.36, 0.12, 0.2).forEach((p, i) =>
        add(bumpy(10 + (i % 5), 0.05, 18, 0.32, 4), p, vary(0.3), pick(["#F8D63A", "#FADF5C", "#F6CF30", "#FBE46E"]), "egg"),
      );
      heap(5, rnd, 0.4, 0.34, 0.22, 0.14).forEach((p, i) =>
        add(bumpy(20 + i, 0.75, 3, 0.05, 2), p, [0.25, 0.2, 0.22], pick(["#EA4F2C", "#F0603A", "#E4472A"]), "gloss"),
      );
      break;
    case "curry":
      // a few big golden chicken pieces and big yellow potato chunks, coated in orange gravy
      sauce("#DC8418", 0.58, 0.48, 6, "#EFA640");
      heap(5, rnd, 0.42, 0.34, 0.14, 0.12).forEach((p, i) =>
        add(bumpy(30 + i, 0.3, 6, 0.24), p, [0.36 + rnd() * 0.06, 0.24, 0.3], pick(["#E9B060", "#E3A552", "#EDB96C"]), "gloss"),
      );
      heap(3, rnd, 0.36, 0.3, 0.26, 0.12).forEach((p, i) =>
        add(bumpy(40 + i, 0.9, 2, 0.03, 2), p, [0.3, 0.27, 0.28], pick(["#F9D84E", "#FBDF5E"]), "gloss", [(rnd() - 0.5) * 0.6, turn(), (rnd() - 0.5) * 0.6]),
      );
      break;
    case "friedchicken":
      // one big thigh piece and a wing, in a rough golden crust
      add(bumpy(50, 0.1, 17, 0.3, 4), [-0.12, 0.2, 0.08], [0.66, 0.38, 0.5], "#D58E2E", "crisp", [0, 0.5, 0.12]);
      add(bumpy(51, 0.05, 17, 0.3, 4), [0.16, 0.36, -0.12], [0.44, 0.22, 0.24], "#DB9836", "crisp", [0.15, -0.5, 0.35]);
      add(bumpy(52, 0.05, 17, 0.3, 4), [0.36, 0.5, -0.24], [0.32, 0.18, 0.2], "#D08A2C", "crisp", [0.3, 0.3, 0.8]);
      add(bumpy(53, 0.1, 17, 0.3, 3), [-0.3, 0.14, -0.22], [0.3, 0.2, 0.26], "#CC862A", "crisp", [0.1, 1.2, 0.2]);
      break;
    case "frenchbean":
      sauce("#C9B27A", 0.5, 0.42, 2);
      heap(18, rnd, 0.42, 0.34, 0.08, 0.2).forEach((p) =>
        add(SHAPES.bean, p, [0.11, 0.36 + rnd() * 0.12, 0.11], pick(["#3F9B46", "#4FAE4F", "#2E8A3C", "#58B65C"]), "gloss", [
          Math.PI / 2 + (rnd() - 0.5) * 0.5,
          turn(),
          (rnd() - 0.5) * 0.4,
        ]),
      );
      heap(7, rnd, 0.36, 0.3, 0.26, 0.12).forEach((p) => lumpAt(p, [0.07, 0.05, 0.06], "#F4E9C6", "soft", 1));
      break;
    case "eggplant":
      sauce("#7A4524", 0.6, 0.5, 6);
      heap(8, rnd, 0.42, 0.34, 0.14, 0.16).forEach((p) =>
        add(SHAPES.bean, p, [0.2, 0.2 + rnd() * 0.12, 0.2], pick(["#5E2F86", "#6E3A97", "#552A7A"]), "gloss", [
          Math.PI / 2 + (rnd() - 0.5) * 0.6,
          turn(),
          0,
        ]),
      );
      heap(4, rnd, 0.38, 0.3, 0.18, 0.12).forEach((p) => lumpAt(p, [0.2, 0.12, 0.17], "#C9A55E", "gloss", 1, 0.2));
      heap(5, rnd, 0.32, 0.26, 0.3, 0.08).forEach((p) => lumpAt(p, [0.06, 0.05, 0.05], "#F4E9C6", "soft", 1));
      break;
    case "steamedegg":
      // the smooth custard filling a small bowl
      add(SHAPES.coin, [0, 0.0, 0], [1.02, 0.06, 1.02], "#F8E08A", "gloss", [0, 0, 0]);
      for (let i = 0; i < 3; i++) add(lump(30 + i, 1, 0.3), [(rnd() - 0.5) * 0.4, 0.035, (rnd() - 0.5) * 0.4], [0.2, 0.015, 0.14], "#8A5A2B", "gloss");
      for (let i = 0; i < 8; i++)
        add(SHAPES.coin, [(rnd() - 0.5) * 0.5, 0.04, (rnd() - 0.5) * 0.5], [0.05, 0.02, 0.05], pick(["#4FA646", "#5DB548"]), "gloss", [0, 0, 0]);
      break;
    case "eggtofu":
    default:
      // thick discs browned all over, a light brown sauce, garlic cloves
      sauce("#C07A3A", 0.55, 0.46, 4, "#DCA066");
      // four discs laid side by side, one leaning on them, faces up so the pale middle shows
      [[-0.24, 0.12, -0.12], [0.22, 0.12, -0.16], [-0.18, 0.12, 0.24], [0.26, 0.12, 0.22], [0.02, 0.3, 0.04]].forEach((p) => {
        parts.push({
          geo: SHAPES.coin,
          p,
          s: [0.4, 0.17, 0.4],
          c: "#F0BC62", // paler in the middle of the face, browner at the seared edge
          rim: "#CF8A34",
          mat: "gloss",
          r: [(rnd() - 0.5) * 0.35, turn(), (rnd() - 0.5) * 0.35],
        });
      });
      heap(5, rnd, 0.46, 0.4, 0.12, 0.04).forEach((p, i) => add(bumpy(60 + i, 0, 3, 0.06, 2), p, [0.08, 0.07, 0.13], "#F1E4C8", "soft"));
      break;
  }
  return parts;
}

/* Merge a dish's parts into one geometry per surface. Each piece is shaded a
   little darker underneath, so crevices read without extra lights. */
function mergeDish(parts) {
  const byMat = {};
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const col = new THREE.Color();
  const rimCol = new THREE.Color();
  parts.forEach(({ geo, p, s, c, mat, r, rim }) => {
    let g = geo.index ? geo.toNonIndexed() : geo.clone();
    ["uv", "uv1"].forEach((a) => g.attributes[a] && g.deleteAttribute(a));
    if (!g.attributes.normal) g.computeVertexNormals();
    // how far each vertex is from the middle of the part, before it is placed
    const pos = g.attributes.position;
    const edge = rim ? Float32Array.from({ length: pos.count }, (_, i) => Math.min(1, Math.hypot(pos.getX(i), pos.getZ(i)) / 0.6)) : null;
    if (rim) rimCol.set(rim);
    m.compose(new THREE.Vector3(...p), q.setFromEuler(e.set(...r)), new THREE.Vector3(...(Array.isArray(s) ? s : [s, s, s])));
    g.applyMatrix4(m);
    col.set(c);
    const n = g.attributes.normal;
    const colors = new Float32Array(n.count * 3);
    for (let i = 0; i < n.count; i++) {
      let k = 0.8 + 0.2 * (n.getY(i) * 0.5 + 0.5);
      const t = edge ? edge[i] * edge[i] : 0;
      if (mat === "crisp") {
        const h = Math.sin(pos.getX(i) * 91.7 + pos.getY(i) * 47.3 + pos.getZ(i) * 63.1) * 43758.5;
        k *= 0.82 + 0.3 * (h - Math.floor(h));
      }
      colors[i * 3] = (col.r + (rimCol.r - col.r) * t) * k;
      colors[i * 3 + 1] = (col.g + (rimCol.g - col.g) * t) * k;
      colors[i * 3 + 2] = (col.b + (rimCol.b - col.b) * t) * k;
    }
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    (byMat[mat] = byMat[mat] || []).push(g);
  });
  return Object.entries(byMat).map(([mat, list]) => ({ mat, geo: mergeGeometries(list) }));
}

/* Rice: a full, heaped bed of loose grains, about 1,700 of them in one
   instanced mesh. They fill the box wall to wall, two layers deep, and show
   round the edges of the dishes and between them; none sit under a dish's
   middle, where they would only poke through the sauce. */
const RICE = (() => {
  const rnd = rng(4242);
  const hx = (BOX.w - 1.05) / 2;
  const hz = (BOX.d - 1.05) / 2;
  const grains = [];
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const v = new THREE.Vector3();
  const sc = new THREE.Vector3();
  for (let n = 0; n < 2600 && grains.length < 1700; n++) {
    const x = (rnd() * 2 - 1) * hx;
    const z = (rnd() * 2 - 1) * hz;
    // heaped toward the middle, as a scoop of rice is
    const dome = (1 - (x / hx) ** 2 * 0.7) * (1 - (z / hz) ** 2 * 0.7);
    const covered = SLOTS.some(({ pos, scale }) => ((x - pos[0]) / (0.36 * scale)) ** 2 + ((z - pos[2]) / (0.3 * scale)) ** 2 < 1);
    if (covered) continue;
    const y = FOOD_Y - 0.02 + dome * 0.16 + (grains.length % 2 ? 0.05 : 0) + rnd() * 0.03;
    v.set(x, y, z);
    q.setFromEuler(e.set((rnd() - 0.5) * 0.9, rnd() * Math.PI, (rnd() - 0.5) * 0.9));
    const k = 0.85 + rnd() * 0.3;
    sc.set(0.17 * k, 0.075 * k, 0.09 * k);
    grains.push(m.compose(v, q, sc).clone());
  }
  return grains;
})();
const GRAIN = new THREE.SphereGeometry(0.5, 8, 6);

function RiceBed() {
  const ref = useRef();
  useLayoutEffect(() => {
    const mesh = ref.current;
    const c = new THREE.Color();
    const rnd = rng(77);
    RICE.forEach((mx, i) => {
      mesh.setMatrixAt(i, mx);
      mesh.setColorAt(i, c.set(rnd() < 0.2 ? "#F4F1E8" : "#FFFFFF")); // a few grains a touch creamier
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, []);
  return (
    <instancedMesh ref={ref} args={[GRAIN, undefined, RICE.length]} castShadow receiveShadow>
      <meshStandardMaterial color="#FFFFFF" roughness={0.55} />
    </instancedMesh>
  );
}

const DISH_CACHE = {};
function Dish({ kind, ...props }) {
  const meshes = DISH_CACHE[kind] || (DISH_CACHE[kind] = mergeDish(buildDish(kind)));
  return (
    <group {...props}>
      {meshes.map(({ mat, geo }) => (
        <mesh key={mat} geometry={geo} material={DISH_MAT[mat]} castShadow receiveShadow />
      ))}
    </group>
  );
}

function Mat({ color, rough = 0.85 }) {
  return <meshStandardMaterial color={color} roughness={rough} />;
}

/* ── textures drawn on a 2D canvas ── */
/* Called after a texture repaints with the web fonts, so an on-demand canvas redraws. */
const repainted = new Set();

const DISPLAY = '"M PLUS Rounded 1c", system-ui, sans-serif';
const BODY = '"Schibsted Grotesk", system-ui, sans-serif';
const MONO = '"Sometype Mono", ui-monospace, monospace';

function canvasTexture(w, h, draw, scale = 2) {
  const canvas = document.createElement("canvas");
  // drawn larger than its layout size, so text stays crisp when the camera is close
  canvas.width = w * scale;
  canvas.height = h * scale;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 16;
  const paint = () => {
    const ctx = canvas.getContext("2d");
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    draw(ctx, w, h);
    tex.needsUpdate = true;
  };
  paint();
  // repaint once the web fonts are in
  if (document.fonts && document.fonts.ready) {
    Promise.all([
      document.fonts.load(`900 40px ${DISPLAY}`),
      document.fonts.load(`800 40px ${DISPLAY}`),
      document.fonts.load(`500 20px ${MONO}`),
      document.fonts.load(`600 20px ${BODY}`),
      document.fonts.load(`700 20px ${BODY}`),
    ])
      .then(() => {
        paint();
        repainted.forEach((f) => f());
      })
      .catch(() => {});
  }
  return tex;
}

/* ── the lid's name card and sticker ──
   Painted into the scene (not laid over it), so the foam hides them from any
   angle and they take the scene's light. Both are laid out in "em", a 24th of
   their width, after the designs in DESIGN.md. */
const INK = C.ink;
const INK_SOFT = C.inkSoft;
const SAMBAL = C.sambal;
const STYROFOAM = C.styrofoam;
const LINKEDIN_SHORT = LINKEDIN.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function spaced(ctx, px) {
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${px}px`;
}

/* The name card inside the lid: a red band with the name and roles, the jobs
   listed like a menu, contacts along the foot. 90 × 54 mm. */
function drawCard(ctx, w, h) {
  const em = w / 24;
  const side = 1.25 * em;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, w, h);
  ctx.textBaseline = "alphabetic";

  // the band
  const bandH = 4.75 * em;
  ctx.fillStyle = SAMBAL;
  ctx.fillRect(0, 0, w, bandH);
  ctx.fillStyle = STYROFOAM;
  ctx.font = `900 ${2.35 * em}px ${DISPLAY}`;
  spaced(ctx, -0.02 * 2.35 * em);
  ctx.fillText("Xing Ying", side, 0.75 * em + 2.0 * em);
  // the roles in full where they fit, otherwise the short line
  ctx.font = `700 ${0.6 * em}px ${BODY}`;
  spaced(ctx, 0.06 * 0.6 * em);
  const full = ROLES.join(", ").toUpperCase();
  const roles = ctx.measureText(full).width <= w - 2 * side ? full : "PRODUCT, ENGINEERING";
  ctx.fillText(roles, side, bandH - 0.65 * em);
  spaced(ctx, 0);

  // the jobs, one row each, shrunk together if the longest would not fit
  const jobs = experience.map((e) => [LID_ROLE[e.role] || e.role, e.org]);
  const gap = 0.8 * em;
  const measure = (k) => {
    let widest = 0;
    jobs.forEach(([role, org]) => {
      ctx.font = `800 ${0.85 * em * k}px ${DISPLAY}`;
      const a = ctx.measureText(role).width;
      ctx.font = `600 ${0.68 * em * k}px ${BODY}`;
      widest = Math.max(widest, a + gap * k + ctx.measureText(org).width);
    });
    return widest;
  };
  const room = w - 2 * side;
  const k = Math.min(1, room / measure(1));
  const rowH = (0.56 + 0.85 * 1.3) * em * k;
  let y = bandH + 0.45 * em;
  ctx.setLineDash([0.18 * em, 0.18 * em]);
  ctx.lineWidth = Math.max(1, 0.04 * em);
  ctx.strokeStyle = "rgba(28, 27, 25, 0.3)";
  jobs.forEach(([role, org]) => {
    const base = y + 0.28 * em * k + 0.85 * em * k * 1.02;
    ctx.fillStyle = INK;
    ctx.font = `800 ${0.85 * em * k}px ${DISPLAY}`;
    ctx.textAlign = "left";
    ctx.fillText(role, side, base);
    ctx.fillStyle = INK_SOFT;
    ctx.font = `600 ${0.68 * em * k}px ${BODY}`;
    ctx.textAlign = "right";
    ctx.fillText(org, w - side, base);
    y += rowH;
    ctx.beginPath();
    ctx.moveTo(side, y);
    ctx.lineTo(w - side, y);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  // the foot
  ctx.fillStyle = INK_SOFT;
  ctx.font = `500 ${0.6 * em}px ${MONO}`;
  ctx.textAlign = "left";
  ctx.fillText(EMAIL, side, h - 0.7 * em);
  // the LinkedIn address on the right, left off if it would crowd the email
  const used = ctx.measureText(EMAIL).width + ctx.measureText(LINKEDIN_SHORT).width;
  if (used + 0.8 * em <= w - 2 * side) {
    ctx.textAlign = "right";
    ctx.fillText(LINKEDIN_SHORT, w - side, h - 0.7 * em);
    ctx.textAlign = "left";
  }
}

/* The sticker on top of the lid, matching the card: the name on the red band,
   the availability line under it, word for word, split in two. */
function drawLidSticker(ctx, w, h) {
  const em = w / 24;
  const side = 1.4 * em;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, w, h);
  ctx.textBaseline = "alphabetic";
  const bandH = 5.4 * em;
  ctx.fillStyle = SAMBAL;
  ctx.fillRect(0, 0, w, bandH);
  ctx.fillStyle = STYROFOAM;
  ctx.font = `900 ${3.8 * em}px ${DISPLAY}`;
  spaced(ctx, -0.02 * 3.8 * em);
  ctx.fillText("Xing Ying", side, 0.85 * em + 3.25 * em);
  ctx.fillStyle = INK;
  ctx.font = `500 ${0.8 * em}px ${MONO}`;
  spaced(ctx, 0.06 * 0.8 * em);
  let y = bandH + 0.7 * em + 0.8 * em;
  ctx.fillText("OPEN TO OPPORTUNITIES FOR", side, y);
  spaced(ctx, 0);
  ctx.font = `600 ${em}px ${BODY}`;
  y += 0.25 * em + 1.35 * em;
  // wrap to the sticker's width
  let line = "";
  "Spring 2027 (Internship), and Full-Time Roles (July 2027)".split(" ").forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > w - 2 * side && line) {
      ctx.fillText(line, side, y);
      y += 1.35 * em;
      line = word;
    } else line = test;
  });
  if (line) ctx.fillText(line, side, y);
}

function drawQr(ctx, w, h) {
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = C.sambal;
  ctx.fillRect(0, 0, w, 96);
  ctx.fillStyle = "#FFFFFF";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.font = `900 46px ${DISPLAY}`;
  ctx.fillText("Scan to connect", w / 2, 50);
  const qr = qrcode(0, "M");
  qr.addData(LINKEDIN);
  qr.make();
  const n = qr.getModuleCount();
  const size = Math.floor((w - 80) / n);
  const off = (w - size * n) / 2;
  ctx.fillStyle = C.ink;
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) if (qr.isDark(r, c)) ctx.fillRect(off + c * size, 126 + r * size, size, size);
  ctx.font = `600 30px ${BODY}`;
  ctx.fillText("LinkedIn", w / 2, h - 34);
  ctx.textAlign = "left";
}

function drawSlip(ctx, w, h) {
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = C.sambal;
  ctx.fillRect(0, 0, 250, h);
  ctx.fillStyle = "#FFFFFF";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.font = `900 54px ${DISPLAY}`;
  ctx.fillText("Resume", 125, h / 2);
  ctx.setLineDash([10, 10]);
  ctx.strokeStyle = C.inkSoft;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(270, 0);
  ctx.lineTo(270, h);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.textAlign = "left";
  ctx.fillStyle = C.ink;
  ctx.font = `900 46px ${DISPLAY}`;
  ctx.fillText("Lau Xing Ying", 300, h / 2 - 34);
  ctx.fillStyle = C.inkSoft;
  ctx.font = `600 28px ${BODY}`;
  ctx.fillText("View Resume", 300, h / 2 + 34);
}

/* ── things you can point at ── */
/* True when the visitor asked for reduced motion: things jump to where they go. */
const Reduced = createContext(false);

/* `lit`: picked from the keyboard, so it lifts as if hovered. */
function Pointable({ id, onPick, onHover, lift = 0.14, raised = 0, lit = false, children, ...props }) {
  const inner = useRef();
  const y = useRef(0);
  const [hover, setHover] = useState(false);
  const reduced = useContext(Reduced);
  useFrame((s, dt) => {
    const goal = hover || lit ? lift : raised;
    y.current += (goal - y.current) * (reduced ? 1 : Math.min(1, dt * 12));
    inner.current.position.y = y.current;
    if (Math.abs(goal - y.current) > 1e-4) s.invalidate();
  });
  return (
    <group {...props}>
      <group
        ref={inner}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          onHover(id);
        }}
        onPointerOut={() => {
          setHover(false);
          onHover(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (e.delta > 6) return; // the end of a drag, not a pick
          onPick(id);
        }}
      >
        {children}
      </group>
    </group>
  );
}

function Steam({ position }) {
  const refs = useRef([]);
  useFrame((s) => {
    refs.current.forEach((m, i) => {
      if (!m) return;
      const ph = (s.clock.elapsedTime * 0.22 + i / 4) % 1;
      m.position.y = ph * 2.1;
      m.position.x = m.userData.x + Math.sin(ph * 4 + i * 2) * 0.16;
      m.scale.setScalar(0.1 + ph * 0.24);
      m.material.opacity = Math.sin(ph * Math.PI) * 0.34;
    });
  });
  return (
    <group position={position}>
      {[-0.9, 0.5, -0.1, 1.2].map((x, i) => (
        <mesh key={i} ref={(m) => { refs.current[i] = m; }} geometry={GEO.sph} position={[x, 0, (i % 2) * 0.7 - 0.35]} userData={{ x }}>
          <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function Pot({ liquid }) {
  return (
    <>
      <mesh geometry={GEO.cyl} position={[0, 0.38, 0]} scale={[1.5, 0.76, 1.5]} castShadow receiveShadow>
        <meshStandardMaterial color={C.steel} roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh geometry={GEO.ring} position={[0, 0.76, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.74, 0.74, 0.5]}>
        <meshStandardMaterial color={C.steelDark} roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh geometry={GEO.cyl} position={[0, 0.775, 0]} scale={[1.3, 0.06, 1.3]}>
        <Mat color={liquid} rough={0.3} />
      </mesh>
      <mesh geometry={GEO.cyl} position={[0.42, 1.0, -0.1]} rotation={[0.2, 0, -0.75]} scale={[0.08, 1.1, 0.08]} castShadow>
        <meshStandardMaterial color={C.steelDark} roughness={0.4} metalness={0.3} />
      </mesh>
    </>
  );
}

/* The small flimsy red bag, after design/refs/plastic-bag.png: a thin T-shirt
   bag standing open. A crumpled sack with a gathered base, an open mouth,
   and the rim rising at each end into a tall strap handle. */
const BAG_H = 1.45;

function bagBody() {
  const g = new THREE.CylinderGeometry(1, 1, 1, 64, 26, true);
  const p = g.attributes.position;
  const sm = THREE.MathUtils.smoothstep;
  for (let i = 0; i < p.count; i++) {
    const a = Math.atan2(p.getZ(i), p.getX(i));
    const t = p.getY(i) + 0.5; // 0 at the base, 1 at the rim
    let r = 0.3 + 0.5 * sm(t, 0, 0.32) - 0.14 * sm(t, 0.55, 1);
    // creases: stronger toward the loose top
    r *= 1 + (0.07 * Math.sin(a * 6 + t * 7) + 0.045 * Math.sin(a * 11 - t * 13) + 0.03 * Math.sin(a * 17 + t * 5)) * (0.35 + 0.65 * t);
    // the rim climbs at the two ends, where the handles grow out of it
    const ends = Math.pow(Math.max(0, Math.cos(2 * a)), 3);
    const y = t * BAG_H + 0.34 * Math.pow(t, 3) * ends + 0.035 * Math.sin(a * 5 + 1) * t;
    p.setXYZ(i, Math.cos(a) * r * 1.05, y, Math.sin(a) * r * 0.78);
  }
  g.computeVertexNormals();
  return g;
}

/* One strap handle: a flat ribbon looping up from one side of the rim's end
   and back down the other, its opening facing forward. */
function bagStrap() {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.17, -0.14, 0),
    new THREE.Vector3(-0.13, 0.36, 0),
    new THREE.Vector3(0, 0.82, 0),
    new THREE.Vector3(0.13, 0.36, 0),
    new THREE.Vector3(0.17, -0.14, 0),
  ]);
  const n = 28;
  const w = 0.13;
  const pos = [];
  const idx = [];
  for (let k = 0; k <= n; k++) {
    const c = curve.getPoint(k / n);
    // a slight twist, like a real strap
    const tw = Math.sin((k / n) * Math.PI) * 0.05;
    pos.push(c.x - tw, c.y, -w, c.x + tw, c.y, w);
    if (k < n) {
      const b = k * 2;
      idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/* Its skin is re-shaped every frame: a constant tremble, and a
   lean-and-ripple whenever a gust passes. */
function Bag({ reduced }) {
  const handles = useRef([]);
  const { geo, base, strap } = useMemo(() => {
    const g = bagBody();
    return { geo: g, base: Float32Array.from(g.attributes.position.array), strap: bagStrap() };
  }, []);

  useFrame((s) => {
    if (reduced) return;
    const t = s.clock.elapsedTime;
    const gust = gustAt(t);
    const p = geo.attributes.position;
    const amp = 0.014 + gust * 0.07;
    for (let i = 0; i < p.count; i++) {
      const bx = base[i * 3];
      const by = base[i * 3 + 1];
      const bz = base[i * 3 + 2];
      const hf = clamp01(by / 1.4);
      const n = Math.sin(bx * 8 + t * 6.5) * Math.cos(by * 10 - t * 4.6 + bz * 7);
      const len = Math.hypot(bx, bz) || 1;
      const k = n * amp * (0.2 + hf);
      p.setXYZ(i, bx + (bx / len) * k + gust * 0.26 * hf * hf, by, bz + (bz / len) * k);
    }
    p.needsUpdate = true;
    geo.computeVertexNormals();
    handles.current.forEach((h, i) => {
      if (!h) return;
      h.rotation.z = (i ? -0.1 : 0.1) + Math.sin(t * 8 + i * 1.7) * 0.05 - gust * 0.42;
      h.rotation.x = Math.sin(t * 5 + i) * 0.06;
      h.position.x = (i ? 0.62 : -0.62) + gust * 0.24;
    });
  });

  const skin = (
    <meshStandardMaterial
      color="#F0432F"
      emissive="#D0301F"
      emissiveIntensity={0.22}
      roughness={0.12}
      transparent
      opacity={0.82}
      side={THREE.DoubleSide}
    />
  );
  return (
    <group position={[0, 0.02, 0]}>
      <mesh geometry={geo} castShadow>
        {skin}
      </mesh>
      {/* the gathered base */}
      <mesh geometry={GEO.cyl} position={[0, 0.02, 0]} scale={[0.72, 0.04, 0.48]} castShadow>
        {skin}
      </mesh>
      {[-0.62, 0.62].map((x, i) => (
        <group key={x} ref={(h) => { handles.current[i] = h; }} position={[x, BAG_H + 0.3, 0]}>
          <mesh geometry={strap} castShadow>
            {skin}
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* One heaped serving. When its dish changes, the new one drops in from above. */
function Portion({ id, dish, slot, raised, reduced, lit, onPick, onHover }) {
  const g = useRef();
  const t = useRef(1);
  const first = useRef(true);
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    t.current = reduced ? 1 : 0;
  }, [dish.kind, reduced]);
  useFrame((s, dt) => {
    if (t.current < 1) {
      t.current = Math.min(1, t.current + dt / 0.65);
      s.invalidate();
    }
    const e = 1 - Math.pow(1 - t.current, 3);
    g.current.position.y = (1 - e) * 2.6;
    g.current.scale.setScalar(slot.scale * (0.5 + 0.5 * e));
  });
  return (
    <Pointable id={id} position={slot.pos} raised={raised} lift={0.16} lit={lit} onPick={onPick} onHover={onHover}>
      <group ref={g} rotation={[0, slot.turn, 0]}>
        <Dish kind={dish.kind} />
      </group>
    </Pointable>
  );
}

/* One side dish: a small plate (a bowl for steamed egg) at the front of the table. */
function SidePlate({ i, dish, lit, onPick, onHover }) {
  const bowl = dish.kind === "steamedegg";
  return (
    <Pointable id={`side-${i}`} position={[PLATE_X[i], 0, PLATE_Z]} lift={0.12} lit={lit} onPick={onPick} onHover={onHover}>
      <mesh geometry={bowl ? GEO.bowl : GEO.plate} castShadow receiveShadow>
        <meshStandardMaterial color="#FFFFFF" roughness={0.35} />
      </mesh>
      <Dish kind={dish.kind} position={[0, bowl ? 0.3 : 0.06, 0]} rotation={[0, i * 1.1, 0]} scale={bowl ? 0.9 : 1.08} />
    </Pointable>
  );
}

/* The lid's printed parts take the light like paper, lifted a little so the ink stays crisp in shade. */
function Printed({ tex }) {
  return <meshStandardMaterial map={tex} emissiveMap={tex} emissive="#FFFFFF" emissiveIntensity={0.32} roughness={0.85} />;
}

function Box({ dishes, selected, packed, curry, sambal, reduced, onPick, onHover, lit }) {
  const lid = useRef();
  // drawn at 4× their layout size: far more than the card ever covers on screen
  const cardTex = useMemo(() => canvasTexture(720, 432, drawCard, 4), []);
  const stickerTex = useMemo(() => canvasTexture(720, 315, drawLidSticker, 4), []);
  const food = useRef();
  const curryRef = useRef();
  const sambalRef = useRef();
  const stream = useRef();
  const pour = useRef(1);
  const hadCurry = useRef(curry);

  useLayoutEffect(() => {
    lid.current.rotation.x = 0; // the box arrives closed
  }, [reduced]);

  useFrame((s, dt) => {
    // the lid lifts once on arrival, and shuts again for dabao
    const goal = packed ? 0 : LID_OPEN;
    lid.current.rotation.x += (goal - lid.current.rotation.x) * (reduced ? 1 : Math.min(1, dt * 4));
    const ease = (k) => (reduced ? 1 : Math.min(1, dt * k));
    // curry pours in a stream, then spreads over the food; sambal lands as a dollop
    if (curry && !hadCurry.current) pour.current = reduced ? 1 : 0;
    hadCurry.current = curry;
    if (pour.current < 1) pour.current = Math.min(1, pour.current + dt / 1.3);
    const spread = curry ? Math.min(1, pour.current * 1.6) : 0;
    const cs = curryRef.current.scale.x + (Math.max(0.0001, spread) - curryRef.current.scale.x) * ease(6);
    curryRef.current.scale.set(cs, Math.max(0.0001, Math.min(1, cs * 1.4)), cs);
    stream.current.visible = curry && pour.current < 0.85;
    stream.current.scale.x = stream.current.scale.z = 0.5 + Math.sin(pour.current * 40) * 0.08;
    const ss = sambalRef.current.scale.x + ((sambal ? 1 : 0.0001) - sambalRef.current.scale.x) * ease(9);
    sambalRef.current.scale.setScalar(ss);
    // the heap sits higher than the rim, so it tucks away as the lid comes down
    food.current.visible = lid.current.rotation.x < -0.3;
  });

  return (
    <group position={BOX.pos} scale={BOX_S}>
      <mesh geometry={GEO.boxRim} castShadow receiveShadow>
        <Foam />
      </mesh>
      <mesh geometry={GEO.boxBase} receiveShadow>
        <Mat color={C.shade} rough={0.95} />
      </mesh>
      <mesh geometry={GEO.flange} position={[0, BOX.h - 0.2, 0]} castShadow receiveShadow>
        <Foam />
      </mesh>
      <mesh geometry={GEO.hinge} position={[0, BOX.h - 0.1, -BOX.d / 2 - 0.12]} castShadow receiveShadow>
        <Foam />
      </mesh>
      <mesh geometry={GEO.tab} position={[0, BOX.h - 0.2, BOX.d / 2 + 0.36]} castShadow receiveShadow>
        <Foam />
      </mesh>

      <Pointable id="about" onPick={onPick} onHover={onHover} lift={0.05} lit={lit("about")}>
        <mesh geometry={GEO.rice} position={[0, 0.06, 0]} receiveShadow castShadow>
          <Mat color={C.rice} rough={1} />
        </mesh>
        <RiceBed />
      </Pointable>

      <group ref={food}>
        {dishes.map((d, i) => (
          <Portion
            key={i}
            id={`dish-${i}`}
            dish={d}
            slot={SLOTS[i]}
            raised={selected === i ? 0.34 : 0}
            reduced={reduced}
            lit={lit(`dish-${i}`)}
            onPick={onPick}
            onHover={onHover}
          />
        ))}
        {/* sauces go on last: curry over the food, sambal in the corner */}
        <group ref={curryRef} position={[0.2, FOOD_Y, 0.3]} scale={0.0001}>
          {[[0, 1.02, 0, 1.0], [0.55, 0.72, 0.4, 0.8], [-0.5, 0.66, 0.3, 0.7], [0.1, 0.5, 0.85, 0.85], [-0.95, 0.5, -0.5, 0.6], [0.95, 0.5, -0.7, 0.6], [0.5, 0.12, 1.0, 1.2]].map(([x, y, z, r], n) => (
            <mesh key={n} geometry={GEO.pool} position={[x, y, z]} rotation={[0, n * 1.3, 0]} scale={[r, 0.14, r * 0.82]} receiveShadow>
              <Mat color={n % 2 ? "#DE9418" : "#D98A12"} rough={0.12} />
            </mesh>
          ))}
          <mesh geometry={GEO.box} position={[0.5, 0.82, 0.35]} rotation={[0.2, 0.5, 0.1]} scale={[0.3, 0.22, 0.28]} castShadow>
            <Mat color="#F3D989" rough={0.6} />
          </mesh>
          <mesh geometry={GEO.box} position={[-0.3, 0.72, 0.5]} rotation={[0.1, 1.1, 0.2]} scale={[0.26, 0.2, 0.24]} castShadow>
            <Mat color="#F3D989" rough={0.6} />
          </mesh>
        </group>
        <mesh ref={stream} geometry={GEO.cyl} position={[0.2, FOOD_Y + 2.6, 0.3]} scale={[0.5, 3.4, 0.5]} visible={false}>
          <Mat color="#DE9418" rough={0.12} />
        </mesh>
        <group ref={sambalRef} position={[1.55, FOOD_Y + 0.02, 1.02]} scale={0.0001}>
          <mesh geometry={GEO.nug} position={[0, 0.16, 0]} scale={[0.8, 0.42, 0.66]} castShadow receiveShadow>
            <Mat color="#C92B22" rough={0.35} />
          </mesh>
          <mesh geometry={GEO.nug} position={[-0.28, 0.1, 0.16]} rotation={[0, 1, 0]} scale={[0.42, 0.26, 0.38]} castShadow>
            <Mat color="#B7241C" rough={0.35} />
          </mesh>
        </group>
        {!reduced && !packed && <Steam position={[0.3, FOOD_Y + 0.9, 0]} />}
      </group>

      <group ref={lid} position={[0, BOX.h, -BOX.d / 2]}>
        <Pointable id="experience" onPick={onPick} onHover={onHover} lift={0} lit={lit("experience")} position={[0, 0, BOX.d / 2]}>
          <mesh geometry={GEO.lidRim} castShadow receiveShadow>
            <Foam />
          </mesh>
          <mesh geometry={GEO.flange} castShadow receiveShadow>
            <Foam />
          </mesh>
          <mesh geometry={GEO.lidTop} position={[0, LID_H - 0.07, 0]} castShadow receiveShadow>
            <Foam />
          </mesh>
          {/* the sticker on top, and the name card inside: part of the foam, so the box hides them */}
          <mesh geometry={GEO.plane} position={[-0.05, LID_H + 0.004, 0.12]} rotation={[-Math.PI / 2, 0, 0.06]} scale={[3.05, 3.05 * 0.4375, 1]} receiveShadow>
            <Printed tex={stickerTex} />
          </mesh>
          {/* the recess narrows toward the panel (the rim is moulded with a slope): about 3.3 × 2.5 across, so the card sits inside it with a margin of foam */}
          <mesh geometry={GEO.plane} position={[0, LID_H - 0.074, 0.02]} rotation={[Math.PI / 2, 0, 0]} scale={[3.0, 3.0 * 0.6, 1]} receiveShadow>
            <Printed tex={cardTex} />
          </mesh>
        </Pointable>
      </group>
    </group>
  );
}

/* ── moving round the table ──
   The camera rides an orbit round the tray, from one stop to the next: the
   overview, then one stop per section. Scroll, swipes and ← → move it along; a
   mouse drag swings it freely all the way round, and on letting go it eases onto
   the nearest stop. Wherever it is, the table also leans a little toward the
   cursor (on touch it sways by itself), and things standing on it slide a touch
   further than the tray the nearer they are, for depth. */
const TILT = rad(8); // the most the table leans, each way
const SWAY = 0.25; // touch sway, as a share of TILT
const PARALLAX = 0.26; // how far the nearest things slide over the tray at full lean
const RATE = { lean: 5, sway: 2, home: 3.5 }; // per second; lower lags more
const SPRING = 28; // stiffness of the ride between stops (critically damped: eases in and out)
const DRAG = { speed: 0.0065, low: rad(10), high: rad(80), full: 90 }; // rad per px; elevation range; px to pull right out
const VIEW_TAN = Math.tan(rad(13)); // half of the camera's 26 degree view
const HOME_LOOK = [0, 0.9, 0];

const homeAz = (phone) => rad(phone ? 8 : 25);
const homeEl = (phone) => rad(phone ? 60 : 40);
const clampN = (n) => Math.max(-1, Math.min(1, n));
const wrapPi = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));
const mod = (a, n) => ((a % n) + n) % n;
const lerp = THREE.MathUtils.lerp;
const coarsePointer = () =>
  typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(hover: none) and (pointer: coarse)").matches;

/* The two level axes the table leans about, for a camera at azimuth `az`:
   across the view, and into it. */
function leanAxes(az, out) {
  out.right.set(Math.cos(az), 0, -Math.sin(az));
  out.into.set(-Math.sin(az), 0, -Math.cos(az));
  return out;
}

/* A lean (x to the right, y up the screen, each -1..1) as a rotation that turns
   the table top to face that way. */
function leanQuat(q, axes, x, y, tmp) {
  tmp.setFromAxisAngle(axes.into, x * TILT);
  return q.setFromAxisAngle(axes.right, -y * TILT).multiply(tmp);
}

/* A camera framing: where round, how high, how far, what it looks at, and how
   far the view is shifted to make room for the card. */
const frame = () => ({ az: 0, el: 0, dist: 20, look: new THREE.Vector3(), sx: 0, sy: 0 });
function copyFrame(out, a) {
  out.az = a.az;
  out.el = a.el;
  out.dist = a.dist;
  out.look.copy(a.look);
  out.sx = a.sx;
  out.sy = a.sy;
  return out;
}
function blendFrame(out, a, b, t) {
  out.az = a.az + wrapPi(b.az - a.az) * t;
  out.el = lerp(a.el, b.el, t);
  out.dist = lerp(a.dist, b.dist, t);
  out.look.lerpVectors(a.look, b.look, t);
  out.sx = lerp(a.sx, b.sx, t);
  out.sy = lerp(a.sy, b.sy, t);
  return out;
}

function SceneTilt({ shared, reduced, children }) {
  const group = useRef();
  const touch = useMemo(coarsePointer, []);
  const pointer = useRef({ x: 0, y: 0 });
  const tmp = useMemo(
    () => ({ r: new THREE.Quaternion(), p: new THREE.Vector3(), axes: { right: new THREE.Vector3(), into: new THREE.Vector3() } }),
    [],
  );

  useEffect(() => {
    if (reduced || touch) return;
    const move = (e) => {
      if (e.pointerType !== "mouse") return;
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = 1 - (e.clientY / window.innerHeight) * 2;
    };
    const leave = (e) => {
      if (!e.relatedTarget) pointer.current.x = pointer.current.y = 0;
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerout", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", leave);
    };
  }, [reduced, touch]);

  useFrame((s, dt) => {
    const lean = shared.lean;
    let x = 0;
    let y = 0;
    let rate = RATE.home;
    if (!reduced) {
      if (shared.dragging) {
        x = lean.x; // hold still while the camera is being swung round
        y = lean.y;
      } else if (touch) {
        const t = s.clock.elapsedTime;
        x = Math.sin(t * 0.5) * SWAY;
        y = Math.sin(t * 0.37 + 1) * SWAY * 0.7;
        rate = RATE.sway;
      } else {
        x = clampN(pointer.current.x);
        y = clampN(pointer.current.y);
        rate = RATE.lean;
      }
    }
    const k = reduced ? 1 : 1 - Math.exp(-dt * rate);
    lean.x += (x - lean.x) * k;
    lean.y += (y - lean.y) * k;
    const g = group.current;
    leanAxes(shared.az, tmp.axes);
    leanQuat(g.quaternion, tmp.axes, lean.x, lean.y, tmp.r);
    // lean about the point the camera is looking at, so the stop stays framed
    tmp.p.copy(shared.look).applyQuaternion(g.quaternion);
    g.position.copy(shared.look).sub(tmp.p);
    shared.slide.copy(tmp.axes.right).multiplyScalar(lean.x).addScaledVector(tmp.axes.into, lean.y);
    if (Math.abs(x - lean.x) + Math.abs(y - lean.y) > 1e-4) s.invalidate();
  });

  return <group ref={group}>{children}</group>;
}

/* One depth layer: slides over the tray with the lean, more the nearer it is. */
function Layer({ depth, shared, name, anchors, children }) {
  const ref = useRef();
  useFrame(() => {
    ref.current.position.copy(shared.slide).multiplyScalar(PARALLAX * depth);
  });
  return (
    <group
      ref={(g) => {
        ref.current = g;
        anchors.current[name] = g;
      }}
    >
      {children}
    </group>
  );
}

/* The camera: rides the orbit from stop to stop, and swings freely while the
   mouse drags, staying wherever it is let go. Reports which stop it has
   reached: -1 while on the move, -2 while left in a free look. */
function Rig({ nav, closed, reduced, shared, onArrive }) {
  const { camera, size, gl } = useThree();
  const phone = size.width < 768;
  const touch = useMemo(coarsePointer, []);
  const canDrag = !touch && !reduced;
  const frames = useRef(null); // { home, closed, stops[] } for this window size
  const drag = useRef(null);
  const closedRef = useRef(closed);
  closedRef.current = closed;
  const S = useMemo(
    () => ({
      cl: closed ? 1 : 0, // 1 while the overview is the shut box close up
      w: 0, // how far the free (dragged) framing has taken over
      wGoal: 0,
      at: 0, // the stop reported as reached
      free: frame(),
      path: frame(),
      cur: frame(),
      a: frame(),
      b: frame(),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useLayoutEffect(() => {
    const aspect = size.width / size.height;
    const look = new THREE.Vector3(...HOME_LOOK);
    const az = homeAz(phone);
    const el = homeEl(phone);
    const dir = new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));

    // the overview: back off until the whole table fits, at every extreme of its lean
    const table = [];
    // on a phone, frame the box and let the table's far ends run off the sides,
    // so the box (and the text on its lid) is big enough to read
    const hx = phone ? 4.4 : TABLE.w / 2;
    for (const x of [-hx, hx])
      for (const z of [TABLE.z - TABLE.d / 2, TABLE.z + TABLE.d / 2])
        for (const y of [0, -0.45]) table.push(new THREE.Vector3(x, y, z));
    const lid = [new THREE.Vector3(-3.5, 5.75, -4.95), new THREE.Vector3(3.5, 5.75, -4.95)]; // the top of the open lid
    const axes = leanAxes(az, { right: new THREE.Vector3(), into: new THREE.Vector3() });
    const amp = reduced ? 0 : touch ? SWAY : 1;
    const leans = amp ? [-amp, 0, amp] : [0];
    const q = new THREE.Quaternion();
    const r = new THREE.Quaternion();
    const slide = new THREE.Vector3();
    const pts = [];
    const turn = (p) => p.sub(look).applyQuaternion(q).add(look);
    for (const lx of leans)
      for (const ly of leans) {
        leanQuat(q, axes, lx, ly, r);
        slide.copy(axes.right).multiplyScalar(lx).addScaledVector(axes.into, ly).multiplyScalar(PARALLAX);
        table.forEach((p) => pts.push(turn(p.clone())));
        lid.forEach((p) => pts.push(turn(p.clone().add(slide))));
      }
    const cam = camera.clone();
    cam.clearViewOffset();
    cam.aspect = aspect;
    cam.updateProjectionMatrix();
    const v = new THREE.Vector3();
    const fits = (d) => {
      cam.position.copy(look).addScaledVector(dir, d);
      cam.lookAt(look);
      cam.updateMatrixWorld();
      return pts.every((p) => {
        v.copy(p).project(cam);
        return Math.abs(v.x) < 0.97 && v.y < 0.9 && v.y > -0.93;
      });
    };
    let lo = 6;
    let hi = 120;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (fits(mid)) hi = mid;
      else lo = mid;
    }
    const home = Object.assign(frame(), { az, el, dist: hi });
    home.look.copy(look);

    // the shut box, close up: what the page opens on
    const shut = Object.assign(frame(), {
      az,
      el: rad(CLOSED_STOP.el),
      dist: CLOSED_STOP.r / Math.min(VIEW_TAN * 0.82, VIEW_TAN * aspect * 0.9),
    });
    shut.look.set(...CLOSED_STOP.look);

    // the section stops, leaving room for the card: beside the scene on wide screens, below it on phones
    const fit = Math.min(VIEW_TAN * (phone ? 0.5 : 0.82), VIEW_TAN * aspect * (phone ? 0.9 : 0.54));
    const stops = ORBIT.map((id) => {
      if (!id) return null;
      const st = STOPS[id];
      const f = Object.assign(frame(), {
        az: rad(st.az),
        el: rad(st.el),
        dist: (phone && st.rPhone ? st.rPhone : st.r) / fit,
        sx: phone ? 0 : 0.2,
        sy: phone ? st.syPhone ?? 0.24 : 0,
      });
      f.look.set(...st.look);
      return f;
    });
    frames.current = { home, shut, stops };
  }, [camera, size.width, size.height, phone, reduced, touch]);

  /* stop i's framing; the overview eases between the shut box and the whole table */
  const stopFrame = (i, out) => {
    const f = frames.current;
    return i === 0 ? blendFrame(out, f.home, f.shut, S.cl) : copyFrame(out, f.stops[i]);
  };

  /* the stop whose side of the table the camera is nearest */
  const nearest = () => {
    if (closedRef.current) return 0;
    let best = 0;
    let gap = Infinity;
    ORBIT.forEach((_, i) => {
      const g = Math.abs(wrapPi(stopFrame(i, S.b).az - S.cur.az));
      if (g < gap) {
        gap = g;
        best = i;
      }
    });
    return best;
  };

  /* ── the mouse drag: a free orbit round the whole tray ── */
  useEffect(() => {
    const el = gl.domElement;
    if (!canDrag) {
      el.style.cursor = "";
      return;
    }
    el.style.cursor = "grab";
    const down = (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, az: S.cur.az, el: S.cur.el, moved: 0 };
    };
    const move = (e) => {
      const d = drag.current;
      if (!d || e.pointerId !== d.id) return;
      const dx = e.clientX - d.x;
      const dy = e.clientY - d.y;
      d.moved = Math.max(d.moved, Math.hypot(dx, dy));
      if (d.moved < 4) return; // still a click
      const home = frames.current.home;
      // swing round the middle of the table, pulling back to see all of it
      S.free.az = d.az - dx * DRAG.speed;
      S.free.el = Math.max(DRAG.low, Math.min(DRAG.high, d.el + dy * DRAG.speed * 0.7));
      S.free.dist = home.dist;
      S.free.look.copy(home.look);
      S.free.sx = S.free.sy = 0;
      S.wGoal = THREE.MathUtils.smoothstep(d.moved, 4, DRAG.full);
      shared.dragging = true;
      el.style.cursor = "grabbing";
    };
    const end = (e) => {
      const d = drag.current;
      if (!d || (e && e.pointerId !== undefined && e.pointerId !== d.id)) return;
      drag.current = null;
      shared.dragging = false;
      if (el.style.cursor === "grabbing") el.style.cursor = "grab";
      if (d.moved < 4) return; // a click: leave things as they were
      // let go: the camera stays exactly where it is, until a scroll, key or pick moves it on
      copyFrame(S.free, S.cur);
      S.w = S.wGoal = 1;
      nav.nearest = nearest();
      nav.free = true;
    };
    const blur = () => end();
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    window.addEventListener("blur", blur);
    return () => {
      end();
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      window.removeEventListener("blur", blur);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canDrag, gl, nav, shared, S]);

  useFrame((s, delta) => {
    if (!frames.current) return;
    const dt = Math.min(delta, 0.05);
    const ease = (rate) => (reduced ? 1 : 1 - Math.exp(-dt * rate));

    S.cl += ((closed ? 1 : 0) - S.cl) * ease(3);
    // ride toward the target on a critically damped spring: no overshoot, soft start and finish
    if (reduced) {
      nav.pos = nav.target;
      nav.v = 0;
    } else {
      const acc = SPRING * (nav.target - nav.pos) - 2 * Math.sqrt(SPRING) * nav.v;
      nav.v += acc * dt;
      nav.pos += nav.v * dt;
      if (Math.abs(nav.target - nav.pos) < 1e-4 && Math.abs(nav.v) < 1e-3) {
        nav.pos = nav.target;
        nav.v = 0;
      }
    }

    // the point on the path: between the stop behind and the stop ahead
    const n = ORBIT.length;
    const i = Math.floor(nav.pos);
    const t = nav.pos - i;
    stopFrame(mod(i, n), S.a);
    stopFrame(mod(i + 1, n), S.b);
    blendFrame(S.path, S.a, S.b, t);
    // long hops (round the back) rise and pull out a little on the way
    const hop = Math.sin(Math.PI * t) * Math.min(1, Math.abs(wrapPi(S.b.az - S.a.az)) / rad(150));
    S.path.el += hop * rad(10);
    S.path.dist *= 1 + 0.35 * hop;

    if (!drag.current) S.wGoal = nav.free ? 1 : 0; // a scroll, key or pick takes it back onto the path
    S.w += (S.wGoal - S.w) * ease(drag.current ? 10 : 2.6);
    if (S.w < 1e-4) S.w = 0;
    const c = blendFrame(S.cur, S.path, S.free, S.w);

    camera.position
      .set(Math.sin(c.az) * Math.cos(c.el), Math.sin(c.el), Math.cos(c.az) * Math.cos(c.el))
      .multiplyScalar(c.dist)
      .add(c.look);
    if (!reduced) camera.position.y += Math.sin(s.clock.elapsedTime * 1.05) * 0.06; // a slow breath
    camera.lookAt(c.look);
    if (Math.abs(c.sx) > 0.001 || Math.abs(c.sy) > 0.001)
      camera.setViewOffset(size.width, size.height, c.sx * size.width, c.sy * size.height, size.width, size.height);
    else if (camera.view) camera.clearViewOffset();
    // settle the camera now: the page text pinned to the scene is placed from it this
    // same frame, so it cannot trail a frame behind the drawing as the view moves
    camera.updateMatrixWorld();
    shared.look.copy(c.look);
    shared.az = c.az;
    if ((drag.current && S.w > 0.5) || nav.free) {
      nav.nearest = nearest();
      nav.preview(nav.nearest); // the stop list marks where the next move sets out from
    }

    // which stop has been reached: shown once nearly there, hidden once clearly away
    const k = Math.round(nav.pos);
    const off = Math.abs(nav.pos - k);
    const idx = mod(k, n);
    const was = S.at;
    if (S.at >= 0 && (idx !== S.at || off > 0.15 || S.w > 0.25)) S.at = -1;
    if (S.at === -2 && !nav.free) S.at = -1;
    if (nav.free && !drag.current) S.at = -2;
    else if (S.at === -2) S.at = -1;
    if (S.at === -1 && off < 0.05 && Math.abs(nav.target - nav.pos) < 0.05 && S.w < 0.05 && !drag.current) S.at = idx;
    if (S.at !== was) onArrive(S.at);

    if (nav.pos !== nav.target || nav.v !== 0 || S.w !== S.wGoal || Math.abs(S.cl - (closed ? 1 : 0)) > 1e-4) s.invalidate();
  });
  return null;
}

/* Which moving part each DOM tag rides on. */
const ON_BOX = new Set(["about", "projects", "experience", "open", ...SLOTS.map((_, i) => `dish-${i}`)]);
const TAG_LAYER = { skills: "pots", contact: "bag", connect: "qr", resume: "slip", ...Object.fromEntries(PLATE_X.map((_, i) => [`side-${i}`, "plates"])) };

/* Labels in order of importance: the featured projects, then the sections,
   then the side dishes. Where two would overlap, the less important steps aside. */
const TAG_ORDER = [
  "open",
  ...SLOTS.map((_, i) => `dish-${i}`),
  "about",
  "experience",
  "skills",
  "contact",
  "connect",
  "resume",
  ...PLATE_X.map((_, i) => `side-${i}`),
];

/* On a phone the plates sit too close for names over each one. There, the names
   run in two straight rows, one above the plates and one below, spaced out so none
   overlap, each joined to its plate by a thin line. Returns the ids it placed. */
function plateRows(tags, plates, camera, size, v) {
  const done = new Set();
  const lines = tags.current;
  const hideLines = () => PLATE_X.forEach((_, i) => lines[`lead-${i}`]?.setAttribute("visibility", "hidden"));
  const shown = PLATE_X.map((_, i) => tags.current[`side-${i}`]).filter((el) => el && !el.classList.contains("is-away") && !el.classList.contains("is-quiet"));
  if (size.width >= 768 || shown.length < PLATE_X.length || !plates) {
    hideLines();
    return done;
  }
  const at = (x, y, z) => {
    v.set(x, y, z).applyMatrix4(plates.matrixWorld).project(camera);
    return [(v.x * 0.5 + 0.5) * size.width, (-v.y * 0.5 + 0.5) * size.height];
  };
  const centre = PLATE_X.map((x) => at(x, 0.1, PLATE_Z));
  const top = Math.min(...PLATE_X.map((x) => at(x, 0.18, PLATE_Z - 0.9)[1])) - 10;
  const bottom = Math.max(...PLATE_X.map((x) => at(x, 0, PLATE_Z + 0.9)[1])) + 10;
  // plates 0, 2, 4 above; 1, 3, 5 below. On a very narrow screen a row too wide
  // to fit sends its longest name to a row of its own, further out.
  const rows = [
    { ids: [0, 2, 4], above: true, level: 0 },
    { ids: [1, 3, 5], above: false, level: 0 },
  ];
  const widthOf = (i) => tags.current[`side-${i}`].offsetWidth;
  for (const row of rows.slice()) {
    const need = row.ids.reduce((sum, i) => sum + widthOf(i) + 4, 8);
    if (need > size.width) {
      const longest = row.ids.reduce((m, i) => (widthOf(i) > widthOf(m) ? i : m), row.ids[0]);
      row.ids = row.ids.filter((i) => i !== longest);
      rows.push({ ids: [longest], above: row.above, level: 1 });
    }
  }
  for (const row of rows) {
    const items = row.ids.map((i) => ({ i, el: tags.current[`side-${i}`], w: widthOf(i), x: centre[i][0] }));
    // spread them out left to right
    for (let k = 1; k < items.length; k++) {
      const min = items[k - 1].x + (items[k - 1].w + items[k].w) / 2 + 4;
      if (items[k].x < min) items[k].x = min;
    }
    // then from the right edge back, so a long name near the end packs its neighbours left
    for (let k = items.length - 1; k >= 0; k--) {
      const max = k === items.length - 1 ? size.width - 6 - items[k].w / 2 : items[k + 1].x - (items[k + 1].w + items[k].w) / 2 - 4;
      if (items[k].x > max) items[k].x = max;
    }
    const under = 6 - (items[0].x - items[0].w / 2);
    if (under > 0) items.forEach((it) => (it.x += under));
    items.forEach(({ i, el, x }) => {
      const h = el.offsetHeight;
      const y = row.above ? top - h - row.level * (h + 6) : bottom + row.level * (h + 6);
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, 0)`;
      el.style.visibility = "visible";
      el.removeAttribute("data-crowded");
      const line = lines[`lead-${i}`];
      if (line) {
        line.setAttribute("x1", x.toFixed(1));
        line.setAttribute("y1", (row.above ? y + h : y).toFixed(1));
        line.setAttribute("x2", centre[i][0].toFixed(1));
        line.setAttribute("y2", centre[i][1].toFixed(1));
        line.setAttribute("visibility", "visible");
      }
      done.add(`side-${i}`);
    });
  }
  return done;
}

/* Pins the page's DOM tags to points in the scene. */
function Tags({ tags, anchors }) {
  const v = useMemo(() => new THREE.Vector3(), []);
  const placed = useMemo(() => [], []);
  useFrame(({ camera, size }) => {
    // the open card, which labels must stay clear of
    const card = typeof document !== "undefined" && document.querySelector("section.card")?.getBoundingClientRect();
    // tags ride along as the table leans
    for (const name in anchors.current) anchors.current[name]?.updateWorldMatrix(true, false);
    for (const id in TAG_POS) {
      const el = tags.current[id];
      if (!el) continue;
      v.set(...TAG_POS[id]);
      const on = anchors.current[ON_BOX.has(id) ? "box" : TAG_LAYER[id]];
      if (on) v.applyMatrix4(on.matrixWorld);
      v.project(camera);
      // keep every tag fully on screen
      const half = el.offsetWidth / 2 + 8;
      const hang = HANG.has(id);
      const y = hang ? (-v.y * 0.5 + 0.5) * size.height : Math.max(el.offsetHeight + 8, (-v.y * 0.5 + 0.5) * size.height);
      // keep clear of the card beside the scene: a label level with it stops at its edge
      const top = hang ? y : y - el.offsetHeight;
      const besideCard = card && card.left > size.width * 0.4 && top < card.bottom && top + el.offsetHeight > card.top;
      const right = besideCard ? card.left - 4 : size.width;
      const x = Math.min(right - half, Math.max(half, (v.x * 0.5 + 0.5) * size.width));
      el._at = [x, y];
    }
    // Lay the labels out in order of importance. One that would overlap a label
    // already placed (or the stop control, or the How to order sign) first tries
    // a row above or below its spot; only if none of those is free does it step aside.
    placed.length = 0;
    if (typeof document !== "undefined") {
      for (const fixed of document.querySelectorAll(".stops, .howto")) {
        const b = fixed.getBoundingClientRect();
        if (b.width) placed.push({ l: b.left - 4, r: b.right + 4, t: b.top - 4, b: b.bottom + 4 });
      }
    }
    const inRows = plateRows(tags, anchors.current.plates, camera, size, v);
    for (const id of TAG_ORDER) {
      const el = tags.current[id];
      if (!el || !el._at || inRows.has(id)) continue;
      const hang = HANG.has(id);
      const move = (dy) => {
        el.style.transform = `translate(${el._at[0].toFixed(1)}px, ${(el._at[1] + dy).toFixed(1)}px) translate(-50%, ${hang ? "0" : "-100%"})`;
        el.style.visibility = "visible";
      };
      if (el.classList.contains("is-away") || el.classList.contains("is-quiet")) {
        move(0);
        continue;
      }
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const top = hang ? el._at[1] : el._at[1] - h;
      const step = h + 6;
      let spot = null;
      for (const dy of [0, -step, step, -2 * step, 2 * step]) {
        const r = { l: el._at[0] - w / 2 - 3, r: el._at[0] + w / 2 + 3, t: top + dy - 3, b: top + dy + h + 3 };
        if (r.t < 0 || r.b > size.height) continue;
        if (!placed.some((p) => r.l < p.r && r.r > p.l && r.t < p.b && r.b > p.t)) {
          spot = { r, dy };
          break;
        }
      }
      if (spot) {
        el.removeAttribute("data-crowded");
        placed.push(spot.r);
        move(spot.dy);
      } else {
        el.setAttribute("data-crowded", "");
        move(0);
      }
    }
  });
  return null;
}

function Scene({ nav, onArrive, dishes, sides, selected, closed, packed, curry, sambal, reduced, highlight, onPick, onHover, onGust, tags }) {
  const { gl, invalidate } = useThree();
  const slip = useRef();
  const anchors = useRef({});
  const gusting = useRef(false);
  const shared = useMemo(
    () => ({ lean: { x: 0, y: 0 }, slide: new THREE.Vector3(), look: new THREE.Vector3(...HOME_LOOK), az: 0, dragging: false }),
    [],
  );
  const qrTex = useMemo(() => canvasTexture(512, 640, drawQr), []);
  const slipTex = useMemo(() => canvasTexture(760, 300, drawSlip), []);
  const idleCursor = !reduced && !coarsePointer() ? "grab" : "";
  const hover = (id) => {
    if (!shared.dragging) gl.domElement.style.cursor = id ? "pointer" : idleCursor;
    onHover(id);
  };
  useEffect(() => {
    repainted.add(invalidate);
    nav.wake = invalidate;
    return () => {
      repainted.delete(invalidate);
      nav.wake = () => {};
    };
  }, [invalidate, nav]);

  /* what lifts for a tag that has keyboard focus */
  const lit = (id) =>
    !!highlight &&
    (id === highlight ||
      (highlight === "projects" && id.startsWith("side-")) ||
      (highlight === "skills" && (id === "curry" || id === "sambal")));

  useFrame((s) => {
    if (reduced) return;
    const g = gustAt(s.clock.elapsedTime);
    slip.current.rotation.x = -g * 0.16;
    if (g > 0.2 && !gusting.current) {
      gusting.current = true;
      onGust();
    } else if (g === 0) gusting.current = false;
  });

  return (
    <Reduced.Provider value={reduced}>
      <hemisphereLight args={["#ffffff", "#F3C9A6", 1.5]} />
      <directionalLight position={[-6, 13, 7]} intensity={1.9} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} shadow-normalBias={0.03}>
        <orthographicCamera attach="shadow-camera" args={[-9, 9, 9, -9, 1, 40]} />
      </directionalLight>
      {/* first, so the lean and the tags read this frame's camera */}
      <Rig nav={nav} closed={closed} reduced={reduced} shared={shared} onArrive={onArrive} />

      <SceneTilt shared={shared} reduced={reduced}>
        <mesh geometry={GEO.table} position={[0, -0.45, TABLE.z]} receiveShadow>
          <Mat color={C.table} rough={0.9} />
        </mesh>

        <Layer depth={1} shared={shared} name="box" anchors={anchors}>
          <Box
            dishes={dishes}
            selected={selected}
            packed={packed}
            curry={curry}
            sambal={sambal}
            reduced={reduced}
            onPick={onPick}
            onHover={hover}
            lit={lit}
          />
        </Layer>

        <Layer depth={0.5} shared={shared} name="plates" anchors={anchors}>
          {sides.map((d, i) => (
            <SidePlate key={d.title} i={i} dish={d} lit={lit(`side-${i}`)} onPick={onPick} onHover={hover} />
          ))}
        </Layer>

        <Layer depth={0.6} shared={shared} name="pots" anchors={anchors}>
          <Pointable id="curry" position={POTS.curry} scale={1.35} onPick={onPick} onHover={hover} lit={lit("curry")}>
            <Pot liquid={C.curry} />
          </Pointable>
          <Pointable id="sambal" position={POTS.sambal} scale={1.05} onPick={onPick} onHover={hover} lit={lit("sambal")}>
            <Pot liquid={C.sambal} />
          </Pointable>
        </Layer>

        <Layer depth={0.9} shared={shared} name="bag" anchors={anchors}>
          <Pointable id="contact" position={BAG_POS} scale={1.35} onPick={onPick} onHover={hover} lift={0.06} lit={lit("contact")}>
            <Bag reduced={reduced} />
          </Pointable>
        </Layer>

        <Layer depth={0.7} shared={shared} name="qr" anchors={anchors}>
          {/* turned to face its stop, out at the front right-hand corner */}
          <Pointable id="connect" position={QR_POS} rotation={[0, 0.55, 0]} scale={1.4} onPick={onPick} onHover={hover} lit={lit("connect")}>
            <mesh geometry={GEO.box} position={[0, 0.06, 0.1]} scale={[1.0, 0.12, 0.6]} castShadow receiveShadow>
              <Mat color="#FFFFFF" rough={0.3} />
            </mesh>
            <group position={[0, 0.72, 0]} rotation={[-0.3, 0, 0]}>
              <mesh geometry={GEO.box} scale={[0.96, 1.2, 0.05]} castShadow>
                <Mat color="#FFFFFF" rough={0.3} />
              </mesh>
              <mesh geometry={GEO.plane} position={[0, 0, 0.027]} scale={[0.9, 1.125, 1]}>
                <meshBasicMaterial map={qrTex} toneMapped={false} />
              </mesh>
            </group>
          </Pointable>
        </Layer>

        <Layer depth={0.2} shared={shared} name="slip" anchors={anchors}>
          <Pointable id="resume" position={SLIP_POS} rotation={[0, 0.28, 0]} scale={1.5} onPick={onPick} onHover={hover} lift={0.05} lit={lit("resume")}>
            <group position={[0, 0, -0.4]}>
              <group ref={slip}>
                <mesh geometry={GEO.plane} position={[0, 0, 0.4]} rotation={[-Math.PI / 2, 0, 0]} scale={[2.0, 0.8, 1]} receiveShadow>
                  <meshStandardMaterial map={slipTex} roughness={0.9} side={THREE.DoubleSide} />
                </mesh>
              </group>
            </group>
          </Pointable>
        </Layer>
      </SceneTilt>

      {/* last, so the tags read this frame's lean */}
      <Tags tags={tags} anchors={anchors} />
    </Reduced.Provider>
  );
}

class Guard extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function BoxScene({ onFail, reduced, ...props }) {
  // some browsers report WebGL as present but fail to create a context
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      if (!(c.getContext("webgl2") || c.getContext("webgl"))) onFail();
    } catch (e) {
      onFail();
    }
  }, [onFail]);
  return (
    <Guard onFail={onFail}>
      <Canvas
        flat
        shadows
        dpr={[1, 2]}
        // with motion reduced nothing moves on its own, so draw only when something changes
        frameloop={reduced ? "demand" : "always"}
        camera={{ fov: 26, near: 1, far: 300, position: [0, 12, 14] }}
        gl={{ antialias: true, alpha: true }}
        style={{ touchAction: "none" }}
        aria-hidden="true"
      >
        <Scene reduced={reduced} {...props} />
      </Canvas>
    </Guard>
  );
}
