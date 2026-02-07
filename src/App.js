import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { TypeAnimation } from "react-type-animation";
import allProjects from "./data/projects";
import profileImg from "./assets/me.png";
import about1Img from "./assets/about1.png";
import about2Img from "./assets/about2.png";
import about3Img from "./assets/about3.png";
import about4Img from "./assets/about4.png";

const Portfolio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Featured projects - using your actual projects with achievements highlighted
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

  return (
    <div className="min-h-screen bg-[#252422] text-white overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#C5EBC3] rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        @keyframes slideInLeft {
          from {
            transform: translateX(-100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideInUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes bounce {
          0%,
          20%,
          53%,
          80%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          40%,
          43% {
            transform: translate3d(0, -15px, 0);
          }
          70% {
            transform: translate3d(0, -7px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out forwards;
        }
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out forwards;
        }
        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.6s ease-out forwards;
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        .animate-pulse-custom {
          animation: pulse 2s infinite;
        }
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
        .stagger-1 {
          animation-delay: 0.1s;
        }
        .stagger-2 {
          animation-delay: 0.2s;
        }
        .stagger-3 {
          animation-delay: 0.3s;
        }
        .stagger-4 {
          animation-delay: 0.4s;
        }
        .stagger-5 {
          animation-delay: 0.5s;
        }
        .stagger-6 {
          animation-delay: 0.6s;
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#252422]/90 backdrop-blur-md border-b border-[#403D39] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 animate-slideInLeft">
              <div className="w-10 h-10 bg-[#C5EBC3] rounded-xl flex items-center justify-center hover:rotate-180 transition-transform duration-500">
                <span className="text-[#252422] font-bold">XY</span>
              </div>
              <span className="font-semibold text-xl">Xing Ying</span>
            </div>

            <div className="hidden md:flex space-x-8 animate-slideInRight">
              {[
                "Home",
                "About",
                "Skills",
                "Experience",
                "Projects",
                "Contact",
              ].map((item, index) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="hover:text-[#C5EBC3] transition-all duration-300 relative group transform hover:scale-110"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C5EBC3] transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>

            <button
              className="md:hidden transform hover:scale-110 transition-transform duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 animate-spin" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#252422]/95 backdrop-blur-md border-t border-[#403D39] animate-slideInUp">
            <div className="px-4 py-4 space-y-3">
              {[
                "Home",
                "About",
                "Skills",
                "Experience",
                "Projects",
                "Contact",
              ].map((item, index) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`block py-2 hover:text-[#C5EBC3] transition-colors transform hover:translate-x-2 animate-slideInLeft stagger-${
                    index + 1
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

      {/* Hero Section */}
      <section
        id="home"
        className="pt-20 min-h-screen flex items-center relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10 mt-10">
          <div className="space-y-6">
            {/* Status Badge */}
            <div className="inline-flex items-center space-x-2 bg-[#403D39] text-[#C5EBC3] px-4 py-2 rounded-full animate-bounce">
              <div className="w-2 h-2 bg-[#C5EBC3] rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                Open to opportunities for Summer 2026
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-2">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight animate-slideInLeft">
                Hi, I'm{" "}
                <span className="text-[#C5EBC3] animate-pulse-custom">
                  Xing Ying
                </span>
              </h1>

              <div className="text-3xl lg:text-4xl font-semibold text-gray-300 animate-slideInLeft stagger-1">
                I am a{" "}
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
                    "Student",
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                  className="text-[#C5EBC3]"
                />
              </div>

              <p className="text-xl text-white max-w-lg animate-slideInLeft stagger-2">
                Year 3 Information Systems student at SMU who loves turning
                ideas into real products.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-row flex-wrap gap-3 animate-slideInLeft stagger-3">
              <a
                href="#projects"
                className="bg-[#C5EBC3] hover:bg-[#6F7E6D] text-[#252422] px-5 sm:px-8 py-3 sm:py-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center space-x-2 group transform hover:scale-105 hover:shadow-lg"
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="https://drive.google.com/file/d/13pi_zOcRKnbBd5hjeRI7sq6k-KP00VLi/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-[#C5EBC3] hover:bg-[#6F7E6D] hover:text-[#252422] px-5 sm:px-8 py-3 sm:py-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center space-x-2 group transform hover:scale-105"
              >
                <Download className="w-4 h-4 group-hover:animate-bounce" />
                <span>View Resume</span>
              </a>
            </div>

            {/* Location */}
            <div className="flex items-center space-x-2 text-white animate-slideInLeft stagger-4">
              <MapPin className="w-4 h-4 animate-pulse" />
              <span>Singapore</span>
            </div>
          </div>

          {/* Profile Image with Floating Elements */}
          <div className="relative animate-slideInRight mb-8">
            <div className="w-80 h-80 lg:w-96 lg:h-96 mx-auto relative">
              <div className="w-full h-full bg-[#403D39] rounded-3xl border-2 border-[#B7C8B5] overflow-hidden transform hover:scale-105 transition-all duration-500 animate-pulse-custom">
                <img
                  src={profileImg}
                  alt="Xing Ying"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#C5EBC3] rounded-full animate-bounce"></div>
            <div
              className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#B7C8B5] rounded-full animate-bounce"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute top-1/2 -left-8 w-4 h-4 bg-[#C5EBC3] rounded-full animate-bounce"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-[#403D39]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-4xl font-bold mb-4">About Me</h2>
            <div className="w-20 h-1 bg-[#C5EBC3] mx-auto rounded-full animate-pulse"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-slideInLeft">
              <p className="text-lg text-gray-300 leading-relaxed">
                I enjoy building things that are actually useful. Whether I'm
                coding full-stack apps or shaping product strategy, I'm most
                excited when technology solves real problems and creates impact.
              </p>

              <p className="text-lg text-gray-300 leading-relaxed">
                Right now, I'm working on projects that sit between engineering
                and product, where I get to think about users, constraints and
                trade-offs. I believe great products come from balancing what's
                technically possible with what users truly need.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 animate-slideInRight">
              <div className="space-y-4">
                <img
                  src={about1Img}
                  alt="Team collaboration"
                  className="h-36 w-full object-cover rounded-xl hover:scale-105 transition-transform duration-300 border border-[#B7C8B5] animate-scaleIn"
                />
                <img
                  src={about2Img}
                  alt="Formal"
                  className="h-46 w-full object-cover rounded-xl hover:scale-105 transition-transform duration-300 border border-[#B7C8B5] animate-scaleIn stagger-1"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img
                  src={about3Img}
                  alt="Representing Ellipsis"
                  className="h-46 w-full object-cover rounded-xl hover:scale-105 transition-transform duration-300 border border-[#B7C8B5] animate-scaleIn stagger-2"
                />
                <img
                  src={about4Img}
                  alt="Participating"
                  className="h-36 w-full object-cover rounded-xl hover:scale-105 transition-transform duration-300 border border-[#B7C8B5] animate-scaleIn stagger-3"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-[#252422]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-4xl font-bold mb-4">Skills & Expertise</h2>
            <div className="w-20 h-1 bg-[#C5EBC3] mx-auto rounded-full animate-pulse"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(skills).map(([category, skillList], index) => (
              <div
                key={category}
                className={`bg-[#403D39] rounded-2xl p-8 border border-[#B7C8B5] hover:border-[#C5EBC3] transition-all duration-300 transform hover:scale-105 hover:shadow-xl animate-slideInUp stagger-${
                  index + 1
                }`}
              >
                <h3 className="text-xl font-semibold mb-6 text-[#C5EBC3] flex items-center">
                  {category}
                </h3>
                <div className="space-y-3">
                  {skillList.map((skill, skillIndex) => (
                    <div
                      key={skill}
                      className={`flex items-center space-x-3 animate-slideInLeft`}
                      style={{ animationDelay: `${skillIndex * 0.1}s` }}
                    >
                      <div
                        className="w-2 h-2 bg-[#C5EBC3] rounded-full animate-pulse"
                        style={{ animationDelay: `${skillIndex * 0.2}s` }}
                      ></div>
                      <span className="text-gray-300 hover:text-white transition-colors">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 bg-[#403D39]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-4xl font-bold mb-4">Experience</h2>
            <div className="w-20 h-1 bg-[#C5EBC3] mx-auto rounded-full animate-pulse"></div>
          </div>

          <div className="space-y-8">
            <div className="bg-[#252422] rounded-2xl p-8 border border-[#B7C8B5] hover:border-[#C5EBC3] transition-all duration-300 transform hover:scale-105 animate-slideInLeft">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#C5EBC3] rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse-custom">
                  <Code className="w-6 h-6 text-[#252422]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    Full-Stack Web Developer Intern
                  </h3>
                  <p className="text-[#C5EBC3] mb-3">
                    MindFlex Education • May 2025 - Oct 2025
                  </p>
                  <p className="text-gray-300">
                    Led the development and rollout of a premium tutor mobile
                    app using React Native & Expo. Managed repository routing,
                    UAT setup, and coordinated App Store release process.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#252422] rounded-2xl p-8 border border-[#B7C8B5] hover:border-[#C5EBC3] transition-all duration-300 transform hover:scale-105 animate-slideInRight">
              <div className="flex items-start space-x-4">
                <div
                  className="w-12 h-12 bg-[#B7C8B5] rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse-custom"
                  style={{ animationDelay: "0.5s" }}
                >
                  <Users className="w-6 h-6 text-[#252422]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Vice President</h3>
                  <p className="text-[#B7C8B5] mb-3">
                    SMU Ellipsis • 2024 – Present
                  </p>
                  <p className="text-gray-300">
                    Oversee 45 student council members and organize tech events,
                    networking nights, and welfare drives for the School of
                    Computing and Information Systems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-[#252422]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
            <div className="w-20 h-1 bg-[#C5EBC3] mx-auto rounded-full animate-pulse"></div>
            <p className="text-[#B7C8B5] max-w-2xl mx-auto mt-4">
              A showcase of my work in product development, software
              engineering, and hackathon achievements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <div
                key={index}
                className={`group bg-[#403D39] rounded-2xl overflow-hidden border border-[#B7C8B5] hover:border-[#C5EBC3] hover:transform hover:scale-105 transition-all duration-300 animate-slideInUp stagger-${
                  index + 1
                }`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {project.achievement && (
                    <div className="absolute top-4 right-4 bg-[#B7C8B5] text-[#252422] px-3 py-1 rounded-full text-xs font-medium animate-bounce">
                      {project.achievement}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="text-white group-hover:text-[#C5EBC3] text-sm font-medium mb-2">
                    {project.category}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#C5EBC3] group-hover:text-white transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-white group-hover:text-[#C5EBC3] mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="text-xs bg-[#252422] px-3 py-1 rounded-full border border-[#B7C8B5] hover:border-[#C5EBC3] transition-colors animate-fadeIn"
                        style={{ animationDelay: `${techIndex * 0.1}s` }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-4 flex-wrap">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        className="flex items-center space-x-2 text-white group-hover:text-[#C5EBC3] transition-colors transform hover:scale-110"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-sm font-medium">Live Demo</span>
                      </a>
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        className="flex items-center space-x-2 text-white group-hover:text-[#C5EBC3] transition-colors transform hover:scale-110"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="w-4 h-4" />
                        <span className="text-sm font-medium">Code</span>
                      </a>
                    )}

                    {project.figmaUrl && (
                      <a
                        href={project.figmaUrl}
                        className="flex items-center space-x-2 text-white group-hover:text-[#C5EBC3] transition-colors transform hover:scale-110"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-sm font-medium">Figma</span>
                      </a>
                    )}

                    {project.demoVideo && (
                      <a
                        href={project.demoVideo}
                        className="flex items-center space-x-2 text-white group-hover:text-[#C5EBC3] transition-colors transform hover:scale-110"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-sm font-medium">Demo Video</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 animate-fadeIn">
            <a
              href="/projects"
              className="bg-[#C5EBC3] hover:bg-[#6F7E6D] text-[#252422] group-hover:text-[#C5EBC3] font-medium px-8 py-4 rounded-full transition-all duration-300 inline-flex items-center space-x-2 transform hover:scale-105 hover:shadow-lg"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[#403D39]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4 animate-slideInUp">
            Let's Build Something Together
          </h2>
          <div className="w-20 h-1 bg-[#C5EBC3] mx-auto rounded-full mb-8 animate-pulse"></div>
          <p className="text-[#B7C8B5] mb-12 max-w-2xl mx-auto text-lg animate-slideInUp stagger-1">
            Looking for a driven intern to kickstart your next project? Let's
            connect and explore how we can create impact together.
          </p>

          {/* Contact */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-12 px-4">
            <a
              href="mailto:xingyinglau.2023@scis.smu.edu.sg"
              className="bg-[#C5EBC3] hover:bg-[#6F7E6D] text-[#252422] px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium transition-all duration-300 inline-flex items-center justify-center space-x-2 transform hover:scale-105 animate-slideInUp stagger-2"
            >
              <Mail className="w-4 h-4 animate-bounce" />
              <span>Get In Touch</span>
            </a>

            <div className="flex flex-row gap-3 sm:gap-4 animate-slideInUp stagger-4">
              <a
                href="https://drive.google.com/file/d/181aJVQ1i7WbHmFfN_Bhzj1YqoEIvruPB/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-[#C5EBC3] hover:bg-[#6F7E6D] hover:text-[#252422] text-[#C5EBC3] px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium transition-all duration-300 inline-flex items-center justify-center space-x-2 transform hover:scale-105"
              >
                <Download className="w-4 h-4 animate-bounce" />
                <span>View Resume</span>
              </a>

              <a
                href="https://www.linkedin.com/in/lauxingying"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-[#C5EBC3] hover:bg-[#6F7E6D] hover:text-[#252422] text-[#C5EBC3] px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium transition-all duration-300 inline-flex items-center justify-center space-x-2 transform hover:scale-105"
              >
                <Linkedin className="w-4 h-4 animate-bounce" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[#403D39] bg-[#252422]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[#B7C8B5] animate-fadeIn">
          <p>
            &copy; 2026 Xing Ying. Crafted with React, Tailwind, and lots of
            coffee
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
