import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface SnackbarNotificationProps {
  open: boolean;
  severity: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose: () => void;
}

const SnackbarNotification: React.FC<SnackbarNotificationProps> = ({
  open,
  severity,
  message,
  onClose
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={2500}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarNotification;
