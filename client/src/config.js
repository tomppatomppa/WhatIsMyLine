const BASE_URI = process.env.REACT_APP_BASE_URI || 'http://localhost:5000'
// process.env.REACT_APP_ENVIROMENT === 'development'
//   ? 'http://localhost:5000'
//   : process.env.REACT_APP_BASE_URI
console.log('Base URI:', BASE_URI)
export { BASE_URI }
