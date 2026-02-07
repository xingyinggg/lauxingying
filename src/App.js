import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Code,
  Users,
  MapPin,
  Mail,
  Github,
  Linkedin,
  ExternalLink,
  ArrowRight,
  Download,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import { TypeAnimation } from "react-type-animation";
import allProjects from "./data/projects";
import profileImg from "./assets/me.png";
import about1Img from "./assets/about1.png";
import about2Img from "./assets/about2.png";
import about3Img from "./assets/about3.png";
import about4Img from "./assets/about4.png";

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
      { threshold: 0.15 }
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

/* ── main component ── */
const Portfolio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const featuredProjects = allProjects.slice(0, 3);

  const skills = {
    Languages: [
      "JavaScript",
      "Python (Pandas, NumPy, scikit-learn)",
      "Java",
      "PHP",
      "SQL",
    ],
    Frameworks: [
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
    Databases: ["MySQL", "MongoDB", "Firebase", "Supabase", "phpMyAdmin"],
    "Product & Project Management": [
      "Product Strategy",
      "Roadmapping",
      "Agile/Scrum",
      "Stakeholder Management",
      "Jira",
    ],
    Cloud: ["AWS", "Azure"],
    "Design & Tools": ["Figma", "Wireframing", "Git"],
  };

  const navItems = [
    "Home",
    "About",
    "Skills",
    "Experience",
    "Projects",
    "Contact",
  ];

  /* highlight current nav link on scroll */
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((n) => n.toLowerCase());
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  });

  return (
    <div className="min-h-screen bg-[#1a1916] text-[#e8e6e3] selection:bg-[#C5EBC3]/30 selection:text-white">
      {/* ── Navigation ── */}
      <nav className="fixed top-0 w-full z-50 bg-[#1a1916]/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a
              href="#home"
              className="flex items-center gap-3 group"
            >
              <div className="w-9 h-9 bg-[#C5EBC3] rounded-lg flex items-center justify-center group-hover:rounded-xl transition-all duration-300">
                <span className="text-[#1a1916] font-bold text-sm">XY</span>
              </div>
              <span className="font-semibold text-lg text-[#e8e6e3]">
                Xing Ying
              </span>
            </a>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    activeSection === item.toLowerCase()
                      ? "text-[#C5EBC3] bg-[#C5EBC3]/10"
                      : "text-[#a8a29e] hover:text-[#e8e6e3] hover:bg-white/5"
                  }`}
                >
                  {item}
                </a>
              ))}
            </div>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#1a1916]/95 backdrop-blur-lg border-t border-white/5">
            <div className="px-6 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === item.toLowerCase()
                      ? "text-[#C5EBC3] bg-[#C5EBC3]/10"
                      : "text-[#a8a29e] hover:text-[#e8e6e3] hover:bg-white/5"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero Section ── */}
      <section
        id="home"
        className="pt-16 min-h-screen flex items-center"
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
            {/* Text — takes 3 of 5 cols */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#C5EBC3]/10 border border-[#C5EBC3]/20 text-[#C5EBC3] px-4 py-2 rounded-full w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5EBC3] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5EBC3]"></span>
                </span>
                <span className="text-sm font-medium">
                  Open to opportunities for Summer 2026
                </span>
              </div>

              {/* Heading */}
              <div className="flex flex-col gap-3">
                <h1 className="text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-balance">
                  Hi, I'm{" "}
                  <span className="text-[#C5EBC3]">Xing Ying</span>
                </h1>

                <div className="text-2xl lg:text-3xl font-medium text-[#a8a29e]">
                  {"I am a "}
                  <TypeAnimation
                    sequence={[
                      "Product Manager",
                      2000,
                      "Software Engineer",
                      2000,
                      "Full-Stack Developer",
                      2000,
                      "UI/UX Designer",
                      2000,
                    ]}
                    wrapper="span"
                    speed={50}
                    repeat={Infinity}
                    className="text-[#C5EBC3]"
                  />
                </div>
              </div>

              <p className="text-lg text-[#a8a29e] max-w-lg leading-relaxed">
                Year 3 Information Systems student at SMU who loves turning
                ideas into real products.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="#projects"
                  className="bg-[#C5EBC3] text-[#1a1916] px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center gap-2 hover:brightness-90 hover:shadow-lg hover:shadow-[#C5EBC3]/10"
                >
                  View My Work
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="https://drive.google.com/file/d/13pi_zOcRKnbBd5hjeRI7sq6k-KP00VLi/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-[#C5EBC3]/40 text-[#C5EBC3] px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center gap-2 hover:bg-[#C5EBC3]/10"
                >
                  <Download className="w-4 h-4" />
                  View Resume
                </a>
              </div>

              <div className="flex items-center gap-2 text-[#a8a29e] text-sm pt-1">
                <MapPin className="w-4 h-4" />
                <span>Singapore</span>
              </div>
            </div>

            {/* Profile Image — takes 2 of 5 cols */}
            <div className="lg:col-span-2 flex justify-center lg:justify-end">
              <div className="w-72 h-72 lg:w-80 lg:h-80 relative">
                <div className="absolute inset-0 bg-[#C5EBC3]/20 rounded-3xl rotate-3"></div>
                <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-[#C5EBC3]/20">
                  <img
                    src={profileImg}
                    alt="Xing Ying"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── About Section ── */}
      <section id="about" className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="flex items-center gap-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tight">About Me</h2>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <FadeIn delay={100}>
              <div className="flex flex-col gap-5">
                <p className="text-lg text-[#a8a29e] leading-relaxed">
                  I enjoy building things that are actually useful. Whether I'm
                  coding full-stack apps or shaping product strategy, I'm most
                  excited when technology solves real problems and creates impact.
                </p>

                <p className="text-lg text-[#a8a29e] leading-relaxed">
                  Right now, I'm working on projects that sit between engineering
                  and product, where I get to think about users, constraints and
                  trade-offs. I believe great products come from balancing what's
                  technically possible with what users truly need.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-3">
                  <img
                    src={about1Img}
                    alt="Team collaboration"
                    className="h-36 w-full object-cover rounded-2xl hover:scale-[1.02] transition-transform duration-300"
                  />
                  <img
                    src={about2Img}
                    alt="Formal"
                    className="h-44 w-full object-cover rounded-2xl hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-col gap-3 pt-8">
                  <img
                    src={about3Img}
                    alt="Representing Ellipsis"
                    className="h-44 w-full object-cover rounded-2xl hover:scale-[1.02] transition-transform duration-300"
                  />
                  <img
                    src={about4Img}
                    alt="Participating"
                    className="h-36 w-full object-cover rounded-2xl hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Skills Section ── */}
      <section id="skills" className="py-24 lg:py-32 bg-[#1f1d1a]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="flex items-center gap-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tight">
                Skills & Expertise
              </h2>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(skills).map(([category, skillList], index) => (
              <FadeIn key={category} delay={index * 80}>
                <div className="group bg-[#252320] rounded-2xl p-6 border border-white/5 hover:border-[#C5EBC3]/20 transition-all duration-300">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[#C5EBC3] mb-5">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillList.map((skill) => (
                      <span
                        key={skill}
                        className="text-sm text-[#a8a29e] bg-white/5 px-3 py-1.5 rounded-lg hover:bg-[#C5EBC3]/10 hover:text-[#C5EBC3] transition-colors duration-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Experience Section ── */}
      <section id="experience" className="py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="flex items-center gap-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Experience</h2>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>
          </FadeIn>

          <div className="flex flex-col gap-6">
            {/* Experience 1 */}
            <FadeIn delay={100}>
              <div className="group grid lg:grid-cols-[200px_1fr] gap-4 lg:gap-8 p-6 rounded-2xl border border-white/5 hover:border-[#C5EBC3]/20 hover:bg-white/[0.02] transition-all duration-300">
                <div className="text-sm text-[#a8a29e] font-medium pt-1">
                  May 2025 — Oct 2025
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#C5EBC3]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Code className="w-5 h-5 text-[#C5EBC3]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#e8e6e3] group-hover:text-[#C5EBC3] transition-colors">
                        Full-Stack Web Developer Intern
                      </h3>
                      <p className="text-[#C5EBC3] text-sm font-medium">
                        MindFlex Education
                      </p>
                    </div>
                  </div>
                  <p className="text-[#a8a29e] leading-relaxed">
                    Led the development and rollout of a premium tutor mobile
                    app using React Native & Expo. Managed repository routing,
                    UAT setup, and coordinated App Store release process.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Experience 2 */}
            <FadeIn delay={200}>
              <div className="group grid lg:grid-cols-[200px_1fr] gap-4 lg:gap-8 p-6 rounded-2xl border border-white/5 hover:border-[#C5EBC3]/20 hover:bg-white/[0.02] transition-all duration-300">
                <div className="text-sm text-[#a8a29e] font-medium pt-1">
                  2024 — Present
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#C5EBC3]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-[#C5EBC3]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#e8e6e3] group-hover:text-[#C5EBC3] transition-colors">
                        Vice President
                      </h3>
                      <p className="text-[#C5EBC3] text-sm font-medium">
                        SMU Ellipsis
                      </p>
                    </div>
                  </div>
                  <p className="text-[#a8a29e] leading-relaxed">
                    Oversee 45 student council members and organize tech events,
                    networking nights, and welfare drives for the School of
                    Computing and Information Systems.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Projects Section ── */}
      <section id="projects" className="py-24 lg:py-32 bg-[#1f1d1a]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <FadeIn>
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-3xl font-bold tracking-tight">
                Featured Projects
              </h2>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>
            <p className="text-[#a8a29e] max-w-2xl mb-12">
              A showcase of my work in product development, software
              engineering, and hackathon achievements.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <FadeIn key={index} delay={index * 100}>
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
                    <p className="text-sm text-[#a8a29e] leading-relaxed line-clamp-2 flex-1">
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

          <FadeIn delay={400}>
            <div className="text-center mt-12">
              <a
                href="/projects"
                className="inline-flex items-center gap-2 bg-[#C5EBC3] text-[#1a1916] font-medium px-6 py-3 rounded-full transition-all duration-200 hover:brightness-90 hover:shadow-lg hover:shadow-[#C5EBC3]/10"
              >
                View All Projects
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Contact Section ── */}
      <section id="contact" className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <FadeIn>
            <p className="text-sm font-medium uppercase tracking-wider text-[#C5EBC3] mb-4">
              Get in Touch
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-balance">
              Let's Build Something Together
            </h2>
            <p className="text-lg text-[#a8a29e] mb-10 max-w-xl mx-auto leading-relaxed">
              Looking for a driven intern to kickstart your next project? Let's
              connect and explore how we can create impact together.
            </p>
          </FadeIn>

          <FadeIn delay={150}>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href="mailto:xingyinglau.2023@scis.smu.edu.sg"
                className="bg-[#C5EBC3] text-[#1a1916] px-6 py-3 rounded-full font-medium transition-all duration-200 inline-flex items-center gap-2 hover:brightness-90 hover:shadow-lg hover:shadow-[#C5EBC3]/10"
              >
                <Mail className="w-4 h-4" />
                Get In Touch
              </a>

              <a
                href="https://drive.google.com/file/d/181aJVQ1i7WbHmFfN_Bhzj1YqoEIvruPB/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#C5EBC3]/40 text-[#C5EBC3] px-6 py-3 rounded-full font-medium transition-all duration-200 inline-flex items-center gap-2 hover:bg-[#C5EBC3]/10"
              >
                <Download className="w-4 h-4" />
                View Resume
              </a>

              <a
                href="https://www.linkedin.com/in/lauxingying"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#C5EBC3]/40 text-[#C5EBC3] px-6 py-3 rounded-full font-medium transition-all duration-200 inline-flex items-center gap-2 hover:bg-[#C5EBC3]/10"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            </div>
          </FadeIn>
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

export default Portfolio;
