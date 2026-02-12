/**
 * Projects Mapper
 */

import { ProjectsData, Project } from "../domain/projects.model";
import { ProjectView } from "./projects.view.model";

export const mapProjectToView = (project: Project): ProjectView => ({
  id: project.id,
  title: project.title,
  description: project.description,
  longDescription: project.longDescription,
  imageUrl: project.imageUrl,
  technologies: project.technologies,
  gitUrl: project.gitUrl,
  liveUrl: project.liveUrl,
  featured: project.featured,
  createdAt: project.createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
});

export const mapProjectsDataToView = (data: ProjectsData): ProjectView[] => {
  return data.projects.map(mapProjectToView);
};
