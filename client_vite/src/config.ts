const CLIENT_ID = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID
const API_KEY = import.meta.env.REACT_APP_GOOGLE_API_KEY

const BASE_URI = '/api'
// process.env.REACT_APP_ENVIROMENT === 'development'
//   ? '/api'
//   : 'https://dramatify.herokuapp.com'

export { CLIENT_ID, API_KEY, BASE_URI }
