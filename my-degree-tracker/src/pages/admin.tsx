import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Alert,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Refresh as RefreshIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAdmin } from '../hooks/useAdmin';
import type { User, UserRole } from '../models/User';

import styles from '../styles/Admin.module.css';

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<UserRole>('user');
  const [newStatus, setNewStatus] = useState(true);
  const { loading, error, updateUserRole, toggleUserStatus, getAllUsers } = useAdmin();

  const loadUsers = async () => {
    const fetchedUsers = await getAllUsers();
    setUsers(fetchedUsers);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setNewStatus(user.isActive);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const handleSaveChanges = async () => {
    if (!selectedUser) return;

    let success = true;

    if (newRole !== selectedUser.role) {
      success = success && await updateUserRole(selectedUser.uid, newRole);
    }

    if (newStatus !== selectedUser.isActive) {
      success = success && await toggleUserStatus(selectedUser.uid, newStatus);
    }

    if (success) {
      await loadUsers();
      handleCloseDialog();
    }
  };

  const getRoleColor = (role: UserRole) => {
    return role === 'admin' ? 'error' : 'success';
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'success' : 'warning';
  };

  if (loading) {
    return (
      <Box className={styles.adminContainer} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center'
      }}>
        <Typography variant="h6" style={{ color: 'white', marginBottom: '1rem' }}>
          👥 Loading User Management...
        </Typography>
        <LinearProgress style={{ width: '300px', height: '4px' }} />
      </Box>
    );
  }

  return (
    <Box className={styles.adminContainer} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h3" 
          component="h1"
          className={styles.adminTitle}
        >
          👑 User Management
        </Typography>
        <Tooltip title="Refresh user list">
          <IconButton onClick={loadUsers} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card className={styles.adminCard}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            System Users
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Manage user roles and permissions for the Degree Tracker system
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow className={styles.adminTableHeader}>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No users found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.uid} hover className={styles.adminTableRow}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {user.role === 'admin' ? <AdminIcon color="error" /> : <PersonIcon color="success" />}
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {user.displayName || user.fullName || 'Unknown'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {user.uid.substring(0, 8)}...
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {user.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.role.toUpperCase()}
                          color={getRoleColor(user.role)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.isActive ? 'Active' : 'Inactive'}
                          color={getStatusColor(user.isActive)}
                          size="small"
                          variant={user.isActive ? 'filled' : 'outlined'}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit user">
                          <IconButton size="small" onClick={() => handleEditUser(user)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle className={styles.adminDialogTitle}>
          Edit User: {selectedUser?.displayName || selectedUser?.email}
        </DialogTitle>
        <DialogContent className={styles.adminDialogContent}>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={newRole}
                label="Role"
                onChange={(e) => setNewRole(e.target.value as UserRole)}
              >
                <MenuItem value="user">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon />
                    User
                  </Box>
                </MenuItem>
                <MenuItem value="admin">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AdminIcon />
                    Administrator
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={newStatus}
                  onChange={(e) => setNewStatus(e.target.checked)}
                />
              }
              label="Account Active"
            />

            {selectedUser && (
              <Box className={styles.adminDialogBox}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Current Role:</strong> {selectedUser.role}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Current Status:</strong> {selectedUser.isActive ? 'Active' : 'Inactive'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>User ID:</strong> {selectedUser.uid}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveChanges} 
            variant="contained" 
            disabled={loading}
            className={styles.saveButton}
            sx={{ minWidth: 100 }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPage;