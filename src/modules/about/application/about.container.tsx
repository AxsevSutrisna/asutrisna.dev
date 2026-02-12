'use client'

/**
 * About Container Component (Primary Adapter)
 */

import React, { useEffect, useState } from 'react'
import { AboutContent } from '../domain/about.model'
import { getAboutContent } from '../domain/about.usecases'
import { mapAboutToView } from './about.mapper'
import { AboutContentView } from './about.view.model'
import { aboutAdapter } from '../infrastructure/about.adapter'
import { AboutView } from './about.view'

export const AboutContainer: React.FC = () => {
  const [content, setContent] = useState<AboutContentView | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        setIsLoading(true)
        setError('')

        const aboutData: AboutContent = await getAboutContent(aboutAdapter)
        const viewContent = mapAboutToView(aboutData)

        setContent(viewContent)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load about content'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAboutContent()
  }, [])

  return <AboutView content={content} isLoading={isLoading} error={error} />
}
