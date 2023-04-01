import 'core-js'
import React, { useState } from 'react'
import useCurrentScripts from '../../hooks/useCurrentScripts'
import { useReaderContext } from './contexts/ReaderContext'
import { optionsActions } from './reducers/'

export function parseHTML(html) {
  const parser = new DOMParser()
  const parsedHtml = parser.parseFromString(html, 'text/html')
  const sectionElements = parsedHtml.querySelectorAll('section')
  const documentFilename = parsedHtml.querySelector('div').id

  const sections = []
  sectionElements.forEach((section) => {
    const parsedSection = parseSection(section)
    sections.push(parsedSection)
  })

  const script = {
    filename: documentFilename,
    data: sections,
  }

  return script
}
function parseHtmlStyle(htmlStyle) {
  const styleObj = {}
  const stylePairs = htmlStyle.split(';')
  stylePairs.forEach((pair) => {
    const [key, value] = pair.split(':')
    if (key && value) {
      const styleKey = key
        .trim()
        .replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
      styleObj[styleKey] = value.trim()
    }
  })
  return styleObj
}

function parseSection(section) {
  const elements = section.querySelectorAll(':scope > *:not(h1)')

  let heading = ''
  const paragraphs = []

  elements.forEach((element) => {
    if (element.tagName.toLowerCase() === 'ul' && element.id) {
      const id = element.id
      const children = Array.from(element.children).map((li) => {
        const html_style = li.getAttribute('style')
        const style = parseHtmlStyle(html_style)
        return { text: li.textContent, style }
      })
      paragraphs.push({ id, children })
    } else {
      paragraphs.push({ text: element.textContent })
    }
  })

  const h1Element = section.querySelector('h1')

  if (h1Element) {
    heading = h1Element.innerText.trim()
  } else {
    heading = 'Document Details'
  }

  return (
    <ReaderSection key={heading} heading={heading} paragraphs={paragraphs} />
  )
}

function ReaderSection({ heading, paragraphs }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const { showScenes } = useCurrentScripts()
  const { options, dispatch } = useReaderContext()
  const { actor, info } = options.settings
  const { HIGHLIGHT_TARGET } = optionsActions

  const renderContent = (paragraphs) => {
    return Array.from(paragraphs).map(({ id, text, children }, index) => {
      if (!id || text) {
        return (
          <p style={info.style} key={index}>
            {text}
          </p>
        )
      } else if (id && children) {
        const isSelected = options.highlight.find((item) => item.id === id)
        const ulStyle = {
          ...actor.style,
          backgroundColor: isSelected
            ? isSelected.style.backgroundColor
            : 'transparent',
        }
        return (
          <div className="my-4" key={index}>
            <strong onClick={() => dispatch(HIGHLIGHT_TARGET({ target: id }))}>
              {id}
            </strong>
            <ul style={ulStyle}>
              {Array.from(children).map(({ text }, index) => (
                <li key={index}>{text}</li>
              ))}
            </ul>
          </div>
        )
      }
      return <div>Something went wrong</div>
    })
  }

  //Show selected scenes
  if (showScenes.length !== 0) {
    return (
      <>
        {showScenes.includes(heading) && (
          <section className="cursor-pointer my-2 border shadow-sm rounded-md">
            <strong
              className="underline"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {heading}
            </strong>

            {isExpanded && <div>{renderContent(paragraphs)}</div>}
          </section>
        )}
      </>
    )
  }
  //show all scenes
  return (
    <section className="cursor-pointer my-2 border shadow-sm rounded-md">
      <strong className="underline" onClick={() => setIsExpanded(!isExpanded)}>
        {heading}
      </strong>

      {isExpanded && <div>{renderContent(paragraphs)}</div>}
    </section>
  )
}
