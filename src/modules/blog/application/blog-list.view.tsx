/**
 * Blog List View Component
 */

import React from 'react'
import { BlogDataView } from './blog.view.model'
import { BlogPostItemComponent } from './blog-post-item.view'

interface BlogListViewProps {
  data: BlogDataView | null
  isLoading: boolean
  error?: string
}

export const BlogListView: React.FC<BlogListViewProps> = ({
  data,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading blog posts...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-600">Error: {error || 'No data found'}</p>
      </div>
    )
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Blog
        </h2>

        {data.posts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No blog posts yet.</p>
        ) : (
          <div className="space-y-8">
            {data.posts.map((post) => (
              <BlogPostItemComponent key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
