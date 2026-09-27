import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Tilt from "./components/Tilt";
import Fog from "./components/Fog";
import Header, { Pill, RESUME_URL, EMAIL, LINKEDIN } from "./components/Header";
import Footer from "./components/Footer";
import ProjectIndex from "./components/ProjectIndex";
import {
  Cursor,
  MaskLines,
  Preloader,
  prefersReducedMotion,
  useReveals,
  useSmoothScroll,
} from "./components/motion";
import allProjects from "./data/projects";
import profileImg from "./assets/me.png";
import about1Img from "./assets/about1.png";
import about2Img from "./assets/about2.png";
import about3Img from "./assets/about3.png";
import about4Img from "./assets/about4.jpg";

const ROLES = ["Product Manager", "Data Analyst", "Software Engineer"];

const skills = {
  "Product & Project Management": [
    "Product Strategy",
    "Roadmapping",
    "Stakeholder Management",
    "User Story Writing",
    "A/B Testing",
    "UAT",
    "Agile/Scrum",
    "Jira",
  ],

  "AI & Automation": [
    "LLM Workflows",
    "Prompt Engineering",
    "AI-Assisted Automation",
    "ChatGPT",
    "Claude",
    "Claude Code",
  ],

  "Data & Machine Learning": [
    "Tableau",
    "Python",
    "Pandas",
    "NumPy",
    "scikit-learn",
    "SQL",
    "Exploratory Data Analysis",
    "Machine Learning",
  ],

  Development: [
    "JavaScript",
    "Java",
    "PHP",
    "React",
    "Next.js",
    "React Native",
    "Vue.js",
    "Flask",
    "Spring Boot",
    "OutSystems",
    "Tailwind CSS",
    "Bootstrap",
  ],

  "Databases & Cloud": [
    "MySQL",
    "MongoDB",
    "Firebase",
    "Supabase",
    "AWS",
    "Azure",
  ],

  "Design & Tools": ["Figma", "Wireframing", "Git", "phpMyAdmin"],
};

const experience = [
  {
    period: "Sep 2026 — Dec 2026",
    role: "Product Management Intern",
    org: "Shopee",
    text: "Work on Search & Recommendation initiatives across A/B testing, data-driven rollout decisions and cross-functional feature, including cross-business use cases for Shopee Food and Monee",
  },
  {
    period: "May 2026 — Aug 2026",
    role: "Business Product Management Intern",
    org: "Shopee",
    text: "Supported end-to-end product lifecycle across cross-functional teams including requirement gathering, KPI tracking, feature rollout support and iterative product improvement",
  },
  {
    period: "May 2025 — Oct 2025",
    role: "Full-Stack Web Developer Intern",
    org: "MindFlex Education",
    text: "Led the development and rollout of a premium tutor mobile app using React Native & Expo. Managed repository routing, UAT setup, and coordinated App Store release process",
  },
  {
    period: "2024 — 2025",
    role: "Vice President",
    org: "SMU Ellipsis",
    text: "Oversee 45 student council members and organize tech events, networking nights, and welfare drives for the School of Computing and Information Systems",
  },
];

/* Roles swap in a masked slot, one every few seconds. */
function RoleCycler() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => setI((n) => (n + 1) % ROLES.length), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <>
      <span className="sr-only">{ROLES.join(", ")}</span>
      <span
        aria-hidden="true"
        // top-aligned so the role's line box starts exactly where the
        // surrounding line does; the extra height below only leaves room
        // for descenders inside the clip
        className="relative inline-grid overflow-hidden align-top h-[1.2em]"
      >
        {ROLES.map((r, n) => (
          <span
            key={r}
            className="col-start-1 row-start-1 whitespace-nowrap transition-transform duration-[900ms] ease-expo"
            style={{
              transform: `translateY(${n === i ? 0 : n === (i + ROLES.length - 1) % ROLES.length ? -110 : 110}%)`,
            }}
          >
            {r}
          </span>
        ))}
      </span>
    </>
  );
}

/* Scales each line of the monumental name to span its container exactly. */
function FitName({ lines }) {
  const box = useRef(null);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    let lastW = 0;
    let raf = 0;
    const fit = (force) => {
      const w = el.clientWidth;
      if (!w || (!force && w === lastW)) return;
      lastW = w;
      el.querySelectorAll("[data-fit]").forEach((line) => {
        line.style.fontSize = "100px";
        line.style.fontSize = `${(100 * w) / line.scrollWidth}px`;
      });
    };
    fit(true);
    document.fonts && document.fonts.ready.then(() => fit(true));
    // defer out of the observer callback so resizing never loops it
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => fit(false));
    });
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);
  return (
    <div ref={box} aria-hidden="true" className="mask-lines w-full select-none">
      {lines.map((l, i) => (
        <span className="mask-line" key={l}>
          <span
            data-fit
            className="display-wide whitespace-nowrap w-fit"
            style={{ "--d": `${250 + i * 110}ms` }}
          >
            {l}
          </span>
        </span>
      ))}
    </div>
  );
}

/* Statement whose words light up from faint to ink as it scrolls through. */
function ScrollLit({ text, className = "" }) {
  const ref = useRef(null);
  const words = text.split(" ");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = el.querySelectorAll("[data-w]");
    if (prefersReducedMotion()) {
      spans.forEach((s) => (s.style.opacity = 1));
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(
        1,
        Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)),
      );
      const lit = p * spans.length * 1.1;
      spans.forEach(
        (s, i) => (s.style.opacity = Math.min(1, Math.max(0.2, lit - i + 0.2))),
      );
    };
    const onScroll = () => raf || (raf = requestAnimationFrame(update));
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span
          key={i}
          data-w
          className="transition-opacity duration-300"
          style={{ opacity: 0.2 }}
        >
          {w}{" "}
        </span>
      ))}
    </p>
  );
}

const Portfolio = () => {
  useSmoothScroll();
  useReveals();

  return (
    <div className="relative min-h-screen text-ink overflow-x-clip">
      <Preloader />
      <Cursor />
      <Fog watch={["home", "contact"]} />
      <Header />

      <main className="relative z-10">
        {/* ── Hero: the fog window ── */}
        <section
          id="home"
          // phones: the hero is just its text (no portrait or giant name), so
          // it sizes to content; from sm up it fills the screen
          className="relative sm:min-h-[100svh] flex flex-col justify-between px-[var(--gutter)] pt-[100px] sm:pt-[112px] pb-8 sm:pb-6"
        >
          <div className="grid md:grid-cols-12 gap-y-10 gap-x-6 items-start">
            <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-6">
              <h1 className="font-display font-semibold tracking-[-0.03em] [word-spacing:0.08em] leading-[1.04] text-[clamp(32px,4.2vw,58px)]">
                <MaskLines
                  as="span"
                  className="block"
                  lines={["Hi, I'm Xing Ying."]}
                  delay={150}
                />
                <span className="mask-lines block">
                  <span className="mask-line">
                    <span style={{ "--d": "260ms" }}>
                      I am a <RoleCycler />
                    </span>
                  </span>
                </span>
              </h1>
              <p
                data-reveal
                style={{ "--d": "380ms" }}
                className="text-[17px] sm:text-[19px] leading-[1.5] text-ink/80 max-w-[430px] xl:max-w-none"
              >
                Final Year Information Systems student @ SMU turning "what if"
                into "what's next".
              </p>
              <p
                data-reveal
                style={{ "--d": "420ms" }}
                className="flex gap-3 text-[15px] leading-[1.5] text-mint-deep max-w-[430px] xl:max-w-none"
              >
                <span
                  aria-hidden="true"
                  className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-mint-deep"
                />
                Open to opportunities for Spring 2027 (Internship), and
                Full-Time Roles (July 2027)
              </p>
              <div
                data-reveal
                style={{ "--d": "480ms" }}
                className="flex flex-wrap gap-3 pt-1"
              >
                <Pill href="#projects">View My Work</Pill>
                <Pill href={RESUME_URL} external dark={false}>
                  View Resume
                </Pill>
              </div>
            </div>

            <figure
              data-reveal
              style={{ "--d": "300ms" }}
              className="hidden md:block md:col-start-10 md:col-span-3 justify-self-end w-[clamp(150px,14vw,220px)]"
            >
              <div className="-rotate-3">
                <Tilt max={8} scale={1.02} glare={false}>
                  <img
                    src={profileImg}
                    alt="Xing Ying"
                    className="w-full aspect-[4/5] object-cover rounded-[3px]"
                  />
                </Tilt>
              </div>
              <figcaption className="label text-ink/75 mt-4">
                Xing Ying — Singapore
              </figcaption>
            </figure>
          </div>

          <div className="pt-10">
            <div className="hidden sm:block">
              <FitName lines={["XING YING"]} />
            </div>
            <div className="flex justify-between items-center label text-ink/70 sm:pt-4">
              <a
                href="#about"
                className="inline-flex items-center gap-2 draw-link"
              >
                <ArrowDown className="w-3.5 h-3.5" /> Scroll to explore
              </a>
              <span className="hidden sm:inline">Singapore</span>
            </div>
          </div>
        </section>

        {/* ── The sheet: opaque ground floating inside the fog ── */}
        <div className="relative bg-ground rounded-[20px] sm:rounded-[28px] mx-[6px] sm:mx-2">
          {/* About */}
          <section
            id="about"
            className="screen px-[var(--gutter)] pt-24 sm:pt-36 pb-24 sm:pb-32"
          >
            <div className="grid md:grid-cols-12 gap-x-6 gap-y-10 lg:gap-y-8 lg:items-center">
              <h2 className="label md:col-span-3 lg:col-span-12 pt-3 lg:pt-0">
                About Me
              </h2>
              <ScrollLit
                className="md:col-span-9 lg:col-span-7 lg:row-start-2 font-display font-semibold tracking-[-0.03em] leading-[1.1] text-[clamp(28px,3.9vw,58px)] lg:text-[min(3vw,5.2vh)]"
                text="I turn messy problems into product solutions for you. I am drawn to the intersections of users, businesses and technology. I find what people actually need, what is possible and bring those together."
              />
              <div className="md:col-span-7 md:col-start-1 lg:col-start-8 lg:col-span-5 lg:row-start-2 lg:row-span-2 relative h-[300px] sm:h-[380px] md:h-[440px] lg:h-[min(62vh,560px)] lg:w-full lg:max-w-[calc(min(62vh,560px)*1.05)] lg:justify-self-end mt-4 md:mt-16 lg:mt-0">
                {[
                  [
                    about2Img,
                    "Formal",
                    "left-[34%] md:left-[26%] top-[18%] w-[34%] md:w-[24%] lg:left-[30%] lg:top-[26%] lg:w-[40%] rotate-3",
                    80,
                  ],
                  [
                    about1Img,
                    "Team collaboration",
                    "left-0 top-0 w-[42%] md:w-[30%] lg:w-[44%] -rotate-2",
                    0,
                  ],
                  [
                    about3Img,
                    "Representing Ellipsis",
                    "right-0 md:right-auto md:left-[52%] top-[4%] w-[36%] md:w-[26%] lg:left-[56%] lg:top-[2%] lg:w-[42%] -rotate-3",
                    160,
                  ],
                  [
                    about4Img,
                    "Participating",
                    "hidden md:block md:left-[78%] top-[28%] md:w-[22%] lg:left-[50%] lg:top-[48%] lg:w-[36%] rotate-2",
                    240,
                  ],
                ].map(([src, alt, pos, d]) => (
                  <img
                    key={alt}
                    src={src}
                    alt={alt}
                    loading="lazy"
                    data-reveal
                    style={{ "--d": `${d}ms` }}
                    className={`absolute aspect-[4/5] object-cover rounded-[3px] transition-transform duration-700 ease-expo hover:!rotate-0 hover:scale-[1.04] hover:z-10 ${pos}`}
                  />
                ))}
              </div>
              <p
                data-reveal
                className="md:col-span-4 md:col-start-9 md:mt-auto lg:col-start-1 lg:col-span-6 lg:row-start-3 lg:mt-0 text-[17px] sm:text-[19px] lg:text-[min(1.35vw,2.3vh)] leading-[1.55] text-ink/80 max-w-[460px] lg:max-w-[560px]"
              >
                Right now, I am exploring product through my work and projects
                from understanding user behaviour, product experimentation to
                building with AI. I enjoy asking the "why" behind problems and
                turn ambiguity into solutions for people.
              </p>
            </div>
          </section>

          {/* Experience */}
          <section id="experience" className="pt-16 sm:pt-24 pb-24 sm:pb-32">
            <div className="px-[var(--gutter)] md:grid md:grid-cols-12 gap-x-6 mb-12 sm:mb-16">
              <MaskLines
                lines={["Experience"]}
                className="md:col-start-4 md:col-span-9 font-display font-black tracking-[-0.04em] leading-[0.9] text-[clamp(40px,12.5vw,160px)] md:text-[clamp(56px,10.5vw,160px)]"
              />
            </div>
            <ol className="border-b border-[var(--rule)]">
              {experience.map((e, i) => (
                <li
                  key={`${e.org}-${e.period}`}
                  data-reveal
                  style={{ "--d": `${i * 80}ms` }}
                  className="group relative border-t border-[var(--rule)] overflow-hidden"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-mint origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-700 ease-expo"
                  />
                  <div className="relative px-[var(--gutter)] py-8 sm:py-10 grid md:grid-cols-12 gap-x-6 gap-y-3">
                    <p className="md:col-span-3 tabular text-[12px] uppercase tracking-[0.06em] text-ink/75 pt-2">
                      {e.period}
                    </p>
                    <div className="md:col-span-5">
                      <h3 className="font-display font-semibold tracking-[-0.025em] leading-[1.08] text-[clamp(24px,2.6vw,36px)]">
                        {e.role}
                      </h3>
                      <p className="label mt-3">{e.org}</p>
                    </div>
                    <p className="md:col-span-4 text-[15px] sm:text-[16px] leading-[1.6] text-ink/80 max-w-[460px] pt-1">
                      {e.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Skills */}
          <section
            id="skills"
            className="px-[var(--gutter)] pt-8 pb-24 sm:pb-36"
          >
            <h2 className="font-display font-semibold tracking-[-0.03em] text-[clamp(28px,3vw,44px)] mb-10 sm:mb-14">
              Skills & Expertise
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-x-6 gap-y-12 border-t border-[var(--rule)] pt-8">
              {Object.entries(skills).map(([cat, list], i) => (
                <div key={cat} data-reveal style={{ "--d": `${i * 60}ms` }}>
                  <h3 className="label text-ink/70 mb-5 min-h-[2.6em]">
                    {cat}
                  </h3>
                  <ul className="font-display font-medium text-[17px] sm:text-[19px] leading-[1.5] tracking-[-0.01em]">
                    {list.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Projects */}
          <section id="projects" className="pt-8 pb-24 sm:pb-32">
            <div className="px-[var(--gutter)] grid md:grid-cols-12 gap-x-6 gap-y-6 mb-12 sm:mb-16 items-end">
              <MaskLines
                lines={["Featured", "Projects"]}
                className="md:col-start-4 md:col-span-9 font-display font-black tracking-[-0.04em] leading-[0.9] text-[clamp(40px,12.5vw,160px)] md:text-[clamp(56px,10.5vw,160px)]"
              />
              <p
                data-reveal
                className="md:col-start-4 md:col-span-6 text-[17px] leading-[1.55] text-ink/80 max-w-[440px]"
              >
                A showcase of my work in product, data and software engineering.
              </p>
            </div>
            <div className="md:px-[var(--gutter)]">
              <div className="px-[var(--gutter)] md:px-0">
                <ProjectIndex projects={allProjects.slice(0, 3)} />
              </div>
            </div>
            <div className="px-[var(--gutter)] pt-10">
              <Pill href="/projects">View All Projects</Pill>
            </div>
          </section>
        </div>

        {/* ── Contact: back out into the fog ── */}
        <section
          id="contact"
          className="relative min-h-[100svh] flex flex-col justify-between px-[var(--gutter)] pt-32 sm:pt-44"
        >
          <div>
            <MaskLines
              lines={["Let's Build", "Something", "Together"]}
              className="font-display font-black tracking-[-0.04em] leading-[0.88] text-[clamp(40px,12.5vw,176px)] md:text-[clamp(52px,11vw,176px)]"
            />
            <div className="grid md:grid-cols-12 gap-x-6 gap-y-10 mt-12 sm:mt-16">
              <p
                data-reveal
                className="md:col-span-4 text-[17px] sm:text-[19px] leading-[1.55] text-ink/80 max-w-[440px]"
              >
                Looking for a driven member to kickstart your next project?
                Let's connect and explore how we can create impact together.
              </p>
              <div
                data-reveal
                style={{ "--d": "120ms" }}
                className="md:col-start-6 md:col-span-7 flex flex-col gap-8"
              >
                <a
                  href={`mailto:${EMAIL}`}
                  data-cursor="Email"
                  className="group font-display font-semibold tracking-[-0.03em] text-[clamp(20px,3.1vw,44px)] leading-tight border-b border-ink pb-3 flex items-center justify-between gap-4 break-all"
                >
                  {EMAIL}
                  <ArrowUpRight className="w-7 h-7 sm:w-10 sm:h-10 shrink-0 transition-transform duration-500 ease-expo group-hover:rotate-45" />
                </a>
                <div className="flex flex-wrap gap-3">
                  <Pill href={`mailto:${EMAIL}`}>Get In Touch</Pill>
                  <Pill href={RESUME_URL} external dark={false}>
                    View Resume
                  </Pill>
                  <Pill href={LINKEDIN} external dark={false}>
                    LinkedIn
                  </Pill>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </section>
      </main>
    </div>
  );
};

export default Portfolio;
