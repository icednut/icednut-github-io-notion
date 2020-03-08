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
    link: 'https://www.linkedin.com/in/jj-kasper-0b5392166/',
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
      <footer>
        <div className="container mx-auto max-w-screen-lg mt-32 pt-16 pb-8 text-gray-600 border-t border-gray-300 px-3">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 mb-3">
            <div className="mr-1">
              <div className="font-bold text-sm">About Me</div>
              <div className="py-2">
                <img src="/3.jpg" className="w-full" />
                <div className="text-sm mt-2">
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  diam nonumy eirmod tempor invidunt ut labore et dolore magna
                  aliquyam erat, sed diam voluptua.
                  <div className="flex justify-start mt-3">
                    {contacts.map(({ Comp, link, alt }) => {
                      return (
                        <a
                          key={link}
                          href={link}
                          aria-label={alt}
                          className="px-4 text-center"
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
                      <a className="inline-block py-px px-2 mr-1 mt-1 bg-teal-400 text-white text-sm post-tag">
                        #{each}
                      </a>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
          <div className="text-xs mt-3">@Copyright Wan Geun Lee</div>
        </div>
      </footer>
    </>
  )
}
