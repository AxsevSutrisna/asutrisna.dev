/**
 * Projects List View Component
 */

import React from 'react'
import { ProjectView } from './projects.view.model'
import { ProjectItemComponent } from './project-item.view'

interface ProjectsListViewProps {
  projects: ProjectView[]
  isLoading: boolean
  error?: string
}

export const ProjectsListView: React.FC<ProjectsListViewProps> = ({
  projects,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading projects...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    )
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Projects
        </h2>

        {projects.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No projects yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <ProjectItemComponent key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
