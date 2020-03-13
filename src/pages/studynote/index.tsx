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
  const postsTable = await getBlogIndex(true, '', 'StudyNote')

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
      //   console.log('post', post)
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
      <Header titlePre="StudyNote" category="StudyNote" />
      <div className="container mx-auto max-w-screen-lg grid px-3">
        <div className="gap-4 masonry my-4">
          {posts.length === 0 && (
            <p className={blogStyles.noPosts}>There are no posts yet</p>
          )}
          {posts.map(post => {
            return (
              <div
                className="bg-white shadow hover:shadow-xl transition-all duration-300 inline-block my-3"
                key={post.Slug}
              >
                <div className="relative overflow-hidden">
                  <Link
                    href={'/' + getBlogLink(post.Slug)}
                    as={getBlogLink(post.Slug)}
                  >
                    <a>
                      <img
                        className={
                          'w-full transition-transform duration-500 transform hover:scale-125 ' +
                          blogStyles.darkenImage
                        }
                        src={
                          '/post_thumbnail/' +
                          (post.Thumbnail && post.Thumbnail !== ''
                            ? post.Thumbnail
                            : 'default_studynote.jpg')
                        }
                        alt="Sunset in the mountains"
                      />
                    </a>
                  </Link>
                </div>
                <div className="px-6 py-4">
                  <div className="text-center">
                    <Link
                      href={'/' + getBlogLink(post.Slug)}
                      as={getBlogLink(post.Slug)}
                    >
                      <a
                        className={
                          'text-black font-bold text-xl text-xl mb-2 text-justify border-b-2 border-white border-dashed hover:border-teal-400 pb-px transition-colors duration-300'
                        }
                      >
                        {post.Page}
                      </a>
                    </Link>
                  </div>
                  <Link
                    href={'/' + getBlogLink(post.Slug)}
                    as={getBlogLink(post.Slug)}
                  >
                    <a>
                      <p
                        className={
                          'text-gray-600 text-xs pt-2 pb-5 text-center'
                        }
                      >
                        <span>Wan Geun Lee</span>
                        <span> / </span>
                        {post.Date && <span>{getDateStr(post.Date)}</span>}
                      </p>
                    </a>
                  </Link>
                </div>
                <div className="px-6 py-4">
                  {post.Tags &&
                    post.Tags.split(',').map(tag => (
                      <Link href={'/tag/' + tag} as={'/tag/' + tag}>
                        <a
                          className={
                            'inline-block py-px px-2 mr-2 mt-2 bg-teal-400 hover:bg-teal-600 text-white text-sm ' +
                            blogStyles.blogTag
                          }
                        >
                          #{tag}
                        </a>
                      </Link>
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
