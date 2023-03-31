const CLOSE_ALL = () => ({ type: 'CLOSE_ALL' })
const OPEN_ALL = () => ({ type: 'OPEN_ALL' })

const HIGHLIGHT = (value) => ({ type: 'HIGHLIGHT', payload: value })

const SETTINGS = ({ target, value, property }) => ({
  type: 'SETTINGS',
  payload: { target: target, property: property, value: value },
})
const optionsActions = { CLOSE_ALL, OPEN_ALL, HIGHLIGHT, SETTINGS }
export { optionsActions }
