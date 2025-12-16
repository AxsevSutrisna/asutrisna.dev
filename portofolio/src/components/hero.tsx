import React, { ReactNode } from 'react'
import Link from 'next/link'

type Breadcrumb = {
  label: string
  value: string
}

type HeroProps = {
  highlight?: string
  subTitle?: string
  title?: string
  date?: string
  description?: ReactNode
  children?: ReactNode
  type?: 'page' | 'post'
  breadcrumb?: Breadcrumb
  hasSearch?: boolean
}

export const Hero: React.FC<HeroProps> = ({
  highlight,
  subTitle,
  title,
  date,
  description,
  children,
  type = 'page',
  breadcrumb,
  hasSearch = false,
}) => {
  return (
    <header
      className={`hero hero-${type}`}
      style={hasSearch ? { marginBottom: '1.5rem' } : undefined}
    >
      {subTitle && (
        <div className="sub-title">
          {breadcrumb && (
            <>
              <Link href={breadcrumb.value}>
                {breadcrumb.label}
              </Link>{' '}
              <span>/</span>
            </>
          )}
          <div>
            {highlight && <span className="highlight">{highlight}</span>}
            <span>{subTitle}</span>
          </div>
        </div>
      )}

      {date && <div className="post-date">{date}</div>}

      {title && <h1 className={date ? 'has-date' : ''}>{title}</h1>}

      {description && (
        <div
          className="hero-description"
          style={hasSearch ? { marginBottom: '0' } : undefined}
        >
          {description}
        </div>
      )}

      {children}
    </header>
  )
}
