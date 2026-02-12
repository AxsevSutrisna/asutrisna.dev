import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Asutrisna - Full Stack Developer</title>
        <meta
          name="description"
          content="Full-stack developer portfolio showcasing projects and expertise in clean architecture"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen">
        <section className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                  Hello, I'm Asutrisna
                </h1>

                <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">
                  A passionate full-stack developer specializing in modern web technologies and clean architecture principles.
                </p>

                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                  Building scalable, maintainable applications with TypeScript, React, and Next.js.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/projects"
                    className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition-colors"
                  >
                    View My Projects
                  </Link>

                  <Link
                    href="/about"
                    className="inline-block px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition-colors"
                  >
                    Learn About Me
                  </Link>
                </div>
              </div>

              <div className="hidden md:block">
                <div className="w-full h-96 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-lg shadow-2xl"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              Featured Work
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Projects',
                  description: 'Explore my recent projects and technical solutions',
                  link: '/projects',
                  icon: '📱',
                },
                {
                  title: 'Portfolio',
                  description: 'View my portfolio with detailed project breakdowns',
                  link: '/portfolio',
                  icon: '🎨',
                },
                {
                  title: 'Blog',
                  description: 'Read articles about web development and architecture',
                  link: '/blog',
                  icon: '📝',
                },
              ].map((item) => (
                <Link
                  key={item.title}
                  href={item.link}
                  className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Home
