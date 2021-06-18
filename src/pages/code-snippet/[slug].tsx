import Header from '../../components/header'
import React, { useRef, useEffect, useState } from 'react'
// import getNotionUsers from '../../lib/notion/getNotionUsers'
import getCodeSnippets from '../../lib/cacher/getCodeSnippets'
import Code from '../../components/code'
import Link from 'next/link'

export async function getStaticProps({ params }) {
  const snippetGuid = params.slug
  // const postsTable = await getBlogIndex(true)
  const authorsToGet: Set<string> = new Set()
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
      user,
      personalLibrary: { snippets },
    },
  } = codeSnippets
  const targetSnippet = snippets.filter(snippet => snippet.guid === snippetGuid)

  return {
    props: {
      postPerYearMap,
      targetSnippet,
    },
    revalidate: 10,
  }
}

export async function getStaticPaths() {
  const codeSnippets = await getCodeSnippets()
  const {
    data: {
      user,
      personalLibrary: { snippets },
    },
  } = codeSnippets
  const snippetUrls = snippets.map(snippet => '/code-snippet/' + snippet.guid)

  return {
    paths: snippetUrls,
    fallback: false,
  }
}

export default ({ postPerYearMap, targetSnippet = [] }) => {
  const [snippet, setSnippet] = useState({})

  if (targetSnippet.length == 0) {
    return <>Invalid snippet</>
  }

  const ts = targetSnippet[0]
  const snippetContents = (ts.files || []).map(snippetContent => {
    return (
      <div>
        <Code language={snippetContent.filetype} name={snippetContent.filename}>
          {snippetContent.content}
        </Code>
      </div>
    )
  })
  const titles = ts.title.split(']')
  let title
  let tags = []

  if (titles.length === 1) {
    title = titles[0]
  } else if (titles.length === 2) {
    title = titles[1].substring(1)
    tags = titles[0]
      .substring(1)
      .split(',')
      .map(tag => (
        <div
          className={
            'inline-block py-px px-2 mr-2 mt-2 bg-purple-500 hover:bg-purple-700 text-white text-sm'
          }
        >
          #{tag}
        </div>
      ))
  } else {
    title = 'unknown'
  }

  return (
    <>
      <Header titlePre="Snippet" category="Snippet" />

      <div className="container mx-auto max-w-screen-lg grid px-3 pt-12">
        <div className="bg-white shadow-sm">
          <div className="flex border-b border-gray-300 p-3">
            <div className="flex-grow text-base text-bold">{title}</div>
            <div className="text-xs text-gray-600">{ts.createdAt}</div>
          </div>
          <div className="px-8 py-6">
            {ts.description && ts.description !== '' ? (
              <div className="p-3 rounded bg-gray-100 mb-3 rounded">
                <pre className="text-sm text-gray-700">{ts.description}</pre>
              </div>
            ) : (
              <></>
            )}
            <div className="overflow-auto">{snippetContents}</div>
          </div>
          <div className="px-8 py-4">{tags}</div>
        </div>
      </div>
      <div
        id="table-of-content__icon"
        className="fixed p-4 opacity-50 bg-white rounded-full cursor-pointer"
        style={{ zIndex: 20, left: '2.25rem', bottom: '2.25rem' }}
      >
        <Link href="/code-snippet">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current text-purple-600 w-6 h-6"
            viewBox="0 0 20 20"
          >
            <path d="M3.828 9l6.071-6.071-1.414-1.414L0 10l.707.707 7.778 7.778 1.414-1.414L3.828 11H20V9H3.828z" />
          </svg>
        </Link>
      </div>
    </>
  )
}
