import { useState } from "react";
import Fog from "./components/Fog";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ProjectLinks, primaryLink } from "./components/ProjectIndex";
import { Cursor, MaskLines, useReveals, useSmoothScroll } from "./components/motion";
import allProjects from "./data/projects";

const categories = ["All", ...new Set(allProjects.map((p) => p.category))];

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  useSmoothScroll();

  const filtered =
    activeFilter === "All" ? allProjects : allProjects.filter((p) => p.category === activeFilter);
  useReveals([activeFilter]);

  return (
    <div className="relative min-h-screen text-ink overflow-x-clip">
      <Cursor />
      <Fog watch={["projects-top"]} />
      <Header onHome={false} />

      <main className="relative z-10">
        <section id="projects-top" className="px-[var(--gutter)] pt-36 sm:pt-48 pb-16 sm:pb-24">
          <MaskLines
            as="h1"
            lines={["All Projects"]}
            className="font-display font-black tracking-[-0.04em] leading-[0.9] text-[clamp(40px,12.5vw,176px)] md:text-[clamp(56px,11vw,176px)]"
          />
          <p data-reveal className="mt-8 text-[17px] sm:text-[19px] leading-[1.55] text-ink/80 max-w-[520px]">
            A collection of projects spanning full-stack development, data analytics, hackathons, and product design.
          </p>
        </section>

        <div className="relative bg-ground rounded-[20px] sm:rounded-[28px] mx-[6px] sm:mx-2 px-[var(--gutter)] pt-8 sm:pt-12 pb-10">
          <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2 pb-10 sm:pb-14">
            {categories.map((cat) => {
              const count = cat === "All" ? allProjects.length : allProjects.filter((p) => p.category === cat).length;
              const on = activeFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  aria-pressed={on}
                  className={`label !text-[11.5px] rounded-full px-4 py-2.5 border transition-colors duration-300 ${
                    on ? "bg-ink text-paper border-ink" : "border-ink/30 text-ink hover:border-ink"
                  }`}
                >
                  {cat} <span className="tabular opacity-60 ml-1">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Staggered two-column gallery: the right column rides lower, so
              the page reads as a hung wall rather than a grid of cards. */}
          <ul className="grid md:grid-cols-2 gap-x-[clamp(24px,5vw,96px)] gap-y-16 sm:gap-y-24 pb-16">
            {filtered.map((project, i) => {
              const href = primaryLink(project);
              return (
                <li
                  key={project.title}
                  data-reveal
                  style={{ "--d": `${(i % 2) * 100}ms` }}
                  className={`group relative flex flex-col ${i % 2 ? "md:mt-32" : ""}`}
                >
                  <div className="relative overflow-hidden rounded-[3px] aspect-[16/10] bg-[#d7e0d8] p-[clamp(6px,0.8vw,12px)] transition-colors duration-500 group-hover:bg-mint">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-contain object-center transition-transform duration-[1200ms] ease-expo group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex items-baseline justify-between gap-4 mt-6">
                    <h2 className="flex-1 font-display font-semibold tracking-[-0.025em] leading-[1.1] text-[clamp(22px,2.4vw,34px)]">
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor="View"
                          className="after:absolute after:inset-0 after:content-['']"
                        >
                          {project.title}
                        </a>
                      ) : (
                        project.title
                      )}
                    </h2>
                    <p className="label text-ink/75 shrink-0">{project.category}</p>
                  </div>
                  <div>
                    {project.achievement && <p className="label text-mint-deep mt-3">{project.achievement}</p>}
                    <p className="mt-3 text-[15px] leading-[1.6] text-ink/80 max-w-[56ch]">{project.description}</p>
                    <p className="mt-3 text-[13px] text-ink/70">{project.tech.join(" · ")}</p>
                    <ProjectLinks project={project} className="mt-4" />
                  </div>
                </li>
              );
            })}
          </ul>
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default Projects;
