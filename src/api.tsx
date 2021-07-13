// eslint-disable-next-line no-unused-vars
import { WindowPostMessageStream } from '@metamask/post-message-stream'
import { getTransport } from './providers/devices'
import { setModal } from './providers/modals'
import RequireApp from './modals/RequireApp'
import RequireDeviceAction from './modals/RequireDeviceAction'

const api = async (stream: WindowPostMessageStream, data: any) => {
  console.log('lw engine api request', data)

  switch (data.type + '/' + data.method) {
    case 'devices/requireApp':
      setModal(RequireApp, {
        handleCancel: () => {
          setModal()
          stream.write({
            id: data.id,
            err: 'cancelled'
          })
        },
        handleSuccess: () => {
          setModal()
          stream.write({
            id: data.id,
            res: 'success'
          })
        },
        app: data.args[0]
      })
      break

    case 'devices/requireDeviceActionStart':
      setModal(RequireDeviceAction, {})
      stream.write({
        id: data.id,
        res: 'success'
      })
      break
    case 'devices/requireDeviceActionEnd':
      setModal()
      stream.write({
        id: data.id,
        res: 'success'
      })
      break

    case 'devices/send':
      // eslint-disable-next-line no-case-declarations
      const transport = getTransport()
      if (!transport) {
        stream.write({
          id: data.id,
          err: 'no transport'
        })
        break
      }

      if (data.args[4]) {
        data.args[4] = Buffer.from(data.args[4], 'hex')
      } else {
        data.args[4] = Buffer.alloc(0)
      }

      // eslint-disable-next-line no-case-declarations
      let result
      try {
        // @ts-ignore
        result = await transport.send(...data.args)
      } catch (e) {
        stream.write({
          id: data.id,
          err: e
        })
        break
      }

      stream.write({
        id: data.id,
        res: result.toString('hex')
      })
      break
    default:
      return false
  }

  return true
}

export default api
