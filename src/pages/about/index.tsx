import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import StickyBox from 'react-sticky-box'
import Header from '../../components/header'
import LinkedIn from '../../components/svgs/linkedin'
import Envelope from '../../components/svgs/envelope'
import { getDateStr, postIsReady } from '../../lib/blog-helpers'
import getNotionUsers from '../../lib/notion/getNotionUsers'
import getBlogIndex from '../../lib/notion/getBlogIndex'

const contacts = [
  {
    Comp: LinkedIn,
    alt: 'linkedin icon',
    link: 'https://www.linkedin.com/in/wan-geun-lee-550a93a2/',
  },
  {
    Comp: Envelope,
    alt: 'envelope icon',
    link: 'mailto:wglee21g@gmail.com',
  },
]

const getDimensions = ele => {
  const { height } = ele.getBoundingClientRect()
  const offsetTop = ele.offsetTop
  const offsetBottom = offsetTop + height + 686

  return {
    height,
    offsetTop,
    offsetBottom,
  }
}

const scrollTo = ele => {
  ele.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

export async function getStaticProps() {
  const postsTable = await getBlogIndex(true)
  const authorsToGet: Set<string> = new Set()
  const posts: any[] = Object.keys(postsTable)
    .map(slug => {
      const post = postsTable[slug]
      if (!postIsReady(post)) {
        return null
      }
      post.Authors = post.Authors || []
      for (const author of post.Authors) {
        authorsToGet.add(author)
      }
      return post
    })
    .filter(Boolean)

  const { users } = await getNotionUsers([...authorsToGet])

  posts.map(post => {
    post.Authors = post.Authors.map(id => users[id].full_name)
  })

  const postPerYearMap = {}
  posts.forEach(post => {
    const postDate = getDateStr(post.Date).split(', ')
    const year = parseInt(postDate[1])

    if (!postPerYearMap[year]) {
      postPerYearMap[year] = []
    }
    postPerYearMap[year].push(post)
  })

  return {
    props: {
      postPerYearMap,
    },
    revalidate: 10,
  }
}

export default () => {
  const [visibleSection, setVisibleSection] = useState('')
  const [kakaopayYn, setKakaopayYn] = useState(true)
  const [skplanetYn, setSkplanetYn] = useState(false)
  const [ntsYn, setNtsYn] = useState(false)
  const techSkillsRef = useRef(null)
  const certificationRef = useRef(null)
  const experienceRef = useRef(null)
  const sideProjectRef = useRef(null)
  const educationRef = useRef(null)
  const sectionRefs = [
    { section: 'tech_skills', ref: techSkillsRef },
    { section: 'certification', ref: certificationRef },
    { section: 'experience', ref: experienceRef },
    { section: 'side_project', ref: sideProjectRef },
    { section: 'education', ref: educationRef },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const { height: headerHeight } = getDimensions(techSkillsRef.current)
      const scrollPosition = window.scrollY + headerHeight

      const selected = sectionRefs.find(({ section, ref }) => {
        const ele = ref.current
        if (ele) {
          const { offsetBottom, offsetTop } = getDimensions(ele)
          return scrollPosition > offsetTop && scrollPosition < offsetBottom
        }
      })

      if (selected && selected.section !== visibleSection) {
        setVisibleSection(selected.section)
      } else if (!selected && visibleSection) {
        setVisibleSection(undefined)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [visibleSection])

  return (
    <>
      <Header titlePre="About Me" category="About Me" />

      <div className="container mx-auto max-w-screen-lg">
        <div className="bg-white shadow-sm" style={{ minWidth: '930px' }}>
          <div className="flex gap-4 mb-3 bg-black py-10 px-20">
            <div className="flex-auto my-auto text-white">
              <div className="text-3xl font-black">이완근 Lee Wan Geun</div>
              <div className="text-sm">Java, Scala Software Engineer</div>
              <div className="flex justify-start">
                {contacts.map(({ Comp, link, alt }) => {
                  return (
                    <a
                      key={link}
                      href={link}
                      aria-label={alt}
                      className="mr-3 text-center"
                      target="_blank"
                      rel="noopener"
                    >
                      <Comp
                        height={16}
                        className="inline"
                        style={{ fill: 'white' }}
                      />
                    </a>
                  )
                })}
              </div>
            </div>
            <div
              className="flex-initial lg:block md:hidden sm:hidden rounded-full w-32 h-32"
              style={{
                backgroundImage: 'url(/about/lwg.jpg)',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
              }}
            ></div>
          </div>
          <div className="mb-20 px-10 py-5">
            <div className="text-right text-xs text-gray-600 mb-8">
              last updated: 2021.01.03
            </div>
            <div id="greeting_kr" className="mb-3">
              안녕하세요, 소프트웨어 엔지니어 이완근 입니다. Java와 Spring
              Framework를 활용한 Backend 웹 개발로 시작하여 현재는 Scala와 분산
              병렬처리에 관심 많은 개발자 입니다. 일상 생활의 불편함을 기술로
              메꾸는 것에 관심이 많으며 기술적인 토론과 경청하는 것을
              좋아합니다.
            </div>
            <div id="greeting_en" className="mb-3">
              Hi, my name is Lee Wan Geun. I'm a software engineer from
              Seong-nam, Korea. I currently am working as a Data Platform
              Engineer at Kakaopay. Thank you.
            </div>
            <div id="focus" className="mb-3">
              <div className="mb-2">Current focus:</div>
              <div className="grid grid-flow-col auto-cols-auto gap-3">
                <div className="p-3 border-2 border-purple-300 text-purple-600 text-center">
                  Scala
                </div>
                <div className="p-3 border-2 border-purple-300 text-purple-600 text-center">
                  Akka (Typed, Cluster, Stream, Persistence)
                </div>
                <div className="p-3 border-2 border-purple-300 text-purple-600 text-center">
                  Event Sourcing
                </div>
              </div>
            </div>
            <div id="motto">
              <div className="mb-2">Favorite Phrase:</div>
              <ul>
                <li>
                  경험은 망가뜨린 도구의 수에 비례한다. Experience varies
                  directly with equipment ruined.
                </li>
              </ul>
            </div>
          </div>

          <div className="flex gap-6 p-10">
            <div className="text-right leading-loose xl:block lg:block md:hidden sm:hidden">
              <StickyBox>
                <div
                  className={`cursor-pointer ${
                    visibleSection === 'tech_skills'
                      ? 'font-black text-purple-800'
                      : 'text-gray-400'
                  }`}
                  onClick={() => scrollTo(techSkillsRef.current)}
                >
                  Tech Skills
                </div>
                <div
                  className={`cursor-pointer ${
                    visibleSection === 'certification'
                      ? 'font-black text-purple-800'
                      : 'text-gray-400'
                  }`}
                  onClick={() => scrollTo(certificationRef.current)}
                >
                  Certification
                </div>
                <div
                  className={`cursor-pointer ${
                    visibleSection === 'experience'
                      ? 'font-black text-purple-800'
                      : 'text-gray-400'
                  }`}
                  onClick={() => scrollTo(experienceRef.current)}
                >
                  Experience
                </div>
                <div
                  className={`cursor-pointer ${
                    visibleSection === 'side_project'
                      ? 'font-black text-purple-800'
                      : 'text-gray-400'
                  }`}
                  onClick={() => scrollTo(sideProjectRef.current)}
                >
                  Side Project
                </div>
                <div
                  className={`cursor-pointer ${
                    visibleSection === 'education'
                      ? 'font-black text-purple-800'
                      : 'text-gray-400'
                  }`}
                  onClick={() => scrollTo(educationRef.current)}
                >
                  Education
                </div>
              </StickyBox>
            </div>
            <div id="about__content">
              <div className="mb-20" id="tech_skills" ref={techSkillsRef}>
                <div
                  className="text-2xl mb-2 text-purple-600"
                  style={{ fontWeight: 'bold' }}
                >
                  Tech Skills
                </div>
                <div className="bg-purple-500 h-1 w-20 my-4"></div>
                <div className="grid grid-cols-2 gap-8">
                  <div id="language">
                    <div className="mb-2 text-xs text-purple-400">Language</div>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex gap-4 items-center">
                        <div className="w-32 text-sm">Java</div>
                        <div className="flex-shrink flex flex-wrap gap-3">
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-32 text-sm">Scala</div>
                        <div className="flex-shrink flex flex-wrap gap-3">
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-32 text-sm">Kotlin</div>
                        <div className="flex-shrink flex flex-wrap gap-3">
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-32 text-sm">Python</div>
                        <div className="flex-shrink flex flex-wrap gap-3">
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-32 text-sm">SQL</div>
                        <div className="flex-shrink flex flex-wrap gap-3">
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="framework">
                    <div className="mb-2 text-xs text-purple-400">
                      Framework
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <div className="flex gap-4 items-center">
                          <div className="w-32 text-sm">Akka Typed 2.6.x</div>
                          <div className="flex flex-wrap gap-3">
                            <div className="inline-block bg-purple-600 w-8 h-2"></div>
                            <div className="inline-block bg-purple-600 w-8 h-2"></div>
                            <div className="inline-block bg-purple-600 w-8 h-2"></div>
                            <div className="inline-block bg-purple-600 w-8 h-2"></div>
                            <div className="inline-block bg-gray-400 w-8 h-2"></div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600">
                          Akka Http, Akka Clustering, Akka Persistence, Alpakka
                        </div>
                      </div>
                      <div>
                        <div className="flex gap-4 items-center">
                          <div className="w-32 text-sm">Spring Framework</div>
                          <div className="flex flex-wrap gap-3">
                            <div className="inline-block bg-purple-600 w-8 h-2"></div>
                            <div className="inline-block bg-purple-600 w-8 h-2"></div>
                            <div className="inline-block bg-purple-600 w-8 h-2"></div>
                            <div className="inline-block bg-purple-600 w-8 h-2"></div>
                            <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600">
                          Spring MVC, Spring Batch, Spring Data JPA, Spring
                          Cloud Stream
                        </div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-32 text-sm">JPA (Hibernate)</div>
                        <div className="flex flex-wrap gap-3">
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-32 text-sm">Pandas</div>
                        <div className="flex flex-wrap gap-3">
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-32 text-sm">Tensorflow</div>
                        <div className="flex flex-wrap gap-3">
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="database">
                    <div className="mb-2 text-xs text-purple-400">
                      Database & Data Platform
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex gap-4 items-center">
                        <div className="w-32 text-sm">
                          Apache Airflow{' '}
                          <span className="text-lg text-red-500">*</span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-32 text-sm">
                          Apache Druid{' '}
                          <span className="text-lg text-red-500">*</span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-32 text-sm">Apache Kafka</div>
                        <div className="flex flex-wrap gap-3">
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-32 text-sm">Spark Streaming</div>
                        <div className="flex flex-wrap gap-3">
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-32 text-sm">MySQL</div>
                        <div className="flex flex-wrap gap-3">
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-32 text-sm">Redis</div>
                        <div className="flex flex-wrap gap-3">
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-32 text-sm">Hbase</div>
                        <div className="flex flex-wrap gap-3">
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-32 text-sm">Impala, Kudu</div>
                        <div className="flex flex-wrap gap-3">
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="text-xs text-gray-500 text-right">
                          <div className="text-lg text-red-500 align-bottom leading-3 inline-block">
                            *
                          </div>{' '}
                          : 직접 구축 및 운영 경험
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="virtualization">
                    <div className="mb-2 text-xs text-purple-400">
                      Virtualization & Orchestration
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex gap-4 items-center">
                        <div className="w-32 text-sm">Docker</div>
                        <div className="flex flex-wrap gap-3">
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-32 text-sm">Kubernetes</div>
                        <div className="flex flex-wrap gap-3">
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-32 text-sm">Helm</div>
                        <div className="flex flex-wrap gap-3">
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="frondend">
                    <div className="mb-2 text-xs text-purple-400">
                      Front End
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex gap-4 items-center">
                        <div className="w-32 text-sm">Javascript</div>
                        <div className="flex flex-wrap gap-3">
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-32 text-sm">React</div>
                        <div className="flex flex-wrap gap-3">
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-32 text-sm">CSS, Tailwind CSS</div>
                        <div className="flex flex-wrap gap-3">
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-32 text-sm">HTML</div>
                        <div className="flex flex-wrap gap-3">
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="tool">
                    <div className="mb-2 text-xs text-purple-400">Tool</div>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex gap-4 items-center">
                        <div className="w-32 text-sm">Git</div>
                        <div className="flex flex-wrap gap-3">
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-32 text-sm">Notion</div>
                        <div className="flex flex-wrap gap-3">
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-32 text-sm">Visual Studio Code</div>
                        <div className="flex flex-wrap gap-3">
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="w-32 text-sm">IntelliJ</div>
                        <div className="flex flex-wrap gap-3">
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-purple-600 w-8 h-2"></div>
                          <div className="inline-block bg-gray-400 w-8 h-2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-20" id="certification" ref={certificationRef}>
                <div className="text-2xl font-black text-purple-600">
                  Certification
                </div>
                <div className="bg-purple-500 h-1 w-20 my-4"></div>
                <div>
                  정보처리기사 (고유번호: 10201100538J){' '}
                  <span className="text-sm text-gray-500">2010.05</span>
                </div>
              </div>

              <div className="mb-20" id="experience" ref={experienceRef}>
                <div className="text-2xl font-black mb-2 text-purple-600">
                  Experience
                </div>
                <div className="bg-purple-500 h-1 w-20 my-4"></div>
                <div className="mb-8">
                  <div className="mb-3 flex gap-2">
                    <div style={{ width: '3.5rem' }}>
                      <img src="/about/kakaopay_logo.png" />
                    </div>
                    <div
                      id="kakaopay"
                      className="flex-shrink"
                      style={{ width: '100%' }}
                    >
                      <div>
                        <span className="text-2xl mr-2">Kakaopay</span>
                        <span className="text-sm text-purple-500">
                          Full Stack Developer, Data Platform Engineer
                        </span>
                      </div>
                      <div className="text-sm">2018.05 ~ Current</div>
                    </div>
                    <div
                      className="h-10 w-10 cursor-pointer"
                      onClick={() => setKakaopayYn(!kakaopayYn)}
                    >
                      {kakaopayYn ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="#D1D5DB"
                        >
                          <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm5-9v2H5V9h10z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="#D1D5DB"
                        >
                          <path d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2v4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  {kakaopayYn && (
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <div className="border-t border-b border-purple-400 p-2 mb-2 flex">
                          <div
                            className="flex-auto align-middle"
                            style={{ lineHeight: '2.5rem' }}
                          >
                            RMS (Risk Management System)
                          </div>
                          <div className="flex-initial">
                            <div className="text-sm text-purple-600">
                              Backend Developer, Data Platform Engineer
                            </div>
                            <div className="text-sm text-purple-500 float-right">
                              2020.02 ~ Current
                            </div>
                          </div>
                        </div>
                        <ul className="text-sm">
                          <li>카카오페이 위험 관리 시스템의 엔진 개발</li>
                          <li>위험 흐름 탐지 룰 엔진 시스템 설계 및 개발</li>
                          <li>데이터 가공 배치 시스템 구축 및 운영</li>
                          <li>
                            위험 탐지 머신러닝 모델(Tensorflow, Sklearn)
                            인퍼런스 API 파이프라인 구축
                          </li>
                        </ul>
                        <div className="mt-1">
                          <div className="text-purple-400 text-xs mb-1">
                            Skills
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Scala
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Akka Typed
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Akka Cluster Sharding
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Akka Persistence
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Alpakka Kafka
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Slick
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              MySQL
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Redis
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Kafka
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Hbase
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Kotlin
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Spring Cloud Stream
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Tensorflow for Java
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              JPMML
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="border-t border-b border-purple-400 p-2 mb-2 flex">
                          <div
                            className="flex-auto align-middle"
                            style={{ lineHeight: '2.5rem' }}
                          >
                            FDS (Fraud Detection System)
                          </div>
                          <div className="flex-initial">
                            <div className="text-sm text-purple-600">
                              Full Stack Developer
                            </div>
                            <div className="text-sm text-purple-500 float-right">
                              2018.10 ~ Current
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="mb-2">
                            카카오페이 거래에서 이상 징후가 보이는 거래를
                            모니터링 하는 시스템과 어드민 툴 개발 및 유지보수에
                            참여하였습니다. 24시간 무중단 운영을 하고 있으며 99%
                            무장애를 목표로 시스템 유지보수를 하고 있습니다.
                          </div>
                          <ul className="text-sm">
                            <li>카카오페이의 이상거래탐지 시스템 개발</li>
                            <li>이상거래 탐지 룰 API 개발 및 유지 보수</li>
                            <li>
                              FDS 어드민 리뉴얼 프론트엔드, 백엔드 개발 진행
                            </li>
                            <li>
                              FDS 거래 데이터를 Hbase로 마이그레이션 하기 위한
                              배치 Job 개발 및 운영
                            </li>
                          </ul>
                        </div>
                        <div className="mt-1">
                          <div className="text-purple-400 text-xs mb-1">
                            Skills
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Scala
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Akka Http
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Slick
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              MySQL
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Redis
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Kafka
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Hbase
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Kotlin
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Spring Cloud Stream
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Spring Boot
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              React
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="border-t border-b border-purple-400 p-2 mb-2 flex">
                          <div
                            className="flex-auto align-middle"
                            style={{ lineHeight: '2.5rem' }}
                          >
                            Pay Airflow
                          </div>
                          <div className="flex-initial">
                            <div className="text-sm text-purple-600">
                              Data Platform Engineer
                            </div>
                            <div className="text-sm text-purple-500 float-right">
                              2018.06 ~ Current
                            </div>
                          </div>
                        </div>
                        <ul className="text-sm">
                          <li>Airflow를 Kubernetes에 구축 작업 및 유지보수</li>
                          <li>Airflow Kuberentes Module 커스터마이징</li>
                          <li>Airflow 구축을 위한 Helm Chart 개발</li>
                          <li>Airflow DAG 실행 결과 전송 모듈 개발</li>
                          <li>테스트용 Kubernetes 클러스터 구축 및 운영</li>
                        </ul>
                        <div className="mt-1">
                          <div className="text-purple-400 text-xs mb-1">
                            Skills
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Apache Airflow
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Python
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Kubernetes
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              MySQL
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="border-t border-b border-purple-400 p-2 mb-2 flex">
                          <div
                            className="flex-auto align-middle"
                            style={{ lineHeight: '2.5rem' }}
                          >
                            Stellar
                          </div>
                          <div className="flex-initial">
                            <div className="text-sm text-purple-600">
                              Backend Developer
                            </div>
                            <div className="text-sm text-purple-500 float-right">
                              2018.09 ~ 2019.03
                            </div>
                          </div>
                        </div>
                        <ul className="text-sm">
                          <li>카카오페이 위험 관리 시스템의 엔진 개발</li>
                          <li>위험 흐름 탐지 룰 엔진 시스템 설계 및 개발</li>
                          <li>데이터 가공 배치 시스템 구축 및 운영</li>
                          <li>
                            위험 탐지 머신러닝 모델 서빙 API 파이프라인 구축
                          </li>
                        </ul>
                        <div className="mt-1">
                          <div className="text-purple-400 text-xs mb-1">
                            Skills
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Java 8
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Spring Boot
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Armeria
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              gRPC
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              MySQL
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Apache Airflow
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="border-t border-b border-purple-400 p-2 mb-2 flex">
                          <div
                            className="flex-auto align-middle"
                            style={{ lineHeight: '2.5rem' }}
                          >
                            Sirius
                          </div>
                          <div className="flex-initial">
                            <div className="text-sm text-purple-600">
                              Backend Developer, Data Platform Engineer
                            </div>
                            <div className="text-sm text-purple-500 float-right">
                              2018.05 ~ 2019.02
                            </div>
                          </div>
                        </div>
                        <ul className="text-sm">
                          <li>
                            카카오페이의 실시간 사용자 거래 데이터 수집 Spark
                            Streaming Job 개발
                          </li>
                          <li>
                            수집 로그 관리 어드민 개발 (Frontend, Backend)
                          </li>
                          <li>
                            데이터 가공 배치 운영을 위한 Kubernetes 기반 Airflow
                            클러스터 구축 및 운영
                          </li>
                        </ul>
                        <div className="mt-1">
                          <div className="text-purple-400 text-xs mb-1">
                            Skills
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Scala
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Spark Streaming
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Impala
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              MySQL
                            </div>
                            <div className="rounded-sm bg-purple-500 text-white px-2 py-1 text-sm">
                              Apache Airflow
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-8">
                  <div className="mb-3 flex gap-2">
                    <div style={{ width: '3.5rem' }}>
                      <img src="/about/skplanet_logo.jpeg" />
                    </div>
                    <div
                      id="skplanet"
                      className="flex-shrink"
                      style={{ width: '100%' }}
                    >
                      <div>
                        <span className="text-2xl mr-2">SK planet</span>
                        <span className="text-sm text-purple-500">
                          Full Stack Developer
                        </span>
                      </div>
                      <div className="text-sm">2015.05 ~ 2018.05</div>
                    </div>
                    <div
                      className="h-10 w-10 cursor-pointer"
                      onClick={() => setSkplanetYn(!skplanetYn)}
                    >
                      {skplanetYn ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="#D1D5DB"
                        >
                          <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm5-9v2H5V9h10z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="#D1D5DB"
                        >
                          <path d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2v4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  {skplanetYn && (
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <div className="border-t border-b border-purple-400 p-2 mb-2 flex">
                          <div
                            className="flex-auto align-middle"
                            style={{ lineHeight: '2.5rem' }}
                          >
                            DMP (Data Management Platform)
                          </div>
                          <div className="flex-initial">
                            <div className="text-sm text-purple-600">
                              Full Stack Developer
                            </div>
                            <div className="text-sm text-purple-500 float-right">
                              2016.01 ~ 2018.05
                            </div>
                          </div>
                        </div>
                        <ul className="text-sm">
                          <li>
                            Spring AMQP, RabbitMQ를 이용한 경량 이벤트버스
                            라이브러리 개발
                          </li>
                          <li>
                            Spring Cloud Netflix를 이용한 마이크로서비스 API
                            Gateway 개발
                          </li>
                          <li>
                            세그먼트 카테고리 관리 프론트엔드, 백엔드 API 개발
                          </li>
                          <li>Oauth를 활용한 DMP Open API 개발</li>
                          <li>
                            Apache Druid를 활용한 세그먼트 사용자 간에 유사도
                            측정 API 개발
                          </li>
                        </ul>
                      </div>
                      <div>
                        <div className="border-t border-b border-purple-400 p-2 mb-2 flex">
                          <div
                            className="flex-auto align-middle"
                            style={{ lineHeight: '2.5rem' }}
                          >
                            TDA (Target Delivery Analysis)
                          </div>
                          <div className="flex-initial">
                            <div className="text-sm text-purple-600">
                              Full Stack Developer
                            </div>
                            <div className="text-sm text-purple-500 float-right">
                              2015.03 ~ 2016.01
                            </div>
                          </div>
                        </div>
                        <ul className="text-sm">
                          <li>
                            시럽, OK캐시백 마케팅에 대한 타겟팅 조건 설정 웹모듈
                            Frontend 개발 & 사용자 실시간 분석 후 마케팅 광고와
                            실시간 매칭하는 API 개발
                          </li>
                          <li>
                            Vaadin를 활용한 마케팅, 사용자 관리 운영툴 개발
                          </li>
                        </ul>
                      </div>
                      <div>
                        <div className="border-t border-b border-purple-400 p-2 mb-2 flex">
                          <div
                            className="flex-auto align-middle"
                            style={{ lineHeight: '2.5rem' }}
                          >
                            앱로그 검증툴 프로젝트
                          </div>
                          <div className="flex-initial">
                            <div className="text-sm text-purple-600">
                              Full Stack Developer
                            </div>
                            <div className="text-sm text-purple-500 float-right">
                              2014.11 ~ 2015.02
                            </div>
                          </div>
                        </div>
                        <ul className="text-sm">
                          <li>
                            테스트 시나리오 엑셀파일 로딩 후 Apache Kafka에서
                            앱로그를 Subscribe하여 실시간으로 앱로그와 테스트
                            시나리오와 대조하는 툴 개발
                          </li>
                          <li>
                            AngularJS를 이용한 Frontend 개발과 Apache Kafka에서
                            앱로그 수집 및 대조 기능 개발
                          </li>
                        </ul>
                      </div>
                      <div>
                        <div className="border-t border-b border-purple-400 p-2 mb-2 flex">
                          <div
                            className="flex-auto align-middle"
                            style={{ lineHeight: '2.5rem' }}
                          >
                            Syrup Store 마케팅 이용현황 통계 모듈 개발
                          </div>
                          <div className="flex-initial">
                            <div className="text-sm text-purple-600">
                              Full Stack Developer
                            </div>
                            <div className="text-sm text-purple-500 float-right">
                              2014.11 ~ 2015.02
                            </div>
                          </div>
                        </div>
                        <ul className="text-sm">
                          <li>
                            Syrup 마케팅 이용 현황 통계 Frontend 개발 진행
                            (Javascript 모듈화 프로그래밍 적용)
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="mb-3 flex gap-2">
                    <div style={{ width: '3.5rem' }}>
                      <img
                        src="/about/nhn-technology-services_logo2.jpg"
                        style={{ marginTop: '19px' }}
                      />
                    </div>
                    <div
                      id="nts"
                      className="flex-shrink"
                      style={{ width: '100%' }}
                    >
                      <div>
                        <span className="text-2xl mr-2">
                          NHN Technology Services
                        </span>
                        <span className="text-sm text-purple-500">
                          Backend Developer
                        </span>
                      </div>
                      <div className="text-sm">2011.02 ~ 2015.05</div>
                    </div>
                    <div
                      className="h-10 w-10 cursor-pointer"
                      onClick={() => setNtsYn(!ntsYn)}
                    >
                      {ntsYn ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="#D1D5DB"
                        >
                          <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm5-9v2H5V9h10z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="#D1D5DB"
                        >
                          <path d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2v4zm-1 11a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
                {ntsYn && (
                  <div className="grid grid-cols-1 gap-6">
                    <div className="mb-3">
                      <div className="border-t border-b border-purple-400 p-2 mb-2 flex">
                        <div
                          className="flex-auto align-middle"
                          style={{ lineHeight: '2.5rem' }}
                        >
                          네이버 2012 한글한글 아름답게 캠페인 외 다수 단기
                          프로모션 이벤트 페이지 및 어드민 개발
                        </div>
                        <div className="flex-initial">
                          <div className="text-sm text-purple-600">
                            Full Stack Developer
                          </div>
                          <div className="text-sm text-purple-500 float-right">
                            2012.09 ~ 2012.11
                          </div>
                        </div>
                      </div>
                      <ul className="text-sm">
                        <li>
                          네이버 캠페인 및 단기 이벤트 Frontend 개발 및 이벤트
                          진행 일정 관리 운영 어드민 개발
                        </li>
                      </ul>
                    </div>
                    <div className="mb-3">
                      <div className="border-t border-b border-purple-400 p-2 mb-2 flex">
                        <div
                          className="flex-auto align-middle"
                          style={{ lineHeight: '2.5rem' }}
                        >
                          네이버 지도 파노라마 영상 생성 자동화 플랫폼
                          (지도영상보정툴 & 파노라마 분할영상 생성툴)
                        </div>
                        <div className="flex-initial">
                          <div className="text-sm text-purple-600">
                            Full Stack Developer
                          </div>
                          <div className="text-sm text-purple-500 float-right">
                            2012.03 ~ 2012.07
                          </div>
                        </div>
                      </div>
                      <ul className="text-sm">
                        <li>
                          jQuery, SVG를 이용한 네이버 지도 파노라마 이미지에
                          사람얼굴, 차번호판 마킹하는 운영툴 Frontend 개발
                        </li>
                        <li>
                          마킹 작업량 통계 산출, 작업 제어관리 기능 Backend 개발
                        </li>
                        <li>
                          Spring Batch Remote Chunking을 활용한 파노라마 분할
                          영상 분산처리 작업 Batch 및 어드민 개발
                        </li>
                      </ul>
                    </div>
                    <div className="mb-3">
                      <div className="border-t border-b border-purple-400 p-2 mb-2 flex">
                        <div
                          className="flex-auto align-middle"
                          style={{ lineHeight: '2.5rem' }}
                        >
                          2012 현대자동차 텔레메틱스 인포뷰어 개발
                        </div>
                        <div className="flex-initial">
                          <div className="text-sm text-purple-600">
                            Full Stack Developer
                          </div>
                          <div className="text-sm text-purple-500 float-right">
                            2011.11 ~ 2012.02
                          </div>
                        </div>
                      </div>
                      <ul className="text-sm">
                        <li>
                          네이버 날씨, 뉴스 조회 API 연동 및 Cache 기능 개발
                        </li>
                      </ul>
                    </div>
                    <div className="mb-3">
                      <div className="border-t border-b border-purple-400 p-2 mb-2 flex">
                        <div
                          className="flex-auto align-middle"
                          style={{ lineHeight: '2.5rem' }}
                        >
                          한게임 게임 운영툴 개발
                        </div>
                        <div className="flex-initial">
                          <div className="text-sm text-purple-600">
                            Full Stack Developer
                          </div>
                          <div className="text-sm text-purple-500 float-right">
                            2011.03 ~ 2011.11
                          </div>
                        </div>
                      </div>
                      <ul className="text-sm">
                        <li>
                          한게임 출조낚시왕 & 스마트폰 윷놀이 게임 아이템 관리
                          및 사용자 관리 운영툴 Frontend & Backend 개발
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-20" id="side_project" ref={sideProjectRef}>
                <div className="text-2xl font-black text-purple-600">
                  Side Project
                </div>
                <div className="bg-purple-500 h-1 w-20 my-4"></div>
                <div className="mb-4">
                  <div className="mb-1 text-gray-600">컨퍼런스 발표</div>
                  <ul className="leading-relaxed">
                    <li>
                      If Kakao 2020 발표: 이상거래탐지를 위한 실시간 데이터
                      처리와 금융사기 행동 분석 (
                      <Link href="https://tv.kakao.com/v/414129448">
                        <a
                          target="_blank"
                          rel="noopener"
                          className="text-purple-500 border-b-2 border-dashed border-purple-500"
                        >
                          발표 영상
                        </a>
                      </Link>
                      )
                    </li>
                    <li>
                      Spring Camp 2015 발표: Spring Integration을 통해 살펴본
                      메시징 세계 (
                      <Link href="https://www.youtube.com/watch?v=9PsBxz28PIo&feature=youtu.be">
                        <a
                          target="_blank"
                          rel="noopener"
                          className="text-purple-500 border-b-2 border-dashed border-purple-500"
                        >
                          발표 영상
                        </a>
                      </Link>
                      )
                    </li>
                  </ul>
                </div>
                <div>
                  <div className="mb-1 text-gray-600">역서</div>
                  <ul>
                    <li>
                      스프링 5.0 마이크로서비스 1판 (
                      <Link href="http://www.yes24.com/Product/Goods/58255540">
                        <a
                          target="_blank"
                          rel="noopener"
                          className="text-purple-500 border-b-2 border-dashed border-purple-500"
                        >
                          책 링크
                        </a>
                      </Link>
                      )
                    </li>
                  </ul>
                </div>
              </div>

              <div
                id="education"
                className="mb-20 leading-relaxed"
                ref={educationRef}
              >
                <div className="text-2xl font-black text-purple-600">
                  Education
                </div>
                <div className="bg-purple-500 h-1 w-20 my-4"></div>
                <div>
                  <span className="text-purple-500">
                    <div
                      className="inline-block text-center"
                      style={{ width: '4.5rem' }}
                    >
                      2010.10
                    </div>
                    <div className="inline-block w-2 text-center">~</div>
                    <div
                      className="inline-block w-20 text-center"
                      style={{ width: '4.5rem' }}
                    >
                      2011.01
                    </div>
                  </span>
                  <span>
                    한국소프트웨어기술진흥협회 Java기반 OpenSource Framework와
                    안드로이드 전문가 양성 교육이수
                  </span>
                </div>
                <div>
                  <span className="text-purple-500">
                    <div
                      className="inline-block text-center"
                      style={{ width: '4.5rem' }}
                    >
                      2003.03
                    </div>
                    <div className="inline-block w-2 text-center">~</div>
                    <div
                      className="inline-block w-20 text-center"
                      style={{ width: '4.5rem' }}
                    >
                      2011.02
                    </div>
                  </span>
                  <span>한국산업기술대학교 컴퓨터 공학과 학사 졸업</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
