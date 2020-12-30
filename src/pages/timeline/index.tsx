import Link from 'next/link'
import Header from '../../components/header'

import blogStyles from '../../styles/blog.module.css'
import sharedStyles from '../../styles/shared.module.css'

import { getBlogLink, getDateStr, postIsReady } from '../../lib/blog-helpers'
import { textBlock } from '../../lib/notion/renderers'
import getNotionUsers from '../../lib/notion/getNotionUsers'
import getBlogIndex from '../../lib/notion/getBlogIndex'
import { url } from 'inspector'

export async function getStaticProps() {
  const postsTable = await getBlogIndex(true)
  const authorsToGet: Set<string> = new Set()
  const posts: any[] = Object.keys(postsTable)
    .map(slug => {
      const post = postsTable[slug]
      if (!postIsReady(post)) {
        return null
      }
      post.Authors = post.Authors || []
      for (const author of post.Authors) {
        authorsToGet.add(author)
      }
      return post
    })
    .filter(Boolean)

  const { users } = await getNotionUsers([...authorsToGet])

  posts.map(post => {
    post.Authors = post.Authors.map(id => users[id].full_name)
  })

  const postPerYearMap = {}
  posts.forEach(post => {
    const postDate = getDateStr(post.Date).split(', ')
    const year = parseInt(postDate[1])

    if (!postPerYearMap[year]) {
      postPerYearMap[year] = []
    }
    postPerYearMap[year].push(post)
  })

  return {
    props: {
      postPerYearMap,
    },
    revalidate: 10,
  }
}

export default ({ postPerYearMap = {} }) => {
  const years = Object.keys(postPerYearMap).reverse()
  let content = null

  if (!years || years.length === 0) {
    content = <p className={blogStyles.noPosts}>There are no posts yet</p>
  } else {
    content = years.map(year => {
      return (
        <div>
          <div className="text-4xl mt-6">{year}</div>
          {postPerYearMap[year] &&
            postPerYearMap[year].length >= 0 &&
            postPerYearMap[year].map(post => {
              return (
                <div className="ml-10 pl-4 border-l-2 border-gray-400 leading-loose">
                  <div className="inline mr-3">
                    <Link
                      href={getBlogLink(post.Slug)}
                      as={getBlogLink(post.Slug)}
                    >
                      <a className="border-b-2 border-transparent hover:border-purple-400 border-dashed">
                        {post.Page}
                      </a>
                    </Link>
                    <div className="inline text-xs text-gray-500 px-2">
                      {getDateStr(post.Date)}
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      )
    })
  }

  return (
    <>
      <Header titlePre="All Posts" category="All" />
      <div className="container mx-auto max-w-screen-lg grid px-3">
        <div className="my-4">{content}</div>
      </div>
    </>
  )
}
