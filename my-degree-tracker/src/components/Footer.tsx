import { Box, Typography, IconButton, Tooltip, useTheme } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => {
  const theme = useTheme();
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        borderTop: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        px: { xs: 2, sm: 3 },
        py: 1.5,
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.25,
          flexWrap: 'wrap',
          color: 'text.secondary',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          Degree Tracker Management System {year}
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.5 }}>
          •
        </Typography>

        <Tooltip title="Open project on GitHub" arrow>
          <IconButton
            component="a"
            href="https://github.com/aviad1486/Degree_Tracker"
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            sx={{
              color: 'text.secondary',
              transition: 'transform 120ms ease, color 120ms ease',
              '&:hover': {
                transform: 'translateY(-1px)',
                color: 'primary.main',
              },
            }}
            aria-label="GitHub repository"
          >
            <GitHubIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default Footer;
