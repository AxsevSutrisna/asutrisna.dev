/**
 * Blog Output Port (Secondary Port)
 */

import { BlogData, BlogPost } from "./blog.model";

export interface IBlogOutput {
  getBlogPosts(category?: string): Promise<BlogData>;
  getBlogPostBySlug(slug: string): Promise<BlogPost>;
}
