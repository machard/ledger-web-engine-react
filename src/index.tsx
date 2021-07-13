import React, { useMemo } from 'react'
import {
  createMuiTheme,
  createStyles,
  ThemeProvider,
  withStyles,
  // eslint-disable-next-line no-unused-vars
  WithStyles
} from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import App from './App'
import DevicesProvider from './providers/devices'
import Placeholder from './modals/Placeholder'
import ModalsProvider from './providers/modals'
// eslint-disable-next-line no-unused-vars
import { WindowPostMessageStream } from '@metamask/post-message-stream'

let theme = createMuiTheme({
  palette: {
    primary: {
      light: '#63ccff',
      main: '#009be5',
      dark: '#006db3'
    }
  },
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5
    }
  },
  shape: {
    borderRadius: 8
  },
  props: {
    MuiTab: {
      disableRipple: true
    }
  },
  mixins: {
    toolbar: {
      minHeight: 48
    }
  }
})

theme = {
  ...theme,
  overrides: {
    MuiDrawer: {
      paper: {
        backgroundColor: '#18202c'
      }
    },
    MuiButton: {
      label: {
        textTransform: 'none'
      },
      contained: {
        boxShadow: 'none',
        '&:active': {
          boxShadow: 'none'
        }
      }
    },
    MuiTabs: {
      root: {
        marginLeft: theme.spacing(1)
      },
      indicator: {
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        backgroundColor: theme.palette.common.white
      }
    },
    MuiTab: {
      root: {
        textTransform: 'none',
        margin: '0 16px',
        minWidth: 0,
        padding: 0,
        [theme.breakpoints.up('md')]: {
          padding: 0,
          minWidth: 0
        }
      }
    },
    MuiIconButton: {
      root: {
        padding: theme.spacing(1)
      }
    },
    MuiTooltip: {
      tooltip: {
        borderRadius: 4
      }
    },
    MuiDivider: {
      root: {
        backgroundColor: '#404854'
      }
    },
    MuiListItemText: {
      primary: {
        fontWeight: theme.typography.fontWeightMedium
      }
    },
    MuiListItemIcon: {
      root: {
        color: 'inherit',
        marginRight: 0,
        '& svg': {
          fontSize: 20
        }
      }
    },
    MuiAvatar: {
      root: {
        width: 32,
        height: 32
      }
    }
  }
}

const styles = createStyles({
  app: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  }
})

export interface EngineProps extends WithStyles<typeof styles> {
  app: string
  extraApi?: (stream: WindowPostMessageStream, data: any) => any
  onTransport?: (transport: any) => void
  rootClass: string
}

function Engine(props: EngineProps) {
  const { classes, app, extraApi, rootClass, onTransport } = props

  const Providers = useMemo(
    () =>
      [
        {
          Provider: ThemeProvider,
          args: { theme }
        },
        {
          Provider: DevicesProvider,
          args: {
            onTransport
          }
        },
        {
          Provider: ModalsProvider,
          args: {}
        }
      ].reduce(
        (Provider, provider) =>
          ({ children }) =>
            Provider({
              children: [
                // @ts-ignore
                provider.Provider({ ...provider.args, children })
              ]
            }),
        ({ children }: any) => children
      ),
    [onTransport]
  )

  return (
    <Providers key='providers'>
      <div className={rootClass}>
        <CssBaseline />
        <div className={classes.app}>
          <App app={app} extraApi={extraApi} />
        </div>
      </div>
      <Placeholder />
    </Providers>
  )
}

export default withStyles(styles)(Engine)
