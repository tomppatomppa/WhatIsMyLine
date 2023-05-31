//@ts-nocheck
import { Actor, OptionState, ReaderMenuActions } from './reader.types'

function generateUniqueColor(highlight: Actor[]) {
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

export const reducer = (
  state: OptionState,
  action: ReaderMenuActions
): OptionState => {
  switch (action.type) {
    case 'CLOSE_ALL': {
      return {
        ...state,
        expanded: [],
      }
    }
    case 'SET_EXPAND': {
      const { expanded } = state
      const isExpanded = expanded.includes(action.payload.sceneId)
      if (isExpanded) {
        return {
          ...state,
          expanded: expanded.filter((id) => id !== action.payload.sceneId),
        }
      }
      return {
        ...state,
        expanded: expanded.concat(action.payload.sceneId),
      }
    }
    case 'HIGHLIGHT_TARGET': {
      const { highlight } = state
      const { target, color } = action.payload
      if (highlight.some((item) => item.id === target)) {
        return {
          ...state,
          highlight: highlight.filter((item) => item.id !== target),
        }
      }
      const uniqueColor = generateUniqueColor(highlight)

      const style = {
        id: target,
        style: {
          backgroundColor: color ? color : uniqueColor,
        },
      }
      return {
        ...state,
        highlight: highlight.concat(style),
      }
    }
    case 'SETTINGS': {
      const { target, value, property } = action.payload
      return {
        ...state,
        settings: {
          ...state.settings,
          [target]: {
            ...state.settings[target],
            [property]: value,
          },
        },
      }
    }
    case 'SET_STYLE': {
      const { target, value, property } = action.payload
      return {
        ...state,
        settings: {
          ...state.settings,
          [target]: {
            style: {
              ...state.settings[target].style,
              [property]: value,
            },
          },
        },
      }
    }
    case 'SET_MODE': {
      const { mode } = state
      return {
        ...state,
        mode: mode === 'edit' ? 'read' : 'edit',
      }
    }

    default:
      throw Error('Unknown action.')
  }
}

export default reducer
