import Header from '../../components/header'
import React, { useRef, useEffect, useState } from 'react'
import blogStyles from '../../styles/blog.module.css'
// import { getDateStr, postIsReady } from '../../lib/blog-helpers'
// import getNotionUsers from '../../lib/notion/getNotionUsers'
// import getBlogIndex from '../../lib/notion/getBlogIndex'
import getCodeSnippets from '../../lib/cacher/getCodeSnippets'
import Code from '../../components/code'

export async function getStaticProps() {
  // const postsTable = await getBlogIndex(true)
  // const authorsToGet: Set<string> = new Set()
  // const posts: any[] = Object.keys(postsTable)
  //   .map(slug => {
  //     const post = postsTable[slug]
  //     if (!postIsReady(post)) {
  //       return null
  //     }
  //     post.Authors = post.Authors || []
  //     for (const author of post.Authors) {
  //       authorsToGet.add(author)
  //     }
  //     return post
  //   })
  //   .filter(Boolean)

  // const { users } = await getNotionUsers([...authorsToGet])

  // posts.map(post => {
  //   post.Authors = post.Authors.map(id => users[id].full_name)
  // })

  const postPerYearMap = {}
  // posts.forEach(post => {
  //   const postDate = getDateStr(post.Date).split(', ')
  //   const year = parseInt(postDate[1])

  //   if (!postPerYearMap[year]) {
  //     postPerYearMap[year] = []
  //   }
  //   postPerYearMap[year].push(post)
  // })

  const codeSnippets = await getCodeSnippets()
  const {
    data: {
      personalLibrary: { snippets },
    },
  } = codeSnippets

  return {
    props: {
      postPerYearMap,
      snippets,
    },
    revalidate: 10,
  }
}

export default ({ postPerYearMap, snippets = [] }) => {
  const publicSnippets = snippets.filter(each => !each.isPrivate)

  publicSnippets.forEach(snippet => {
    const titles = snippet.title.split(']')
    let title
    let tags = []

    if (titles.length === 1) {
      title = titles[0]
    } else if (titles.length === 2) {
      title = titles[1].substring(1)
      tags = titles[0]
        .substring(1)
        .split(',')
        .map(tag => tag.trim())
    } else {
      title = 'unknown'
    }
    snippet.actualTitle = title
    snippet.tags = tags
  })
  const [showTargetSnippets, setShowTargetSnippets] = useState(publicSnippets)
  const [selectedTag, setSelectedTag] = useState('')
  const [selectedSnippet, setSelectedSnippet] = useState(null)

  const getSnippetContents = targetSnippet =>
    (targetSnippet.files || []).map(snippetContent => {
      return (
        <Code language={snippetContent.filetype} name={snippetContent.filename}>
          {snippetContent.content}
        </Code>
      )
    })

  const getTagDoms = snippet =>
    snippet.tags.map(tag => (
      <div
        className={
          'inline-block py-px px-2 mr-2 mt-2 bg-purple-500 hover:bg-purple-700 text-white text-sm cursor-pointer'
        }
        onClick={() => {
          setSelectedSnippet(null)

          if (selectedTag === tag) {
            setSelectedTag('')
            setShowTargetSnippets(publicSnippets)
          } else {
            const filteredTargetSnippets = publicSnippets.filter(snippet =>
              snippet.tags.includes(tag)
            )
            setShowTargetSnippets(filteredTargetSnippets)
            setSelectedTag(tag)
          }
        }}
      >
        #{tag}
      </div>
    ))

  const getSnippetDoms = targetSnippets =>
    targetSnippets.map(snippet => {
      const descriptionPreview = (snippet.description || '').split('\n')[0]

      return (
        <div className="bg-white shadow hover:shadow-xl transition-all duration-300">
          <div
            className="border-b border-gray-300 py-3 px-5 cursor-pointer"
            onClick={() => setSelectedSnippet(snippet)}
          >
            <div className="text-lg text-bold">
              {snippet.actualTitle}
              <div className="text-xs text-gray-600">
                {snippet.createdAt.split('T')[0]}
              </div>
            </div>
          </div>
          <div
            className="px-6 py-3 cursor-pointer"
            onClick={() => setSelectedSnippet(snippet)}
          >
            <div className="p-3 rounded bg-gray-100 mb-3 rounded">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {descriptionPreview}
              </pre>
              <span className="text-xs text-gray-500">Read more</span>
            </div>
            <div
              className="grid grid-cols-1 overflow-y-auto"
              style={{ height: '16rem' }}
            >
              {getSnippetContents(snippet)}
            </div>
          </div>
          <div className="px-6 py-3">{getTagDoms(snippet)}</div>
        </div>
      )
    })

  const getSnippetDetailDoms = targetSnippet => {
    return (
      <div className="bg-white shadow">
        <div className="flex border-b border-gray-300 py-3 px-5">
          <div className="flex-grow text-lg text-bold">
            {targetSnippet.actualTitle}
            <div className="text-xs text-gray-600">
              {targetSnippet.createdAt.split('T')[0]}
            </div>
          </div>
          <div
            className="cursor-pointer p-4"
            onClick={() => setSelectedSnippet(null)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current text-purple-600 w-5 h-5"
              viewBox="0 0 20 20"
            >
              <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
            </svg>
          </div>
        </div>
        <div className="px-6 py-3">
          <div className="p-3 rounded bg-gray-100 mb-3 rounded">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {targetSnippet.description}
            </pre>
          </div>
          <div className="grid grid-cols-1 overflow-auto">
            {getSnippetContents(targetSnippet)}
          </div>
        </div>
        <div className="px-6 py-3">{getTagDoms(targetSnippet)}</div>
      </div>
    )
  }

  const getTagListDom = snippets => {
    const tagMap = {}
    snippets.forEach(snippet => {
      snippet.tags.forEach(
        tag => (tagMap[tag] = (!tagMap[tag] ? 0 : tagMap[tag]) + 1)
      )
    })
    const tagList: any = []

    Object.keys(tagMap).forEach(key => {
      tagList.push(key)
    })
    tagList.sort((a, b) => {
      if (tagMap[a] > tagMap[b]) {
        return -1
      } else if (tagMap[a] < tagMap[b]) {
        return 1
      } else {
        return 0
      }
    })
    return tagList.map(tag => (
      <div
        className={
          'p-2 text-white text-sm cursor-pointer ' +
          (selectedTag === tag
            ? 'bg-purple-700'
            : 'bg-purple-500 hover:bg-purple-700')
        }
        style={{ minWidth: 'fit-content' }}
        onClick={() => {
          setSelectedSnippet(null)

          if (selectedTag === tag) {
            setSelectedTag('')
            setShowTargetSnippets(publicSnippets)
          } else {
            const filteredTargetSnippets = publicSnippets.filter(snippet =>
              snippet.tags.includes(tag)
            )
            setShowTargetSnippets(filteredTargetSnippets)
            setSelectedTag(tag)
          }
        }}
      >
        #{tag}&nbsp;
        <div className="inline-block bg-purple-200 rounded-full text-purple-600 text-xs p-1 text-center">
          {tagMap[tag]}
        </div>
      </div>
    ))
  }

  return (
    <>
      <Header titlePre="Snippet" category="Snippet" />
      <div className="container mx-auto max-w-screen-xl overflow-auto grid pt-16">
        <div className={'break-all ' + blogStyles.postContent}>
          <div className="flex flex-nowrap gap-2 pb-4 mb-4 overflow-x-auto">
            {getTagListDom(publicSnippets)}
          </div>
          {selectedSnippet == null ? (
            <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-6 pb-8">
              {getSnippetDoms(showTargetSnippets)}
            </div>
          ) : (
            <div className="pb-8">{getSnippetDetailDoms(selectedSnippet)}</div>
          )}
        </div>
      </div>
    </>
  )
}
