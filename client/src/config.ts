const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY

const BASE_URI =
  process.env.REACT_APP_ENVIROMENT === 'development'
    ? 'http://127.0.0.1:5000'
    : 'https://dramatify.herokuapp.com'

export { CLIENT_ID, API_KEY, BASE_URI }
