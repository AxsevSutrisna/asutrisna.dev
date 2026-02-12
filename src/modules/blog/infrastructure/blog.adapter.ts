/**
 * Blog Local Storage Adapter (Secondary Adapter)
 */

import { IBlogOutput } from "../domain/blog.output";
import { BlogData, BlogPost } from "../domain/blog.model";

const STORAGE_KEY = "blog_posts";

const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Clean Architecture in Frontend",
    slug: "clean-architecture-frontend",
    excerpt:
      "Understanding clean architecture principles and how to apply them in frontend applications.",
    content: `# Clean Architecture in Frontend

Clean architecture is an architectural pattern that emphasizes separation of concerns...`,
    author: "Asutrisna",
    tags: ["architecture", "frontend", "typescript"],
    category: "Technology",
    imageUrl: "/images/blog/clean-arch.jpg",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    published: true,
  },
  {
    id: "2",
    title: "TypeScript Best Practices",
    slug: "typescript-best-practices",
    excerpt:
      "Essential TypeScript patterns and best practices for production applications.",
    content: `# TypeScript Best Practices

TypeScript is a powerful language that adds type safety to JavaScript...`,
    author: "Asutrisna",
    tags: ["typescript", "javascript", "best-practices"],
    category: "Technology",
    imageUrl: "/images/blog/typescript.jpg",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
    published: true,
  },
];

export class BlogLocalStorageAdapter implements IBlogOutput {
  async getBlogPosts(category?: string): Promise<BlogData> {
    try {
      let posts = mockBlogPosts;

      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          posts = JSON.parse(stored);
        }
      }

      const filtered = category
        ? posts.filter((p: BlogPost) => p.category === category && p.published)
        : posts.filter((p: BlogPost) => p.published);

      const categories = [...new Set(posts.map((p: BlogPost) => p.category))];

      return {
        posts: filtered,
        totalPosts: filtered.length,
        categories,
      };
    } catch {
      const filtered = mockBlogPosts.filter((p: BlogPost) => p.published);
      const categories = [
        ...new Set(mockBlogPosts.map((p: BlogPost) => p.category)),
      ];

      return {
        posts: filtered,
        totalPosts: filtered.length,
        categories,
      };
    }
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost> {
    try {
      let posts = mockBlogPosts;

      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          posts = JSON.parse(stored);
        }
      }

      const post = posts.find((p) => p.slug === slug && p.published);

      if (!post) {
        throw new Error("Post not found");
      }

      return post;
    } catch {
      const post = mockBlogPosts.find((p) => p.slug === slug && p.published);
      if (!post) {
        throw new Error("Post not found");
      }
      return post;
    }
  }

  setBlogPosts(posts: BlogPost[]): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    }
  }
}

export const blogAdapter = new BlogLocalStorageAdapter();
