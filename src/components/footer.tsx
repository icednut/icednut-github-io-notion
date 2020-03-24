import { TwitterTimelineEmbed } from 'react-twitter-embed'
import Link from 'next/link'
import ExtLink from '../components/ext-link'

import Facebook from '../components/svgs/facebook'
import GitHub from '../components/svgs/github'
import Twitter from '../components/svgs/twitter'
import LinkedIn from '../components/svgs/linkedin'
import Envelope from '../components/svgs/envelope'
import contactStyles from '../styles/contact.module.css'

const contacts = [
  {
    Comp: Facebook,
    alt: 'facebook icon',
    link: 'https://www.facebook.com/wangeunl',
  },
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
              <div className="font-bold text-sm pb-px">About Me</div>
              <div
                className="border-b-4 border-teal-400"
                style={{ width: '1rem' }}
              ></div>
              <div className="py-2">
                <img
                  src="/wglee.jpg"
                  className="w-full"
                  alt="wglee-thumbnail"
                />
                <div className="text-sm mt-2">
                  <p>
                    Hi, I'm Wan Geun Lee from Korea and working Data Platform
                    Developer and Data Engineer at Kakaopay. If you can't
                    pronounce my name, please call me Will. Icednut's Space is
                    my web backend development log, study note and life log
                    storage. Have a nice day. If you have a question, please
                    contact me by mail icon below. Thank you.
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
                          rel="noopener"
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
              <div className="font-bold text-sm pb-px">Twitter</div>
              <div
                className="border-b-4 border-teal-400"
                style={{ width: '1rem' }}
              ></div>
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
              <div className="font-bold text-sm pb-px">Tags</div>
              <div
                className="border-b-4 border-teal-400"
                style={{ width: '1rem' }}
              ></div>
              <div className="py-2">
                {tagOptions &&
                  tagOptions.map(each => (
                    <Link href={'/tag/[slug]'} as={'/tag/' + each}>
                      <a className="inline-block py-px px-2 mr-2 mt-2 bg-teal-400 hover:bg-teal-600 text-white text-xs post-tag">
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
