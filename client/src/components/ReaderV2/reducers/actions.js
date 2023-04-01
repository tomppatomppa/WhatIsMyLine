const CLOSE_ALL = () => ({ type: 'CLOSE_ALL' })
const OPEN_ALL = () => ({ type: 'OPEN_ALL' })

const HIGHLIGHT_TARGET = ({ target, color }) => ({
  type: 'HIGHLIGHT_TARGET',
  payload: { target, color },
})

const SETTINGS = ({ target, value, property }) => ({
  type: 'SETTINGS',
  payload: { target: target, property: property, value: value },
})
const SET_STYLE = ({ target, value, property }) => ({
  type: 'SET_STYLE',
  payload: { target: target, property: property, value: value },
})
const optionsActions = {
  CLOSE_ALL,
  OPEN_ALL,
  SETTINGS,
  SET_STYLE,
  HIGHLIGHT_TARGET,
}
export { optionsActions }
