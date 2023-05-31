const CLOSE_ALL = () => ({ type: 'CLOSE_ALL' })

const SET_EXPAND = ({ sceneId }: any) => ({
  type: 'SET_EXPAND',
  payload: { sceneId },
})

const HIGHLIGHT_TARGET = ({ target, color }: any) => ({
  type: 'HIGHLIGHT_TARGET',
  payload: { target, color },
})

const SETTINGS = ({ target, value, property }: any) => ({
  type: 'SETTINGS',
  payload: { target: target, property: property, value: value },
})

const SET_STYLE = ({ target, value, property }: any) => ({
  type: 'SET_STYLE',
  payload: { target: target, property: property, value: value },
})

const SET_MODE = () => ({
  type: 'SET_MODE',
})

export {
  CLOSE_ALL,
  SETTINGS,
  SET_STYLE,
  HIGHLIGHT_TARGET,
  SET_MODE,
  SET_EXPAND,
}
