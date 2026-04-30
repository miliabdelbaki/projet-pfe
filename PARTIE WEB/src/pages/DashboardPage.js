import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';

import { statsAPI } from '../services/api';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500&family=Share+Tech+Mono&display=swap');

  .db-root {
    font-family: 'Barlow', sans-serif;
    color: #c8d8e8;
  }

  .db-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 32px;
    padding-bottom: 20px;
    border-bottom: 1px solid #161c26;
    position: relative;
  }

  .db-header::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 120px;
    height: 2px;
    background: linear-gradient(90deg, #ff6f00, transparent);
  }

  .db-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 42px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    color: #ffffff;
    line-height: 1.1;
  }

  .db-subtitle {
    font-family: 'Barlow', sans-serif;
    font-size: 13px;
    color: #6a7a8a;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-top: 6px;
    font-weight: 500;
  }

  .db-timestamp {
    font-family: 'Barlow', sans-serif;
    font-size: 13px;
    color: #5a6a7a;
    text-align: right;
    line-height: 1.6;
  }

  /* STAT CARDS */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }

  .stat-card {
    background: #0d1117;
    border: 1px solid #161c26;
    padding: 24px;
    position: relative;
    overflow: hidden;
    transition: all 0.2s;
  }

  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--accent, #ff6f00);
    opacity: 0.7;
  }

  .stat-card:hover {
    border-color: var(--accent, #ff6f00);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }

  .stat-card-bg {
    position: absolute;
    bottom: -10px;
    right: -10px;
    opacity: 0.04;
  }

  .stat-label {
    font-family: 'Barlow', sans-serif;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #8a9aaa;
    margin-bottom: 12px;
  }

  .stat-value {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 52px;
    font-weight: 800;
    line-height: 1;
    color: var(--accent, #ff6f00);
    letter-spacing: -0.02em;
  }

  .stat-unit {
    font-family: 'Barlow', sans-serif;
    font-size: 13px;
    color: #7a8a9a;
    margin-top: 8px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    line-height: 1.5;
  }

  .stat-trend {
    position: absolute;
    bottom: 16px;
    right: 16px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    padding: 3px 8px;
    background: rgba(255,255,255,0.04);
    border: 1px solid #1e2a38;
    color: #3a4a5a;
  }

  /* SECTION */
  .db-section {
    background: #0d1117;
    border: 1px solid #161c26;
    margin-bottom: 20px;
  }

  .db-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #161c26;
  }

  .db-section-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 18px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #ffffff;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .db-section-title::before {
    content: '';
    width: 3px;
    height: 16px;
    background: #ff6f00;
  }

  .section-tag {
    font-family: 'Barlow', sans-serif;
    font-size: 11px;
    color: #5a6a7a;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    background: #0a0c0f;
    border: 1px solid #1e2a38;
    padding: 4px 10px;
    font-weight: 600;
  }

  /* GRID 2 COL */
  .db-two-col {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }

  @media (max-width: 768px) {
    .db-two-col { grid-template-columns: 1fr; }
    .stats-grid { grid-template-columns: 1fr 1fr; }
  }

  /* ACTIVITY LIST */
  .activity-list { padding: 0; }

  .activity-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    border-bottom: 1px solid #161c26;
    transition: background 0.15s;
  }

  .activity-item:hover { background: rgba(255,111,0,0.06); }
  .activity-item:last-child { border-bottom: none; }

  .activity-dot {
    width: 12px;
    height: 12px;
    min-width: 12px;
    background: var(--dot-color, #3a4a5a);
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }

  .activity-text {
    flex: 1;
    font-size: 15px;
    color: #a0b0c0;
    font-weight: 400;
    line-height: 1.6;
  }

  .activity-text strong { color: #ffffff; font-weight: 600; }

  .activity-time {
    font-family: 'Barlow', sans-serif;
    font-size: 12px;
    color: #5a6a7a;
    white-space: nowrap;
  }

  /* SYSTEM STATUS */
  .sys-status-list { padding: 0; }

  .sys-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    border-bottom: 1px solid #0d1117;
  }

  .sys-item:last-child { border-bottom: none; }

  .sys-name {
    flex: 1;
    font-size: 12px;
    color: #8a9aaa;
    font-family: 'Share Tech Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .sys-bar-wrap {
    width: 120px;
    height: 4px;
    background: #161c26;
    position: relative;
    overflow: hidden;
  }

  .sys-bar-fill {
    height: 100%;
    background: var(--bar-color, #ff6f00);
    transition: width 1s cubic-bezier(0.22,1,0.36,1);
  }

  .sys-pct {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    color: var(--bar-color, #ff6f00);
    min-width: 38px;
    text-align: right;
  }

  .sys-badge {
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    padding: 2px 8px;
    border: 1px solid;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .sys-badge.ok { color: #00e676; border-color: rgba(0,230,118,0.3); }
  .sys-badge.warn { color: #ff6f00; border-color: rgba(255,111,0,0.3); }
  .sys-badge.crit { color: #e53935; border-color: rgba(229,57,53,0.3); }

  /* MINI CHART */
  .mini-chart {
    display: flex;
    align-items: flex-end;
    gap: 4px;
    height: 60px;
    padding: 16px 20px;
    border-bottom: 1px solid #0d1117;
  }

  .chart-bar {
    flex: 1;
    background: rgba(255,111,0,0.15);
    border-top: 2px solid #ff6f00;
    transition: height 1s cubic-bezier(0.22,1,0.36,1);
    position: relative;
  }

  .chart-bar:hover { background: rgba(255,111,0,0.3); }

  .chart-labels {
    display: flex;
    gap: 4px;
    padding: 8px 20px 16px;
  }

  .chart-label {
    flex: 1;
    text-align: center;
    font-family: 'Barlow', sans-serif;
    font-size: 12px;
    color: #5a6a7a;
    text-transform: uppercase;
    font-weight: 600;
  }

  /* LOADER */
  .db-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 40vh;
    gap: 16px;
  }

  .loader-ring {
    width: 48px;
    height: 48px;
    border: 2px solid #1e2a38;
    border-top-color: #ff6f00;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .loader-text {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    color: #3a4a5a;
    text-transform: uppercase;
    letter-spacing: 0.15em;
  }

  /* MODAL OVERLAY */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: #0d1117;
    border: 1px solid #161c26;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
    padding: 24px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #161c26;
  }

  .modal-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 18px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #fff;
  }

  .modal-close {
    background: none;
    border: none;
    font-size: 24px;
    color: #8a9aaa;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.15s;
  }

  .modal-close:hover {
    color: #ff6f00;
  }

  .activity-details {
    margin-bottom: 24px;
  }

  .detail-row {
    display: flex;
    margin-bottom: 12px;
  }

  .detail-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    color: #3a4a5a;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    min-width: 100px;
  }

  .detail-value {
    color: #c8d8e8;
    font-size: 13px;
  }

  .items-container {
    margin-top: 20px;
  }

  .item-block {
    background: #0a0c0f;
    border: 1px solid #1e2a38;
    padding: 16px;
    margin-bottom: 12px;
  }

  .item-label {
    font-size: 13px;
    color: #c8d8e8;
    font-weight: 500;
    margin-bottom: 8px;
  }

  .item-status {
    display: inline-block;
    font-size: 10px;
    padding: 2px 8px;
    border: 1px solid;
    margin-bottom: 12px;
  }

  .item-status.completed {
    color: #00e676;
    border-color: rgba(0, 230, 118, 0.3);
  }

  .item-status.incomplete {
    color: #e53935;
    border-color: rgba(229, 57, 53, 0.3);
  }

  .item-notes {
    font-size: 12px;
    color: #8a9aaa;
    margin-bottom: 12px;
    padding: 8px;
    background: rgba(255, 111, 0, 0.05);
    border-left: 2px solid #ff6f00;
    word-break: break-word;
  }

  .item-image {
    width: 100%;
    max-height: 500px;
    border: 1px solid #1e2a38;
    margin-top: 12px;
    border-radius: 4px;
    object-fit: cover;
    background: #0a0c0f;
  }

  .no-image {
    text-align: center;
    padding: 40px 24px;
    color: #3a4a5a;
    font-size: 14px;
    font-style: italic;
    background: #0a0c0f;
    border: 1px dashed #1e2a38;
    border-radius: 4px;
    margin-top: 12px;
  }

  .image-error {
    text-align: center;
    padding: 40px 24px;
    color: #e53935;
    font-size: 14px;
    background: #0a0c0f;
    border: 1px solid #e53935;
    border-radius: 4px;
    margin-top: 12px;
  }

  /* Activity item clickable */
  .activity-item-clickable {
    cursor: pointer;
  }

  .activity-item-clickable:hover {
    background: rgba(255, 111, 0, 0.08) !important;
  }
`;

const getWeekDays = () => {
  const days = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const weekDays = [];
  for (let i = 1; i <= 7; i++) {
    const dayIndex = (currentDay + i) % 7;
    weekDays.push(days[dayIndex]);
  }
  return weekDays;
};

const WEEK_DAYS = getWeekDays();

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, totalRooms: 0, totalVerifications: 0 });
  const [bars, setBars] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [activity, setActivity] = useState([]);
  const [sysItems, setSysItems] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await statsAPI.getDashboardStats();
      setStats({
        totalUsers: data.totalUsers,
        totalRooms: data.totalRooms,
        totalVerifications: data.totalVerifications
      });
      setBars(Array.isArray(data.weeklyVerifications) ? data.weeklyVerifications : [0, 0, 0, 0, 0, 0, 0]);
      setActivity(Array.isArray(data.activity) ? data.activity : []);
      setSysItems(Array.isArray(data.systemStatus) ? data.systemStatus : []);
    } catch (err) {
      enqueueSnackbar('Erreur de chargement', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Helper: Ensure photo URL has proper data URL prefix
  const getPhotoSrc = (photo) => {
    if (!photo || photo.length === 0) return null;
    if (photo.startsWith('data:')) return photo;
    return `data:image/jpeg;base64,${photo}`;
  };

  if (loading) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="db-loader">
          <div className="loader-ring" />
          <span className="loader-text">Chargement du tableau de bord…</span>
        </div>
      </>
    );
  }

  const now = new Date();

  const STAT_CARDS = [
    { label: 'Utilisateurs enregistrés', value: stats.totalUsers, unit: 'Comptes actifs', accent: '#ff6f00', icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z', trend: '+2 ce mois' },
    { label: 'Salles surveillées', value: stats.totalRooms, unit: 'Salles serveurs', accent: '#00b4d8', icon: 'M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z', trend: 'Actives' },
    { label: 'Vérifications totales', value: stats.totalVerifications, unit: 'Contrôles effectués', accent: '#00e676', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', trend: 'Cette semaine' },
  ];

  const ACTIVITY = activity.length > 0 ? activity.map((item) => ({
    ...item,
    color: item.status === 'validated' ? '#00e676' : item.status === 'incomplete' ? '#e53935' : '#ff6f00',
    time: item.createdAt ? new Date(item.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '---'
  })) : [
    { text: <><strong>Chargement...</strong> — Aucune activité pour le moment</>, time: '...', color: '#3a4a5a' }
  ];

  const SYS_ITEMS = [];

  return (
    <>
      <style>{STYLES}</style>
      <div className="db-root">
        <div className="db-header">
          <div>
            <div className="db-title">Tableau de bord</div>
            <div className="db-subtitle">// Vue d'ensemble opérationnelle</div>
          </div>
          <div className="db-timestamp">
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: 11, color: '#3a4a5a' }}>
              {now.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="stats-grid">
          {STAT_CARDS.map((c) => (
            <div className="stat-card" key={c.label} style={{ '--accent': c.accent }}>
              <div className="stat-label">{c.label}</div>
              <div className="stat-value">{c.value}</div>
              <div className="stat-unit">{c.unit}</div>
              <div className="stat-trend">{c.trend}</div>
              <svg className="stat-card-bg" width="80" height="80" viewBox="0 0 24 24" fill={c.accent}>
                <path d={c.icon} />
              </svg>
            </div>
          ))}
        </div>

        <div className="db-two-col">
          {/* ACTIVITÉ RÉCENTE */}
          <div className="db-section">
            <div className="db-section-header">
              <span className="db-section-title">Activité récente</span>
              <span className="section-tag">Live</span>
            </div>
            <div className="activity-list">
              {ACTIVITY.map((a, i) => (
                <div 
                  className="activity-item activity-item-clickable" 
                  key={i}
                  onClick={() => setSelectedActivity(a)}
                  title="Cliquez pour voir les détails et les images"
                >
                  <div className="activity-dot" style={{ '--dot-color': a.color }} />
                  <div className="activity-text">{a.text}</div>
                  <div className="activity-time">{a.time}</div>
                </div>
              ))}
            </div>
          </div>


        </div>

        {/* VÉRIFICATIONS HEBDO */}
        <div className="db-section">
          <div className="db-section-header">
            <span className="db-section-title">Vérifications cette semaine</span>
            <span className="section-tag">Semaine en cours</span>
          </div>
          <div className="mini-chart">
            {(() => {
              const maxValue = Math.max(...bars, 1); // Ensure at least 1 to avoid division by 0
              return bars.map((h, i) => {
                const heightPercent = (h / maxValue) * 100;
                return (
                  <div
                    key={i}
                    className="chart-bar"
                    style={{ height: `${heightPercent}%` }}
                    title={`${WEEK_DAYS[i]}: ${h} vérification${h !== 1 ? 's' : ''}`}
                  />
                );
              });
            })()}
          </div>
          <div className="chart-labels">
            {WEEK_DAYS.map((d) => (
              <span className="chart-label" key={d}>{d}</span>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL: Détails d'activité avec images */}
      {selectedActivity && (
        <div className="modal-overlay" onClick={() => setSelectedActivity(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Détails de l'activité</div>
              <button className="modal-close" onClick={() => setSelectedActivity(null)}>✕</button>
            </div>

            <div className="activity-details">
              <div className="detail-row">
                <span className="detail-label">Salle</span>
                <span className="detail-value">{selectedActivity.room}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Technicien</span>
                <span className="detail-value">{selectedActivity.technician}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Statut</span>
                <span className="detail-value">
                  <span style={{
                    color: selectedActivity.status === 'validated' ? '#00e676' : 
                           selectedActivity.status === 'incomplete' ? '#e53935' : '#ff6f00'
                  }}>
                    {selectedActivity.status}
                  </span>
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date</span>
                <span className="detail-value">
                  {new Date(selectedActivity.createdAt).toLocaleString('fr-FR')}
                </span>
              </div>
            </div>

            {/* Afficher les items avec images et notes */}
            {selectedActivity.items && selectedActivity.items.length > 0 && (
              <div className="items-container">
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#fff',
                  marginBottom: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <span style={{ width: 3, height: 16, background: '#ff6f00' }} />
                  Éléments vérifiés
                </div>

                {selectedActivity.items.map((item, idx) => {
                  const photoSrc = getPhotoSrc(item.photo);
                  return (
                    <div className="item-block" key={idx}>
                      <div className="item-label">{item.label}</div>
                      <span className={`item-status ${item.completed ? 'completed' : 'incomplete'}`}>
                        {item.completed ? '✓ COMPLÉTÉ' : '✗ NON COMPLÉTÉ'}
                      </span>

                      {item.notes && (
                        <div className="item-notes">
                          <strong>Notes :</strong> {item.notes}
                        </div>
                      )}

                      {photoSrc ? (
                        <img 
                          src={photoSrc}
                          alt={`Photo - ${item.label}`}
                          className="item-image"
                          onLoad={() => {
                            console.log('✅ Image loaded successfully for:', item.label);
                          }}
                          onError={(e) => {
                            console.error('❌ Image load error for:', item.label);
                            console.error('Photo src starts with:', photoSrc?.substring(0, 80));
                            console.error('Photo length:', photoSrc?.length);
                            e.target.style.display = 'none';
                            const errorDiv = document.createElement('div');
                            errorDiv.className = 'image-error';
                            errorDiv.textContent = '❌ Erreur lors du chargement de l\'image';
                            e.target.parentElement.appendChild(errorDiv);
                          }}
                        />
                      ) : (
                        <div className="no-image">📷 Aucune image capturée</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}