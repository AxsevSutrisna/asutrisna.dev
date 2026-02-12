/**
 * Blog Use Cases
 */

import { BlogData, BlogPost, BlogError } from "./blog.model";
import { IBlogOutput } from "./blog.output";

export const getBlogPosts = async (
  blogOutput: IBlogOutput,
  category?: string,
): Promise<BlogData> => {
  try {
    const blogData = await blogOutput.getBlogPosts(category);

    if (!blogData || !blogData.posts) {
      throw new BlogError("Blog data is not available");
    }

    return blogData;
  } catch (error) {
    if (error instanceof BlogError) {
      throw error;
    }
    throw new BlogError(
      error instanceof Error ? error.message : "Failed to fetch blog posts",
    );
  }
};

export const getBlogPostBySlug = async (
  blogOutput: IBlogOutput,
  slug: string,
): Promise<BlogPost> => {
  try {
    const post = await blogOutput.getBlogPostBySlug(slug);

    if (!post) {
      throw new BlogError("Blog post not found");
    }

    return post;
  } catch (error) {
    if (error instanceof BlogError) {
      throw error;
    }
    throw new BlogError(
      error instanceof Error ? error.message : "Failed to fetch blog post",
    );
  }
};
