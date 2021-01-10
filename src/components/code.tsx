import React, { useState } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-jsx'
import Clipboard from 'react-clipboard.js'

const Code = ({ children, language = 'javascript', name = '' }) => {
  const [copyYn, setCopyYn] = useState(false)
  const lines = children.split(/\n/).length
  const lineDoms = []
  for (let i = 0; i < lines; i++) {
    lineDoms.push(
      <div className="token text-right text-gray-600 pr-2">{i}</div>
    )
  }

  return (
    <div
      className="mb-2 rounded"
      style={{ backgroundColor: '#2d2d2d', color: '#ccc' }}
    >
      <div className="flex w-100 border-b border-gray-700">
        {name === '' ? (
          <></>
        ) : (
          <>
            <div className="text-white text-sm px-4 py-3 flex-initial border-r border-gray-700">
              {name}
            </div>
          </>
        )}
        <div
          className={
            'text-gray-500 px-4 py-3 text-xs font-bold flex-initial ' +
            (name === '' ? ' border-r border-gray-700' : '')
          }
        >
          {language}
        </div>
        <div className="flex-grow px-4 py-2">
          <Clipboard
            className="bg-purple-600 rounded px-2 py-1 text-xs opacity-50 hover:opacity-100 float-right"
            data-clipboard-text={children}
            onSuccess={() => {
              setCopyYn(true)
              setTimeout(() => setCopyYn(false), 2200)
            }}
          >
            {copyYn ? 'Copied!' : 'Copy'}
          </Clipboard>
        </div>
      </div>

      <div className="flex w-100 px-3 py-3">
        <div className="h-100 w-16 px-4 flex-grow-0 text-xs">
          <pre>
            <code className="block text-xs">{lineDoms}</code>
          </pre>
        </div>
        <div className="relative flex-grow overflow-x-auto">
          <pre>
            <code
              className="block px-2 text-xs"
              dangerouslySetInnerHTML={{
                __html: Prism.highlight(
                  children,
                  Prism.languages[language.toLowerCase()] ||
                    Prism.languages.javascript
                ),
              }}
            />
          </pre>
        </div>

        <style jsx>{`
          pre {
            tab-size: 2;
          }
        `}</style>
      </div>
    </div>
  )
}

export default Code
