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
      <div className="w-screen pt-12 mb-20 bg-white">
        <img
          src="/wglee2.png"
          alt="wglee"
          className="rounded-full mx-auto shadow"
          style={{ width: '142px' }}
        />
        <div className="flex justify-center my-3">
          <span
            className={
              'text-center text-3xl font-bold capitalize ' + styles.logo
            }
          >
            Icednut's Space
          </span>
        </div>
        <div className="flex justify-center mb-8 border-b border-gray-300 -pb-3">
          {navItems.map(({ label, page }) => {
            const menuColor =
              page === pathname
                ? ' text-teal-400 border-b-2 border-teal-400'
                : ' text-gray-700'
            return (
              <Link href={page}>
                <a
                  className={
                    'hover:text-teal-400 px-5 pb-3 text-base font-light hover:font-bold ' +
                    styles.header_menu +
                    menuColor
                  }
                >
                  {label}
                </a>
              </Link>
            )
          })}
        </div>
      </div>
    </header>
  )
}
