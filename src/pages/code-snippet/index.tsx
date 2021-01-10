import Header from '../../components/header'
import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import Envelope from '../../components/svgs/envelope'
import { getDateStr, postIsReady } from '../../lib/blog-helpers'
import getNotionUsers from '../../lib/notion/getNotionUsers'
import getBlogIndex from '../../lib/notion/getBlogIndex'

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

  return {
    props: {
      postPerYearMap,
    },
    revalidate: 10,
  }
}

export default () => {
  return (
    <>
      <Header titlePre="Code Snippet" category="Code Snippet" />

      <div className="container mx-auto max-w-screen-lg grid px-3">
        <div className="text-base">준비 중</div>
      </div>
    </>
  )
}
