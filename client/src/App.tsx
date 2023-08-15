import { RouterProvider } from 'react-router-dom'

import { router } from './router'

function App() {
  // useQuery(['user'], () => getUser()) // Refresh jwt by calling getUser() every time the app is loaded

  return (
    <div className="app text-center">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
