import '../styles/global.css'
import '../styles/prism.tomorrow.css'
import Footer from '../components/footer'
import getTagIndex from '../lib/notion/getTagIndex'

const App = ({ Component, pageProps, tagOptions }) => {
  return (
    <>
      <Component {...pageProps} />

      <Footer tagOptions={tagOptions}></Footer>
    </>
  )
}

App.getInitialProps = async ({ req }) => {
  const tagOptions = await getTagIndex()
  return { tagOptions }
}

export default App
