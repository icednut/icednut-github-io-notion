import Link from 'next/link'
import Header from '../../components/header'

import blogStyles from '../../styles/blog.module.css'
import sharedStyles from '../../styles/shared.module.css'

import { getBlogLink, getDateStr, postIsReady } from '../../lib/blog-helpers'
import { textBlock } from '../../lib/notion/renderers'
import getNotionUsers from '../../lib/notion/getNotionUsers'
import getBlogIndex from '../../lib/notion/getBlogIndex'
import { url } from 'inspector'

export async function unstable_getStaticProps() {
  const postsTable = await getBlogIndex()

  const authorsToGet: Set<string> = new Set()
  const posts: any[] = Object.keys(postsTable)
    .map(slug => {
      const post = postsTable[slug]
      // remove draft posts in production
      if (!postIsReady(post)) {
        return null
      }
      post.Authors = post.Authors || []
      for (const author of post.Authors) {
        authorsToGet.add(author)
      }
      console.log('post', post)
      return post
    })
    .filter(Boolean)

  const { users } = await getNotionUsers([...authorsToGet])

  posts.map(post => {
    post.Authors = post.Authors.map(id => users[id].full_name)
  })

  return {
    props: {
      posts,
    },
    revalidate: 10,
  }
}

export default ({ posts = [] }) => {
  return (
    <>
      <Header titlePre="Blog" />
      <div className="container mx-auto grid grid-flow-col-dense">
        <div className="gap-4 masonry">
          {posts.length === 0 && (
            <p className={blogStyles.noPosts}>There are no posts yet</p>
          )}
          {posts.map(post => {
            return (
              <div
                className="relative rounded-lg bg-white shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 inline-block m-3"
                key={post.Slug}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <Link href="/blog/[slug]" as={getBlogLink(post.Slug)}>
                    <a className="group">
                      <img
                        className={
                          'w-full rounded-t-lg transition-transform duration-500 transform hover:scale-125 ' +
                          blogStyles.darkenImage
                        }
                        src="3.jpg"
                        alt="Sunset in the mountains"
                      />
                      {/* <div className="absolute w-full h-full bg-black opacity-0 hover:opacity-75 transition-color duration-500">
                                    </div> */}
                    </a>
                  </Link>
                </div>
                <div className="px-6 py-4">
                  <div className="text-center">
                    <Link href="/blog/[slug]" as={getBlogLink(post.Slug)}>
                      <a
                        className={
                          'text-black font-bold text-xl text-xl mb-2 text-justify border-b-2 border-white hover:border-teal-400 pb-px transition-colors duration-300'
                        }
                      >
                        {post.Page}
                      </a>
                    </Link>
                  </div>
                  <Link href="/blog/[slug]" as={getBlogLink(post.Slug)}>
                    <a>
                      <p
                        className={
                          'text-gray-600 text-xs pt-2 pb-5 text-center'
                        }
                      >
                        {post.Authors.length > 0 && (
                          <span>{post.Authors.join(' ')}</span>
                        )}
                        <span> / </span>
                        {post.Date && <span>{getDateStr(post.Date)}</span>}
                      </p>
                      <div>
                        {(!post.preview || post.preview.length === 0) && (
                          <p className="text-gray-400">No preview available</p>
                        )}
                        {(post.preview || []).map((block, idx) => (
                          <p>
                            textBlock(block, true, `${post.Slug}${idx}`)
                          </p>
                        ))}
                      </div>
                    </a>
                  </Link>
                </div>
                <div className="px-6 py-4">
                  {post.Tags &&
                    post.Tags.split(',').map(tag => (
                      <span
                        className={
                          'inline-block rounded-full py-px px-2 mr-1 mt-1 bg-teal-400 text-white text-sm ' +
                          blogStyles.blogTag
                        }
                      >
                        #{tag}
                      </span>
                    ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
