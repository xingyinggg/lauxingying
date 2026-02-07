import React, { useState } from "react";
import { ExternalLink, Github, Filter } from "lucide-react";
import projects from "./data/projects";

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  // Using your actual projects data


  const filters = ['All', 'Web App', 'Data Analytics', 'Hackathon', 'Mobile App Design'];
  
  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  // const getStatusColor = (status) => {
  //   switch(status) {
  //     case 'Live': return 'bg-[#C5EBC3]';
  //     case 'Award Winner': return 'bg-[#C5EBC3]';
  //     case 'Prototype': return 'bg-[#B7C8B5]';
  //     case 'In Development': return 'bg-[#B7C8B5]';
  //     default: return 'bg-[#403D39]';
  //   }
  // };

  // const getCategoryIcon = (type) => {
  //   switch(type) {
  //     case 'Full-Stack': return <Code className="w-4 h-4" />;
  //     case 'UI/UX Design': return <Palette className="w-4 h-4" />;
  //     case 'Mobile App': return <Globe className="w-4 h-4" />;
  //     default: return <Code className="w-4 h-4" />;
  //   }
  // };

  return (
    <div className="min-h-screen bg-[#252422] text-white">
      {/* Header */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 mb=10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-5">
            <h1 className="text-5xl font-bold mb-6">
              <span className="text-[#C5EBC3]">My Projects</span>
            </h1>
            <div className="w-20 h-1 bg-white mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-white max-w-3xl mx-auto">
              A collection of my work spanning full-stack development, data analytics, hackathon achievements and product design.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Icon */}
            <Filter className="w-6 h-6 text-[#B7C8B5]" />

            {/* Buttons */}
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl border-2 ${
                  activeFilter === filter
                    ? "bg-[#C5EBC3] text-[#252422] border-[#6F7E6D] shadow-lg"
                    : "bg-transparent text-[#C5EBC3] border-[#C5EBC3] hover:bg-[#6F7E6D] hover:text-[#252422] hover:border-[#B7C8B5]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {filteredProjects.map((project, index) => (
              <div
                key={index}
                className={`group bg-[#403D39] rounded-2xl overflow-hidden border border-[#B7C8B5] hover:border-[#C5EBC3] hover:scale-105 transition-all duration-300 animate-slideInUp stagger-${index + 1}`}
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

                  <p className="text-white group-hover:text-[#C5EBC3] mb-4">
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

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <div className="text-[#B7C8B5] text-lg mb-4">No projects found in this category</div>
              <button
                onClick={() => setActiveFilter('All')}
                className="text-[#C5EBC3] hover:text-[#B7C8B5] font-medium"
              >
                View All Projects
              </button>
            </div>
          )}

          {/* Back to Home */}
            <div className="text-center mt-20">
            <a
              href="/"
              className="group inline-flex items-center space-x-3 bg-[#C5EBC3] hover:bg-[#6F7E6D] text-[#252422] px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-[#B7C8B5] animate-bounce"
            >
              <span className="transform group-hover:-translate-x-1 transition-transform duration-300 text-xl">←</span>
              <span>Back to Home</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;