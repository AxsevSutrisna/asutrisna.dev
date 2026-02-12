'use client'

/**
 * Projects Container Component (Primary Adapter)
 */

import React, { useEffect, useState } from 'react'
import { ProjectsData } from '../domain/projects.model'
import { getProjects } from '../domain/projects.usecases'
import { mapProjectsDataToView } from './projects.mapper'
import { ProjectView } from './projects.view.model'
import { projectsAdapter } from '../infrastructure/projects.adapter'
import { ProjectsListView } from './projects-list.view'

interface ProjectsContainerProps {
  featuredOnly?: boolean
}

export const ProjectsContainer: React.FC<ProjectsContainerProps> = ({
  featuredOnly = false,
}) => {
  const [projects, setProjects] = useState<ProjectView[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        setError('')

        const projectsData: ProjectsData = await getProjects(
          projectsAdapter,
          featuredOnly
        )
        const viewProjects = mapProjectsDataToView(projectsData)

        setProjects(viewProjects)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load projects'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [featuredOnly])

  return (
    <ProjectsListView
      projects={projects}
      isLoading={isLoading}
      error={error}
    />
  )
}
