import React, { useState, useEffect } from 'react';

import {
  Box, Typography, Paper, Tabs, Tab, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Chip, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, Alert
} from '@mui/material';
import { CheckCircle, Cancel, Delete, Refresh } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { usersAPI } from '../services/api';

const PAGE_STYLES = `
  .users-page .page-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 28px;
    padding-bottom: 16px;
    border-bottom: 1px solid #161c26;
    position: relative;
  }
  .users-page .page-header::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0;
    width: 80px; height: 2px;
    background: linear-gradient(90deg, #ff6f00, transparent);
  }
  .users-page .page-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 32px;
    font-weight: 800;
    text-transform: uppercase;
    color: #fff;
    letter-spacing: 0.02em;
    line-height: 1;
  }
  .users-page .page-subtitle {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    color: #3a4a5a;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-top: 4px;
  }
  .users-page { width: 100%; max-width: 100%; margin: 0 auto; }
  .users-page .page-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 28px; padding-bottom: 16px; border-bottom: 1px solid #161c26; position: relative; }
  .users-page .page-header::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 80px; height: 2px; background: linear-gradient(90deg, #ff6f00, transparent); }
  .users-page .page-title { font-family: 'Barlow Condensed', sans-serif; font-size: 32px; font-weight: 800; text-transform: uppercase; color: #fff; letter-spacing: 0.02em; line-height: 1; }
  .users-page .page-subtitle { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: #3a4a5a; text-transform: uppercase; letter-spacing: 0.15em; margin-top: 4px; }
  .users-page .header-actions { display: flex; gap: 8px; }

  .users-page .email-cell {
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
    color: #8a9aaa;
  }

  .users-page .MuiTableContainer-root { overflow-x: auto; }
  .users-page .MuiTable-root { min-width: 620px; width: 100%; }
  .users-page .MuiTableCell-root { word-break: break-word; }

  @media (max-width: 1024px) {
    .users-page { padding: 0 8px; }
    .users-page .page-header { flex-wrap: wrap; gap: 10px; }
    .users-page .header-actions { width: 100%; justify-content: flex-start; }
  }
  @media (max-width: 768px) {
    .users-page .page-title { font-size: 24px; }
    .users-page .page-subtitle { font-size: 9px; }
    .users-page .MuiTableCell-root { font-size: 11px; padding: 8px 10px !important; }
    .users-page .MuiTableHead-root .MuiTableCell-root { font-size: 9px !important; }
  }

  .users-page .pending-row td { background: rgba(255,171,0,0.03) !important; }

  .delete-confirm-text { color: #8a9aaa; font-size: 14px; }
  .delete-confirm-text strong { color: #c8d8e8; }
`;

export default function UsersPage() {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const [allUsers, pending] = await Promise.all([usersAPI.getAll(), usersAPI.getPending()]);
      setUsers(allUsers);
      setPendingUsers(pending);
    } catch {
      enqueueSnackbar('Erreur lors du chargement des utilisateurs', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await usersAPI.approve(userId);
      enqueueSnackbar('Utilisateur validé', { variant: 'success' });
      loadUsers();
    } catch {
      enqueueSnackbar('Erreur lors de la validation', { variant: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      await usersAPI.delete(deleteDialog.user.id);
      enqueueSnackbar('Utilisateur supprimé', { variant: 'success' });
      setDeleteDialog({ open: false, user: null });
      loadUsers();
    } catch {
      enqueueSnackbar('Erreur lors de la suppression', { variant: 'error' });
    }
  };

  const getRoleBadge = (role) => {
    const map = { admin: 'error', technicien: 'primary' };
    return <Chip label={role} color={map[role] || 'default'} size="small" />;
  };

  const getStatusBadge = (status) => {
    const colors = { active: 'success', pending: 'warning', inactive: 'default' };
    const labels = { active: 'Actif', pending: 'En attente', inactive: 'Inactif' };
    return <Chip label={labels[status]} color={colors[status]} size="small" />;
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
      <CircularProgress />
    </Box>
  );

  const allowedRoles = ['technicien', 'employe'];
  const visibleUsers = users.filter((u) => allowedRoles.includes(u.role));
  const visiblePendingUsers = pendingUsers.filter((u) => allowedRoles.includes(u.role));
  const displayList = tabValue === 0 ? visibleUsers : visiblePendingUsers;

  return (
    <>
      <style>{PAGE_STYLES}</style>
      <Box className="users-page">
        <div className="page-header">
          <div>
            <div className="page-title">Utilisateurs</div>
            <div className="page-subtitle">// Gestion des opérateurs &amp; techniciens</div>
          </div>
          <div className="header-actions">
            <Button variant="outlined" startIcon={<Refresh />} onClick={loadUsers} size="small">
              Actualiser
            </Button>
          </div>
        </div>

        {visiblePendingUsers.length > 0 && tabValue === 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {visiblePendingUsers.length} opérateur(s) en attente de validation
            <Button size="small" onClick={() => setTabValue(1)} sx={{ ml: 2 }}>
              Voir
            </Button>
          </Alert>
        )}

        <Paper>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
            <Tab label={`Tous (${visibleUsers.length})`} />
            <Tab
              label="En attente"
              icon={visiblePendingUsers.length > 0 ? <Chip label={visiblePendingUsers.length} size="small" color="warning" /> : null}
              iconPosition="end"
            />
          </Tabs>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Identifiant</TableCell>
                  <TableCell>Nom complet</TableCell>
                  <TableCell>Rôle</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Création</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayList.map((user) => (
                  <TableRow key={user.id} className={user.status === 'pending' ? 'pending-row' : ''}>
                    <TableCell><span className="email-cell">{user.email}</span></TableCell>
                    <TableCell>{user.full_name || user.displayName || '—'}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell sx={{ fontFamily: 'Share Tech Mono', fontSize: '11px', color: '#3a4a5a' }}>
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell align="right">
                      {user.status === 'pending' && (
                        <IconButton size="small" color="success" onClick={() => handleApprove(user.id)} title="Valider">
                          <CheckCircle fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton size="small" color="error" onClick={() => setDeleteDialog({ open: true, user })} title="Supprimer">
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {displayList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography sx={{ py: 4, color: '#3a4a5a', fontFamily: 'Share Tech Mono', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        — Aucun enregistrement —
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, user: null })}>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogContent>
            <p className="delete-confirm-text">
              Supprimer définitivement l'opérateur <strong>{deleteDialog.user?.email}</strong> ?<br />
              <span style={{ color: '#5a6a7a', fontSize: 12 }}>Cette action est irréversible.</span>
            </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, user: null })}>Annuler</Button>
            <Button onClick={handleDelete} color="error" variant="contained">Supprimer</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}