/**
 * Portfolio Use Cases
 * Implements business logic without framework dependencies
 */

import { PortfolioData, PortfolioError } from "./portfolio.model";
import { IPortfolioOutput } from "./portfolio.output";

export const getPortfolioItems = async (
  portfolioOutput: IPortfolioOutput,
): Promise<PortfolioData> => {
  try {
    const portfolioData = await portfolioOutput.getPortfolioItems();

    if (!portfolioData || !portfolioData.items) {
      throw new PortfolioError("Portfolio data is not available");
    }

    return portfolioData;
  } catch (error) {
    if (error instanceof PortfolioError) {
      throw error;
    }
    throw new PortfolioError(
      error instanceof Error
        ? error.message
        : "Failed to fetch portfolio items",
    );
  }
};
