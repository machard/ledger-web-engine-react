import React, { useCallback, useContext, useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import { DialogActions, DialogContent, DialogTitle } from '../components/Dialog'
import { Button, Dialog } from '@material-ui/core'
import {
  createStyles,
  // eslint-disable-next-line no-unused-vars
  Theme,
  withStyles,
  // eslint-disable-next-line no-unused-vars
  WithStyles
} from '@material-ui/core/styles'
import { context as devicesContext, setTransport } from '../providers/devices'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'

const styles = (_theme: Theme) => createStyles({})

interface Props extends WithStyles<typeof styles> {
  app: any
  handleCancel: (event?: {}, reason?: 'backdropClick' | 'escapeKeyDown') => void
  handleSuccess: Function
}

const ensureAppOpen = async (
  transport: TransportWebUSB,
  expectedName: string,
  handleSuccess: Function
) => {
  console.log('ensure app open')
  try {
    const r = await transport.send(0xb0, 0x01, 0x00, 0x00)
    let i = 0
    const format = r[i++]
    if (format !== 1) {
      throw new Error('wrong app')
    }
    const nameLength = r[i++]
    const name = r.slice(i, (i += nameLength)).toString('ascii')
    // const versionLength = r[i++]
    // const version = r.slice(i, (i += versionLength)).toString('ascii')
    // const flagLength = r[i++]
    // const flags = r.slice(i, (i += flagLength))

    if (name !== expectedName) {
      throw new Error('wrong app')
    }

    handleSuccess()
  } catch (e) {
    throw new Error('wrong app')
  }
}

const ensureConnected = async (setTransport: Function) => {
  let transport = await TransportWebUSB.openConnected()
  if (transport) {
    return setTransport(transport)
  }

  try {
    transport = await TransportWebUSB.request()
  } catch (e) {}

  if (transport) {
    return setTransport(transport)
  }

  throw new Error('no transport')
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function RequireApp(props: Props) {
  const { app, handleCancel, handleSuccess } = props
  const devices = useContext(devicesContext)

  const handleWakeup = useCallback(() => {
    setTransport(null)
  }, [])

  useEffect(() => {
    if (!devices.transport) {
      return
    }

    let stop = false

    const ensure = async () => {
      if (stop) {
        return
      }
      try {
        const t = setTimeout(handleWakeup, 1000)
        await ensureAppOpen(devices.transport, app.name, handleSuccess)
        clearTimeout(t)
      } catch (e) {
        await delay(200)
        ensure()
      }
    }

    ensure()

    return () => {
      stop = true
    }
  }, [devices.transport, handleSuccess])

  useEffect(() => {
    if (devices.transport) {
      return
    }

    let stop = false

    const ensure = async () => {
      if (stop) {
        return
      }
      try {
        await ensureConnected(setTransport)
      } catch (e) {
        ensure()
      }
    }

    ensure()

    return () => {
      stop = true
    }
  }, [devices.transport])

  return (
    <Dialog
      onClose={handleCancel}
      aria-labelledby='customized-dialog-title'
      open
    >
      <DialogTitle id='customized-dialog-title' onClose={handleCancel}>
        {app.name} is needed
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          Please open the {app.name} app on your device and make sure the device
          is not connected to an other tab.
        </Typography>
        <Typography gutterBottom>
          If you don't have the app, please install it.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={!devices.transport}
          onClick={handleWakeup}
          color='primary'
        >
          It's done, wake up !
        </Button>
        <Button onClick={handleCancel} color='secondary'>
          I don't want
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default withStyles(styles)(RequireApp)
