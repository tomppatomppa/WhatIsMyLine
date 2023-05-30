import { useReducer } from 'react'
import clsx from 'clsx'
import reducer from './reducer'
import ReaderContext from './contexts/ReaderContext'

import styles from './Reader.module.css'
import { OptionState } from './reader.types'

interface ReaderProps {
  children?: React.ReactNode
  initialState: OptionState
}

export const Reader = (props: ReaderProps) => {
  const { children, initialState } = props
  const [options, dispatch] = useReducer(reducer, initialState)

  return (
    <div className={clsx(styles.reader, styles[options.mode])}>
      <ReaderContext.Provider value={{ options, dispatch }}>
        {children}
      </ReaderContext.Provider>
    </div>
  )
}

// // eslint-disable-next-line no-unused-vars
// const Controller = () => {
//   const [minimized, setMinimized] = useState(false)
//   const { dispatch } = useReaderContext()

//   return (
//     <div className="fixed bottom-12  right-12 bg-green-200">
//       <div className="absolute -top-5 right-0 bg-white h-2">
//         <button onClick={() => setMinimized(!minimized)}>
//           <BsThreeDots size={24} />
//         </button>
//       </div>
//       {minimized && (
//         <div>
//           <button
//             className="border border-black p-2"
//             onClick={() => dispatch(OPEN_ALL())}
//           >
//             open
//           </button>
//           <button
//             className="border border-black p-2"
//             onClick={() => dispatch(CLOSE_ALL())}
//           >
//             close
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }
export default Reader
