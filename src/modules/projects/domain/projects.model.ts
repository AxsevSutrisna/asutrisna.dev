/**
 * Projects Domain Model
 */

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  technologies: string[];
  gitUrl?: string;
  liveUrl?: string;
  featured: boolean;
  createdAt: Date;
}

export interface ProjectsData {
  projects: Project[];
  totalProjects: number;
  featuredCount: number;
}

export class ProjectsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProjectsError";
  }
}
