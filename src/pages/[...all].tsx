import React from 'react'
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
import { getBlogLink, getDateStr } from '../lib/blog-helpers'
import { Z_DEFAULT_COMPRESSION } from 'zlib'
import Link from 'next/link'

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

// Get the data for each blog post
export async function unstable_getStaticProps({ params }) {
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
export async function unstable_getStaticPaths() {
  const postsTable = await getBlogIndex()
  return Object.keys(postsTable).map(slug => getBlogLink(slug))
}

const listTypes = new Set(['bulleted_list', 'numbered_list'])

const RenderPost = ({ post, prevPost, nextPost, redirect }) => {
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

  return (
    <>
      <Header titlePre={post.Page} category={post.Category} />
      <div className="container mx-auto max-w-screen-lg">
        {prevPost && prevPost.Slug && prevPost.Page && (
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
                <a className="border-b-2 border-transparent border-dashed hover:border-teal-400">
                  {prevPost.Page}
                </a>
              </Link>
            </div>
          </div>
        )}

        <div className={'sticky top-0 px-3'} style={{ zIndex: 20 }}>
          <div
            className={'absolute overflow-hidden ' + blogStyles.postPreviewList}
          >
            <div
              id="table-of-content__icon"
              className="absolute p-2 bg-teal-400 w-8 opacity-50"
              style={{ zIndex: 22 }}
            >
              <svg
                className="fill-current text-white w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M1 4h2v2H1V4zm4 0h14v2H5V4zM1 9h2v2H1V9zm4 0h14v2H5V9zm-4 5h2v2H1v-2zm4 0h14v2H5v-2z" />
              </svg>
            </div>
            <div
              id="table-of-content__list"
              className={
                'absolute overflow-hidden w-full h-full pt-10 px-3 bg-white border border-dotted border-gray-400 text-sm'
              }
              style={{ zIndex: 21 }}
            >
              <div className="font-bold text-gray-800 text-white mb-4">
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
                          <span>{textBlock(properties.title, true, id)}</span>
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
          </div>
        </div>

        <div
          id="top-button"
          className="fixed shadow-2xl p-4 bg-white rounded-full text-xs opacity-50"
          style={{ right: '26px', bottom: '29px' }}
        >
          <a href="#">
            <svg
              className="fill-current text-gray-600 w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M10.707 7.05L10 6.343 4.343 12l1.414 1.414L10 9.172l4.243 4.242L15.657 12z" />
            </svg>
          </a>
        </div>

        <div className="bg-white shadow mx-3">
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
                {post.Page || ''}
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

            {(post.content || []).map((block, blockIdx) => {
              const { value } = block
              const { type, properties, id, parent_id } = value
              const isLast = blockIdx === post.content.length - 1
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
                      if (listMap[itemId].isNested) return null

                      const createEl = (item, additionalMarginClass) =>
                        React.createElement(
                          components.li || 'ul',
                          {
                            key: item.key,
                            className:
                              additionalMarginClass + ' pl-2 leading-loose',
                          },
                          item.children,
                          item.nested.length > 0
                            ? React.createElement(
                                components.ul || 'ul',
                                {
                                  key: item + 'sub-list',
                                  className: 'my-1 list-disc list-inside',
                                },
                                item.nested.map(nestedId =>
                                  createEl(listMap[nestedId], 'ml-6')
                                )
                              )
                            : null
                        )
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

              //   console.log(type, properties)
              switch (type) {
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
                  const { block_width } = format
                  const baseBlockWidth = 768
                  const roundFactor = Math.pow(10, 2)
                  // calculate percentages
                  const width = block_width
                    ? `${Math.round(
                        (block_width / baseBlockWidth) * 100 * roundFactor
                      ) / roundFactor}%`
                    : '100%'

                  const isImage = type === 'image'
                  const Comp = isImage ? 'img' : 'video'

                  toRender.push(
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
                  break
                }
                case 'header':
                  renderHeading(
                    'h1',
                    'mt-4 mb-px leading-loose text-3xl font-bold'
                  )
                  break
                case 'sub_header':
                  renderHeading(
                    'h2',
                    'mt-3 mb-px leading-loose text-xl font-bold'
                  )
                  break
                case 'sub_sub_header':
                  renderHeading(
                    'h3',
                    'mt-2 mb-px leading-loose text-lg font-bold'
                  )
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
                case 'quote':
                  if (properties.title) {
                    toRender.push(
                      React.createElement(
                        components.blockquote,
                        { key: id },
                        properties.title
                      )
                    )
                  }
                  break
                default:
                  if (
                    process.env.NODE_ENV !== 'production' &&
                    !listTypes.has(type)
                  ) {
                    console.log('unknown type', type)
                  }
                  break
              }
              return toRender
            })}
            <div className="pt-16">
              {post.Tags &&
                post.Tags.split(',').map(tag => (
                  <div
                    className={
                      'inline-block py-px px-2 mr-2 mt-2 bg-teal-400 text-white text-sm ' +
                      blogStyles.blogTag
                    }
                  >
                    #{tag}
                  </div>
                ))}
            </div>
          </div>
        </div>
        {nextPost && nextPost.Slug && nextPost.Page && (
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
                <a className="border-b-2 border-transparent border-dashed hover:border-teal-400">
                  {nextPost.Page}
                </a>
              </Link>
            </div>
          </div>
        )}

        <div className="bg-white shadow mx-3 my-10 px-12 py-6">Comment</div>
      </div>
    </>
  )
}

export default RenderPost
