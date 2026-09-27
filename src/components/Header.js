import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { getLenis, useSingaporeTime } from "./motion";

export const RESUME_URL =
  "https://drive.google.com/file/d/1Sa9M8w0nmPMt2jkJ-BM4UXkFpi-RGmCs/view?usp=sharing";
export const EMAIL = "lauxingying@gmail.com";
export const LINKEDIN = "https://www.linkedin.com/in/lauxingying";
export const GITHUB = "https://github.com/xingyinggg";

export function Pill({
  href,
  children,
  dark = true,
  external = false,
  className = "",
  ...rest
}) {
  const ext = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a
      href={href}
      {...ext}
      {...rest}
      className={`group inline-flex items-center gap-2 rounded-full px-5 py-3 label !text-[11.5px] transition-colors duration-300 ${
        dark
          ? "bg-ink text-paper hover:bg-[#26302a]"
          : "border border-ink/80 text-ink hover:bg-ink hover:text-paper"
      } ${className}`}
    >
      {children}
      <ArrowUpRight
        className={`w-3.5 h-3.5 transition-transform duration-500 ease-expo group-hover:rotate-45 ${dark ? "text-mint" : ""}`}
        strokeWidth={2}
      />
    </a>
  );
}

const MENU = [
  ["About", "/#about"],
  ["Experience", "/#experience"],
  ["Projects", "/#projects"],
  ["Contact", "/#contact"],
];

export default function Header({ onHome = true }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const time = useSingaporeTime();

  // once the page moves, the header gains a solid backing so it stays
  // legible over whatever content passes underneath
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const btn = useRef(null);
  const panel = useRef(null);

  useEffect(() => {
    const lenis = getLenis();
    if (open) {
      lenis && lenis.stop();
      document.body.style.overflow = "hidden";
      panel.current && panel.current.querySelector("a").focus();
    } else {
      lenis && lenis.start();
      document.body.style.overflow = "";
    }
    const onKey = (e) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        btn.current && btn.current.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (e, href) => {
    setOpen(false);
    if (!onHome) return; // let the browser navigate to /#section
    const id = href.split("#")[1];
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const lenis = getLenis();
    // wait a frame so Lenis is running again after the panel closes
    requestAnimationFrame(() =>
      lenis
        ? lenis.scrollTo(el, { duration: 1.4 })
        : el.scrollIntoView({ behavior: "smooth" }),
    );
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-[60] px-[var(--gutter)] transition-[background-color,padding,border-color,color] duration-500 ease-expo border-b ${
          open
            ? "text-paper border-transparent pt-5 sm:pt-7 pb-3"
            : scrolled
              ? "text-ink bg-ground/90 backdrop-blur-md border-[var(--rule)] py-3"
              : "text-ink border-transparent pt-5 sm:pt-7 pb-3"
        }`}
      >
        <div className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center gap-3">
          <a href="/" className="flex items-center gap-3 w-fit min-w-0">
            <span className="label whitespace-nowrap">Lau Xing Ying</span>
          </a>
          <p className="label hidden md:block opacity-70">
            Singapore <span className="tabular mx-1">{time}</span> SGT
          </p>
          <div className="flex items-center justify-end gap-1.5 sm:gap-2">
            <Pill
              href={RESUME_URL}
              external
              dark={false}
              className={`!px-4 sm:!px-5 max-[379px]:!px-3 max-[379px]:[&>svg]:hidden ${scrolled ? "" : "bg-ground/40"} ${open ? "!hidden" : ""}`}
            >
              Resume
            </Pill>
            <button
              ref={btn}
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              className={`label !text-[11.5px] rounded-full px-4 sm:px-5 max-[379px]:px-3 py-3 min-w-0 min-[380px]:min-w-[80px] sm:min-w-[92px] transition-colors duration-300 ${
                open
                  ? "bg-mint text-ink"
                  : "bg-ink text-paper hover:bg-[#26302a]"
              }`}
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      <div
        id="site-menu"
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        className={`fixed inset-0 z-[55] bg-ink text-paper px-[var(--gutter)] pt-28 pb-8 flex flex-col justify-between ${
          open ? "visible" : "invisible pointer-events-none"
        }`}
        style={{
          clipPath: open ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
          transition: `clip-path 0.8s var(--ease-expo), visibility 0s linear ${open ? "0s" : "0.8s"}`,
        }}
      >
        <nav>
          <ul>
            {MENU.map(([label, href], i) => (
              <li
                key={label}
                className="border-t border-paper/15 overflow-hidden"
              >
                <a
                  href={href}
                  onClick={(e) => go(e, href)}
                  className="group flex items-baseline justify-between py-3 sm:py-4 font-display font-extrabold tracking-[-0.03em] text-[clamp(44px,8.5vw,120px)] leading-[0.95] text-paper hover:text-mint transition-colors duration-300 menu-item"
                  style={{ "--d": `${80 + i * 60}ms` }}
                >
                  <span className="transition-transform duration-500 ease-expo group-hover:translate-x-4">
                    {label}
                  </span>
                  <ArrowUpRight className="w-8 h-8 sm:w-12 sm:h-12 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-wrap gap-x-8 gap-y-3 label text-paper/70 pt-8">
          <a className="draw-link hover:text-paper" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
          <a
            className="draw-link hover:text-paper"
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </a>
          <a
            className="draw-link hover:text-paper"
            href={LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            className="draw-link hover:text-paper"
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </>
  );
}
