import axios from 'axios'
import 'core-js'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { baseURI, BASE_URI } from '../../config'

function Section({ heading, paragraphs }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [highlight, setHighlight] = useState(null)

  const handleHighlight = (id) => {
    if (highlight === id) {
      setHighlight(null)
    } else {
      setHighlight(id)
    }
  }
  const renderContent = (paragraphs) => {
    return Array.from(paragraphs).map(({ id, text, children }, index) => {
      if (!id || text) {
        return (
          <p className="text-left font-light" key={index}>
            {text}
          </p>
        )
      } else if (id && children) {
        return (
          <div className="my-4" key={index}>
            <p onClick={() => handleHighlight(id)}>{id}</p>
            <ul className={`${highlight === id ? 'bg-green-200' : ''}`}>
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
    <section className="cursor-pointer my-2">
      <h1 onClick={() => setIsExpanded(!isExpanded)}>{heading}</h1>
      {isExpanded && <div>{renderContent(paragraphs)}</div>}
    </section>
  )
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
  return <Section key={heading} heading={heading} paragraphs={paragraphs} />
}

function parseHTML(html) {
  const parser = new DOMParser()
  const parsedHtml = parser.parseFromString(html, 'text/html')
  const sectionElements = parsedHtml.querySelectorAll('section')

  const sections = []
  sectionElements.forEach((section) => {
    const parsedSection = parseSection(section)
    sections.push(parsedSection)
  })

  return sections
}
const ReaderV2 = () => {
  const navigate = useNavigate()
  const [data, setData] = useState(null)

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get(`${baseURI}/api/v2/`)
      setData(data)
    }
    getData()
  }, [])

  if (!data) {
    return <div>Loading...</div>
  }

  const parsed = parseHTML(data)

  return (
    <div className="mx-auto text-center max-w-2xl">
      <button
        className="border rounded-md bg-primary p-2"
        onClick={() => navigate('/')}
      >
        back
      </button>
      {parsed}
    </div>
  )
}

export default ReaderV2
