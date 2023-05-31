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

export type LineType = 'info' | 'actor'
export interface OptionState {
  mode: string
  showAll: boolean
  highlight: Actor[]
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

export type ReaderMenuActions =
  | ReducerAction<'CLOSE_ALL', {}>
  | ReducerAction<'SET_EXPAND', { sceneId: string }>
  | ReducerAction<'HIGHLIGHT_TARGET', { target: string; color: string }>
  | ReducerAction<
      'SETTINGS',
      { target: LineType; value: string; property: string }
    >
  | ReducerAction<
      'SET_STYLE',
      { target: LineType; value: string; property: string }
    >
  | ReducerAction<'SET_MODE', {}>
