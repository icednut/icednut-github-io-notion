import Link from 'next/link'
import Header from '../../components/header'
import blogStyles from '../../styles/blog.module.css'
import { getBlogLink, getDateStr, postIsReady } from '../../lib/blog-helpers'
// import getNotionUsers from '../../lib/notion/getNotionUsers'
// import getBlogIndex from '../../lib/notion/getBlogIndex'
// import getTagIndex from '../../lib/notion/getTagIndex'

export async function getStaticProps({ params }) {
  const tag = params.slug
  // const postsTable = await getBlogIndex(true, tag)
  const postsTable = {}

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
      return post
    })
    .filter(Boolean)

  // const { users } = await getNotionUsers([...authorsToGet])

  // posts.map(post => {
  //   post.Authors = post.Authors.map(id => users[id].full_name)
  // })

  return {
    props: {
      posts,
      tag,
    },
    revalidate: 10,
  }
}

export async function getStaticPaths() {
  // const tagOptions = await getTagIndex()
  // const tags = tagOptions.map(tag => '/tag/' + tag)
  const tags = []
  return {
    paths: tags,
    fallback: false,
  }
}

export default ({ posts = [], tag = '' }) => {
  return (
    <>
      <Header titlePre={tag} />
      <div className="container mx-auto max-w-screen-lg grid px-3 pt-12">
        <div className="text-4xl mt-6">#{tag}</div>
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
                  {/* <div 
                    className="absolute w-full px-3" 
                    style={{
                      zIndex:2,
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}>
                    <svg className="fill-current text-white w-6 h-6 mx-auto" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M.2 10a11 11 0 0 1 19.6 0A11 11 0 0 1 .2 10zm9.8 4a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-2a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/></svg>
                  </div> */}
                  <Link href="/[slug]" as={getBlogLink(post.Slug)}>
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
                            : 'default.jpg')
                        }
                        alt="Sunset in the mountains"
                      />
                    </a>
                  </Link>
                </div>
                <div className="px-6 py-4">
                  <div className="text-center">
                    <Link
                      href={getBlogLink(post.Slug)}
                      as={getBlogLink(post.Slug)}
                    >
                      <a
                        className={
                          'text-black font-bold text-xl text-xl mb-2 text-justify border-b-2 border-white border-dashed hover:border-purple-500 pb-px transition-colors duration-300'
                        }
                      >
                        {post.Page}
                      </a>
                    </Link>
                  </div>
                  <Link
                    href={getBlogLink(post.Slug)}
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
                      <Link href={'/tag/[slug]'} as={'/tag/' + tag}>
                        <a
                          className={
                            'inline-block py-px px-2 mr-2 mt-2 bg-purple-500 hover:bg-purple-700 text-white text-sm ' +
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
