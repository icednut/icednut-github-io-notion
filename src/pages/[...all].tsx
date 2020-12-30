import React, { useState } from 'react'
import Head from 'next/head'
import Header from '../components/header'
import Heading from '../components/heading'
import TargetHeading from '../components/target-heading'
import components from '../components/dynamic'
import ReactJSXParser from '@zeit/react-jsx-parser'
import blogStyles from '../styles/blog.module.css'
import { textBlock } from '../lib/notion/renderers'
import getPageData from '../lib/notion/getPageData'
import getBlogIndex from '../lib/notion/getBlogIndex'
import getNotionUsers from '../lib/notion/getNotionUsers'
import { getBlogLink, getDateStr, postIsReady } from '../lib/blog-helpers'
import { Z_DEFAULT_COMPRESSION } from 'zlib'
import Link from 'next/link'
import { DiscussionEmbed } from 'disqus-react'

function getSlug(params) {
  if (!params && !params.all && params.all.length === 0) {
    return null
  }

  if (params.all.length === 1) {
    return params.all[0]
  } else {
    return params.all.join('/')
  }
}

function renderPostContent(contentMap, contentElements, allContentMap) {
  let listTagName: string | null = null
  let listLastId: string | null = null
  let listMap: {
    [id: string]: {
      key: string
      isNested?: boolean
      nested: string[]
      children: React.ReactFragment
    }
  } = {}

  // console.log('contentElements', contentElements)

  return (
    <>
      {contentElements.map((value, blockIdx) => {
        const { type, properties, id, parent_id } = value
        const isLast = blockIdx === contentElements.length - 1
        const isList = listTypes.has(type)
        let toRender = []

        if (isList) {
          listTagName = components[type === 'bulleted_list' ? 'ul' : 'ol']
          listLastId = `list${id}`

          listMap[id] = {
            key: id,
            nested: [],
            children: textBlock(properties.title, true, id),
          }

          if (listMap[parent_id]) {
            listMap[id].isNested = true
            listMap[parent_id].nested.push(id)
          }
          if (contentMap[id]) {
            listMap[id].isNested = true
            listMap[id].nested = contentMap[id].map(each => each.id)
            // console.log('contentMap[id]', contentMap[id], 'id', id, 'listMap[id]', listMap[id], 'listMap[parent_id]', listMap[parent_id], 'parent_id', parent_id)
          }

          // if (listMap[id].isNested) {
          //   console.log(listMap)
          // }
        }

        if (listTagName && (isLast || !isList)) {
          let additionalListClassName = ''
          switch (listTagName) {
            case 'ul':
              additionalListClassName = 'my-1 list-disc list-inside'
              break
            case 'ol':
              additionalListClassName = 'my-1 list-decimal list-inside'
              break
            case 'li':
              additionalListClassName = 'leading-loose'
              break
          }

          toRender.push(
            React.createElement(
              listTagName,
              { key: listLastId!, className: additionalListClassName },
              Object.keys(listMap).map(itemId => {
                // if (listMap[itemId].isNested) {
                //   console.log(listMap[itemId])
                //   return null
                // }

                // console.log('listMap[itemId]', listMap[itemId])

                const createEl = (item, additionalMarginClass) => {
                  // console.log('item', item)
                  if (item) {
                    const nestedItemElements =
                      item.nested && item.nested.length > 0
                        ? item.nested.map(nestedId => {
                            const title =
                              allContentMap[nestedId] &&
                              allContentMap[nestedId].properties
                                ? allContentMap[nestedId].properties.title
                                : null
                            const children = title
                              ? textBlock(title, true, nestedId)
                              : null
                            const nestedElement = {
                              key: nestedId,
                              nested: [],
                              children: children,
                            }
                            return createEl(nestedElement, 'ml-5')
                          })
                        : null
                    const nestedItemList = nestedItemElements
                      ? React.createElement(
                          components.ul || 'ul',
                          {
                            key: item + 'sub-list',
                            className: 'my-1 list-disc list-inside',
                          },
                          nestedItemElements
                        )
                      : null

                    // console.log(nestedItemList)

                    if (nestedItemList) {
                      return React.createElement(
                        components.li || 'ul',
                        {
                          key: item.key,
                          className:
                            additionalMarginClass + ' pl-2 leading-loose',
                        },
                        item.children,
                        nestedItemList
                      )
                    } else {
                      return React.createElement(
                        components.li || 'ul',
                        {
                          key: item.key,
                          className:
                            additionalMarginClass + ' pl-2 leading-loose',
                        },
                        item.children
                      )
                    }
                  } else {
                    null
                  }
                }
                return createEl(listMap[itemId], '')
              })
            )
          )
          listMap = {}
          listLastId = null
          listTagName = null
        }

        const collectText = (el, acc = []) => {
          if (el) {
            if (typeof el === 'string') acc.push(el)
            if (Array.isArray(el)) el.map(item => collectText(item, acc))
            if (typeof el === 'object')
              collectText(el.props && el.props.children, acc)
          }
          return acc.join('').trim()
        }

        const renderHeading = (
          tagName: string,
          additionalClassName: string = 'leading-ralxed'
        ) => {
          const text = properties.title
          const children = textBlock(text, true, id)
          const props = {
            key: id,
            className: additionalClassName,
            id: collectText(text)
              .toLowerCase()
              .replace(/\s/g, '-')
              .replace(/[?!:]/g, ''),
          }

          toRender.push(React.createElement(tagName, props, children))
        }

        switch (type) {
          case 'column_list':
            const columnCount =
              contentMap[value.id].length >= 12
                ? 12
                : contentMap[value.id].length
            toRender.push(
              <div
                className={
                  'grid lg:grid-cols-' +
                  columnCount +
                  ' xl:grid-cols-' +
                  columnCount +
                  ' md:grid-cols-2 sm:grid-cols-1'
                }
              >
                {renderPostContent(
                  contentMap,
                  contentMap[value.id],
                  allContentMap
                )}
              </div>
            )
            break
          case 'column':
            toRender.push(
              <div className="px-1">
                {renderPostContent(
                  contentMap,
                  contentMap[value.id],
                  allContentMap
                )}
              </div>
            )
            break
          case 'page':
          case 'divider':
            break
          case 'text':
            if (properties) {
              toRender.push(textBlock(properties.title, false, id))
            } else {
              toRender.push(
                <span key={id} className="leading-ralxed mt-px">
                  &nbsp;
                </span>
              )
            }
            break
          case 'image':
          case 'video': {
            const { format = {} } = value
            // const { block_width } = format
            // const baseBlockWidth = 768
            // const roundFactor = Math.pow(10, 2)
            // calculate percentages
            // const width = block_width
            //   ? `${Math.round(
            //       (block_width / baseBlockWidth) * 100 * roundFactor
            //     ) / roundFactor}%`
            //   : '100%'
            const width = '100%'

            const isImage = type === 'image'
            const Comp = isImage ? 'img' : 'video'
            const resultDom = isImage ? (
              <Link
                href={`/api/asset?assetUrl=${encodeURIComponent(
                  format.display_source as any
                )}&blockId=${id}`}
              >
                <a target="_blank" rel="noopener">
                  <Comp
                    key={id}
                    src={`/api/asset?assetUrl=${encodeURIComponent(
                      format.display_source as any
                    )}&blockId=${id}`}
                    controls={!isImage}
                    alt={isImage ? 'An image from Notion' : undefined}
                    loop={!isImage}
                    muted={!isImage}
                    autoPlay={!isImage}
                    style={{ width }}
                    className="my-1"
                  />
                </a>
              </Link>
            ) : (
              <Comp
                key={id}
                src={`/api/asset?assetUrl=${encodeURIComponent(
                  format.display_source as any
                )}&blockId=${id}`}
                controls={!isImage}
                alt={isImage ? 'An image from Notion' : undefined}
                loop={!isImage}
                muted={!isImage}
                autoPlay={!isImage}
                style={{ width }}
                className="my-1"
              />
            )

            toRender.push(resultDom)
            break
          }
          case 'header':
            renderHeading('h2', 'mt-4 mb-px leading-loose text-3xl font-bold')
            break
          case 'sub_header':
            renderHeading('h3', 'mt-3 mb-px leading-loose text-xl font-bold')
            break
          case 'sub_sub_header':
            renderHeading('h4', 'mt-2 mb-px leading-loose text-lg font-bold')
            break
          case 'code': {
            if (properties.title) {
              const content = properties.title[0][0]
              const language = properties.language[0][0]

              if (language === 'LiveScript') {
                // this requires the DOM for now
                toRender.push(
                  <ReactJSXParser
                    key={id}
                    jsx={content}
                    components={components}
                    componentsOnly={false}
                    renderInpost={false}
                    allowUnknownElements={true}
                    blacklistedTags={['script', 'style']}
                  />
                )
              } else {
                toRender.push(
                  <components.Code key={id} language={language || ''}>
                    {content}
                  </components.Code>
                )
              }
            }
            break
          }
          case 'callout':
            if (properties.title) {
              const blockFormat = value.format
              const originalContent = properties.title[0][0]
              const quoteContent = originalContent.replace(/\\n/g, '<br/>')

              toRender.push(
                React.createElement(
                  components.div,
                  {
                    key: id,
                    className:
                      'bg-gray-700 p-6 text-lg leading-relaxed my-3 text-gray-200 flex',
                    style: {
                      whiteSpace: 'pre-wrap',
                    },
                  },
                  <div className="mr-3">{blockFormat['page_icon']}</div>,
                  <div>{quoteContent}</div>
                )
              )
            }
            break
          case 'quote':
            if (properties.title) {
              const originalContent = properties.title[0][0]
              const quoteContent = originalContent.replace(/\\n/g, '<br/>')
              properties.title[0][0] = quoteContent

              toRender.push(
                React.createElement(
                  components.blockquote,
                  {
                    key: id,
                    className:
                      'italic border-l-4 border-gray-700 px-3 py-1 text-lg leading-relaxed my-3',
                    style: {
                      whiteSpace: 'pre-wrap',
                    },
                  },
                  properties.title
                )
              )
            }
            break
          default:
            if (process.env.NODE_ENV !== 'production' && !listTypes.has(type)) {
              console.log('unknown type', type)
            }
            break
        }
        return toRender
      })}
    </>
  )
}

// Get the data for each blog post
export async function getStaticProps({ params }) {
  const slug = getSlug(params)
  // load the postsTable so that we can get the page's ID
  const postsTable = await getBlogIndex()
  const postArray = Object.keys(postsTable)
  const post = postsTable[slug]

  if (!post) {
    console.log(`Failed to find post for slug: ${slug}`)
    return {
      props: {
        redirect: '/',
      },
      revalidate: 5,
    }
  }
  const currentPostIndex = postArray.indexOf(slug)
  const prevPostTitle =
    currentPostIndex - 1 < 0 ? null : postArray[currentPostIndex - 1]
  const nextPostTitle =
    currentPostIndex + 1 >= postArray.length
      ? null
      : postArray[currentPostIndex + 1]
  const prevPost = prevPostTitle != null ? postsTable[prevPostTitle] : null
  const nextPost = nextPostTitle != null ? postsTable[nextPostTitle] : null

  const postData = await getPageData(post.id)
  post.content = postData.blocks

  const { users } = await getNotionUsers(post.Authors || [])
  post.Authors = Object.keys(users).map(id => users[id].full_name)

  return {
    props: {
      post,
      prevPost,
      nextPost,
    },
    revalidate: 10,
  }
}

// Return our list of blog posts to prerender
export async function getStaticPaths() {
  const postsTable = await getBlogIndex()
  const paths = Object.keys(postsTable).map(slug => getBlogLink(slug))
  return {
    paths,
    fallback: false,
  }
}

const listTypes = new Set(['bulleted_list', 'numbered_list'])

const RenderPost = ({ post, prevPost, nextPost, redirect }) => {
  const [contentTableYn, setContentTableYn] = useState(false)

  if (redirect) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
          <meta httpEquiv="refresh" content={`0;url=${redirect}`} />
        </Head>
      </>
    )
  }

  const contentMap = {}
  const allContentMap = {}
  const contents = post.content || []
  contents.forEach(each => {
    const parentId = each.value['parent_id']
    if (contentMap[parentId] == null) {
      contentMap[parentId] = []
    }
    contentMap[parentId].push(each.value)
    allContentMap[each.value.id] = each.value
  })
  const mainContentId = Object.keys(contentMap)[0]

  return (
    <>
      <Header titlePre={post.Page} category={post.Category} />
      <div className="container mx-auto max-w-screen-lg">
        {prevPost && prevPost.Slug && prevPost.Page && postIsReady(prevPost) && (
          <div className={blogStyles.nextPrevPostContainer}>
            <div className={blogStyles.nextPrevPostIconContainer + ' mb-3'}>
              <svg
                className={blogStyles.nextPrevPostIcon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M10.707 7.05L10 6.343 4.343 12l1.414 1.414L10 9.172l4.243 4.242L15.657 12z" />
              </svg>
            </div>
            <div className={blogStyles.nextPrevPostText}>previous post</div>
            <div className={blogStyles.nextPrevPostTitle}>
              <Link
                href={getBlogLink(prevPost.Slug)}
                as={getBlogLink(prevPost.Slug)}
              >
                <a className="border-b-2 border-transparent border-dashed hover:border-purple-500">
                  {prevPost.Page}
                </a>
              </Link>
            </div>
          </div>
        )}
        <div className="bg-white shadow-sm mx-3">
          <div id="post-title" className="relative">
            <div
              id="title-info"
              className="absolute w-full px-3 text-center"
              style={{
                zIndex: 10,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div
                id="post-title"
                className={
                  'break-words font-extrabold text-white ' +
                  blogStyles.postTitle
                }
              >
                <h1>{post.Page || ''}</h1>
              </div>
              <div className="text-gray-400 text-sm">
                {post.Authors.length > 0 && (
                  // <span>{post.Authors.join(' ')}</span>
                  <span>Wan Geun Lee</span>
                )}
                <span> / </span>
                {post.Date && <span>{getDateStr(post.Date)}</span>}
              </div>
            </div>
            <div
              id="title-info__dim"
              className="absolute w-full h-full text-center bg-black opacity-75"
            ></div>
            <img
              src={
                '/post_thumbnail/' +
                (post.Thumbnail && post.Thumbnail !== ''
                  ? post.Thumbnail
                  : 'default.jpg')
              }
              className="w-full"
            />
          </div>

          <div
            id="post-content"
            className={'py-6 break-all ' + blogStyles.postContent}
          >
            {(!post.content || post.content.length === 0) && (
              <p>This post has no content</p>
            )}
            {renderPostContent(
              contentMap,
              contentMap[mainContentId] || [],
              allContentMap
            )}
            <div className="pt-16">
              {post.Tags &&
                post.Tags.split(',').map(tag => (
                  <div
                    className={
                      'inline-block py-px px-2 mr-2 mt-2 bg-purple-500 hover:bg-purple-700 text-white text-sm ' +
                      blogStyles.blogTag
                    }
                  >
                    <Link href="/tag/[slug]" as={'/tag/' + tag}>
                      <a>#{tag}</a>
                    </Link>
                  </div>
                ))}
            </div>

            <div className="py-6">
              <DiscussionEmbed
                shortname="icednuts-space"
                config={{
                  url: 'https://icednut.space/' + post.Slug,
                  identifier: post.Slug,
                  title: post.Page,
                }}
              />
            </div>
          </div>
        </div>
        {nextPost && nextPost.Slug && nextPost.Page && postIsReady(nextPost) && (
          <div className={blogStyles.nextPrevPostContainer}>
            <div className={blogStyles.nextPrevPostIconContainer + ' mt-3'}>
              <svg
                className={blogStyles.nextPrevPostIcon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
            <div className={blogStyles.nextPrevPostText}>next post</div>
            <div className={blogStyles.nextPrevPostTitle}>
              <Link
                href={getBlogLink(nextPost.Slug)}
                as={getBlogLink(nextPost.Slug)}
              >
                <a className="border-b-2 border-transparent border-dashed hover:border-purple-600">
                  {nextPost.Page}
                </a>
              </Link>
            </div>
          </div>
        )}
      </div>
      <div
        className={'fixed ' + blogStyles.postPreviewList}
        style={{ zIndex: 23 }}
      >
        {contentTableYn ? (
          <div
            id="table-of-content__list"
            className={'p-4 bg-white shadow-sm text-sm'}
            style={{ maxHeight: 580, overflow: 'auto' }}
          >
            <div className="grid grid-cols-2">
              <div
                className="inline-block py-px px-2 mt-2 mb-6 bg-purple-500 hover:bg-purple-700 text-white text-sm text-center w-10"
                style={{ marginRight: 'auto' }}
              >
                <a href="#">Top</a>
              </div>
              <div
                className="inline-block py-px px-2 mt-2 mb-6 text-sm text-center w-10 cursor-pointer"
                style={{ marginLeft: 'auto' }}
                onClick={() => setContentTableYn(false)}
              >
                <a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current hover:stroke-2 text-purple-500 hover:text-purple-700"
                    viewBox="0 0 20 20"
                    style={{ width: 14, marginLeft: 'auto' }}
                  >
                    <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="font-bold text-gray-800 text-white mb-3">
              Table of Contents
            </div>
            <div>
              {(post.content || []).map((block, blockIdx) => {
                const { value } = block
                const { type, properties, id, parent_id } = value
                let toRender = []

                const renderHeading = (
                  isSubtitle: boolean,
                  additionalClass: string
                ) => {
                  let titleIcon = (
                    <svg
                      className="fill-current inline mr-2 text-gray-400 w-3 h-3"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M12 5h-2v12H8V3h8v2h-2v12h-2V5zM8 3a4 4 0 1 0 0 8V3z" />
                    </svg>
                  )

                  if (isSubtitle) {
                    titleIcon = (
                      <svg
                        className="fill-current inline mr-2 text-gray-400 w-3 h-3"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M3.5 13H12v5l6-6-6-6v5H4V2H2v11z" />
                      </svg>
                    )
                  }
                  toRender.push(
                    <Heading key={id}>
                      <div key={id} className={additionalClass}>
                        <span>{titleIcon}</span>
                        <span className="border-b-2 border-transparent border-dashed hover:border-gray-400">
                          {textBlock(properties.title, true, id)}
                        </span>
                      </div>
                    </Heading>
                  )
                }

                switch (type) {
                  case 'header':
                    renderHeading(false, 'mb-2 text-gray-800')
                    break
                  case 'sub_header':
                    renderHeading(true, 'pl-4 mb-2 text-gray-700')
                    break
                  case 'sub_sub_header':
                    renderHeading(true, 'pl-8 mb-2 text-gray-600')
                    break
                }
                return toRender
              })}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div
        id="table-of-content__icon"
        className="fixed p-4 opacity-50 bg-white rounded-full cursor-pointer"
        style={{ zIndex: 20, left: '2.25rem', bottom: '2.25rem' }}
        onClick={() => setContentTableYn(true)}
      >
        <svg
          className="fill-current text-purple-600 w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M1 4h2v2H1V4zm4 0h14v2H5V4zM1 9h2v2H1V9zm4 0h14v2H5V9zm-4 5h2v2H1v-2zm4 0h14v2H5v-2z" />
        </svg>
      </div>
    </>
  )
}

export default RenderPost
