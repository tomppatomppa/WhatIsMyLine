//@ts-nocheck
import { ReaderConfiguration, ReaderMenuActions } from './reader.types'
import { generateUniqueColor } from './utils'

export const reducer = (
  state: ReaderConfiguration,
  action: ReaderMenuActions
): ReaderConfiguration => {
  switch (action.type) {
    case 'CLOSE_ALL': {
      return {
        ...state,
        expanded: [],
      }
    }
    case 'SET_EXPAND': {
      const { expanded } = state
      let updatedExpanded

      if (expanded.includes(action.payload.sceneId)) {
        updatedExpanded = expanded.filter((id) => id !== action.payload.sceneId)
      } else {
        updatedExpanded = [...expanded, action.payload.sceneId]
      }
      return {
        ...state,
        expanded: updatedExpanded,
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
