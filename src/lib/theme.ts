import { createTheme } from '@mui/material/styles'

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#BFA2F2' }, // pastel violet (CTA)
    secondary: { main: '#90CAF9' },
    background: { default: '#FAFAFA' },
  },
  shape: { borderRadius: 16 },
  typography: { fontFamily: 'Roboto, system-ui, -apple-system, Segoe UI, Arial' },
})
