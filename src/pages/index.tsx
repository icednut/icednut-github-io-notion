import Link from 'next/link'
import Header from '../components/header'
import ExtLink from '../components/ext-link'
import Features from '../components/features'
import GitHub from '../components/svgs/github'
import sharedStyles from '../styles/shared.module.css'

export default () => (
  <>
    <Header titlePre="Home" />
    <div className={sharedStyles.layout}>
      <div className="explanation">
        <p>
          Get started by creating a new page in Notion and clicking the deploy
          button below. After you supply your token and the blog index id (the
          page's id in Notion) we will automatically create the table for you!
          See{' '}
          <ExtLink href="https://github.com/ijjk/notion-blog#getting-blog-index-and-token">
            here in the readme
          </ExtLink>{' '}
          for finding the new page's id. To get your token from Notion, login
          and look for a cookie under www.notion.so with the name `token_v2`.
          After finding your token and your blog's page id you should be good to
          go!
        </p>
      </div>
    </div>
  </>
)
