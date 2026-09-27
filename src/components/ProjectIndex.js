import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

export const primaryLink = (p) => p.liveUrl || p.demoVideo || p.githubUrl || p.figmaUrl;

export function ProjectLinks({ project, className = "" }) {
  const links = [
    ["Live Demo", project.liveUrl],
    ["Code", project.githubUrl],
    ["Figma", project.figmaUrl],
    ["Video", project.demoVideo],
  ].filter(([, url]) => url);
  if (!links.length) return null;
  return (
    <div className={`flex flex-wrap gap-x-4 gap-y-1 ${className}`}>
      {links.map(([label, url]) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 label inline-flex items-center gap-1 text-ink/75 hover:text-ink draw-link"
        >
          {label}
          <ArrowUpRight className="w-3 h-3" />
        </a>
      ))}
    </div>
  );
}

/**
 * Typographic project index. Hovering a row nudges its title forward and
 * dims the others; on small screens each row carries its own thumbnail.
 */
export default function ProjectIndex({ projects }) {
  const [active, setActive] = useState(null);

  return (
    <div className="relative" onPointerLeave={() => setActive(null)}>
      <ul className="border-b border-[var(--rule)]">
        {projects.map((p, i) => {
          const href = primaryLink(p);
          const dim = active !== null && active !== i;
          return (
            <li
              key={p.title}
              data-reveal
              style={{ "--d": `${Math.min(i, 6) * 50}ms` }}
              onPointerEnter={() => setActive(i)}
              className="group relative border-t border-[var(--rule)]"
            >
              <div className="grid grid-cols-[88px_1fr] md:grid-cols-[1fr_190px_260px] gap-x-4 md:gap-x-8 items-center py-4 md:py-6">
                <img
                  src={p.image}
                  alt=""
                  loading="lazy"
                  className="md:hidden row-span-2 w-[88px] h-[60px] object-cover rounded-[3px]"
                />
                <h3
                  className={`font-display font-semibold tracking-[-0.03em] leading-[1.02] text-[clamp(22px,3.4vw,48px)] transition-[opacity,transform] duration-500 ease-expo md:group-hover:translate-x-5 ${
                    dim ? "md:opacity-35" : ""
                  }`}
                >
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="View"
                      className="after:absolute after:inset-0 after:content-['']"
                    >
                      {p.title}
                    </a>
                  ) : (
                    p.title
                  )}
                  {p.achievement && (
                    <span className="ml-3 align-middle inline-block label text-mint-deep translate-y-[-0.2em]">
                      {p.achievement}
                    </span>
                  )}
                </h3>
                <p className="label text-ink/70 md:self-center">{p.category}</p>
                <div className="col-start-2 md:col-start-auto flex flex-col gap-2">
                  <p className="text-[13px] leading-snug text-ink/70 hidden md:block">{p.tech.join(" · ")}</p>
                  <ProjectLinks project={p} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
