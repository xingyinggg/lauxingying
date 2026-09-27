import { ArrowUp } from "lucide-react";
import { EMAIL, GITHUB, LINKEDIN } from "./Header";
import { getLenis, useSingaporeTime } from "./motion";

export default function Footer() {
  const time = useSingaporeTime();
  const toTop = (e) => {
    e.preventDefault();
    const lenis = getLenis();
    lenis ? lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <footer className="border-t border-ink/25 mt-20 lg:mt-[6vh] py-6 grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6 label text-ink/75">
      <p>&copy; 2026 Xing Ying</p>
      <p className="hidden md:block">
        Singapore <span className="tabular mx-1">{time}</span> SGT
      </p>
      <div className="flex gap-5 justify-end md:justify-start">
        <a className="draw-link hover:text-ink" href={GITHUB} target="_blank" rel="noopener noreferrer">GitHub</a>
        <a className="draw-link hover:text-ink" href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a className="draw-link hover:text-ink" href={`mailto:${EMAIL}`}>Email</a>
      </div>
      <a href="#top" onClick={toTop} className="md:justify-self-end inline-flex items-center gap-2 draw-link w-fit hover:text-ink">
        Back to top <ArrowUp className="w-3.5 h-3.5" />
      </a>
    </footer>
  );
}
