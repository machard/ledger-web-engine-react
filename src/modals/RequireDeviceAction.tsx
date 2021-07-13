import React from 'react'
import Typography from '@material-ui/core/Typography'
import { DialogContent, DialogTitle } from '../components/Dialog'
import { Dialog } from '@material-ui/core'
import {
  createStyles,
  // eslint-disable-next-line no-unused-vars
  Theme,
  withStyles,
  // eslint-disable-next-line no-unused-vars
  WithStyles
} from '@material-ui/core/styles'

const styles = (_theme: Theme) => createStyles({})

interface Props extends WithStyles<typeof styles> {}

function RequireDeviceAction(_props: Props) {
  return (
    <Dialog disableBackdropClick aria-labelledby='customized-dialog-title' open>
      <DialogTitle id='customized-dialog-title'>
        A device action is needed
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          Please check your device and validate the interaction.
        </Typography>
      </DialogContent>
    </Dialog>
  )
}

export default withStyles(styles)(RequireDeviceAction)
