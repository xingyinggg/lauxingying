import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Linkedin,
  Mail,
} from "lucide-react";
import allProjects from "./data/projects";

/* ── tiny hook: fade-in on scroll ── */
function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          io.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function FadeIn({ children, className = "", delay = 0 }) {
  const ref = useFadeIn();
  return (
    <div
      ref={ref}
      className={`fade-section ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const categories = ["All", ...new Set(allProjects.map((p) => p.category))];

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? allProjects
      : allProjects.filter((p) => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-[#1a1916] text-[#e8e6e3] selection:bg-[#C5EBC3]/30 selection:text-white">
      {/* ── Nav ── */}
      <nav className="fixed top-0 w-full z-50 bg-[#1a1916]/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 flex items-center h-16">
          <a
            href="/"
            className="flex items-center gap-2 text-[#a8a29e] hover:text-[#e8e6e3] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back Home</span>
          </a>
        </div>
      </nav>

      {/* ── Header ── */}
      <section className="pt-32 pb-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            All Projects
          </h1>
          <p className="text-lg text-[#a8a29e] max-w-2xl leading-relaxed">
            A collection of projects spanning full-stack development, data
            analytics, hackathons, and product design.
          </p>
        </div>
      </section>

      {/* ── Filters ── */}
      <section className="pb-8">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === cat
                    ? "bg-[#C5EBC3] text-[#1a1916]"
                    : "bg-white/5 text-[#a8a29e] hover:text-[#e8e6e3] hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grid ── */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, index) => (
              <FadeIn key={project.title} delay={index * 60}>
                <div className="group flex flex-col bg-[#252320] rounded-2xl overflow-hidden border border-white/5 hover:border-[#C5EBC3]/20 transition-all duration-300 h-full">
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {project.achievement && (
                      <div className="absolute top-3 right-3 bg-[#C5EBC3] text-[#1a1916] px-3 py-1 rounded-full text-xs font-semibold">
                        {project.achievement}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6 gap-3">
                    <div className="text-xs font-medium uppercase tracking-wider text-[#C5EBC3]">
                      {project.category}
                    </div>
                    <h3 className="text-lg font-semibold text-[#e8e6e3]">
                      {project.title}
                    </h3>
                    <p className="text-sm text-[#a8a29e] leading-relaxed line-clamp-3 flex-1">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.tech.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="text-xs text-[#a8a29e] bg-white/5 px-2.5 py-1 rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-4 pt-2 mt-auto">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          className="flex items-center gap-1.5 text-sm text-[#a8a29e] hover:text-[#C5EBC3] transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          className="flex items-center gap-1.5 text-sm text-[#a8a29e] hover:text-[#C5EBC3] transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="w-3.5 h-3.5" />
                          Code
                        </a>
                      )}
                      {project.figmaUrl && (
                        <a
                          href={project.figmaUrl}
                          className="flex items-center gap-1.5 text-sm text-[#a8a29e] hover:text-[#C5EBC3] transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Figma
                        </a>
                      )}
                      {project.demoVideo && (
                        <a
                          href={project.demoVideo}
                          className="flex items-center gap-1.5 text-sm text-[#a8a29e] hover:text-[#C5EBC3] transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Video
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-[#a8a29e]">
          <p>&copy; 2026 Xing Ying</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/xingyinggg"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C5EBC3] transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/lauxingying"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C5EBC3] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:xingyinglau.2023@scis.smu.edu.sg"
              className="hover:text-[#C5EBC3] transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Projects;
