import type { NextPage } from 'next'
import Head from 'next/head'
import { PortfolioContainer } from '@/modules/portfolio/application/portfolio.container'

const PortfolioPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Portfolio - Asutrisna</title>
        <meta
          name="description"
          content="My portfolio of completed projects and works"
        />
      </Head>

      <PortfolioContainer />
    </>
  )
}

export default PortfolioPage
