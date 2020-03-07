import ExtLink from './ext-link'
import { TwitterTimelineEmbed } from 'react-twitter-embed'

export default () => (
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
              <span className="inline-block py-px px-2 mr-1 mt-1 bg-teal-400 text-white text-sm post-tag">
                #Akka
              </span>
              <span className="inline-block py-px px-2 mr-1 mt-1 bg-teal-400 text-white text-sm post-tag">
                #Scala
              </span>
              <span className="inline-block py-px px-2 mr-1 mt-1 bg-teal-400 text-white text-sm post-tag">
                #Functional Programming
              </span>
              <span className="inline-block py-px px-2 mr-1 mt-1 bg-teal-400 text-white text-sm post-tag">
                #Java
              </span>
              <span className="inline-block py-px px-2 mr-1 mt-1 bg-teal-400 text-white text-sm post-tag">
                #Kotlin
              </span>
            </div>
          </div>
        </div>
        <div className="text-xs mt-3">@Copyright Wan Geun Lee</div>
      </div>
    </footer>
  </>
)
