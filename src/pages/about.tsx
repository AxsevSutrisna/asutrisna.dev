import type { NextPage } from 'next'
import Head from 'next/head'
import { AboutContainer } from '@/modules/about/application/about.container'

const AboutPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>About Me - Asutrisna</title>
        <meta
          name="description"
          content="Learn more about me, my skills, and experience"
        />
      </Head>

      <AboutContainer />
    </>
  )
}

export default AboutPage
