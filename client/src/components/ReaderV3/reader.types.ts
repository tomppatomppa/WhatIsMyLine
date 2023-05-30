export type ReaderMode = 'read' | 'edit'

export type ReaderMenu = 'read' | 'edit'
export type MenuBarPosition = 'top' | 'bottom'

export interface Style {
  textAlign: string
  marginLeft?: string
  fontStyle?: string
  fontSize: string
  color: string
}
export interface OptionState {
  mode: string
  showAll: boolean
  highlight: string[]
  settings: {
    info: {
      style: Style
    }
    actor: {
      style: Style
    }
  }
}

export type ReducerAction<T, P> = {
  type: T
  payload: P
}
