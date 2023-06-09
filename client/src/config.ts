const BASE_URI =
  process.env.REACT_APP_ENVIROMENT === 'development'
    ? 'http://localhost:5000'
    : 'https://dramatify.herokuapp.com'

export { BASE_URI }
