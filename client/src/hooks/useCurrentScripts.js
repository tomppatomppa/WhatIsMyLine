import { useContext } from 'react'
import CurrentScriptContext from '../contexts/CurrentScriptContext'

const useCurrentScripts = () => {
  return useContext(CurrentScriptContext)
}

export default useCurrentScripts
