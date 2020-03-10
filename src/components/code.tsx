import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'

const Code = ({ children, language = 'javascript' }) => {
  return (
    <>
      <pre>
        <code
          className="overflow-auto block my-1 p-5"
          style={{ backgroundColor: '#2d2d2d', color: '#ccc' }}
          dangerouslySetInnerHTML={{
            __html: Prism.highlight(
              children,
              Prism.languages[language.toLowerCase()] ||
                Prism.languages.javascript
            ),
          }}
        />
      </pre>

      <style jsx>{`
        pre {
          tab-size: 2;
        }
      `}</style>
    </>
  )
}

export default Code
