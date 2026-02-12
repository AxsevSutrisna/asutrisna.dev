import type { NextPage } from 'next'
import Head from 'next/head'
import { BlogContainer } from '@/modules/blog/application/blog.container'

const BlogPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Blog - Asutrisna</title>
        <meta
          name="description"
          content="Read my articles about web development, architecture, and technology"
        />
      </Head>

      <BlogContainer />
    </>
  )
}

export default BlogPage
