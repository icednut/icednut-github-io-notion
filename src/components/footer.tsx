import { TwitterTimelineEmbed } from 'react-twitter-embed'
import Link from 'next/link'
import ExtLink from '../components/ext-link'

import GitHub from '../components/svgs/github'
import Twitter from '../components/svgs/twitter'
import LinkedIn from '../components/svgs/linkedin'
import Envelope from '../components/svgs/envelope'
import contactStyles from '../styles/contact.module.css'

const contacts = [
  {
    Comp: Twitter,
    alt: 'twitter icon',
    link: 'https://twitter.com/crazybnn',
  },
  {
    Comp: GitHub,
    alt: 'github icon',
    link: 'https://github.com/icednut',
  },
  {
    Comp: LinkedIn,
    alt: 'linkedin icon',
    link: 'https://www.linkedin.com/in/wangeun-lee-550a93a2/',
  },
  {
    Comp: Envelope,
    alt: 'envelope icon',
    link: 'mailto:wglee21g@gmail.com',
  },
]

export default ({ tagOptions = [] }) => {
  return (
    <>
      <div
        id="top-button"
        className="fixed shadow-2xl p-4 bg-white rounded-full text-xs opacity-50"
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

      <footer>
        <div className="container mx-auto max-w-screen-lg mt-32 pt-16 pb-8 text-gray-600 border-t border-gray-300 px-3">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 mb-3">
            <div className="mr-1">
              <div className="font-bold text-sm">About Me</div>
              <div className="py-2">
                <img src="/post_thumbnail/default.jpg" className="w-full" />
                <div className="text-sm mt-2">
                  <p>
                    Hi, I'm Wan Geun Lee from Korea. If you can't pronounce my
                    name, please call me Will. Icednut's Space is my web backend
                    development log, study note and life log storage. Have a
                    nice day. If you have question, please contact me below mail
                    icon. Thank you.
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    My Motto: Experience varies directly with equipment ruined.
                    경험은 망가뜨린 도구의 수에 비례한다.
                  </p>
                  <div className="flex justify-start mt-3">
                    {contacts.map(({ Comp, link, alt }) => {
                      return (
                        <a
                          key={link}
                          href={link}
                          aria-label={alt}
                          className="px-4 text-center"
                          target="_blank"
                        >
                          <Comp height={16} className="inline" />
                        </a>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="mx-1">
              <div className="font-bold text-sm">Twitter</div>
              <div className="py-2">
                <TwitterTimelineEmbed
                  sourceType="profile"
                  screenName="crazybnn"
                  options={{ height: 400 }}
                  transparent
                  noHeader
                  noBorders
                  placeholder="Loading"
                />
              </div>
            </div>
            <div className="ml-1">
              <div className="font-bold text-sm">Tags</div>
              <div className="py-2">
                {tagOptions &&
                  tagOptions.map(each => (
                    <Link href={'/tag/' + each} as={'/tag/' + each}>
                      <a className="inline-block py-px px-2 mr-2 mt-2 bg-teal-400 text-white text-sm post-tag">
                        #{each}
                      </a>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
          <div className="text-xs mt-10">@2020 Wan Geun Lee</div>
        </div>
      </footer>
    </>
  )
}
