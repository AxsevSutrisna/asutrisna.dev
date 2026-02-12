/**
 * Blog Mapper
 */

import { BlogData, BlogPost } from "../domain/blog.model";
import { BlogPostView, BlogDataView } from "./blog.view.model";

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const mapBlogPostToView = (post: BlogPost): BlogPostView => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  excerpt: post.excerpt,
  content: post.content,
  author: post.author,
  tags: post.tags,
  category: post.category,
  imageUrl: post.imageUrl,
  createdAt: formatDate(post.createdAt),
  updatedAt: formatDate(post.updatedAt),
});

export const mapBlogDataToView = (data: BlogData): BlogDataView => ({
  posts: data.posts.map(mapBlogPostToView),
  totalPosts: data.totalPosts,
  categories: data.categories,
});
