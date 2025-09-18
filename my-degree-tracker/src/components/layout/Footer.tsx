import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import styles from './Footer.module.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <Box component="footer" className={styles.footerEnhanced}>
      <Box className={styles.footerMainContent}>
        <Box className={styles.footerRow}>
          <Typography variant="body2" className={styles.footerText}>
            🎓 Degree Tracker Management System
          </Typography>
          
          <Typography variant="body2" className={styles.footerDivider}>
            •
          </Typography>

          <Tooltip title="🚀 View source code on GitHub" arrow>
            <IconButton
              component="a"
              href="https://github.com/aviad1486/Degree_Tracker"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              className={styles.githubButton}
              aria-label="GitHub repository"
            >
              <GitHubIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box className={styles.footerLinks}>
          <Typography variant="caption" className={styles.footerCopyright}>
            © {year} Academic Management System. Built with ❤️ for students.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;