/**
 * Projects Application Model
 */

export interface ProjectView {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  technologies: string[];
  gitUrl?: string;
  liveUrl?: string;
  featured: boolean;
  createdAt: string;
}

export interface ProjectsViewState {
  projects: ProjectView[];
  isLoading: boolean;
  error?: string;
}
