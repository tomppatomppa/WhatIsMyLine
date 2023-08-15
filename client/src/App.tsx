import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { useMutation, useQuery } from 'react-query'
import { getUser } from './API/loginApi'
import { deleteScriptById, fetchAllUserScripts } from './API/scriptApi'
import { Script } from './components/ReaderV3/reader.types'

function App() {
  useQuery(['user'], () => getUser()) // Refresh jwt by calling getUser() every time the app is loaded
  const { data } = useQuery(['scripts'], () => fetchAllUserScripts())

  const { mutate } = useMutation(deleteScriptById, {
    onSuccess: (data) => {
      console.log(data)
    },
    onError: (error) => {
      console.log(error)
    },
  })
  console.log(data)
  return (
    <div className="app text-center">
      <RouterProvider router={router} />
      {data?.map((script: Script) => (
        <button className="block" onClick={() => mutate(script.script_id)}>
          {script.script_id}
        </button>
      ))}
    </div>
  )
}

export default App
