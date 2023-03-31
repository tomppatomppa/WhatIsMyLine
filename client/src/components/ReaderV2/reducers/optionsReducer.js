export const optionsReducer = (state, action) => {
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
    case 'HIGHLIGHT': {
      const { highlight } = state
      if (highlight.includes(action.payload)) {
        return {
          ...state,
          highlight: highlight.filter((name) => name !== action.payload),
        }
      }
      return {
        ...state,
        highlight: state.highlight.concat(action.payload),
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

export default optionsReducer
