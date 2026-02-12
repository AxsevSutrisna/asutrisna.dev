/**
 * Projects Output Port (Secondary Port)
 */

import { ProjectsData } from "./projects.model";

export interface IProjectsOutput {
  getProjects(featured?: boolean): Promise<ProjectsData>;
}
