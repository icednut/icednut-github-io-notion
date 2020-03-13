import React from 'react'
import components from '../../components/dynamic'

function applyTags(tags = [], children, noPTag = false, key) {
  let child = children

  for (const tag of tags) {
    const props: { [key: string]: any } = { key }
    let tagName = tag[0]

    if (noPTag && tagName === 'p') {
      tagName = React.Fragment
      props.className = 'leading-loose tracking-wide py-2'
    }
    if (tagName === 'c') {
      tagName = 'code'
      props.className =
        'leading-loose tracking-wide p-1 bg-gray-400 rounded text-xs text-red-600'
    }

    if (tagName === 'a') {
      props.href = tag[1]
      props.className =
        'leading-loose py-2 text-justify rounded text-teal-500 border-b-2 border-transparent border-dashed hover:border-teal-500'
    }

    child = React.createElement(components[tagName] || tagName, props, child)
  }
  return child
}

export function textBlock(text = [], noPTag = false, mainKey) {
  const children = []
  let key = 0

  for (const textItem of text) {
    key++
    if (textItem.length === 1) {
      children.push(textItem)
      continue
    }
    children.push(applyTags(textItem[1], textItem[0], noPTag, key))
  }
  let props = { key: mainKey }
  if (!noPTag) {
    props['className'] = 'leading-loose tracking-wide py-2'
  }
  return React.createElement(
    noPTag ? React.Fragment : components.p,
    props,
    ...children,
    noPTag
  )
}
