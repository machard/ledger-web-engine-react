/* @flow */
import React, { useReducer, useCallback } from 'react'

type State = {
  Component: any
  props: any
}

export let setModal: (Component?: any, props?: any) => void = () => {}

// reducer
const reducer = (state: State, update: any) => {
  return {
    ...state,
    ...update
  }
}
const initialState: State = {
  Component: null,
  props: null
}

export const context = React.createContext<State>(initialState)

const ModalProvider = ({ children }: { children: any }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  setModal = useCallback(
    (Component, props) => dispatch({ Component, props }),
    []
  )

  return <context.Provider value={state}>{children}</context.Provider>
}

export default ModalProvider
