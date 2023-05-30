export type ReaderMode = 'read' | 'edit'

export type ReaderMenu = 'read' | 'edit'
export type MenuPosition = 'top' | 'bottom'

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
  expanded: string[]
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

export interface Actor {
  id: string
  style: {
    backgroundColor: string
  }
}

export type ReaderMenuActions = ReducerAction<'SET_EXPAND', string>
