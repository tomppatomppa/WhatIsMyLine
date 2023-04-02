import 'core-js'
import React, { useState } from 'react'
import useCurrentScripts from '../../hooks/useCurrentScripts'
import { useReaderContext } from './contexts/ReaderContext'
import { optionsActions } from './reducers/'

export function parseHTML(html) {
  const parser = new DOMParser()
  const parsedHtml = parser.parseFromString(html, 'text/html')
  const sectionElements = parsedHtml.querySelectorAll('section')
  const documentFilename = parsedHtml.querySelector('div')?.id

  if (!sectionElements || !documentFilename) return

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

function parseSection(section) {
  const elements = section.querySelectorAll(':scope > *:not(h1)')

  let heading = ''
  const paragraphs = []

  elements.forEach((element) => {
    if (element.tagName.toLowerCase() === 'ul' && element.id) {
      const id = element.id
      const children = Array.from(element.children).map((li) => {
        return { text: li.textContent }
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
          <div className="my-4 cursor-pointer" key={index}>
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
      return null
    })
  }

  //Show selected scenes
  if (showScenes.length !== 0) {
    return (
      <>
        {showScenes.includes(heading) && (
          <section className="bg-white my-2 border shadow-md rounded-md">
            <strong
              className="underline cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {heading}
            </strong>
            {isExpanded && <>{renderContent(paragraphs)}</>}
          </section>
        )}
      </>
    )
  }
  //show all scenes
  return (
    <section className="bg-white my-2 border shadow-md rounded-md">
      <strong
        className="underline cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {heading}
      </strong>
      {isExpanded && <>{renderContent(paragraphs)}</>}
    </section>
  )
}
