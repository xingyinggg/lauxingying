import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Code,
  Handshake,
  Users,
  MapPin,
  Mail,
  Github,
  Linkedin,
  ExternalLink,
  ArrowRight,
  Download,
} from "lucide-react";
import { TypeAnimation } from "react-type-animation";
import Tilt from "./components/Tilt";
import allProjects from "./data/projects";
import profileImg from "./assets/me.png";
import about1Img from "./assets/about1.png";
import about2Img from "./assets/about2.png";
import about3Img from "./assets/about3.png";
import about4Img from "./assets/about4.jpg";

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
      { threshold: 0.15 },
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
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);

  const handleHeroMove = (e) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

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
      setScrolled(window.scrollY > 10);
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
    <div className="min-h-screen bg-[#1a1916] text-[#e8e6e3] selection:bg-[#C5EBC3]/30 selection:text-white overflow-x-hidden">
      {/* ── Ambient 3D background ── */}
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none z-0"
        aria-hidden="true"
      >
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#C5EBC3]/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-[#C5EBC3]/[0.07] rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#C5EBC3]/[0.06] rounded-full blur-3xl animate-float-delay" />
      </div>

      <div className="relative z-10">
        {/* ── Navigation ── */}
        <nav
          className={`fixed top-0 w-full z-50 bg-[#1a1916]/80 backdrop-blur-lg border-b transition-shadow duration-300 ${
            scrolled
              ? "border-white/10 shadow-lg shadow-black/20"
              : "border-white/5"
          }`}
        >
          <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <a href="#home" className="flex items-center gap-3 group">
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
          ref={heroRef}
          onMouseMove={handleHeroMove}
          className="snap-section relative pt-16 pb-12 lg:pb-0 lg:min-h-screen lg:h-screen flex items-center overflow-hidden"
        >
          <div
            className="pointer-events-none absolute inset-0 hidden md:block transition-opacity duration-300"
            style={{
              background:
                "radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), rgba(197,235,195,0.08), transparent 40%)",
            }}
            aria-hidden="true"
          />
          <div className="max-w-6xl mx-auto px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-5 gap-6 lg:gap-12 items-center">
              {/* Text — takes 3 of 5 cols */}
              <div className="lg:col-span-3 flex flex-col gap-4 sm:gap-5">
                {/* Badge */}
                <div className="inline-flex items-start gap-2.5 bg-[#C5EBC3]/10 border border-[#C5EBC3]/20 text-[#C5EBC3] px-4 py-2.5 rounded-2xl lg:rounded-full w-fit max-w-full mt-4 lg:mt-0">
                  <span className="relative flex h-2 w-2 mt-1.5 flex-shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5EBC3] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5EBC3]"></span>
                  </span>
                  <span className="text-sm font-medium leading-snug">
                    Open to opportunities for Fall 2026 & Spring 2027
                    (Internship), and Full-Time Roles (July 2027)
                  </span>
                </div>

                {/* Heading */}
                <div className="flex flex-col gap-2">
                  <h1 className="text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-balance">
                    Hi, I'm{" "}
                    <span className="bg-gradient-to-r from-[#C5EBC3] to-[#8fd6ba] bg-clip-text text-transparent">
                      Xing Ying
                    </span>
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
                  Year 4 Information Systems student at SMU who loves turning
                  ideas into real products.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href="#projects"
                    className="bg-[#C5EBC3] text-[#1a1916] px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center gap-2 hover:brightness-90 hover:shadow-lg hover:shadow-[#C5EBC3]/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                  >
                    View My Work
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    href="https://drive.google.com/file/d/1rwB04lMOs_L3CRjn29yunLOj_LMY152E/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-[#C5EBC3]/40 text-[#C5EBC3] px-6 py-3 rounded-full font-medium transition-all duration-200 flex items-center gap-2 hover:bg-[#C5EBC3]/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                  >
                    <Download className="w-4 h-4" />
                    View Resume
                  </a>
                </div>

                <div className="flex items-center gap-2 text-[#a8a29e] text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>Singapore</span>
                </div>
              </div>

              {/* Profile Image — takes 2 of 5 cols */}
              <div className="lg:col-span-2 flex justify-center lg:justify-end">
                <div className="animate-float-slow">
                  <Tilt
                    className="w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72"
                    max={12}
                    scale={1.03}
                  >
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-[#C5EBC3]/30 to-[#C5EBC3]/5 rounded-3xl rotate-6"
                      style={{ transform: "translateZ(-40px) rotate(6deg)" }}
                    ></div>
                    <div
                      className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-[#C5EBC3]/20 shadow-2xl shadow-black/40"
                      style={{ transform: "translateZ(20px)" }}
                    >
                      <img
                        src={profileImg}
                        alt="Xing Ying"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Tilt>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── About Section ── */}
        <section
          id="about"
          className="snap-section scroll-mt-16 py-16 lg:py-0 lg:h-screen lg:flex lg:flex-col lg:justify-center lg:overflow-y-auto"
        >
          <div className="max-w-6xl mx-auto px-6 lg:px-8 w-full">
            <FadeIn>
              <div className="flex items-center gap-4 mb-5">
                <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
                  About Me
                </h2>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>
            </FadeIn>

            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <FadeIn delay={100}>
                <div className="flex flex-col gap-3">
                  <p className="text-base lg:text-lg text-[#a8a29e] leading-relaxed">
                    I enjoy building things that are actually useful. Whether
                    I'm coding full-stack apps or shaping product strategy, I'm
                    most excited when technology solves real problems and
                    creates impact.
                  </p>

                  <p className="text-base lg:text-lg text-[#a8a29e] leading-relaxed">
                    Right now, I'm working on projects that sit between AI and
                    product, where I get to think about users, constraints and
                    trade-offs. I believe great products come from balancing
                    what's technically possible with what users truly need.
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={200}>
                <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto lg:mx-0 lg:ml-auto">
                  <div className="flex flex-col gap-2">
                    <img
                      src={about1Img}
                      alt="Team collaboration"
                      className="aspect-square w-full object-cover rounded-2xl hover:scale-[1.02] transition-transform duration-300"
                    />
                    <img
                      src={about2Img}
                      alt="Formal"
                      className="aspect-square w-full object-cover rounded-2xl hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                  <div className="flex flex-col gap-2 pt-4">
                    <img
                      src={about3Img}
                      alt="Representing Ellipsis"
                      className="aspect-square w-full object-cover rounded-2xl hover:scale-[1.02] transition-transform duration-300"
                    />
                    <img
                      src={about4Img}
                      alt="Participating"
                      className="aspect-square w-full object-cover rounded-2xl hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ── Skills Section ── */}
        <section
          id="skills"
          className="snap-section scroll-mt-16 py-16 lg:py-0 lg:h-screen lg:flex lg:flex-col lg:justify-center lg:overflow-y-auto bg-[#1f1d1a]"
        >
          <div className="max-w-6xl mx-auto px-6 lg:px-8 w-full">
            <FadeIn>
              <div className="flex items-center gap-4 mb-5">
                <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
                  Skills & Expertise
                </h2>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>
            </FadeIn>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {Object.entries(skills).map(([category, skillList], index) => (
                <FadeIn key={category} delay={index * 80}>
                  <Tilt
                    max={6}
                    scale={1.01}
                    className="bg-[#252320] rounded-xl p-5 border border-white/5 hover:border-[#C5EBC3]/20 transition-colors duration-300"
                  >
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-[#C5EBC3] mb-4">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skillList.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs text-[#a8a29e] bg-white/5 px-2.5 py-1.5 rounded-md hover:bg-[#C5EBC3]/10 hover:text-[#C5EBC3] transition-colors duration-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </Tilt>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── Experience Section ── */}
        <section
          id="experience"
          className="snap-section scroll-mt-16 py-16 lg:py-0 lg:h-screen lg:flex lg:flex-col lg:justify-center lg:overflow-y-auto"
        >
          <div className="max-w-6xl mx-auto px-6 lg:px-8 w-full">
            <FadeIn>
              <div className="flex items-center gap-4 mb-5">
                <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
                  Experience
                </h2>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>
            </FadeIn>

            <div className="flex flex-col gap-3">
              <FadeIn delay={100}>
                <Tilt
                  max={3}
                  scale={1.005}
                  glare={false}
                  className="group grid lg:grid-cols-[160px_1fr] gap-2 lg:gap-6 p-4 rounded-xl border border-white/5 hover:border-[#C5EBC3]/20 hover:bg-white/[0.02] transition-colors duration-300"
                >
                  <div className="text-sm text-[#a8a29e] font-medium pt-1">
                    May 2026 — Aug 2026
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[#C5EBC3]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Handshake className="w-4 h-4 text-[#C5EBC3]" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-[#e8e6e3] group-hover:text-[#C5EBC3] transition-colors">
                          Business Product Management Intern
                        </h3>
                        <p className="text-[#C5EBC3] text-sm font-medium">
                          Shopee
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-[#a8a29e] leading-relaxed">
                      Supported end-to-end product lifecycle across
                      cross-functional teams including requirement gathering,
                      KPI tracking, feature rollout support and iterative
                      product improvement
                    </p>
                  </div>
                </Tilt>
              </FadeIn>
              {/* Experience 1 */}
              <FadeIn delay={100}>
                <Tilt
                  max={3}
                  scale={1.005}
                  glare={false}
                  className="group grid lg:grid-cols-[160px_1fr] gap-2 lg:gap-6 p-4 rounded-xl border border-white/5 hover:border-[#C5EBC3]/20 hover:bg-white/[0.02] transition-colors duration-300"
                >
                  <div className="text-sm text-[#a8a29e] font-medium pt-1">
                    May 2025 — Oct 2025
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[#C5EBC3]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Code className="w-4 h-4 text-[#C5EBC3]" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-[#e8e6e3] group-hover:text-[#C5EBC3] transition-colors">
                          Full-Stack Web Developer Intern
                        </h3>
                        <p className="text-[#C5EBC3] text-sm font-medium">
                          MindFlex Education
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-[#a8a29e] leading-relaxed">
                      Led the development and rollout of a premium tutor mobile
                      app using React Native & Expo. Managed repository routing,
                      UAT setup, and coordinated App Store release process.
                    </p>
                  </div>
                </Tilt>
              </FadeIn>

              {/* Experience 2 */}
              <FadeIn delay={200}>
                <Tilt
                  max={3}
                  scale={1.005}
                  glare={false}
                  className="group grid lg:grid-cols-[160px_1fr] gap-2 lg:gap-6 p-4 rounded-xl border border-white/5 hover:border-[#C5EBC3]/20 hover:bg-white/[0.02] transition-colors duration-300"
                >
                  <div className="text-sm text-[#a8a29e] font-medium pt-1">
                    2024 — 2025
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[#C5EBC3]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-4 h-4 text-[#C5EBC3]" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-[#e8e6e3] group-hover:text-[#C5EBC3] transition-colors">
                          Vice President
                        </h3>
                        <p className="text-[#C5EBC3] text-sm font-medium">
                          SMU Ellipsis
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-[#a8a29e] leading-relaxed">
                      Oversee 45 student council members and organize tech
                      events, networking nights, and welfare drives for the
                      School of Computing and Information Systems.
                    </p>
                  </div>
                </Tilt>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ── Projects Section ── */}
        <section
          id="projects"
          className="snap-section scroll-mt-16 py-16 lg:py-0 lg:h-screen lg:flex lg:flex-col lg:justify-center lg:overflow-y-auto bg-[#1f1d1a]"
        >
          <div className="max-w-6xl mx-auto px-6 lg:px-8 w-full">
            <FadeIn>
              <div className="flex items-center gap-4 mb-2">
                <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
                  Featured Projects
                </h2>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>
              <p className="text-base text-[#a8a29e] mb-4">
                A showcase of my work in product development, software
                engineering, and hackathon achievements.
              </p>
            </FadeIn>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredProjects.map((project, index) => (
                <FadeIn key={index} delay={index * 100}>
                  <Tilt
                    max={8}
                    scale={1.02}
                    className="group flex flex-col bg-[#252320] rounded-xl overflow-hidden border border-white/5 hover:border-[#C5EBC3]/20 transition-colors duration-300 h-full"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-24 lg:h-28 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {project.achievement && (
                        <div
                          className="absolute top-2 right-2 bg-[#C5EBC3] text-[#1a1916] px-2.5 py-1 rounded-full text-xs font-semibold shadow-lg"
                          style={{ transform: "translateZ(40px)" }}
                        >
                          {project.achievement}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-3 gap-1.5">
                      <div className="text-xs font-medium uppercase tracking-wider text-[#C5EBC3]">
                        {project.category}
                      </div>
                      <h3 className="text-base font-semibold text-[#e8e6e3]">
                        {project.title}
                      </h3>
                      <p className="text-sm text-[#a8a29e] leading-relaxed flex-1 line-clamp-2">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {project.tech.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="text-xs text-[#a8a29e] bg-white/5 px-2 py-1 rounded-md"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-3 pt-1 mt-auto">
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
                  </Tilt>
                </FadeIn>
              ))}
            </div>

            <FadeIn delay={400}>
              <div className="text-center mt-3">
                <a
                  href="/projects"
                  className="inline-flex items-center gap-2 bg-[#C5EBC3] text-[#1a1916] font-medium text-sm px-6 py-3 rounded-full transition-all duration-200 hover:brightness-90 hover:shadow-lg hover:shadow-[#C5EBC3]/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                >
                  View All Projects
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── Contact Section ── */}
        <section
          id="contact"
          className="snap-section scroll-mt-16 py-16 lg:py-0 lg:h-screen lg:flex lg:flex-col lg:justify-center lg:overflow-y-auto"
        >
          <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center w-full">
            <FadeIn>
              <p className="text-sm font-medium uppercase tracking-wider text-[#C5EBC3] mb-3">
                Get in Touch
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4 text-balance">
                Let's Build Something Together
              </h2>
              <p className="text-base text-[#a8a29e] mb-8 max-w-xl mx-auto leading-relaxed">
                Looking for a driven member to kickstart your next project?
                Let's connect and explore how we can create impact together.
              </p>
            </FadeIn>

            <FadeIn delay={150}>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <a
                  href="mailto:xingyinglau.2023@scis.smu.edu.sg"
                  className="bg-[#C5EBC3] text-[#1a1916] px-6 py-3 rounded-full font-medium text-sm transition-all duration-200 inline-flex items-center gap-2 hover:brightness-90 hover:shadow-lg hover:shadow-[#C5EBC3]/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                >
                  <Mail className="w-4 h-4" />
                  Get In Touch
                </a>

                <a
                  href="https://drive.google.com/file/d/1rwB04lMOs_L3CRjn29yunLOj_LMY152E/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-[#C5EBC3]/40 text-[#C5EBC3] px-6 py-3 rounded-full font-medium text-sm transition-all duration-200 inline-flex items-center gap-2 hover:bg-[#C5EBC3]/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  View Resume
                </a>

                <a
                  href="https://www.linkedin.com/in/lauxingying"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-[#C5EBC3]/40 text-[#C5EBC3] px-6 py-3 rounded-full font-medium text-sm transition-all duration-200 inline-flex items-center gap-2 hover:bg-[#C5EBC3]/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
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
    </div>
  );
};

export default Portfolio;
