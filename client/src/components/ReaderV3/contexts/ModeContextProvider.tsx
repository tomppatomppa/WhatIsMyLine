import { contextFactory } from '../../../contexts/helpers/contextFactory'

import { ReaderMode } from '../reader.types'

const [useMode, ModeContext] = contextFactory<ReaderMode>()

export { useMode }

type ModeContextProviderProps = {
  mode: ReaderMode
  children: React.ReactNode
}

const ModeContextProvider = (props: ModeContextProviderProps) => {
  return (
    <ModeContext.Provider value={props.mode}>
      {props.children}
    </ModeContext.Provider>
  )
}

export default ModeContextProvider
