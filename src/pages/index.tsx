import Link from 'next/link'
import Header from '../components/header'
import ExtLink from '../components/ext-link'
import Features from '../components/features'
import GitHub from '../components/svgs/github'
import sharedStyles from '../styles/shared.module.css'
import { CSSGrid, layout } from 'react-stonecutter'

export default () => (
  <>
    <Header titlePre="Home" />
    <div className="container mx-auto grid">
      <div className="gap-3 masonry m-4">
        <div className="bg-gray-200 rounded-lg overflow-hidden shadow-md inline-block mb-4">
          <div className="p-3">
            <img
              className="w-full rounded-lg"
              src="table-view.png"
              alt="Sunset in the mountains"
            />
          </div>
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">1. The Coldest Sunset</div>
            <p className="text-gray-700 text-base">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatibus quia, nulla! Maiores et perferendis eaque,
              exercitationem praesentium nihil.
            </p>
          </div>
          <div className="px-6 py-4">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
              #photography
            </span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
              #travel
            </span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
              #winter
            </span>
          </div>
        </div>
        <div className="bg-gray-200 rounded-lg overflow-hidden shadow-md inline-block mb-4">
          <div className="p-3">
            <img
              className="w-full rounded-lg"
              src="avatar.png"
              alt="Sunset in the mountains"
            />
          </div>
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">2. The Coldest Sunset</div>
            <p className="text-gray-700 text-base">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatibus quia, nulla!
            </p>
          </div>
          <div className="px-6 py-4">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
              #photography
            </span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
              #travel
            </span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
              #winter
            </span>
          </div>
        </div>
        <div className="bg-gray-200 rounded-lg overflow-hidden shadow-md inline-block mb-4">
          <div className="p-3">
            <img
              className="w-full rounded-lg"
              src="avatar.png"
              alt="Sunset in the mountains"
            />
          </div>
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">3. The Coldest Sunset</div>
            <p className="text-gray-700 text-base">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatibus quia, nulla! Maiores et perferendis eaque,
              exercitationem praesentium nihil.Lorem ipsum dolor sit amet,
              consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et
              perferendis eaque, exercitationem praesentium nihil.Lorem ipsum
              dolor sit amet, consectetur adipisicing elit. Voluptatibus quia,
              nulla! Maiores et perferendis eaque, exercitationem praesentium
              nihil.Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatibus quia, nulla! Maiores et perferendis eaque,
              exercitationem praesentium nihil.Lorem ipsum dolor sit amet,
              consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et
              perferendis eaque, exercitationem praesentium nihil.Lorem ipsum
              dolor sit amet, consectetur adipisicing elit. Voluptatibus quia,
              nulla! Maiores et perferendis eaque, exercitationem praesentium
              nihil.Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatibus quia, nulla! Maiores et perferendis eaque,
              exercitationem praesentium nihil.Lorem ipsum dolor sit amet,
              consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et
              perferendis eaque, exercitationem praesentium nihil.
            </p>
          </div>
          <div className="px-6 py-4">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
              #photography
            </span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
              #travel
            </span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
              #winter
            </span>
          </div>
        </div>
        <div className="bg-gray-200 rounded-lg overflow-hidden shadow-md inline-block mb-4">
          <div className="p-3">
            <img
              className="w-full rounded-lg"
              src="avatar.png"
              alt="Sunset in the mountains"
            />
          </div>
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">4. The Coldest Sunset</div>
            <p className="text-gray-700 text-base">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatibus quia, nulla! Maiores et perferendis eaque,
              exercitationem praesentium nihil.
            </p>
          </div>
          <div className="px-6 py-4">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
              #photography
            </span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
              #travel
            </span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
              #winter
            </span>
          </div>
        </div>
        <div className="bg-gray-200 rounded-lg overflow-hidden shadow-md inline-block mb-4">
          <div className="p-3">
            <img
              className="w-full rounded-lg"
              src="avatar.png"
              alt="Sunset in the mountains"
            />
          </div>
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">5. The Coldest Sunset</div>
            <p className="text-gray-700 text-base">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatibus quia, nulla! Maiores et perferendis eaque,
              exercitationem praesentium nihil.
            </p>
          </div>
          <div className="px-6 py-4">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
              #photography
            </span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
              #travel
            </span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
              #winter
            </span>
          </div>
        </div>
        <div className="bg-gray-200 rounded-lg overflow-hidden shadow-md inline-block mb-4">
          <div className="p-3">
            <img
              className="w-full rounded-lg"
              src="avatar.png"
              alt="Sunset in the mountains"
            />
          </div>
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">6. The Coldest Sunset</div>
            <p className="text-gray-700 text-base">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatibus quia, nulla!
            </p>
          </div>
          <div className="px-6 py-4">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
              #photography
            </span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
              #travel
            </span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
              #winter
            </span>
          </div>
        </div>
        <div className="bg-gray-200 rounded-lg overflow-hidden shadow-md inline-block mb-4">
          <div className="p-3">
            <img
              className="w-full rounded-lg"
              src="avatar.png"
              alt="Sunset in the mountains"
            />
          </div>
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">7. The Coldest Sunset</div>
            <p className="text-gray-700 text-base">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatibus quia, nulla! Maiores et perferendis eaque,
              exercitationem praesentium nihil.
            </p>
          </div>
          <div className="px-6 py-4">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
              #photography
            </span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
              #travel
            </span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
              #winter
            </span>
          </div>
        </div>
        <div className="bg-gray-200 rounded-lg overflow-hidden shadow-md inline-block mb-4">
          <div className="p-3">
            <img
              className="w-full rounded-lg"
              src="avatar.png"
              alt="Sunset in the mountains"
            />
          </div>
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">8. The Coldest Sunset</div>
            <p className="text-gray-700 text-base">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatibus quia, nulla! Maiores et perferendis eaque,
              exercitationem praesentium nihil.
            </p>
          </div>
          <div className="px-6 py-4">
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
              #photography
            </span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
              #travel
            </span>
            <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
              #winter
            </span>
          </div>
        </div>
      </div>
    </div>
  </>
)
