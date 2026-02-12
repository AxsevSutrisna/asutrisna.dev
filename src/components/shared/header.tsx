/**
 * Header Component
 * Shared navigation component
 */

import React from 'react'
import Link from 'next/link'

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
            Asutrisna
          </Link>

          <ul className="flex gap-6">
            <li>
              <Link
                href="/portfolio"
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                Portfolio
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                Blog
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
