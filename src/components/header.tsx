import Link from 'next/link'
import Head from 'next/head'
import ExtLink from './ext-link'
import { useRouter } from 'next/router'
import styles from '../styles/header.module.css'

const navItems: { label: string; page?: string }[] = [
  { label: 'DevLog', page: '/' },
  { label: 'StudyNote', page: '/studynote' },
  { label: 'All', page: '/timeline' },
]

const ogImageUrl = 'https://icednut-github-io-notion.now.sh/og-image.jpg'

export default ({ titlePre = '', category = '' }) => {
  return (
    <header>
      <Head>
        <title>
          {titlePre ? `${titlePre} |` : ''} Icednut's Space Notion Blog
        </title>
        <meta
          name="description"
          content="Web Backend Development, Study Note, Life Log using Notion"
        />
        <meta name="og:title" content="Icednut's Space Notion Blog" />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:site" content="@crazybnn" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImageUrl} />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-91631073-2"
        ></script>
        <script>
          window.dataLayer = window.dataLayer || [] function gtag()
          {dataLayer.push(arguments)}
          gtag('js', new Date()) gtag('config', 'UA-91631073-2')
        </script>
      </Head>
      <div className="relative pt-12 mb-20 bg-white">
        <div className="absolute" style={{ left: '1.25rem', top: '1.25rem' }}>
          <Link href="/atom">
            <a target="_blank">
              <svg
                id="Bold"
                height="14"
                viewBox="0 0 24 24"
                width="14"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="3.429" cy="20.571" r="3.429" />
                <path d="m11.429 24h4.57c0-8.821-7.178-15.999-15.999-16v4.572c6.302.001 11.429 5.126 11.429 11.428z" />
                <path d="m24 24c0-13.234-10.766-24-24-24v4.571c10.714 0 19.43 8.714 19.43 19.429z" />
              </svg>
            </a>
          </Link>
        </div>
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
              label === category
                ? ' text-teal-400 border-b-2 border-teal-400'
                : ' text-gray-700'
            return (
              <Link href={page} as={page}>
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
