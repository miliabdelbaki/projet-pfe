import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';

const DRAWER_WIDTH = 260;
const DRAWER_COLLAPSED = 64;

const NAV_ITEMS = [
  { text: 'Dashboard', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z', path: '/dashboard' },
  { text: 'Utilisateurs', icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z', path: '/users' },
  { text: 'Salles', icon: 'M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z', path: '/rooms' },
  { text: 'Checklists', icon: 'M19 3H14.82C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z', path: '/checklists' },
  { text: 'Historique salles', icon: 'M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.954 8.954 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z', path: '/history-salles' },
  { text: 'Analyse de risque', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z', path: '/analyse-salles' },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authAPI.getCurrentUser();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = React.useState(false);
  const accountMenuRef = React.useRef(null);

  // Track if we're in mobile mode (≤1024px)
  const [isMobile, setIsMobile] = React.useState(() => window.innerWidth <= 1024);

  React.useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  React.useEffect(() => {
    const onDocClick = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const isActive = (path) => location.pathname === path;

  // On mobile: sidebar is overlay (0 shift). On desktop: sidebar shifts content.
  const sidebarWidth = isMobile ? DRAWER_WIDTH : (collapsed ? DRAWER_COLLAPSED : DRAWER_WIDTH);
  const contentShift = isMobile ? 0 : sidebarWidth;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@300;400;500&family=Share+Tech+Mono&display=swap');

        * { box-sizing: border-box; }

        .layout-root {
          display: flex;
          min-height: 100vh;
          background: #0a0c0f;
          font-family: 'Barlow', sans-serif;
          overflow-x: hidden;
        }

        /* ── SIDEBAR ── */
        .sidebar {
          width: ${DRAWER_WIDTH}px;
          min-height: 100vh;
          background: #0d1117;
          border-right: 1px solid #161c26;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0; top: 0; bottom: 0;
          z-index: 200;
          transition: width 0.3s cubic-bezier(0.22,1,0.36,1), transform 0.28s cubic-bezier(0.22,1,0.36,1);
          overflow: hidden;
        }

        /* Desktop collapsed state */
        @media (min-width: 1025px) {
          .sidebar { width: ${collapsed ? DRAWER_COLLAPSED : DRAWER_WIDTH}px; }
        }

        /* Mobile: hidden by default, slides in */
        @media (max-width: 1024px) {
          .sidebar {
            width: ${DRAWER_WIDTH}px !important;
            transform: translateX(-100%);
          }
          .sidebar.mobile-open {
            transform: translateX(0);
          }
        }

        /* Mobile overlay backdrop */
        .sidebar-backdrop {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 199;
          backdrop-filter: blur(2px);
        }
        .sidebar-backdrop.visible { display: block; }

        /* ── SIDEBAR HEADER ── */
        .sidebar-header {
          padding: ${collapsed && !isMobile ? '20px 10px' : '24px 20px'};
          border-bottom: 1px solid #161c26;
          display: flex;
          align-items: center;
          justify-content: ${collapsed && !isMobile ? 'center' : 'space-between'};
          min-height: 56px;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          overflow: hidden;
        }

        .logo-hex {
          width: 36px; height: 36px; min-width: 36px;
          background: #ff6f00;
          clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s; flex-shrink: 0;
          cursor: pointer;
        }
        .logo-hex:hover { transform: rotate(30deg); }

        .logo-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px; font-weight: 700;
          color: #fff; text-transform: uppercase;
          letter-spacing: 0.04em; white-space: nowrap;
          opacity: ${collapsed && !isMobile ? 0 : 1};
          transition: opacity 0.2s;
          line-height: 1.2;
        }
        .logo-version {
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px; color: #3a4a5a;
          text-transform: uppercase; letter-spacing: 0.1em;
        }

        .collapse-btn {
          background: none;
          border: 1px solid #1e2a38;
          color: #3a4a5a;
          width: 24px; height: 24px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s; flex-shrink: 0;
        }
        .collapse-btn:hover { border-color: #ff6f00; color: #ff6f00; }

        /* ── NAV ── */
        .sidebar-nav {
          flex: 1;
          padding: 12px 0;
          overflow-y: auto; overflow-x: hidden;
        }

        .nav-section-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px; color: #2a3a4a;
          text-transform: uppercase; letter-spacing: 0.15em;
          padding: ${collapsed && !isMobile ? '12px 0 4px' : '12px 20px 4px'};
          text-align: ${collapsed && !isMobile ? 'center' : 'left'};
          opacity: ${collapsed && !isMobile ? 0 : 1};
          transition: opacity 0.15s;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: ${collapsed && !isMobile ? '12px' : '11px 20px'};
          cursor: pointer;
          position: relative;
          transition: all 0.15s;
          white-space: nowrap;
          justify-content: ${collapsed && !isMobile ? 'center' : 'flex-start'};
          margin: 2px 8px;
        }

        .nav-item:hover .nav-icon { color: #ff6f00; }
        .nav-item:hover .nav-text { color: #fff; }
        .nav-item:hover::before {
          content: '';
          position: absolute; inset: 0;
          background: rgba(255,111,0,0.06);
          border-left: 2px solid rgba(255,111,0,0.3);
        }

        .nav-item.active { background: rgba(255,111,0,0.08); }
        .nav-item.active::before {
          content: '';
          position: absolute; inset: 0;
          border-left: 3px solid #ff6f00;
        }

        .nav-icon {
          display: flex; align-items: center; flex-shrink: 0;
          transition: color 0.15s;
        }
        .nav-item.active .nav-icon { color: #ff6f00; }
        .nav-item:not(.active) .nav-icon { color: #3a4a5a; }

        .nav-text {
          font-size: 13px; font-weight: 500;
          letter-spacing: 0.02em;
          transition: all 0.15s;
          opacity: ${collapsed && !isMobile ? 0 : 1};
          position: ${collapsed && !isMobile ? 'absolute' : 'static'};
          pointer-events: ${collapsed && !isMobile ? 'none' : 'auto'};
        }
        .nav-item.active .nav-text { color: #e0b07a; }
        .nav-item:not(.active) .nav-text { color: #5a6a7a; }

        /* Tooltip when collapsed on desktop */
        .nav-item[data-tooltip]:hover::after {
          content: attr(data-tooltip);
          position: absolute;
          left: calc(100% + 12px); top: 50%;
          transform: translateY(-50%);
          background: #1a2230; color: #c8d8e8;
          font-family: 'Barlow', sans-serif;
          font-size: 12px; font-weight: 500;
          padding: 6px 12px;
          white-space: nowrap;
          border: 1px solid #2a3a4a;
          border-left: 2px solid #ff6f00;
          z-index: 300;
          display: ${collapsed && !isMobile ? 'block' : 'none'};
        }

        /* ── SIDEBAR USER ── */
        .sidebar-user {
          padding: ${collapsed && !isMobile ? '16px 8px' : '16px 20px'};
          border-top: 1px solid #161c26;
          display: flex; align-items: center; gap: 12px;
          justify-content: ${collapsed && !isMobile ? 'center' : 'flex-start'};
        }

        .user-avatar {
          width: 36px; height: 36px; min-width: 36px;
          background: linear-gradient(135deg, #1e2a38, #2a3a4a);
          border: 1px solid #2a3a4a;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; font-size: 15px; color: #ff6f00;
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }

        .user-info {
          flex: 1; min-width: 0;
          opacity: ${collapsed && !isMobile ? 0 : 1};
          transition: opacity 0.15s;
        }
        .user-name {
          font-size: 13px; font-weight: 600; color: #c8d8e8;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .user-role {
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px; color: #ff6f00;
          text-transform: uppercase; letter-spacing: 0.1em;
        }

        .logout-btn {
          background: none; border: 1px solid #1e2a38;
          color: #3a4a5a; width: 28px; height: 28px; min-width: 28px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.15s;
          opacity: ${collapsed && !isMobile ? 0 : 1};
        }
        .logout-btn:hover { border-color: #e53935; color: #e53935; }

        /* ── TOPBAR ── */
        .topbar {
          position: fixed;
          top: 0;
          left: ${contentShift}px;
          right: 0;
          height: 56px;
          background: rgba(13,17,23,0.96);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #161c26;
          display: flex;
          align-items: center;
          padding: 0 20px;
          z-index: 100;
          gap: 12px;
          transition: left 0.3s cubic-bezier(0.22,1,0.36,1);
          min-width: 0;
        }

        .topbar-breadcrumb {
          display: flex; align-items: center; gap: 8px;
          flex: 1; min-width: 0; overflow: hidden;
        }
        .breadcrumb-sep { color: #2a3a4a; font-size: 12px; flex-shrink: 0; }
        .breadcrumb-segment {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.05em;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .breadcrumb-segment.dim { color: #3a4a5a; flex-shrink: 0; }
        .breadcrumb-segment.current { color: #c8d8e8; min-width: 0; }

          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .topbar-time {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px; color: #c8d8e8;
          letter-spacing: 0.05em;
          white-space: nowrap; flex-shrink: 0;
        }

        /* ── ACCOUNT MENU ── */
        .account-wrap { position: relative; flex-shrink: 0; }

        .account-trigger {
          height: 40px;
          padding: 0 14px 0 4px;
          border-radius: 20px;
          border: 1px solid #2a3a4a;
          background: rgba(30,42,56,0.5);
          color: #c8d8e8;
          cursor: pointer;
          display: flex; align-items: center; gap: 10px;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .account-trigger:hover {
          border-color: #ff6f00;
          background: rgba(255,111,0,0.05);
        }

        .trigger-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: linear-gradient(135deg, #1e2a38, #2a3a4a);
          color: #ff6f00;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; font-size: 14px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid #3a4a5a;
          flex-shrink: 0;
        }
        .trigger-name {
          font-family: 'Barlow', sans-serif;
          font-size: 13px; font-weight: 600;
          max-width: 120px; overflow: hidden;
          text-overflow: ellipsis; white-space: nowrap;
        }

        .account-menu {
          position: absolute;
          top: calc(100% + 10px); right: 0;
          width: 280px;
          background: #161c26;
          border: 1px solid #2a3a4a;
          box-shadow: 0 14px 35px rgba(0,0,0,0.5);
          overflow: hidden; z-index: 400;
        }
        .account-menu-header {
          padding: 20px 16px;
          background: #0d1117;
          border-bottom: 1px solid #1e2a38;
          text-align: center;
        }
        .account-menu-avatar {
          width: 56px; height: 56px; margin: 0 auto 12px;
          background: linear-gradient(135deg, #1e2a38, #2a3a4a);
          border: 1px solid #ff6f00; color: #ff6f00;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 24px; font-weight: 700;
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
        .account-menu-email {
          color: #5a6a7a; font-family: 'Share Tech Mono', monospace;
          font-size: 11px; overflow: hidden;
          text-overflow: ellipsis; white-space: nowrap;
          letter-spacing: 0.05em;
        }
        .account-menu-name {
          color: #fff; font-family: 'Barlow Condensed', sans-serif;
          font-size: 18px; font-weight: 600;
          margin-top: 6px; letter-spacing: 0.02em; text-transform: uppercase;
        }
        .account-menu-list { padding: 8px; background: #161c26; }
        .account-menu-item {
          width: 100%; border: none; background: transparent;
          text-align: left; padding: 12px 16px;
          color: #c8d8e8; font-family: 'Barlow', sans-serif;
          font-size: 14px; font-weight: 500;
          cursor: pointer; display: flex; align-items: center;
          gap: 12px; transition: all 0.2s;
        }
        .account-menu-item:hover { background: rgba(255,111,0,0.05); color: #ff6f00; }

        /* ── MOBILE MENU BTN ── */
        .mobile-menu-btn {
          background: none;
          border: 1px solid #1e2a38;
          color: #5a6a7a;
          width: 36px; height: 36px; min-width: 36px;
          display: none;
          align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0;
          transition: all 0.2s;
        }
        .mobile-menu-btn:hover { border-color: #ff6f00; color: #ff6f00; }

        /* ── MAIN CONTENT ── */
        .main-content {
          margin-left: ${contentShift}px;
          margin-top: 56px;
          flex: 1;
          padding: 28px;
          min-height: calc(100vh - 56px);
          transition: margin-left 0.3s cubic-bezier(0.22,1,0.36,1);
          background: #0a0c0f;
          background-image:
            linear-gradient(rgba(255,111,0,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,111,0,0.015) 1px, transparent 1px);
          background-size: 48px 48px;
          overflow-x: hidden;
          min-width: 0;
          width: 100%;
        }

        .main-content table, .main-content .MuiTable-root {
          width: 100% !important;
          table-layout: auto !important;
        }
        .main-content .MuiTableContainer-root {
          width: 100%; overflow-x: auto;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .topbar { left: 0 !important; }
          .main-content { margin-left: 0 !important; padding: 16px; }
          .mobile-menu-btn { display: flex; }
          .collapse-btn { display: none; }
          .topbar-time { display: none; }
        }

        @media (max-width: 640px) {
          .topbar { padding: 0 10px; gap: 8px; }
          .trigger-name { display: none; }
          .main-content { padding: 12px 10px 24px; }
        }
      `}</style>

      <div className="layout-root">

        {/* Mobile backdrop */}
        <div
          className={`sidebar-backdrop ${mobileOpen ? 'visible' : ''}`}
          onClick={() => setMobileOpen(false)}
        />

        {/* ── SIDEBAR ── */}
        <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <div className="logo-hex">
                <svg width="16" height="16" viewBox="0 0 22 22" fill="none">
                  <path d="M11 2L20 7V15L11 20L2 15V7L11 2Z" fill="white" />
                  <path d="M11 7L16 10V14L11 17L6 14V10L11 7Z" fill="#ff6f00" />
                </svg>
              </div>
              {(!collapsed || isMobile) && (
                <div>
                  <div className="logo-name">SRGuardian</div>
                  <div className="logo-version">v1.0.0 · Industrial</div>
                </div>
              )}
            </div>
            {!isMobile && (
              <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  {collapsed
                    ? <path d="M8 5v14l11-7z"/>
                    : <path d="M16 5v14L5 12z"/>
                  }
                </svg>
              </button>
            )}
          </div>

          <nav className="sidebar-nav">
            {(!collapsed || isMobile) && <div className="nav-section-label">Navigation</div>}
            {NAV_ITEMS.map((item) => (
              <div
                key={item.path}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                data-tooltip={item.text}
                onClick={() => { navigate(item.path); setMobileOpen(false); }}
              >
                <span className="nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d={item.icon} />
                  </svg>
                </span>
                {(!collapsed || isMobile) && <span className="nav-text">{item.text}</span>}
              </div>
            ))}
          </nav>

          <div className="sidebar-user">
            <div className="user-avatar">
              {user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            {(!collapsed || isMobile) && (
              <>
                <div className="user-info">
                  <div className="user-name">{user?.displayName || user?.email?.split('@')[0] || 'Opérateur'}</div>
                  <div className="user-role">{user?.role || 'admin'}</div>
                </div>
                <button className="logout-btn" onClick={handleLogout} title="Déconnexion">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                  </svg>
                </button>
              </>
            )}
          </div>
        </aside>

        {/* ── TOPBAR ── */}
        <header className="topbar">
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>

          <div className="topbar-breadcrumb">
            <span className="breadcrumb-segment dim">SRGuardian</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-segment current">
              {NAV_ITEMS.find(i => i.path === location.pathname)?.text || 'Page'}
            </span>
          </div>


          <Clock />

          <div className="account-wrap" ref={accountMenuRef}>
            <button
              className="account-trigger"
              onClick={() => setAccountMenuOpen((v) => !v)}
              title="Compte"
            >
              <div className="trigger-avatar">
                {(user?.email?.charAt(0) || 'U').toUpperCase()}
              </div>
              <span className="trigger-name">
                {user?.displayName || user?.email?.split('@')[0] || 'Admin'}
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.7, flexShrink: 0 }}>
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>

            {accountMenuOpen && (
              <div className="account-menu">
                <div className="account-menu-header">
                  <div className="account-menu-email">{user?.email || 'utilisateur@local'}</div>
                  <div className="account-menu-avatar">
                    {(user?.email?.charAt(0) || 'U').toUpperCase()}
                  </div>
                  <div className="account-menu-name">
                    Bonjour {user?.displayName || user?.email?.split('@')[0] || 'Utilisateur'} !
                  </div>
                </div>
                <div className="account-menu-list">
                  <button className="account-menu-item" onClick={() => { navigate('/settings'); setAccountMenuOpen(false); }}>
                    ⚙️ Paramètres
                  </button>
                  <button
                    className="account-menu-item"
                    onClick={() => { setAccountMenuOpen(false); handleLogout(); }}
                  >
                    🚪 Se déconnecter
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* ── MAIN ── */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}

function Clock() {
  const [time, setTime] = React.useState(new Date());
  React.useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="topbar-time">
      {time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  );
}