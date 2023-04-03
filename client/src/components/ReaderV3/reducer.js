function generateUniqueColor(highlight) {
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

export const reducer = (state, action) => {
  switch (action.type) {
    case 'CLOSE_ALL': {
      return {
        ...state,
        showAll: false,
      }
    }
    case 'OPEN_ALL': {
      return {
        ...state,
        showAll: true,
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
    default:
      throw Error('Unknown action.')
  }
}

export default reducer
