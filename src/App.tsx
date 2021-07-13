import React, { useCallback, useEffect, useState } from 'react'
import { WindowPostMessageStream } from '@metamask/post-message-stream'
import {
  createStyles,
  // eslint-disable-next-line no-unused-vars
  Theme,
  withStyles,
  // eslint-disable-next-line no-unused-vars
  WithStyles
} from '@material-ui/core/styles'
import api from './api'

const styles = (_theme: Theme) =>
  createStyles({
    iframe: {
      borderWidth: 0,
      width: '100%',
      height: '100%'
    }
  })

interface HeaderProps extends WithStyles<typeof styles> {
  app: string
  extraApi?: (stream: WindowPostMessageStream, data: any) => any
}

function App(props: HeaderProps) {
  const { classes, app, extraApi } = props
  const [iframe, setIframe]: [any, Function] = useState()
  const [stream, setStream]: [WindowPostMessageStream | undefined, Function] =
    useState()

  useEffect(() => {
    if (!iframe) {
      return
    }
    setStream(
      new WindowPostMessageStream({
        name: 'ledger-web-parent',
        target: app,
        // todo when updating: https://github.com/MetaMask/post-message-stream/pull/23
        // targetOrigin: "*",
        targetWindow: iframe.contentWindow
      })
    )
  }, [iframe])

  useEffect(() => {
    if (!stream) {
      return
    }

    const onMessage = async (data: any) => {
      const handled = await api(stream, data)
      if (!handled && extraApi) {
        extraApi(stream, data)
      }
    }

    // @ts-ignore
    stream.on('data', onMessage)

    // @ts-ignore
    return () => stream.off('data', onMessage)
  }, [stream])

  const setRef = useCallback(
    (iframe) => {
      setIframe(iframe)
    },
    [setIframe]
  )

  return (
    <React.Fragment>
      <iframe
        key={app}
        ref={setRef}
        title={app}
        src={app}
        className={classes.iframe}
        allow='clipboard-write'
      />
    </React.Fragment>
  )
}

export default withStyles(styles)(App)
