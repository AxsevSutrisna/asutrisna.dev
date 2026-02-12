/**
 * Portfolio Domain Model
 * Represents the core business logic for portfolio
 * No framework dependencies
 */

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  link?: string;
  startDate: Date;
  endDate?: Date;
}

export interface PortfolioData {
  items: PortfolioItem[];
  totalItems: number;
  lastUpdated: Date;
}

export class PortfolioError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PortfolioError";
  }
}
