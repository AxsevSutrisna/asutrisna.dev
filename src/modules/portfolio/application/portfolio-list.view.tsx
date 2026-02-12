/**
 * Portfolio List View Component (Presentation Layer)
 * Pure presentation component, no business logic
 */

import React from 'react'
import { PortfolioItemView } from './portfolio.view.model'
import { PortfolioItemComponent } from './portfolio-item.view'

interface PortfolioListViewProps {
  items: PortfolioItemView[]
  isLoading: boolean
  error?: string
}

export const PortfolioListView: React.FC<PortfolioListViewProps> = ({
  items,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading portfolio...</p>
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
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Portfolio
        </h2>

        {items.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            No portfolio items yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <PortfolioItemComponent key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
