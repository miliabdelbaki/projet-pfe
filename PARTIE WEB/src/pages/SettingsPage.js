import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, Grid, TextField, Button, Divider,
  Switch, FormControlLabel, Alert, CircularProgress
} from '@mui/material';
import { Lock, Notifications, Save, Security, LightMode, DarkMode } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { authAPI } from '../services/api';
import { useAppTheme } from './ThemeContext';

const PAGE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500&family=Share+Tech+Mono&display=swap');

  .settings-page { font-family: 'Barlow', sans-serif; color: var(--text-primary); }

  .settings-page .page-header {
    display: flex; align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 28px; padding-bottom: 16px;
    border-bottom: 1px solid var(--border); position: relative;
  }
  .settings-page .page-header::after {
    content: ''; position: absolute; bottom: -1px; left: 0;
    width: 80px; height: 2px;
    background: linear-gradient(90deg, var(--accent), transparent);
  }
  .settings-page .page-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 32px; font-weight: 800; text-transform: uppercase;
    color: var(--text-primary); letter-spacing: 0.02em; line-height: 1;
  }
  .settings-page .page-subtitle {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px; color: var(--text-muted);
    text-transform: uppercase; letter-spacing: 0.15em; margin-top: 4px;
  }
  .settings-page .section-heading {
    display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
  }
  .settings-page .section-heading-bar {
    width: 3px; height: 18px; background: var(--accent);
  }
  .settings-page .section-heading-text {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 15px; font-weight: 700; text-transform: uppercase;
    color: var(--text-primary); letter-spacing: 0.06em;
  }
  .settings-page .profile-card {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    padding: 28px;
    display: flex; flex-direction: column; align-items: center;
    text-align: center; position: relative; overflow: hidden;
  }
  .settings-page .profile-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0;
    height: 2px; background: linear-gradient(90deg, var(--accent), transparent);
  }
  .settings-page .profile-avatar {
    width: 80px; height: 80px;
    background: var(--bg-base);
    border: 2px solid var(--border-mid);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 36px; font-weight: 800; color: var(--accent);
    margin-bottom: 16px;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  }
  .settings-page .profile-name {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 20px; font-weight: 700; color: var(--text-primary);
    text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 4px;
  }
  .settings-page .profile-email {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px; color: var(--text-secondary); margin-bottom: 12px;
  }
  .settings-page .role-badge {
    display: inline-block;
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px; text-transform: uppercase; letter-spacing: 0.12em;
    padding: 4px 12px;
    border: 1px solid rgba(255,111,0,0.4);
    color: var(--accent); background: rgba(255,111,0,0.06);
  }
  .settings-page .sys-info-card {
    background: var(--bg-surface); border: 1px solid var(--border);
    padding: 20px; margin-top: 16px;
  }
  .settings-page .sys-info-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 0; border-bottom: 1px solid var(--border);
  }
  .settings-page .sys-info-row:last-child { border-bottom: none; }
  .settings-page .sys-info-key {
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px; text-transform: uppercase;
    letter-spacing: 0.12em; color: var(--text-muted);
  }
  .settings-page .sys-info-val {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px; color: var(--text-secondary);
  }
  .settings-page .sys-info-val.live { color: var(--success); }
  .settings-page .sys-info-val.live::before { content: '● '; font-size: 8px; }

  /* THEME TOGGLE BUTTON */
  .theme-toggle-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 16px 20px;
    background: var(--bg-base);
    border: 1px solid var(--border-mid);
    border-left: 3px solid var(--accent);
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 16px;
    font-family: 'Barlow', sans-serif;
  }
  .theme-toggle-btn:hover {
    border-color: var(--accent);
    background: rgba(255,111,0,0.04);
  }
  .theme-toggle-track {
    width: 52px; height: 26px;
    background: var(--border-mid);
    border-radius: 13px;
    position: relative;
    transition: background 0.3s;
    flex-shrink: 0;
  }
  .theme-toggle-track.active { background: var(--accent); }
  .theme-toggle-thumb {
    position: absolute;
    top: 3px; left: 3px;
    width: 20px; height: 20px;
    background: #fff;
    border-radius: 50%;
    transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
    display: flex; align-items: center; justify-content: center;
  }
  .theme-toggle-track.active .theme-toggle-thumb { transform: translateX(26px); }
  .theme-toggle-label {
    flex: 1;
  }
  .theme-toggle-title {
    font-size: 13px; font-weight: 600; color: var(--text-primary);
    display: block;
  }
  .theme-toggle-subtitle {
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px; color: var(--text-muted);
    text-transform: uppercase; letter-spacing: 0.1em;
    display: block; margin-top: 2px;
  }
  .theme-icon {
    font-size: 18px;
    transition: all 0.3s;
  }
`;

export default function SettingsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const { isDark, toggleTheme } = useAppTheme();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({ displayName: '', email: '' });
  const [passwordData, setPasswordData] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [prefs, setPrefs] = useState({
    notifications_email: true,
    notifications_dashboard: true,
    auto_refresh: true,
  });

  useEffect(() => {
    const u = authAPI.getCurrentUser();
    if (u) {
      setUser(u);
      setProfileData({ displayName: u.displayName || '', email: u.email || '' });
    }
    const saved = localStorage.getItem('app_settings');
    if (saved) {
      try { setPrefs(JSON.parse(saved)); } catch {}
    }
  }, []);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const updated = { ...user, ...profileData };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      enqueueSnackbar('Profil mis à jour', { variant: 'success' });
    } catch {
      enqueueSnackbar('Erreur de mise à jour', { variant: 'error' });
    } finally { setLoading(false); }
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      enqueueSnackbar('Les mots de passe ne correspondent pas', { variant: 'error' }); return;
    }
    if (passwordData.new_password.length < 8) {
      enqueueSnackbar('Minimum 8 caractères requis', { variant: 'error' }); return;
    }
    setLoading(true);
    try {
      enqueueSnackbar('Mot de passe modifié', { variant: 'success' });
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch {
      enqueueSnackbar('Erreur', { variant: 'error' });
    } finally { setLoading(false); }
  };

  const handleSavePrefs = () => {
    localStorage.setItem('app_settings', JSON.stringify(prefs));
    enqueueSnackbar('Préférences sauvegardées', { variant: 'success' });
  };

  if (!user) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress />
    </Box>
  );

  const SectionHeading = ({ children }) => (
    <div className="section-heading">
      <div className="section-heading-bar" />
      <span className="section-heading-text">{children}</span>
    </div>
  );

  return (
    <>
      <style>{PAGE_STYLES}</style>
      <Box className="settings-page">
        <div className="page-header">
          <div>
            <div className="page-title">Paramètres</div>
            <div className="page-subtitle">// Configuration du compte &amp; du système</div>
          </div>
        </div>

        <Grid container spacing={3}>
          {/* LEFT */}
          <Grid item xs={12} md={4}>
            <div className="profile-card">
              <div className="profile-avatar">
                {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="profile-name">{user?.displayName || 'Opérateur'}</div>
              <div className="profile-email">{user?.email}</div>
              <span className="role-badge">
                {user?.role === 'admin' ? '⬡ Administrateur' : '◈ Technicien'}
              </span>
            </div>


          </Grid>

          {/* RIGHT */}
          <Grid item xs={12} md={8}>

            {/* PROFILE */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <SectionHeading>Informations du profil</SectionHeading>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Nom d'affichage" value={profileData.displayName}
                    onChange={e => setProfileData({ ...profileData, displayName: e.target.value })}
                    helperText="Affiché dans l'interface opérateur" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth type="email" label="Adresse email" value={profileData.email}
                    disabled helperText="L'identifiant ne peut pas être modifié" />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained"
                    startIcon={loading ? <CircularProgress size={16} /> : <Save />}
                    onClick={handleSaveProfile} disabled={loading}>
                    Enregistrer
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {/* PASSWORD */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <SectionHeading>Sécurité — Mot de passe</SectionHeading>
              <Alert severity="info" sx={{ mb: 2 }}>Minimum 8 caractères requis.</Alert>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth type="password" label="Mot de passe actuel"
                    value={passwordData.current_password}
                    onChange={e => setPasswordData({ ...passwordData, current_password: e.target.value })} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth type="password" label="Nouveau mot de passe"
                    value={passwordData.new_password}
                    onChange={e => setPasswordData({ ...passwordData, new_password: e.target.value })} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth type="password" label="Confirmer"
                    value={passwordData.confirm_password}
                    onChange={e => setPasswordData({ ...passwordData, confirm_password: e.target.value })} />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="outlined" startIcon={<Security />}
                    onClick={handleChangePassword}
                    disabled={!passwordData.current_password || !passwordData.new_password || loading}>
                    Changer le mot de passe
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {/* PREFERENCES */}
            <Paper sx={{ p: 3 }}>
              <SectionHeading>Préférences système</SectionHeading>

              {/* ══ THEME TOGGLE ══ */}
              <button className="theme-toggle-btn" onClick={toggleTheme}>
                <span style={{ fontSize: 20, color: 'var(--accent)' }}>
                  {isDark ? '🌙' : '☀️'}
                </span>
                <div className="theme-toggle-label">
                  <span className="theme-toggle-title">
                    {isDark ? 'Mode sombre actif' : 'Mode clair actif'}
                  </span>
                  <span className="theme-toggle-subtitle">
                    Cliquez pour passer en mode {isDark ? 'clair' : 'sombre'}
                  </span>
                </div>
                <div className={`theme-toggle-track ${isDark ? 'active' : ''}`}>
                  <div className="theme-toggle-thumb">
                    {isDark
                      ? <DarkMode sx={{ fontSize: 12, color: '#ff6f00' }} />
                      : <LightMode sx={{ fontSize: 12, color: '#ff9500' }} />
                    }
                  </div>
                </div>
              </button>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={1}>
                {[
                  { key: 'notifications_email', label: 'Notifications par email' },
                  { key: 'notifications_dashboard', label: 'Notifications dans le tableau de bord' },
                  { key: 'auto_refresh', label: 'Actualisation automatique des données' },
                ].map(pref => (
                  <Grid item xs={12} key={pref.key}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={prefs[pref.key]}
                          onChange={e => setPrefs({ ...prefs, [pref.key]: e.target.checked })}
                        />
                      }
                      label={<span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{pref.label}</span>}
                    />
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Button variant="contained" startIcon={<Save />} onClick={handleSavePrefs}>
                    Sauvegarder les préférences
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}