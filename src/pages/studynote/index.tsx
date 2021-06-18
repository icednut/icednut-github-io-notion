import Header from '../../components/header'
import blogStyles from '../../styles/blog.module.css'
import { getDateStr } from '../../lib/blog-helpers'
import {
  Client,
  LogLevel,
  APIErrorCode,
  APIResponseError,
} from '@notionhq/client'

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

class NotionPost {
  private readonly page_id: String
  private readonly properties: any

  constructor(page_id, properties) {
    this.page_id = page_id
    this.properties = properties
  }

  getPageId() {
    return this.page_id
  }

  getProperties() {
    return this.properties
  }
}

export async function getStaticProps() {
  try {
    const database = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      filter: {
        property: 'Category',
        select: {
          equals: 'StudyNote',
        },
      },
    })
    const posts = database.results.map(each => {
      const obj = {
        page_id: each.id,
        title: each.properties.Page['title'][0].plain_text,
        created_at: each.properties.Date['date'].start,
        published: each.properties.Published['checkbox'],
        thumbnail:
          '/post_thumbnail/' +
          (each.properties.Thumbnail['rich_text'].length > 0
            ? each.properties.Thumbnail['rich_text'][0].plain_text
            : 'default.jpg'),
        properties: each.properties,
      }
      return obj
    })

    return {
      props: {
        posts,
      },
      revalidate: 10,
    }
  } catch (error) {
    if (APIResponseError.isAPIResponseError(error)) {
      // error is now strongly typed to APIResponseError
      switch (error.code) {
        case APIErrorCode.ObjectNotFound:
          // ...
          break
        case APIErrorCode.Unauthorized:
          // ...
          break
        // ...
        default:
          // you could even take advantage of exhaustiveness checking
          // assertNever(error.code)
          break
      }
    }
  }
}

export default ({ posts = [] }) => {
  const featuredPosts = posts
    .filter(post => post['Featured'] === 'Yes')
    .map(featuredPost => {
      return (
        <div
          className="py-4 pl-2 border-b border-gray-300"
          key={featuredPost.Slug}
          style={{ width: '100%' }}
        >
          <div>
            {/* <Link
              href={getBlogLink(featuredPost.Slug)}
              as={getBlogLink(featuredPost.Slug)}
            > */}
            <a
              className={
                'text-black font-bold text-sm mb-2 text-justify border-b-2 border-transparent border-dashed hover:border-purple-400 pb-px transition-colors duration-300'
              }
            >
              <span className="mr-2">{featuredPost.Page}</span>
              <span className={'text-gray-600 text-xs pt-1'}>
                {featuredPost.Date && getDateStr(featuredPost.Date)}
              </span>
            </a>
            {/* </Link> */}
            {/* <div>
              {featuredPost.Tags &&
                featuredPost.Tags.split(',').map(tag => (
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
            </div> */}
          </div>
        </div>
      )
    })
    .slice(0, 5)

  return (
    <>
      <Header titlePre="StudyNote" category="StudyNote" />

      <div className="container mx-auto max-w-screen-lg grid px-3 pt-12">
        {/* <div className="text-sm mt-6 mb-1 text-purple-500">
          Featured ({featuredPosts.length})
        </div> */}
        {/* <div id="featured-posts">{featuredPosts}</div> */}

        <div className="text-sm mt-12 mb-1 text-purple-500">
          Posts ({posts.length})
        </div>
        <div className="gap-4 masonry mb-6">
          {posts.length === 0 && (
            <p className={blogStyles.noPosts}>There are no posts yet</p>
          )}
          {posts
            .filter(post => post.published)
            .map(post => {
              return (
                <div
                  className="bg-white shadow hover:shadow-xl transition-all duration-300 inline-block my-3"
                  key={post.Slug}
                >
                  <div className="relative overflow-hidden">
                    {/* <Link
                      href={'/' + getBlogLink(post.Slug)}
                      as={getBlogLink(post.Slug)}
                    > */}
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
                    {/* </Link> */}
                  </div>
                  <div className="px-6 py-4">
                    <div className="text-center">
                      {/* <Link
                        href={'/' + getBlogLink(post.Slug)}
                        as={getBlogLink(post.Slug)}
                      > */}
                      <a
                        className={
                          'text-black font-bold text-xl text-xl mb-2 text-justify border-b-2 border-white border-dashed hover:border-purple-500 pb-px transition-colors duration-300'
                        }
                      >
                        {post.title}
                      </a>
                      {/* </Link> */}
                    </div>
                    {/* <Link
                      href={'/' + getBlogLink(post.Slug)}
                      as={getBlogLink(post.Slug)}
                    > */}
                    <p
                      className={'text-gray-600 text-xs pt-2 pb-5 text-center'}
                    >
                      <span>Wan Geun Lee / {post.created_at}</span>
                    </p>
                    {/* </Link> */}
                  </div>
                  <div className="px-6 py-4">
                    {post.Tags &&
                      post.Tags.split(',').map(tag => (
                        <a
                          className={
                            'inline-block py-px px-2 mr-2 mt-2 bg-purple-500 hover:bg-purple-700 text-white text-sm ' +
                            blogStyles.blogTag
                          }
                        >
                          #{tag}
                        </a>
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
