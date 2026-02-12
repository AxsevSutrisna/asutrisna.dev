/**
 * Projects Use Cases
 */

import { ProjectsData, ProjectsError } from "./projects.model";
import { IProjectsOutput } from "./projects.output";

export const getProjects = async (
  projectsOutput: IProjectsOutput,
  featured?: boolean,
): Promise<ProjectsData> => {
  try {
    const projectsData = await projectsOutput.getProjects(featured);

    if (!projectsData || !projectsData.projects) {
      throw new ProjectsError("Projects data is not available");
    }

    return projectsData;
  } catch (error) {
    if (error instanceof ProjectsError) {
      throw error;
    }
    throw new ProjectsError(
      error instanceof Error ? error.message : "Failed to fetch projects",
    );
  }
};

export const getFeaturedProjects = async (
  projectsOutput: IProjectsOutput,
): Promise<ProjectsData> => {
  return getProjects(projectsOutput, true);
};
