import React from 'react'
import Head from 'next/head'
import Header from '../../components/header'
import Heading from '../../components/heading'
import TargetHeading from '../../components/target-heading'
import components from '../../components/dynamic'
import ReactJSXParser from '@zeit/react-jsx-parser'
import blogStyles from '../../styles/blog.module.css'
import { textBlock } from '../../lib/notion/renderers'
import getPageData from '../../lib/notion/getPageData'
import getBlogIndex from '../../lib/notion/getBlogIndex'
import getNotionUsers from '../../lib/notion/getNotionUsers'
import { getBlogLink, getDateStr } from '../../lib/blog-helpers'

// Get the data for each blog post
export async function unstable_getStaticProps({ params: { slug } }) {
  // load the postsTable so that we can get the page's ID
  const postsTable = await getBlogIndex()
  const post = postsTable[slug]

  if (!post) {
    console.log(`Failed to find post for slug: ${slug}`)
    return {
      props: {
        redirect: '/blog',
      },
      revalidate: 5,
    }
  }
  const postData = await getPageData(post.id)
  post.content = postData.blocks

  const { users } = await getNotionUsers(post.Authors || [])
  post.Authors = Object.keys(users).map(id => users[id].full_name)

  return {
    props: {
      post,
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

const RenderPost = ({ post, redirect }) => {
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
      <Header titlePre={post.Page} />
      <div className="container mx-auto max-w-4xl">
        <div className="sticky top-0" style={{ zIndex: 9999 }}>
          <div
            className={
              'absolute p-2 bg-gray-500 text-white overflow-scroll ' +
              blogStyles.postPreviewList
            }
          >
            <svg
              className="fill-current text-white w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M1 4h2v2H1V4zm4 0h14v2H5V4zM1 9h2v2H1V9zm4 0h14v2H5V9zm-4 5h2v2H1v-2zm4 0h14v2H5v-2z" />
            </svg>
            <div className="font-bold text-base text-gray-700 pt-4 pl-4 mb-4">
              Table of Contents
            </div>
            <div className="text-xs px-4">
              {(post.content || []).map((block, blockIdx) => {
                const { value } = block
                const { type, properties, id, parent_id } = value
                let toRender = []

                const renderHeading = (additionalClass: string) => {
                  toRender.push(
                    <Heading key={id}>
                      <div key={id} className={additionalClass}>
                        {textBlock(properties.title, true, id)}
                      </div>
                    </Heading>
                  )
                }

                switch (type) {
                  case 'header':
                    renderHeading('text-sm pl-2 mb-2')
                    break
                  case 'sub_header':
                    renderHeading('text-sm pl-6 mb-2')
                    break
                  case 'sub_sub_header':
                    renderHeading('text-sm pl-10 mb-2')
                    break
                }
                return toRender
              })}
            </div>
          </div>
        </div>

        <div
          className="fixed shadow-2xl p-4 rounded-full text-xs"
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

        <div className="bg-white shadow m-3">
          <div id="post-title" className="relative">
            <div
              id="title-info"
              className="absolute w-full px-3 text-center"
              style={{
                zIndex: 9998,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="text-2xl font-extrabold text-white">
                {post.Page || ''}
              </div>
              <div className="text-gray-400 text-sm">
                {post.Authors.length > 0 && (
                  <span>{post.Authors.join(' ')}</span>
                )}
                <span> / </span>
                {post.Date && <span>{getDateStr(post.Date)}</span>}
              </div>
            </div>
            <div
              id="title-info__dim"
              className="absolute w-full h-full text-center bg-black opacity-75"
            ></div>
            <img src="/3.jpg" className="w-full" />
          </div>

          <div className="p-12">
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
                toRender.push(
                  React.createElement(
                    listTagName,
                    { key: listLastId! },
                    Object.keys(listMap).map(itemId => {
                      if (listMap[itemId].isNested) return null

                      const createEl = item =>
                        React.createElement(
                          components.li || 'ul',
                          { key: item.key },
                          item.children,
                          item.nested.length > 0
                            ? React.createElement(
                                components.ul || 'ul',
                                { key: item + 'sub-list' },
                                item.nested.map(nestedId =>
                                  createEl(listMap[nestedId])
                                )
                              )
                            : null
                        )
                      return createEl(listMap[itemId])
                    })
                  )
                )
                listMap = {}
                listLastId = null
                listTagName = null
              }

              const renderHeading = (Type: string | React.ComponentType) => {
                toRender.push(
                  <TargetHeading key={id}>
                    <Type key={id}>
                      {textBlock(properties.title, true, id)}
                    </Type>
                  </TargetHeading>
                )
              }

              switch (type) {
                case 'page':
                case 'divider':
                  break
                case 'text':
                  if (properties) {
                    toRender.push(textBlock(properties.title, false, id))
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
                    />
                  )
                  break
                }
                case 'header':
                  renderHeading('h1')
                  break
                case 'sub_header':
                  renderHeading('h2')
                  break
                case 'sub_sub_header':
                  renderHeading('h3')
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
                      'inline-block py-px px-2 mr-1 mt-1 bg-teal-400 text-white text-sm ' +
                      blogStyles.blogTag
                    }
                  >
                    #{tag}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RenderPost
