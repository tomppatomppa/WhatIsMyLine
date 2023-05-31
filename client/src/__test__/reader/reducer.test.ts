import { renderHook, act } from '@testing-library/react-hooks'
import '@testing-library/jest-dom'
import { OptionState } from 'src/components/ReaderV3/reader.types'
import reducer from 'src/components/ReaderV3/reducer'
import { useReducer } from 'react'

let initialState = {
  mode: 'read',
  highlight: [],
  expanded: [],
  settings: {
    info: {
      style: {
        textAlign: 'left',
        marginLeft: '10px',
        fontStyle: 'italic',
        fontSize: '11.8pt',
        color: '#333333',
      },
    },
    actor: {
      style: {
        textAlign: 'center',
        fontSize: '11.8pt',
        color: '#333333',
      },
    },
  },
} as OptionState

describe('reducer.ts', () => {
  test('Should set mode to edit', () => {
    const { result } = renderHook(() => useReducer(reducer, initialState))
    expect(result.current[0].mode).toBe(initialState.mode)

    act(() => {
      result.current[1]({
        type: 'SET_MODE',
        payload: {},
      })
    })

    expect(result.current[0].mode).toBe('edit')
  })
  test('Should add and remove id from expanded array', () => {
    const { result } = renderHook(() => useReducer(reducer, initialState))
    const sceneId = '10042 ID. SCENE'
    //Add
    act(() => {
      result.current[1]({
        type: 'SET_EXPAND',
        payload: { sceneId },
      })
    })

    expect(result.current[0].expanded).toHaveLength(1)
    expect(result.current[0].expanded[0]).toEqual(sceneId)
    //Remove
    act(() => {
      result.current[1]({
        type: 'SET_EXPAND',
        payload: { sceneId },
      })
    })
    expect(result.current[0].expanded).toHaveLength(0)
  })
  test('Should add and remove target from highlight array', () => {
    const { result } = renderHook(() => useReducer(reducer, initialState))

    const target = 'JOHN DOE'
    //Add
    act(() => {
      result.current[1]({
        type: 'HIGHLIGHT_TARGET',
        payload: { target },
      })
    })
    expect(result.current[0].highlight).toHaveLength(1)
    expect(result.current[0].highlight[0].id).toEqual(target)
    expect(result.current[0].highlight[0].style.backgroundColor).toBeDefined()
    //Remove
    act(() => {
      result.current[1]({
        type: 'HIGHLIGHT_TARGET',
        payload: { target },
      })
    })
    expect(result.current[0].highlight).toHaveLength(0)
  })
  test('Should assign color property when passed as parameter', () => {
    const { result } = renderHook(() => useReducer(reducer, initialState))

    const target = 'JOHN DOE'
    const color = '#FFFFFF'

    act(() => {
      result.current[1]({
        type: 'HIGHLIGHT_TARGET',
        payload: { target, color },
      })
    })
    expect(result.current[0].highlight).toHaveLength(1)
    expect(result.current[0].highlight[0].style.backgroundColor).toEqual(color)
  })
  test('Should assign global color for all actors', () => {
    const { result } = renderHook(() => useReducer(reducer, initialState))

    const target = 'actor'
    const property = 'color'
    const value = '#FFFFFF'

    act(() => {
      result.current[1]({
        type: 'SET_STYLE',
        payload: { target, value, property },
      })
    })
    expect(result.current[0].settings[target].style[property]).toEqual(value)
  })
})
