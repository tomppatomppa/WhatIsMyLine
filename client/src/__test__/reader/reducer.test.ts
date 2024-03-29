import { renderHook, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ReaderConfiguration } from 'src/components/ReaderV3/reader.types'
import reducer from 'src/components/ReaderV3/reducer'
import { useReducer } from 'react'

let initialState = {
  mode: 'read',
  highlight: [],
  currentScrollTarget: '',
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
} as ReaderConfiguration

describe('reducer.ts', () => {
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
  test('Should reset expanded array', () => {
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

    act(() => {
      result.current[1]({
        type: 'CLOSE_ALL',
        payload: {},
      })
    })

    expect(result.current[0].expanded).toHaveLength(0)
  })

  test('Should assign currentScrollTarget', () => {
    const { result } = renderHook(() => useReducer(reducer, initialState))
    const currentScrollTarget = 'e73fd1c0-c18b-4baf-a6f2-367f968c433a'

    act(() => {
      result.current[1]({
        type: 'SET_CURRENT_SCROLL_TARGET',
        payload: { currentScrollTarget },
      })
    })
    expect(result.current[0].currentScrollTarget).toEqual(currentScrollTarget)
  })
})
