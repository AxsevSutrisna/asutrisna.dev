/**
 * Blog Post Item View Component
 */

import React from 'react'
import { BlogPostView } from './blog.view.model'

interface BlogPostItemComponentProps {
  post: BlogPostView
}

export const BlogPostItemComponent: React.FC<BlogPostItemComponentProps> = ({
  post,
}) => {
  return (
    <article className="border-b border-gray-200 dark:border-gray-700 pb-8">
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}

      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
        <span>{post.createdAt}</span>
        <span>•</span>
        <span>{post.author}</span>
        <span>•</span>
        <span className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-xs">
          {post.category}
        </span>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        <a href={`/blog/${post.slug}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
          {post.title}
        </a>
      </h3>

      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
        {post.excerpt}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      <a
        href={`/blog/${post.slug}`}
        className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
      >
        Read More →
      </a>
    </article>
  )
}
