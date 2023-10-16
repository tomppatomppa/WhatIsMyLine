const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY

const BASE_URI =
  process.env.REACT_APP_ENVIROMENT === 'development'
    ? '/api'
    : 'https://dramatify.herokuapp.com'

export { CLIENT_ID, API_KEY, BASE_URI }
