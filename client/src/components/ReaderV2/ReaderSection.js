import 'core-js'
import React, { useState } from 'react'
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

function parseSection(section) {
  const elements = section.querySelectorAll(':scope > *:not(h1)')

  let heading = ''
  const paragraphs = []

  elements.forEach((element) => {
    if (element.tagName.toLowerCase() === 'ul' && element.id) {
      const id = element.id
      const children = Array.from(element.children).map((li) => li.textContent)
      paragraphs.push({ id, children })
    } else {
      paragraphs.push({ text: element.textContent })
    }
  })

  const h1Element = section.querySelector('h1')

  if (h1Element) {
    heading = h1Element.textContent
  } else {
    heading = 'Document Details'
  }

  return (
    <ReaderSection key={heading} heading={heading} paragraphs={paragraphs} />
  )
}

function ReaderSection({ heading, paragraphs }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const { options, dispatch } = useReaderContext()
  const { HIGHLIGHT } = optionsActions

  const renderContent = (paragraphs) => {
    return Array.from(paragraphs).map(({ id, text, children }, index) => {
      if (!id || text) {
        return (
          <p className="font-light" key={index}>
            {text}
          </p>
        )
      } else if (id && children) {
        return (
          <div className="my-4" key={index}>
            <p onClick={() => dispatch(HIGHLIGHT(id))}>{id}</p>
            <ul
              className={`${
                options.highlight.includes(id) ? 'bg-green-200' : ''
              }`}
            >
              {Array.from(children).map((text, index) => (
                <li key={index}>{text}</li>
              ))}
            </ul>
          </div>
        )
      }
      return <div>Something went wrong</div>
    })
  }

  return (
    <section className="cursor-pointer my-2 border rounded-md">
      <h1 className="font-bold" onClick={() => setIsExpanded(!isExpanded)}>
        {heading}
      </h1>
      {isExpanded && <div className="">{renderContent(paragraphs)}</div>}
    </section>
  )
}
