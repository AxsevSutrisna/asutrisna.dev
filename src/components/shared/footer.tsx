/**
 * Footer Component
 * Shared footer component
 */

import React from 'react'

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Asutrisna</h3>
            <p className="text-gray-400">
              Full-stack developer passionate about clean code and architecture.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/portfolio" className="hover:text-white">Portfolio</a></li>
              <li><a href="/projects" className="hover:text-white">Projects</a></li>
              <li><a href="/about" className="hover:text-white">About</a></li>
              <li><a href="/blog" className="hover:text-white">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="https://github.com" className="hover:text-white">GitHub</a></li>
              <li><a href="https://linkedin.com" className="hover:text-white">LinkedIn</a></li>
              <li><a href="https://twitter.com" className="hover:text-white">Twitter</a></li>
              <li><a href="mailto:contact@asutrisna.dev" className="hover:text-white">Email</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-gray-400">
            © {currentYear} Asutrisna. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
