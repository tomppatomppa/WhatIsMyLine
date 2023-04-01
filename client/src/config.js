const BASE_URI =
  process.env.REACT_APP_ENVIROMENT === 'development'
    ? 'http://localhost:5000'
    : process.env.HEROKU_URI

export { BASE_URI }
