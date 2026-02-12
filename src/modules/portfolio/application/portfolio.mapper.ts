/**
 * Portfolio Mapper
 * Converts domain models to application view models
 */

import { PortfolioData, PortfolioItem } from "../domain/portfolio.model";
import { PortfolioItemView } from "./portfolio.view.model";

export const mapPortfolioItemToView = (
  item: PortfolioItem,
): PortfolioItemView => ({
  id: item.id,
  title: item.title,
  description: item.description,
  imageUrl: item.imageUrl,
  technologies: item.technologies,
  link: item.link,
  startDate: item.startDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  }),
  endDate: item.endDate?.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  }),
});

export const mapPortfolioDataToView = (
  data: PortfolioData,
): PortfolioItemView[] => {
  return data.items.map(mapPortfolioItemToView);
};
