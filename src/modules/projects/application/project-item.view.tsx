/**
 * Project Item View Component
 */

import React from 'react'
import { ProjectView } from './projects.view.model'

interface ProjectItemComponentProps {
  project: ProjectView
}

export const ProjectItemComponent: React.FC<ProjectItemComponentProps> = ({
  project,
}) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {project.imageUrl && (
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-56 object-cover"
        />
      )}

      <div className="p-6">
        {project.featured && (
          <span className="inline-block mb-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-semibold rounded-full">
            Featured
          </span>
        )}

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {project.title}
        </h3>

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {project.description}
        </p>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-3 py-1 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          {project.createdAt}
        </p>

        <div className="flex gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
            >
              Live Demo
            </a>
          )}
          {project.gitUrl && (
            <a
              href={project.gitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:underline text-sm font-medium"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
