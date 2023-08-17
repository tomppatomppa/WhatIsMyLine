import { RouterProvider } from 'react-router-dom'

import { router } from './router'

function App() {
  return (
    <div className="app text-center">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
