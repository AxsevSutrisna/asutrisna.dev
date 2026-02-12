'use client'

/**
 * Portfolio Container Component (Primary Adapter)
 * Connects React UI with domain use cases
 */

import React, { useEffect, useState } from 'react'
import { PortfolioData } from '../domain/portfolio.model'
import { getPortfolioItems } from '../domain/portfolio.usecases'
import { mapPortfolioDataToView } from './portfolio.mapper'
import { PortfolioItemView } from './portfolio.view.model'
import { portfolioAdapter } from '../infrastructure/portfolio.adapter'
import { PortfolioListView } from './portfolio-list.view'

export const PortfolioContainer: React.FC = () => {
  const [items, setItems] = useState<PortfolioItemView[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        setIsLoading(true)
        setError('')

        const portfolioData: PortfolioData = await getPortfolioItems(
          portfolioAdapter
        )
        const viewItems = mapPortfolioDataToView(portfolioData)

        setItems(viewItems)
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load portfolio'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPortfolioItems()
  }, [])

  return (
    <PortfolioListView
      items={items}
      isLoading={isLoading}
      error={error}
    />
  )
}
