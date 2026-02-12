/**
 * Dependency Injection Configuration
 * Centralizes all adapter/output instantiation
 */

import { portfolioAdapter } from "@/modules/portfolio/infrastructure/portfolio.adapter";
import { projectsAdapter } from "@/modules/projects/infrastructure/projects.adapter";
import { aboutAdapter } from "@/modules/about/infrastructure/about.adapter";
import { blogAdapter } from "@/modules/blog/infrastructure/blog.adapter";

export const outputs = {
  portfolioOutput: portfolioAdapter,
  projectsOutput: projectsAdapter,
  aboutOutput: aboutAdapter,
  blogOutput: blogAdapter,
};
