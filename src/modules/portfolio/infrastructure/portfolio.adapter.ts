/**
 * Portfolio Local Storage Adapter (Secondary Adapter)
 * Implements IPortfolioOutput using localStorage
 */

import { IPortfolioOutput } from "../domain/portfolio.output";
import { PortfolioData, PortfolioItem } from "../domain/portfolio.model";

const STORAGE_KEY = "portfolio_items";

const mockPortfolioData: PortfolioItem[] = [
  {
    id: "1",
    title: "E-commerce Platform",
    description: "Full-stack e-commerce platform with Next.js and Node.js",
    imageUrl: "/images/portfolio/ecommerce.jpg",
    technologies: ["Next.js", "React", "Node.js", "MongoDB", "TypeScript"],
    link: "https://example.com/ecommerce",
    startDate: new Date("2023-01-01"),
    endDate: new Date("2023-06-30"),
  },
  {
    id: "2",
    title: "Task Management App",
    description:
      "Collaborative task management application with real-time updates",
    imageUrl: "/images/portfolio/taskapp.jpg",
    technologies: ["React", "Firebase", "Tailwind CSS", "TypeScript"],
    link: "https://example.com/taskapp",
    startDate: new Date("2023-07-01"),
    endDate: new Date("2024-01-31"),
  },
];

export class PortfolioLocalStorageAdapter implements IPortfolioOutput {
  async getPortfolioItems(): Promise<PortfolioData> {
    try {
      // Try to get from localStorage (browser environment)
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const items = JSON.parse(stored);
          return {
            items,
            totalItems: items.length,
            lastUpdated: new Date(),
          };
        }
      }

      // Return mock data as default
      return {
        items: mockPortfolioData,
        totalItems: mockPortfolioData.length,
        lastUpdated: new Date(),
      };
    } catch (error) {
      // Return mock data if localStorage fails
      return {
        items: mockPortfolioData,
        totalItems: mockPortfolioData.length,
        lastUpdated: new Date(),
      };
    }
  }

  setPortfolioItems(items: PortfolioItem[]): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }
}

export const portfolioAdapter = new PortfolioLocalStorageAdapter();
