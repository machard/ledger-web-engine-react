/* @flow */
// eslint-disable-next-line no-unused-vars
import React, { ReactNode, useEffect, useReducer } from 'react'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'

interface State {
  transport: any
}

// actions/methods
export let getTransport = () => TransportWebUSB
export let setTransport = (_transport: any) => undefined

// reducer
const reducer = (state: State, update: any) => {
  console.log('devices reducer', update)
  switch (update.type) {
    case 'transport':
      return {
        ...state,
        transport: update.transport
      }
      break
    case 'disconnected':
      return {
        ...state,
        transport: null
      }
      break
  }
  return state
}
const initialState: State = {
  transport: null
}

export const context = React.createContext<State>(initialState)

const DevicesProvider = ({
  children,
  onTransport
}: {
  children: ReactNode
  onTransport?: (transport: any) => void
}) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  getTransport = () => state.transport
  setTransport = (transport: any) => {
    dispatch({
      type: 'transport',
      transport
    })
    return undefined
  }

  useEffect(() => {
    if (!state.transport) {
      return
    }
    state.transport._events.once('disconnect', () => {
      dispatch({
        type: 'disconnected'
      })
    })
  }, [state.transport, dispatch])

  useEffect(() => {
    if (!onTransport) {
      return
    }
    onTransport(state.transport)
  }, [state.transport, onTransport])

  return <context.Provider value={state}>{children}</context.Provider>
}

export default DevicesProvider
