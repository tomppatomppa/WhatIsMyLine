export type ReaderMode = 'read' | 'edit'

export type ReaderMenu = 'read' | 'edit'
export type MenuPosition = 'top' | 'bottom'

//Scene types

type SceneLine = 'ACTOR' | 'INFO'

export type Line = {
  type: SceneLine
  name: string
  lines: string[]
}
export type Scene = {
  id: string | 'SCRIPT DETAILS'
  data: Line[]
  isEditing?: boolean
}

export type Script = {
  filename: string
  scenes: Scene[]
}
// Line types
export interface Style {
  textAlign?: string
  marginLeft?: string | number
  fontStyle?: string
  fontSize?: string | number
  color?: string
}

export type LineType = 'info' | 'actor'
export interface ReaderConfiguration {
  mode: ReaderMode
  highlight: Actor[]
  expanded: string[]
  settings: {
    [key in LineType]: {
      style: Style
    }
  }
}

export type ReducerAction<T, P> = {
  type: T
  payload?: P
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
  | ReducerAction<'HIGHLIGHT_TARGET', { target: string; color?: string }>
  | ReducerAction<
      'SETTINGS',
      { target: LineType; value: string; property: string }
    >
  | ReducerAction<
      'SET_STYLE',
      { target: LineType; value: string; property: keyof Style }
    >
  | ReducerAction<'SET_MODE', {}>
