import type { NextPage } from 'next'
import Head from 'next/head'
import { ProjectsContainer } from '@/modules/projects/application/projects.container'

const ProjectsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Projects - Asutrisna</title>
        <meta
          name="description"
          content="View my latest projects and technical solutions"
        />
      </Head>

      <ProjectsContainer />
    </>
  )
}

export default ProjectsPage
