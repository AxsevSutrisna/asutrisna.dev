/**
 * Projects Local Storage Adapter (Secondary Adapter)
 */

import { IProjectsOutput } from "../domain/projects.output";
import { ProjectsData, Project } from "../domain/projects.model";

const STORAGE_KEY = "projects";

const mockProjects: Project[] = [
  {
    id: "1",
    title: "Personal Portfolio Site",
    description: "Modern portfolio website with clean architecture",
    longDescription:
      "A fully responsive portfolio website built with Next.js and TypeScript, showcasing clean architecture principles in a frontend project.",
    imageUrl: "/images/projects/portfolio.jpg",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "React"],
    liveUrl: "https://asutrisna.dev",
    gitUrl: "https://github.com/asutrisna/asutrisna.dev",
    featured: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Task Management App",
    description: "Collaborative task management with real-time features",
    longDescription:
      "A full-featured task management application with real-time collaboration, priority management, and team integration.",
    imageUrl: "/images/projects/taskapp.jpg",
    technologies: ["React", "Firebase", "Tailwind CSS"],
    liveUrl: "https://taskapp.example.com",
    gitUrl: "https://github.com/asutrisna/taskapp",
    featured: true,
    createdAt: new Date("2023-10-20"),
  },
  {
    id: "3",
    title: "API Documentation Generator",
    description: "Automated API documentation from code",
    longDescription:
      "Tool that automatically generates comprehensive API documentation from source code comments and type definitions.",
    imageUrl: "/images/projects/apidoc.jpg",
    technologies: ["Node.js", "TypeScript", "Express"],
    gitUrl: "https://github.com/asutrisna/api-doc-generator",
    featured: false,
    createdAt: new Date("2023-08-10"),
  },
];

export class ProjectsLocalStorageAdapter implements IProjectsOutput {
  async getProjects(featured?: boolean): Promise<ProjectsData> {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const projects = JSON.parse(stored);
          const filtered = featured
            ? projects.filter((p: Project) => p.featured)
            : projects;
          return {
            projects: filtered,
            totalProjects: projects.length,
            featuredCount: projects.filter((p: Project) => p.featured).length,
          };
        }
      }

      const filtered = featured
        ? mockProjects.filter((p) => p.featured)
        : mockProjects;
      return {
        projects: filtered,
        totalProjects: mockProjects.length,
        featuredCount: mockProjects.filter((p) => p.featured).length,
      };
    } catch {
      const filtered = featured
        ? mockProjects.filter((p) => p.featured)
        : mockProjects;
      return {
        projects: filtered,
        totalProjects: mockProjects.length,
        featuredCount: mockProjects.filter((p) => p.featured).length,
      };
    }
  }

  setProjects(projects: Project[]): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }
  }
}

export const projectsAdapter = new ProjectsLocalStorageAdapter();
