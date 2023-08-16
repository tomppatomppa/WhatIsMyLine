import { RouterProvider } from 'react-router-dom'

import { router } from './router'
import { getUser } from './API/loginApi'
import { useQuery } from 'react-query'

function App() {
  useQuery(['user'], () => getUser()) // Refresh jwt by calling getUser() every time the app is loaded

  return (
    <div className="app text-center">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
