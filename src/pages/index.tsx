import Header from '../components/header'
import blogStyles from '../styles/blog.module.css'
import {
  Client,
  LogLevel,
  APIErrorCode,
  APIResponseError,
} from '@notionhq/client'

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  logLevel: LogLevel.DEBUG,
})

export async function getStaticProps() {
  try {
    const database = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      filter: {
        property: 'Category',
        select: {
          equals: 'DevLog',
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
  // const featuredPosts = posts
  //   .filter(post => post['Featured'] === 'Yes')
  //   .map(featuredPost => {
  //     return (
  //       <div className="py-3 border-b border-gray-300" key={featuredPost.Slug}>
  //         <div>
  //           <Link
  //             href={getBlogLink(featuredPost.Slug)}
  //             as={getBlogLink(featuredPost.Slug)}
  //           >
  //             <a
  //               className={
  //                 'text-black font-bold text-sm mb-2 text-justify border-b-2 border-transparent border-dashed hover:border-purple-400 pb-px transition-colors duration-300'
  //               }
  //             >
  //               <span className="mr-2">{featuredPost.Page}</span>
  //               <span className={'text-gray-600 text-xs pt-1'}>
  //                 {featuredPost.Date && getDateStr(featuredPost.Date)}
  //               </span>
  //             </a>
  //           </Link>
  //           <div>
  //             {featuredPost.Tags &&
  //               featuredPost.Tags.split(',').map(tag => (
  //                 <Link href={'/tag/[slug]'} as={'/tag/' + tag}>
  //                   <a
  //                     className={
  //                       'inline-block py-px px-2 mr-2 mt-2 bg-purple-500 hover:bg-purple-700 text-white text-sm ' +
  //                       blogStyles.blogTag
  //                     }
  //                   >
  //                     #{tag}
  //                   </a>
  //                 </Link>
  //               ))}
  //           </div>
  //         </div>
  //       </div>
  //     )
  //   })
  //   .slice(0, 5)
  const featuredPosts = []

  return (
    <>
      <Header titlePre="DevLog" category="DevLog" />
      <div className="container mx-auto max-w-screen-lg grid px-3 pt-16">
        <div className="text-sm mt-6 mb-1 text-purple-500">
          Featured ({featuredPosts.length})
        </div>
        <div id="featured-posts" className="grid grid-cols-1">
          {featuredPosts}
        </div>

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
                  // key={post.Slug}
                >
                  <div className="relative overflow-hidden">
                    <a>
                      <img
                        className={
                          'w-full transition-transform duration-500 transform hover:scale-125 ' +
                          blogStyles.darkenImage
                        }
                        src={post.thumbnail}
                        alt="Sunset in the mountains"
                      />
                    </a>

                    {/* <Link
                      href={getBlogLink(post.Slug)}
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
                              : 'default.jpg')
                          }
                          alt="Sunset in the mountains"
                        />
                      </a>
                    </Link> */}
                  </div>
                  <div className="px-6 py-4 text-center">
                    <a
                      className={
                        'text-black font-bold text-xl mb-2 text-justify border-b-2 border-white border-dashed hover:border-purple-400 pb-px transition-colors duration-300'
                      }
                    >
                      {post.title}
                      <p
                        className={
                          'text-gray-600 text-xs pt-2 pb-5 text-center'
                        }
                      >
                        <span>Wan Geun Lee / {post.created_at}</span>
                      </p>
                    </a>
                    {/* <Link
                      href={getBlogLink(post.Slug)}
                      as={getBlogLink(post.Slug)}
                    >
                      <a
                        className={
                          'text-black font-bold text-xl mb-2 text-justify border-b-2 border-white border-dashed hover:border-purple-400 pb-px transition-colors duration-300'
                        }
                      >
                        {post.Page}
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
                    </Link> */}
                  </div>
                  <div className="px-6 py-4">
                    {/* {post.Tags &&
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
                      ))} */}
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </>
  )
}
