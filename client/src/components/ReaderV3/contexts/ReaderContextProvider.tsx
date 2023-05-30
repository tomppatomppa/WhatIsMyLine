import { contextFactory } from '../../../contexts/helpers/contextFactory'

import { OptionState } from '../reader.types'

const [useReader, ReaderContext] = contextFactory()

export { useReader }

type ReaderContextProviderProps = {
  children: React.ReactNode
  options: OptionState
}

const ReaderContextProvider = (props: ReaderContextProviderProps) => {
  return (
    <ReaderContext.Provider value={props.options}>
      {props.children}
    </ReaderContext.Provider>
  )
}

export default ReaderContextProvider
