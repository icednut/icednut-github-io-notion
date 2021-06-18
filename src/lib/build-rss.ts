import { resolve } from 'path'
import { writeFile } from './fs-helpers'
// import { renderToStaticMarkup } from 'react-dom/server'

// import { textBlock } from './notion/renderers'
// import getBlogIndex from './notion/getBlogIndex'
// import getNotionUsers from './notion/getNotionUsers'
// import { postIsReady, getBlogLink } from './blog-helpers'

// must use weird syntax to bypass auto replacing of NODE_ENV
process.env['NODE' + '_ENV'] = 'production'
process.env.USE_CACHE = 'true'

// constants
const NOW = new Date().toJSON()

function mapToAuthor(author) {
  return `<author><name>Wan Geun Lee</name></author>`
}

function decode(string) {
  return string
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function mapToEntry(post) {
  //   ${renderToStaticMarkup(
  //     post.preview
  //       ? (post.preview || []).map((block, idx) =>
  //           textBlock(block, false, post.title + idx)
  //         )
  //       : post.content
  //   )}
  return `
    <entry>
      <id>${post.link}</id>
      <title>${decode(post.title)}</title>
      <link href="https://icednut.space${post.link}"/>
      <updated>${new Date(post.date).toJSON()}</updated>
      <content type="xhtml">
        <div xmlns="http://www.w3.org/1999/xhtml">
          <p class="more">
            <a href="https://icednut.space${post.link}">Read more</a>
          </p>
        </div>
      </content>
      ${(post.authors || []).map(mapToAuthor).join('\n      ')}
    </entry>`
}

function concat(total, item) {
  return total + item
}

function createRSS(blogPosts = []) {
  const postsString = blogPosts.map(mapToEntry).reduce(concat, '')

  return `<?xml version="1.0" encoding="utf-8"?>
  <feed xmlns="http://www.w3.org/2005/Atom">
    <title>Icednut's Space</title>
    <subtitle>Icednut's Space Notion Blog</subtitle>
    <link href="https://icednut.space/atom" rel="self" type="application/rss+xml"/>
    <link href="https://icednut.space/" />
    <updated>${NOW}</updated>
    <id>Icednut's Space Notion Blog</id>${postsString}
  </feed>`
}

async function main() {
  // const postsTable = await getBlogIndex(true)
  const postsTable = {}
  const neededAuthors = new Set<string>()

  const blogPosts = Object.keys(postsTable)
    .map(slug => {
      const post = postsTable[slug]
      // if (!postIsReady(post)) return

      // post.authors = post.Authors || []

      // for (const author of post.authors) {
      //   neededAuthors.add(author)
      // }
      return post
    })
    .filter(Boolean)

  // const { users } = await getNotionUsers([...neededAuthors])
  const users = {}

  blogPosts.forEach(post => {
    post.authors = post.authors.map(id => users[id])
    // post.link = getBlogLink(post.Slug)
    post.title = post.Page
    post.date = post.Date
  })

  const outputPath = './public/atom'
  await writeFile(resolve(outputPath), createRSS(blogPosts), 'utf8')
  console.log(`Atom feed file generated at \`${outputPath}\``)
}

main().catch(error => console.error(error))
