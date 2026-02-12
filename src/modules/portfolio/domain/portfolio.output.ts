/**
 * Portfolio Output Port (Secondary Port)
 * Defines the contract for portfolio data sources
 */

import { PortfolioData } from "./portfolio.model";

export interface IPortfolioOutput {
  getPortfolioItems(): Promise<PortfolioData>;
}
