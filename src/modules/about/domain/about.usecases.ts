/**
 * About Use Cases
 */

import { AboutContent, AboutError } from "./about.model";
import { IAboutOutput } from "./about.output";

export const getAboutContent = async (
  aboutOutput: IAboutOutput,
): Promise<AboutContent> => {
  try {
    const content = await aboutOutput.getAboutContent();

    if (!content) {
      throw new AboutError("About content is not available");
    }

    return content;
  } catch (error) {
    if (error instanceof AboutError) {
      throw error;
    }
    throw new AboutError(
      error instanceof Error ? error.message : "Failed to fetch about content",
    );
  }
};
