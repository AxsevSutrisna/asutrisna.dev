/**
 * About View Component
 */

import React from 'react'
import { AboutContentView } from './about.view.model'

interface AboutViewProps {
  content: AboutContentView | null
  isLoading: boolean
  error?: string
}

export const AboutView: React.FC<AboutViewProps> = ({
  content,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    )
  }

  if (error || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-600">
          Error: {error || 'Content not found'}
        </p>
      </div>
    )
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          {content.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              {content.bio}
            </p>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {content.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {content.education.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Education
                </h2>
                <div className="space-y-4">
                  {content.education.map((edu, idx) => (
                    <div key={idx} className="border-l-4 border-indigo-600 pl-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {edu.degree}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {edu.school}
                      </p>
                      <p className="text-sm text-gray-500">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Contact
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Location
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {content.location}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <a
                    href={`mailto:${content.email}`}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    {content.email}
                  </a>
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Experience
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {content.experience}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
