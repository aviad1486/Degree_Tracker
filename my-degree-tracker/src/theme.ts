import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Create base theme with custom typography settings
let theme = createTheme({
  typography: {
    // Base typography scale - these will be automatically responsive
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    body1: {
      lineHeight: 1.6,
    },
    body2: {
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none', // Keep button text as-is (no uppercase)
      fontWeight: 500,
    },
  },
  palette: {
    primary: {
      main: '#1976d2', // Material Design blue
    },
    secondary: {
      main: '#dc004e', // Material Design pink
    },
    background: {
      default: '#fafafa',
    },
  },
  shape: {
    borderRadius: 8, // Consistent rounded corners
  },
  spacing: 8, // 8px base spacing unit for Material Design grid
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

// Apply responsive font sizes - this will automatically scale typography
// based on screen size using Material Design recommendations
theme = responsiveFontSizes(theme, {
  breakpoints: ['sm', 'md', 'lg'], // Apply scaling at these breakpoints
  factor: 2, // Scaling factor (default is 2)
});

export default theme;