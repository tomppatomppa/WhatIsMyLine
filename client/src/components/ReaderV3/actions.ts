const CLOSE_ALL = () => ({ type: 'CLOSE_ALL' })
const OPEN_ALL = () => ({ type: 'OPEN_ALL' })

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

export { CLOSE_ALL, OPEN_ALL, SETTINGS, SET_STYLE, HIGHLIGHT_TARGET, SET_MODE }
