'use client'

/**
 * Blog Container Component (Primary Adapter)
 */

import React, { useEffect, useState } from 'react'
import { BlogData } from '../domain/blog.model'
import { getBlogPosts } from '../domain/blog.usecases'
import { mapBlogDataToView } from './blog.mapper'
import { BlogDataView } from './blog.view.model'
import { blogAdapter } from '../infrastructure/blog.adapter'
import { BlogListView } from './blog-list.view'

interface BlogContainerProps {
  category?: string
}

export const BlogContainer: React.FC<BlogContainerProps> = ({
  category,
}) => {
  const [data, setData] = useState<BlogDataView | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setIsLoading(true)
        setError('')

        const blogData: BlogData = await getBlogPosts(blogAdapter, category)
        const viewData = mapBlogDataToView(blogData)

        setData(viewData)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load blog posts'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogPosts()
  }, [category])

  return (
    <BlogListView data={data} isLoading={isLoading} error={error} />
  )
}
