/**
 * Portfolio Application Model
 * DTO for UI layer
 */

export interface PortfolioItemView {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  link?: string;
  startDate: string;
  endDate?: string;
}

export interface PortfolioViewState {
  items: PortfolioItemView[];
  isLoading: boolean;
  error?: string;
}
