import React, { useContext } from 'react'
import {
  createStyles,
  // eslint-disable-next-line no-unused-vars
  Theme,
  withStyles,
  // eslint-disable-next-line no-unused-vars
  WithStyles
} from '@material-ui/core/styles'
import { context as modalsContext } from '../providers/modals'

const styles = (_theme: Theme) => createStyles({})

interface Props extends WithStyles<typeof styles> {}

function Placeholder(_props: Props) {
  const modals = useContext(modalsContext)

  const Modal = modals.Component
  if (!Modal) {
    return null
  }

  return <modals.Component {...modals.props} />
}

export default withStyles(styles)(Placeholder)
