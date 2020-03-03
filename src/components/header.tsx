import Link from 'next/link'
import Head from 'next/head'
import ExtLink from './ext-link'
import { useRouter } from 'next/router'
import styles from '../styles/header.module.css'

const navItems: { label: string; page?: string }[] = [
  { label: 'DevLog', page: '/' },
  { label: 'StudyNote', page: '/blog' },
  { label: 'Life', page: '/contact' },
]

const ogImageUrl = 'https://notion-blog.now.sh/og-image.png'

export default ({ titlePre = '' }) => {
  const { pathname } = useRouter()

  return (
    <header>
      <Head>
        <title>{titlePre ? `${titlePre} |` : ''} My Notion Blog</title>
        <meta
          name="description"
          content="An example Next.js site using Notion for the blog"
        />
        <meta name="og:title" content="My Notion Blog" />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:site" content="@_ijjk" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImageUrl} />
      </Head>
      <div className="container mx-auto pt-12">
        <img
          src="wglee2.png"
          alt="wglee"
          className="rounded-full mx-auto shadow"
          style={{ width: '142px' }}
        />
        <div className="flex justify-center my-3">
          <span className="text-center text-2xl capitalize">
            Icednut's Space
          </span>
        </div>
        <div className="flex justify-center mt-3 mb-8">
          {navItems.map(({ label, page }) => (
            <Link href={page}>
              <a className="px-5 hover:font-bold">{label}</a>
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
