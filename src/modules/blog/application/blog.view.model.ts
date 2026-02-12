/**
 * Blog Application Model
 */

export interface BlogPostView {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string[];
  category: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogDataView {
  posts: BlogPostView[];
  totalPosts: number;
  categories: string[];
}
