//@ts-nocheck
import { Actor, ReaderConfiguration, SceneLine } from './reader.types'

export function generateUniqueColor(highlight: Actor[]) {
  const colors = [
    '#86efac',
    '#d8b4fe',
    '#f7d8a1',
    '#e6d5c1',
    '#d6d2e0',
    '#c6cfeb',
    '#b5ccf8',
    '#a5c9f3',
    '#94c5ed',
    '#84c2e8',
    '#74bedf',
    '#64bbda',
  ]

  const excludedColors = highlight.map((item) => {
    return item.style.backgroundColor
  })

  for (const element of colors) {
    if (!excludedColors.includes(element)) {
      return element
    }
  }
  return '#86efac'
}

export function arrayAttributeMatch(arr1: any[], arr2: any[]): boolean {
  if (arr1?.length !== arr2?.length) {
    return false
  }

  const attributes = arr1.map((item) => item.name?.replaceAll?.('.mp3', ''))

  for (let i = 0; i < arr2.length; i++) {
    if (!attributes.includes(arr2[i].id)) {
      return false
    }
  }

  return true
}
