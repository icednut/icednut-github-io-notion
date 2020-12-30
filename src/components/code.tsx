import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import Clipboard from 'react-clipboard.js'

const Code = ({ children, language = 'javascript' }) => {
  return (
    <>
      <div className="relative">
        <Clipboard
          className="absolute bg-gray-600 rounded px-2 py-1 text-xs opacity-50 hover:opacity-100"
          style={{ right: '0.75rem', top: '0.75rem' }}
          data-clipboard-text={children}
          onSuccess={() => alert('Copied!')}
        >
          Copy to Clipboard
        </Clipboard>
        <pre>
          <code
            className="overflow-auto block my-1 px-5 py-10 text-xs"
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
        <div
          className="absolute text-gray-500 px-2 py-1 text-xs font-bold"
          style={{ right: '0.75rem', bottom: '1rem' }}
        >
          {language}
        </div>
      </div>

      <style jsx>{`
        pre {
          tab-size: 2;
        }
      `}</style>
    </>
  )
}

export default Code
