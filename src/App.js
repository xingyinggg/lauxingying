import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  House,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import qrcode from "qrcode-generator";
import {
  EMAIL,
  GITHUB,
  LINKEDIN,
  RESUME_URL,
  ROLES,
  experience,
  featured,
  moreWork,
  sauces,
  sides,
  skills,
} from "./data/site";
import { play, say, setSound, soundOn } from "./sound";
import { ORBIT, OrbitNav } from "./orbit";
import profileImg from "./assets/me.png";

const BoxScene = lazy(() => import("./components/BoxScene"));

/* The sections labelled in the scene. Labels name the real thing only: the
   food is never explained. (Projects has no label of its own: each side plate
   carries its project's name.) */
const SECTIONS = [
  { id: "about", name: "About" },
  { id: "skills", name: "Skills" },
  { id: "experience", name: "Experience" },
  { id: "contact", name: "Contact" },
  { id: "connect", name: "Scan to connect" },
];

/* The How to order sign folds for the rest of the visit once it has done its job. */
const SIGN_KEY = "xy-how-to-order";
const NAME = {
  ...Object.fromEntries(SECTIONS.map((s) => [s.id, s.name])),
  projects: "Projects",
  ...Object.fromEntries(featured.map((p, i) => [`dish-${i}`, p.title])),
};
const stopName = (i) => {
  const id = ORBIT[((i % ORBIT.length) + ORBIT.length) % ORBIT.length];
  return id ? NAME[id] : "Overview";
};

/* The stall's "how to order" sign: how to get round, ticked off step by step.
   Mouse and touch each get their own words; CSS shows the right set. */
const HOW_TO = [
  {
    mouse: [
      "Open the box",
      <>
        Click it, scroll, or press <kbd>→</kbd>
      </>,
    ],
    touch: ["Tap the box", "to open it"],
  },
  {
    mouse: [
      "Go round the table",
      <>
        Scroll, or press <kbd>←</kbd>
        <kbd>→</kbd>
      </>,
    ],
    touch: ["Swipe the table", "to go round"],
  },
  {
    mouse: ["Pick what you want", "Click any label to jump there"],
    touch: ["Tap a label", "to jump there"],
  },
];

/* `reference`: opened again from its tag, so it is read, not worked through:
   no ticks, and the strip gives both ways to move in one line. */
function HowToOrder({ done: progress, reference, popped, onHide }) {
  const done = reference ? progress.map(() => false) : progress;
  // the strip (small screens) shows one step at a time: the first not yet done
  const now = Math.max(0, done.indexOf(false));
  const all = !done.includes(false);
  const s = HOW_TO[all ? HOW_TO.length - 1 : now];
  return (
    <aside
      key={popped ? "popped" : "up"}
      aria-label="How to get around"
      className={`howto arrive-now ${popped ? "is-popped" : ""}`}
    >
      {/* small screens: one line, the step to do now */}
      <div className="howto-strip">
        <span className={`howto-n ${all ? "is-done" : ""}`} aria-hidden="true">
          {reference ? (
            "?"
          ) : all ? (
            <Check className="w-3 h-3" strokeWidth={3.5} />
          ) : (
            now + 1
          )}
        </span>
        <span className="howto-strip-text">
          <span className="howto-strip-label">
            How to order
            {!reference && (
              <>
                <span className="howto-pips" aria-hidden="true">
                  {done.map((d, i) => (
                    <i key={i} className={d ? "is-on" : ""} />
                  ))}
                </span>
                <span className="sr-only">
                  , step {all ? HOW_TO.length : now + 1} of {HOW_TO.length}
                </span>
              </>
            )}
          </span>
          {reference ? (
            <span className="howto-strip-line">
              <span className="for-mouse">
                <b>Scroll</b> or <kbd>←</kbd>
                <kbd>→</kbd> to go round, <b>click a label</b> to jump there
              </span>
              <span className="for-touch">
                <b>Swipe the table</b> to go round, <b>tap a label</b> to jump
                there
              </span>
            </span>
          ) : (
            <span className="howto-strip-line">
              <b className="for-mouse">{s.mouse[0]}</b>
              <b className="for-touch">{s.touch[0]}</b>{" "}
              <span className="for-mouse">{s.mouse[1]}</span>
              <span className="for-touch">{s.touch[1]}</span>
            </span>
          )}
        </span>
        <button type="button" className="howto-hide" onClick={onHide}>
          Hide
        </button>
      </div>

      <div className="howto-band">
        <p className="howto-title">How to order</p>
        <button type="button" className="howto-hide" onClick={onHide}>
          Hide
        </button>
      </div>
      <ol className="howto-steps">
        {HOW_TO.map((s, i) => (
          <li key={i} className={done[i] ? "is-done" : ""}>
            <span className="howto-n" aria-hidden="true">
              {done[i] ? (
                <Check className="w-3 h-3" strokeWidth={3.5} />
              ) : (
                i + 1
              )}
            </span>
            <span className="howto-text">
              <b>
                <span className="for-mouse">{s.mouse[0]}</span>
                <span className="for-touch">{s.touch[0]}</span>
                {done[i] && <span className="sr-only"> (done)</span>}
              </b>
              <small>
                <span className="for-mouse">{s.mouse[1]}</span>
                <span className="for-touch">{s.touch[1]}</span>
              </small>
            </span>
          </li>
        ))}
      </ol>
      <p className="howto-foot for-mouse">
        <span>Drag to look around</span>
        <span>
          <kbd>Esc</kbd> for the overview
        </span>
      </p>
    </aside>
  );
}

/* Whether a wheel over `el` belongs to something on the page that scrolls that
   way (a long card, the stop list) rather than to the camera. Only "can it
   scroll at all": the browser scrolls it before the event arrives, so whether it
   was already at the end can't be told. */
function ownsScroll(el, dx, dy) {
  const box = el?.closest?.("[data-own-scroll]");
  if (!box) return false;
  return Math.abs(dy) >= Math.abs(dx)
    ? box.scrollHeight > box.clientHeight + 1
    : box.scrollWidth > box.clientWidth + 1;
}

/* Every project, in list order: the three featured (in the box), the side
   plates, then the work that has no dish. */
const ALL = [...featured, ...sides, ...moreWork];
const indexOf = (p) => ALL.indexOf(p);

/* The three kinds of work, matching the three roles on her card. */
const DISCIPLINE = {
  ai: ["AI & Data", "var(--grape)"],
  eng: ["Software engineering", "var(--bag-blue)"],
  design: ["Product design", "var(--curry)"],
};
const priceColour = (p) => DISCIPLINE[p.discipline][1];

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      !!window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

function RoleCycler({ reduced }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((n) => (n + 1) % ROLES.length), 2600);
    return () => clearInterval(id);
  }, [reduced]);
  return (
    <>
      <span className="sr-only">{ROLES.join(", ")}</span>
      <span
        aria-hidden="true"
        className="inline-block align-bottom overflow-hidden whitespace-nowrap pb-[0.14em] -mb-[0.14em]"
      >
        <span key={i} className="role-in text-sambal">
          {ROLES[i]}
        </span>
      </span>
    </>
  );
}

function Ext({ href, className = "", children }) {
  const external = !href.startsWith("mailto:");
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

function Arrow() {
  return <ArrowUpRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />;
}

/* Screenshot tile. `zoom` enlarges narrow phone screens set in a wide frame. */
function Shot({ p }) {
  if (!p.image)
    return (
      <div className="aspect-[16/10] rounded-[10px] bg-styrofoam grid place-items-center text-center px-3">
        <span className="text-[14px] text-ink-soft">
          Screenshot coming soon
        </span>
      </div>
    );
  return (
    <div className="overflow-hidden rounded-[10px] bg-white aspect-[16/10]">
      <img
        src={p.image}
        alt={`${p.title} screenshot`}
        className="w-full h-full object-cover"
        style={p.zoom ? { transform: `scale(${p.zoom})` } : undefined}
      />
    </div>
  );
}

function PanelTitle({ children, sub }) {
  return (
    <header className="mb-5">
      <h2 className="sign text-[clamp(28px,3vw,40px)]">{children}</h2>
      {sub && (
        <p className="mt-2 text-[16px] leading-[1.5] text-ink-soft max-w-[44ch]">
          {sub}
        </p>
      )}
    </header>
  );
}

function About({ reduced }) {
  return (
    <>
      <PanelTitle>About Me</PanelTitle>
      <div className="grid gap-[var(--wall)]">
        <div className="cell">
          {/* full width, so "I am a <role>" stays on one line */}
          <p className="sign font-extrabold text-[24px] leading-[1.15]">
            Hi, I'm Xing Ying.
            <span className="block md:whitespace-nowrap">
              I am a <RoleCycler reduced={reduced} />
            </span>
          </p>
          <div className="mt-4 pt-4 rule-t grid gap-5 sm:grid-cols-[minmax(0,1fr)_150px] items-start">
            <p className="text-[18px] leading-[1.55]">
              Final-year Information Systems student at SMU, turning "what if"
              into "what's next". I work where users, business and technology
              meet: finding what people actually need, what's possible, and
              bringing the two together. Right now that means product
              experimentation, user behaviour and building with AI.
            </p>
            <figure className="max-w-[200px] sm:max-w-none">
              <img
                src={profileImg}
                alt="Xing Ying"
                className="w-full aspect-[4/5] object-cover rounded-[10px]"
              />
              <figcaption className="label text-ink-soft mt-2">
                Xing Ying — Singapore
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </>
  );
}

function ProjectLinks({ p }) {
  const links = [
    [p.githubUrl, "GitHub"],
    [p.demoVideo, "Demo"],
    [p.figmaUrl, "Figma"],
  ].filter(([url]) => url);
  if (!links.length)
    return <p className="text-[14px] text-ink-soft">Links coming soon</p>;
  return (
    <p className="flex flex-col gap-2 text-[16px] font-semibold">
      {links.map(([url, name]) => (
        <Ext
          key={name}
          href={url}
          className="link inline-flex items-center gap-1 w-fit"
        >
          {name} <Arrow />
        </Ext>
      ))}
    </p>
  );
}

/* One project, in full. */
function ProjectDetail({ p, children }) {
  return (
    <div key={p.title} className="arrive-now">
      <header className="mb-5">
        <h2 className="sign text-[clamp(26px,2.8vw,36px)]">{p.title}</h2>
        <p className="swatch tick mt-3" style={{ "--c": priceColour(p) }}>
          {DISCIPLINE[p.discipline][0]}, {p.category}
        </p>
        {p.achievement && (
          <p className="mt-2">
            <span className="award">{p.achievement}</span>
          </p>
        )}
        {p.sponsor && (
          <p className="label mt-2 text-ink-soft">Sponsor: {p.sponsor}</p>
        )}
      </header>
      <div className="compartments">
        <div className="cell cell-big">
          <p className="text-[16px] leading-[1.6]">{p.description}</p>
          <p className="mt-4 pt-4 rule-t text-[14px] leading-[1.5] text-ink-soft">
            {p.tech.join(", ")}
          </p>
        </div>
        <div className="cell !p-2">
          <Shot p={p} />
        </div>
        <div className="cell">
          <ProjectLinks p={p} />
        </div>
      </div>
      {children}
    </div>
  );
}

const roundButton =
  "grid place-items-center w-11 h-11 rounded-full hover:bg-ink hover:text-styrofoam transition-colors duration-300";

/* The Projects stop: every project as a list, or one of them opened from it. */
function Projects({ open, setOpen, onFeatured }) {
  const [only, setOnly] = useState(null); // a discipline to show, or null for all
  const p = open == null ? null : ALL[open];
  if (p)
    return (
      <ProjectDetail p={p}>
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setOpen(null)}
            className="link text-[14px] font-semibold"
          >
            All Projects
          </button>
          <span className="flex gap-1">
            <button
              type="button"
              aria-label="Previous project"
              onClick={() => setOpen((open + ALL.length - 1) % ALL.length)}
              className={roundButton}
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next project"
              onClick={() => setOpen((open + 1) % ALL.length)}
              className={roundButton}
            >
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </span>
        </div>
      </ProjectDetail>
    );
  const keep = (x) => !only || x.discipline === only;
  const groups = [
    ["Featured", featured.filter(keep)],
    ["More projects", [...sides, ...moreWork].filter(keep)],
  ].filter(([, list]) => list.length);
  const chip = (key, label, count, c) => (
    <button
      key={label}
      type="button"
      aria-pressed={only === key}
      onClick={() => setOnly(key)}
      className={`filter-chip ${only === key ? "is-on" : ""}`}
    >
      {c && (
        <span className="filter-sq" style={{ "--c": c }} aria-hidden="true" />
      )}
      {label}
      {count != null && <span className="filter-n">{count}</span>}
    </button>
  );
  return (
    <>
      <PanelTitle sub="A showcase of my work in product, data and software engineering.">
        All Projects
      </PanelTitle>
      {/* one chip per kind of work: they filter the list and double as the colour key */}
      <div
        className="-mt-1 mb-4 flex flex-wrap gap-1.5"
        role="group"
        aria-label="Show projects by kind of work"
      >
        {chip(null, "All")}
        {Object.entries(DISCIPLINE).map(([key, [name, c]]) =>
          chip(key, name, ALL.filter((x) => x.discipline === key).length, c),
        )}
      </div>
      {groups.map(([name, list]) => (
        <section key={name} className="mt-4 first:mt-0">
          <h3 className="label text-ink-soft mb-2 px-1">{name}</h3>
          <ul className="cell !p-2">
            {list.map((x, n) => (
              <li key={x.title} className={n ? "rule-t" : ""}>
                <button
                  type="button"
                  // a featured project has its own stop in the box; the rest open here
                  onClick={() =>
                    x.featured
                      ? onFeatured(featured.indexOf(x))
                      : setOpen(indexOf(x))
                  }
                  className="group w-full flex items-center gap-3 px-2 py-2.5 text-left rounded-[10px] hover:bg-styrofoam transition-colors duration-300"
                >
                  <span
                    className="swatch tick"
                    style={{ "--c": priceColour(x) }}
                  >
                    {x.title}
                  </span>
                  <span className="ml-auto shrink-0 text-[13px] text-ink-soft">
                    {DISCIPLINE[x.discipline][0]}
                  </span>
                  <ArrowRight
                    className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}

function Skills() {
  return (
    <>
      <PanelTitle>Skills & Expertise</PanelTitle>
      <dl className="cell">
        {sauces
          .flatMap((s) => s.groups)
          .map((g, i) => (
            <div key={g} className={i ? "rule-t pt-3 mt-3" : ""}>
              <dt className="label text-ink-soft">{g}</dt>
              <dd className="mt-1.5 text-[16px] leading-[1.55]">
                {skills[g].join(", ")}
              </dd>
            </div>
          ))}
      </dl>
    </>
  );
}

function Experience() {
  return (
    <>
      <PanelTitle>Experience</PanelTitle>
      <ol className="cell">
        {experience.map((e, i) => (
          <li
            key={`${e.org}-${e.period}`}
            className={i ? "rule-t pt-5 mt-5" : ""}
          >
            <p className="tick uppercase text-ink-soft">{e.period}</p>
            <h3 className="sign font-extrabold text-[24px] leading-[1.1] mt-1.5">
              {e.role}
            </h3>
            <p className="label mt-2">{e.org}</p>
            <p className="mt-2.5 text-[16px] leading-[1.6] text-ink-soft">
              {e.text}
            </p>
          </li>
        ))}
      </ol>
    </>
  );
}

function Contact() {
  return (
    <>
      <PanelTitle sub="Looking for a driven member to kickstart your next project? Let's connect and explore how we can create impact together.">
        Let's Build Something Together
      </PanelTitle>
      <div className="cell">
        <a
          href={`mailto:${EMAIL}`}
          className="group flex items-center justify-between gap-3 sign font-extrabold text-[clamp(18px,2vw,24px)] break-all"
        >
          {EMAIL}
          <ArrowUpRight
            className="w-6 h-6 shrink-0 transition-transform duration-500 ease-expo group-hover:rotate-45"
            aria-hidden="true"
          />
        </a>
        <div className="flex flex-wrap gap-2 mt-5 pt-5 rule-t">
          <Ext href={`mailto:${EMAIL}`} className="btn">
            Get In Touch
          </Ext>
          <Ext href={RESUME_URL} className="btn btn-line">
            View Resume <Arrow />
          </Ext>
          <Ext href={LINKEDIN} className="btn btn-line">
            LinkedIn <Arrow />
          </Ext>
          <Ext href={GITHUB} className="btn btn-line">
            GitHub <Arrow />
          </Ext>
        </div>
      </div>
      <p className="mt-5 text-[13px] text-ink-soft">
        &copy; 2026 Xing Ying · Singapore
      </p>
    </>
  );
}

function Connect() {
  const src = useMemo(() => {
    const qr = qrcode(0, "M");
    qr.addData(LINKEDIN);
    qr.make();
    return qr.createDataURL(8, 16);
  }, []);
  return (
    <>
      <PanelTitle sub="Point your phone camera here to open my LinkedIn.">
        Scan to connect
      </PanelTitle>
      <div className="cell grid place-items-center">
        <img
          src={src}
          alt="QR code that opens Xing Ying's LinkedIn profile"
          className="w-full max-w-[260px] [image-rendering:pixelated]"
        />
      </div>
      <div className="mt-4">
        <Ext href={LINKEDIN} className="btn">
          LinkedIn <Arrow />
        </Ext>
      </div>
    </>
  );
}

export default function Portfolio() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(null); // index into ALL, opened at the Projects stop
  const [sound, setSoundState] = useState(soundOn);
  const [no3d, setNo3d] = useState(false);
  const tags = useRef({});
  const voice = useRef(0);

  /* ── the orbit: which stop the camera has reached, and which it is heading for ── */
  const nav = useMemo(() => new OrbitNav(), []);
  const [at, setAt] = useState(0); // -1 while on the move, -2 while left in a free look after a drag
  const [head, setHead] = useState(0);
  const focus = at > 0 ? ORBIT[at] : null; // the section whose card is showing
  const no3dRef = useRef(no3d);
  no3dRef.current = no3d;

  const fly = useCallback(
    (id) => {
      const i = Math.max(0, ORBIT.indexOf(id ?? null));
      nav.goTo(i);
      if (no3dRef.current) setAt(i); // no camera to wait for: the card is just there
    },
    [nav],
  );

  // the sounds of the ride, and what each stop does on arrival
  const lastAt = useRef(0);
  useEffect(() => {
    const was = lastAt.current;
    lastAt.current = at;
    if (at < 0) {
      if (was >= 0) play("whoosh");
      if (ORBIT[was] === "contact") play("squeak"); // the bag lets go of the box
      return;
    }
    if (ORBIT[at] === "contact" && was !== at) {
      play("squeak");
      const id = setTimeout(() => play("snap"), 700);
      return () => clearTimeout(id);
    }
    if (ORBIT[at] !== "projects") setOpen(null);
  }, [at]);

  /* How to order: steps 2 (went round) and 3 (picked something) as they happen */
  const [went, setWent] = useState(false);
  const [picked, setPicked] = useState(false);

  /* a featured dish in the box was picked: it has its own stop */
  const pickDish = useCallback(
    (i) => {
      setPicked(true);
      play("tap");
      say(voice.current++ % 2 ? "nage" : "zhege");
      fly(`dish-${i}`);
    },
    [fly],
  );
  /* a side plate was picked: its project opens at the Projects stop */
  const pickSide = useCallback(
    (i) => {
      setPicked(true);
      setOpen(indexOf(sides[i]));
      play("tap");
      say(voice.current++ % 2 ? "nage" : "zhege");
      fly("projects");
    },
    [fly],
  );

  const [sauce, setSauce] = useState({ curry: false, sambal: false });
  const [opened, setOpened] = useState(false);

  const openBox = useCallback(() => {
    setOpened(true);
    play("squeak");
  }, []);

  const pick = useCallback(
    (id) => {
      // the box arrives closed: the first press anywhere on the scene opens it
      if (!opened) return openBox();
      setPicked(true);
      if (id === "curry" || id === "sambal") {
        // the pots add their sauce to the box, then show what the sauces stand for
        setSauce((was) => {
          if (!was[id]) play(id === "curry" ? "pour" : "plop");
          return { ...was, [id]: true };
        });
        fly("skills");
      } else if (id === "resume")
        window.open(RESUME_URL, "_blank", "noopener,noreferrer");
      else if (id.startsWith("dish-")) pickDish(Number(id.slice(5)));
      else if (id.startsWith("side-")) pickSide(Number(id.slice(5)));
      else {
        if (id === "projects") setOpen(null);
        fly(id);
      }
    },
    [fly, pickDish, pickSide, opened, openBox],
  );

  const back = useCallback(() => {
    setOpen(null);
    fly(null);
  }, [fly]);

  /* ── moving round: ← → (or A D), the wheel, and swipes; Esc goes back to the overview ── */
  const [lit, setLit] = useState(null); // the tag that has keyboard focus: its part of the scene lifts
  /* The How to order sign: "up" on the overview until it has done its job,
     "folded" into a tag, or "popped" back open from that tag. */
  const [sign, setSign] = useState(() => {
    try {
      return sessionStorage.getItem(SIGN_KEY) === "folded" ? "folded" : "up";
    } catch (e) {
      return "up";
    }
  });
  const foldSign = useCallback(() => {
    setSign("folded");
    try {
      sessionStorage.setItem(SIGN_KEY, "folded");
    } catch (e) {
      /* private mode: the sign just stays folded until the next visit */
    }
  }, []);
  // both lessons learnt: fold, after a pause so the last tick is seen
  useEffect(() => {
    if (sign !== "up" || !went || !picked) return;
    const id = setTimeout(foldSign, 1400);
    return () => clearTimeout(id);
  }, [sign, went, picked, foldSign]);

  useEffect(() => {
    nav.locked = !opened;
    nav.reduced = reduced;
    nav.onOpen = openBox;
    // a move while the box is shut only opens it: that is step 1, not step 2
    nav.onUse = () => nav.locked || setWent(true);
    nav.onHead = setHead;
  }, [nav, opened, reduced, openBox]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (!focus && document.activeElement?.closest?.(".pin"))
          document.activeElement.blur();
        back();
        return;
      }
      if (e.altKey || e.ctrlKey || e.metaKey || no3d) return;
      if (e.target.closest?.("input, textarea, select, [contenteditable]"))
        return;
      // only sideways: ↑ ↓ / W S are left alone for anything that scrolls
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const step =
        k === "ArrowRight" || k === "d"
          ? 1
          : k === "ArrowLeft" || k === "a"
            ? -1
            : 0;
      if (!step) return;
      e.preventDefault();
      // a tag left focused on the overview would sit, hidden, under the next stop
      if (document.activeElement?.closest?.(".pin"))
        document.activeElement.blur();
      nav.step(step);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [back, focus, nav, no3d]);

  // the wheel rides the camera along the orbit; the card keeps its own scrolling
  useEffect(() => {
    if (no3d) return;
    let idle = null;
    let owned = false; // this gesture belongs to the card
    const wheel = (e) => {
      if (e.ctrlKey) return; // pinch zoom
      const unit =
        e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      const dx = e.deltaX * unit;
      const dy = e.deltaY * unit;
      if (idle === null) owned = ownsScroll(e.target, dx, dy);
      clearTimeout(idle);
      idle = setTimeout(() => {
        idle = null;
        if (!owned) nav.release();
      }, 170);
      if (!owned) nav.scrub((Math.abs(dy) >= Math.abs(dx) ? dy : dx) / 420);
    };
    window.addEventListener("wheel", wheel, { passive: true });
    return () => {
      clearTimeout(idle);
      window.removeEventListener("wheel", wheel);
    };
  }, [nav, no3d]);

  // swipes on touch: up or left for the next stop, down or right for the one before
  useEffect(() => {
    if (no3d) return;
    let t = null;
    const start = (e) => {
      t = null;
      if (e.touches.length !== 1 || e.target.closest?.("[data-own-scroll]"))
        return;
      const p = e.touches[0];
      t = {
        x: p.clientX,
        y: p.clientY,
        axis: null,
        last: 0,
        time: e.timeStamp,
        v: 0,
      };
    };
    const move = (e) => {
      if (!t || e.touches.length !== 1) return;
      const p = e.touches[0];
      if (!t.axis) {
        if (Math.hypot(p.clientX - t.x, p.clientY - t.y) < 12) return; // still a tap
        t.axis =
          Math.abs(p.clientX - t.x) > Math.abs(p.clientY - t.y) ? "x" : "y";
        t.x = p.clientX;
        t.y = p.clientY;
        t.time = e.timeStamp;
        return;
      }
      const run = t.axis === "x" ? t.x - p.clientX : t.y - p.clientY; // px toward the next stop
      const span =
        t.axis === "x" ? window.innerWidth * 0.55 : window.innerHeight * 0.45;
      const dt = Math.max(1, e.timeStamp - t.time);
      t.v = t.v * 0.6 + ((run - t.last) / dt) * 0.4; // px per ms, smoothed
      nav.scrub((run - t.last) / span);
      t.last = run;
      t.time = e.timeStamp;
    };
    const end = () => {
      if (t?.axis) nav.release(Math.abs(t.v) > 0.35 ? Math.sign(t.v) : 0);
      t = null;
    };
    window.addEventListener("touchstart", start, { passive: true });
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("touchend", end);
    window.addEventListener("touchcancel", end);
    return () => {
      window.removeEventListener("touchstart", start);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", end);
      window.removeEventListener("touchcancel", end);
    };
  }, [nav, no3d]);

  /* one step round the orbit from the stop control; without 3D there is no camera to ride */
  const goStep = (d) => {
    if (no3d) {
      const n = ORBIT.length;
      return fly(ORBIT[(Math.max(0, at) + d + n) % n]);
    }
    nav.step(d);
  };
  const goStop = (id) => (id ? pick(id) : back());

  // tabbing onto a tag lifts its part of the scene
  const tagFocus = (id) => ({
    onFocus: (e) => e.target.matches(":focus-visible") && setLit(id),
    onBlur: () => setLit((was) => (was === id ? null : was)),
  });

  const [hovered, setHovered] = useState(null);
  const onHover = useCallback((id) => {
    if (id === "contact") play("crinkle");
    setHovered(id);
  }, []);
  const onGust = useCallback(() => play("rustle"), []);
  const onFail = useCallback(() => {
    setNo3d(true);
    setOpened(true);
  }, []);

  /* back to how the box arrives: no sauce */
  const changed = sauce.curry || sauce.sambal;
  const resetBox = () => {
    setSauce({ curry: false, sambal: false });
    setOpen(null);
    play("tap");
  };

  const toggleSound = () => {
    const on = !sound;
    setSound(on);
    setSoundState(on);
    if (on) say("xiaomei");
  };

  const openProject = (i) => {
    if (i != null && i !== open) {
      play("tap");
      say(voice.current++ % 2 ? "nage" : "zhege");
    }
    setOpen(i);
  };

  const tagRef = (id) => (el) => {
    tags.current[id] = el;
  };
  // the tags name the parts of the scene on the overview only
  const onOverview = no3d ? !focus : (at === 0 || at === -2) && opened;
  const away = onOverview ? "" : "is-away";
  // the sign is up on the overview (box shut or open); away from it only when asked for
  const atTable = at === 0 || at === -2;
  const signShown = !no3d && (sign === "popped" || (sign === "up" && atTable));
  // the scene's labels keep clear of the sign: lay them out again when it comes or goes
  useEffect(() => {
    const id = requestAnimationFrame(() => nav.wake());
    return () => cancelAnimationFrame(id);
  }, [signShown, sign, nav]);

  return (
    <div
      className={`fixed inset-0 bg-sky text-ink overflow-hidden ${no3d ? "no3d" : ""}`}
    >
      <h1 className="sr-only">Lau Xing Ying</h1>

      {/* ── The scene: one box on a hawker table ── */}
      <div className="absolute inset-0">
        {!no3d && (
          <Suspense fallback={null}>
            <BoxScene
              dishes={featured}
              sides={sides}
              selected={
                focus?.startsWith("dish-") ? Number(focus.slice(5)) : -1
              }
              nav={nav}
              onArrive={setAt}
              closed={!opened}
              packed={!opened || focus === "contact"}
              curry={sauce.curry}
              sambal={sauce.sambal}
              reduced={reduced}
              highlight={onOverview ? lit : null}
              onPick={pick}
              onHover={onHover}
              onGust={onGust}
              onFail={onFail}
              tags={tags}
            />
          </Suspense>
        )}

        {!no3d && (
          <svg className="leaders" aria-hidden="true">
            {sides.map((p, i) => (
              <line
                key={p.title}
                ref={(el) => (tags.current[`lead-${i}`] = el)}
                visibility="hidden"
              />
            ))}
          </svg>
        )}

        <nav
          aria-label="Sections"
          className={
            no3d
              ? "absolute inset-0 flex flex-col items-center justify-center gap-3 p-6"
              : ""
          }
        >
          {no3d && (
            <p className="sign text-[clamp(40px,8vw,72px)] mb-4">Xing Ying</p>
          )}
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              ref={tagRef(s.id)}
              onClick={() => pick(s.id)}
              className={`price tick pin ${away}`}
              data-section=""
              tabIndex={onOverview ? 0 : -1}
              {...tagFocus(s.id)}
            >
              {s.name}
            </button>
          ))}
          <button
            type="button"
            ref={tagRef("resume")}
            onClick={() => pick("resume")}
            className={`price tick pin ${away}`}
            data-section=""
            tabIndex={onOverview ? 0 : -1}
            {...tagFocus("resume")}
          >
            Resume <Arrow />
          </button>
          {!no3d && (
            <button
              type="button"
              ref={tagRef("open")}
              onClick={openBox}
              className={`price price-primary tick pin ${opened ? "is-away" : ""}`}
              style={{ "--c": "var(--styrofoam)" }}
              tabIndex={opened ? -1 : 0}
              {...tagFocus("open")}
            >
              Open the box
            </button>
          )}
        </nav>

        {/* price cards on the featured dishes and the side plates */}
        {!no3d &&
          featured.map((p, i) => (
            <button
              key={p.title}
              type="button"
              ref={tagRef(`dish-${i}`)}
              onClick={() => pickDish(i)}
              tabIndex={onOverview ? 0 : -1}
              className={`price tick pin ${onOverview || focus === `dish-${i}` ? "" : "is-away"}`}
              style={{ "--c": priceColour(p) }}
              {...tagFocus(`dish-${i}`)}
            >
              {p.title}
            </button>
          ))}
        {!no3d &&
          sides.map((p, i) => {
            const atPlates = focus === "projects";
            // on the overview a plate is named only while pointed at or tabbed to
            const state =
              atPlates || hovered === `side-${i}`
                ? ""
                : onOverview
                  ? "is-quiet"
                  : "is-away";
            return (
              <button
                key={p.title}
                type="button"
                ref={tagRef(`side-${i}`)}
                onClick={() => pickSide(i)}
                tabIndex={atPlates || onOverview ? 0 : -1}
                className={`price tick pin is-plate ${state} ${atPlates && ALL[open] === p ? "!bg-ink !text-styrofoam" : ""}`}
                style={{ "--c": priceColour(p) }}
                {...tagFocus(`side-${i}`)}
              >
                {p.title}
              </button>
            );
          })}
      </div>

      {/* ── The stop control: where you are, a step either way, and a dot for every stop ── */}
      {(no3d ? focus : opened) &&
        (() => {
          const here = no3d ? Math.max(0, at) : head;
          const id = ORBIT[here];
          const total = ORBIT.length - 1;
          const colour = id?.startsWith("dish-")
            ? priceColour(featured[Number(id.slice(5))])
            : "transparent";
          const next = stopName(here + 1);
          const prev = stopName(here - 1);
          return (
            <nav
              aria-label="Stops round the table"
              className="stops arrive-now absolute z-20 top-3 left-[var(--gutter)] max-md:top-auto max-md:bottom-3 max-md:right-[var(--gutter)]"
            >
              <div className="flex items-stretch gap-1.5">
                <button
                  type="button"
                  onClick={back}
                  className="stop-step"
                  aria-label="Overview"
                  disabled={here === 0}
                >
                  <House className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => goStep(-1)}
                  className="stop-step"
                  aria-label={`Previous stop: ${prev}`}
                  title={`Previous: ${prev}`}
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                </button>
                <p className="price tick stop-now" style={{ "--c": colour }}>
                  <span className="stop-lines">
                    <span className="stop-here" aria-live="polite">
                      {here ? (
                        <>
                          <span className="stop-count">
                            {here} / {total}
                          </span>
                          <span className="stop-name">{NAME[id]}</span>
                        </>
                      ) : (
                        <span className="stop-name">Overview</span>
                      )}
                    </span>
                    <span className="stop-next" aria-hidden="true">
                      Next: {next}
                    </span>
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => goStep(1)}
                  className="stop-step"
                  aria-label={`Next stop: ${next}`}
                  title={`Next: ${next}`}
                >
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
              <ol className="stop-dots">
                {ORBIT.map((sid, i) => (
                  <li key={sid || "overview"}>
                    <button
                      type="button"
                      onClick={() => goStop(sid)}
                      aria-label={sid ? NAME[sid] : "Overview"}
                      title={sid ? NAME[sid] : "Overview"}
                      aria-current={i === here ? "step" : undefined}
                      className={sid?.startsWith("dish-") ? "is-featured" : ""}
                      style={
                        sid?.startsWith("dish-")
                          ? {
                              "--c": priceColour(
                                featured[Number(sid.slice(5))],
                              ),
                            }
                          : undefined
                      }
                    />
                  </li>
                ))}
              </ol>
            </nav>
          );
        })()}

      {/* ── The compartment card ── */}
      {focus && (
        <section
          key={focus}
          aria-live="polite"
          className="arrive-now card card-shell absolute z-10 flex flex-col overflow-hidden inset-x-2 bottom-[90px] max-h-[54svh] md:inset-x-auto md:right-[var(--gutter)] md:top-[76px] md:bottom-auto md:max-h-[calc(100svh-100px)] md:w-[min(560px,42vw)]"
        >
          {/* the card is a fixed frame; this scrolls inside it, so the scrollbar sits within the card */}
          <div data-own-scroll className="card-scroll panel-scroll">
            {focus === "about" && <About reduced={reduced} />}
            {focus?.startsWith("dish-") && (
              <ProjectDetail p={featured[Number(focus.slice(5))]}>
                <button
                  type="button"
                  onClick={() => fly("projects")}
                  className="mt-4 link text-[14px] font-semibold"
                >
                  All Projects
                </button>
              </ProjectDetail>
            )}
            {focus === "projects" && (
              <Projects
                open={open}
                setOpen={openProject}
                onFeatured={(i) => pickDish(i)}
              />
            )}
            {focus === "skills" && <Skills />}
            {focus === "experience" && <Experience />}
            {focus === "contact" && <Contact />}
            {focus === "connect" && <Connect />}
          </div>
        </section>
      )}

      {/* left in a free look after a drag: how to get going again */}
      {!no3d && (
        <p
          className={`browse-hint ${at === -2 ? "" : "is-gone"}`}
          aria-hidden="true"
        >
          Scroll or <kbd>→</kbd> to carry on
        </p>
      )}

      {/* how to get round: the stall's numbered sign */}
      {signShown && (
        <HowToOrder
          done={[opened, went, picked]}
          reference={sign === "popped"}
          popped={sign === "popped" && !atTable}
          onHide={foldSign}
        />
      )}

      <div
        className={`absolute z-20 left-[var(--gutter)] bottom-4 max-md:bottom-auto max-md:top-3 flex flex-wrap gap-1.5 ${focus ? "max-md:hidden" : ""}`}
      >
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={sound}
          className="tag tag-light"
        >
          {sound ? (
            <Volume2 className="w-4 h-4" aria-hidden="true" />
          ) : (
            <VolumeX className="w-4 h-4" aria-hidden="true" />
          )}
          {sound ? "Sound on" : "Sound off"}
        </button>
        {!no3d && !signShown && (
          <button
            type="button"
            onClick={() => setSign("popped")}
            className="tag tag-light"
          >
            <span className="howto-q" aria-hidden="true">
              ?
            </span>
            How to order
          </button>
        )}
        {changed && (
          <button type="button" onClick={resetBox} className="tag tag-light">
            <RotateCcw className="w-4 h-4" aria-hidden="true" /> Reset the box
          </button>
        )}
      </div>
    </div>
  );
}
