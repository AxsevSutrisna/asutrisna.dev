/**
 * Portfolio Item View Component
 * Displays individual portfolio item
 */

import React from 'react'
import { PortfolioItemView } from './portfolio.view.model'

interface PortfolioItemComponentProps {
  item: PortfolioItemView
}

export const PortfolioItemComponent: React.FC<PortfolioItemComponentProps> = ({
  item,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {item.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          {item.description}
        </p>

        <div className="mb-4">
          <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
            {item.startDate}
            {item.endDate && ` - ${item.endDate}`}
          </p>

          <div className="flex flex-wrap gap-2">
            {item.technologies.map((tech) => (
              <span
                key={tech}
                className="inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs px-3 py-1 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
          >
            View Project →
          </a>
        )}
      </div>
    </div>
  )
}
