/**
 * Blog Domain Model
 */

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string[];
  category: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
}

export interface BlogData {
  posts: BlogPost[];
  totalPosts: number;
  categories: string[];
}

export class BlogError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BlogError";
  }
}
