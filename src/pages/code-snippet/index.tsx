import Header from '../../components/header'
import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import Envelope from '../../components/svgs/envelope'
import { getDateStr, postIsReady } from '../../lib/blog-helpers'
import getNotionUsers from '../../lib/notion/getNotionUsers'
import getBlogIndex from '../../lib/notion/getBlogIndex'
import getCodeSnippets from '../../lib/cacher/getCodeSnippets'
import Code from '../../components/code'

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

  const codeSnippets = await getCodeSnippets()
  const {
    data: {
      user,
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

  const getSnippetDoms = targetSnippets =>
    targetSnippets.map(snippet => {
      const snippetContents = (snippet.files || []).map(snippetContent => {
        return (
          <div>
            <Code
              language={snippetContent.filetype}
              name={snippetContent.filename}
            >
              {snippetContent.content}
            </Code>
          </div>
        )
      })

      const descriptionPreview = (snippet.description || '').split('\n')[0]
      const tagDoms = snippet.tags.map(tag => (
        <div
          className={
            'inline-block py-px px-2 mr-2 mt-2 bg-purple-500 hover:bg-purple-700 text-white text-sm cursor-pointer'
          }
          onClick={() => {
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

      return (
        <div className="bg-white shadow-sm">
          <div
            className="flex border-b border-gray-300 p-3 cursor-pointer"
            onClick={() =>
              (window.location.href = `/code-snippet/${snippet.guid}`)
            }
          >
            <div className="flex-grow text-base text-bold">
              {snippet.actualTitle}
            </div>
            <div className="text-xs text-gray-600">{snippet.createdAt}</div>
          </div>
          <div
            className="px-6 py-3 cursor-pointer"
            onClick={() =>
              (window.location.href = `/code-snippet/${snippet.guid}`)
            }
          >
            <div className="p-3 rounded bg-gray-100 mb-3 rounded">
              <pre className="text-sm text-gray-700">{descriptionPreview}</pre>
              <span className="text-xs text-gray-500">Read more</span>
            </div>
            <div className="overflow-auto" style={{ height: '16rem' }}>
              {snippetContents}
            </div>
          </div>
          <div className="px-6 py-3">{tagDoms}</div>
        </div>
      )
    })

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
          'inline-block p-2 mr-2 mt-2 text-white text-sm cursor-pointer ' +
          (selectedTag === tag
            ? 'bg-purple-700'
            : 'bg-purple-500 hover:bg-purple-700')
        }
        onClick={() => {
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
        #{tag}{' '}
        <div className="inline-block bg-purple-200 rounded-full text-purple-600 text-xs p-1 w-6 text-center">
          {tagMap[tag]}
        </div>
      </div>
    ))
  }

  return (
    <>
      <Header titlePre="Code Snippet" category="Code Snippet" />

      <div className="container mx-auto max-w-screen-xl grid px-3 pt-12">
        <div className="flex flex-wrap pb-8">
          {getTagListDom(publicSnippets)}
        </div>
        <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-6">
          {getSnippetDoms(showTargetSnippets)}
        </div>
      </div>
    </>
  )
}
