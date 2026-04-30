import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { authAPI } from '../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.login(email, password);
      enqueueSnackbar('Authentification réussie', { variant: 'success' });
      navigate('/dashboard');
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || 'Identifiants invalides.',
        { variant: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;800&family=Barlow:wght@300;400;500&family=Share+Tech+Mono&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          background: #0a0c0f;
          font-family: 'Barlow', sans-serif;
          overflow: hidden;
          position: relative;
        }

        /* LEFT PANEL — industrial illustration */
        .login-left {
          flex: 1.2;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 60px;
          overflow: hidden;
        }

        .login-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, transparent 40%, rgba(10,12,15,0.95) 100%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%230d1117'/%3E%3Cpath d='M0 40h80M40 0v80' stroke='%23161c26' stroke-width='1'/%3E%3Cpath d='M0 0h80v80' fill='none' stroke='%231a2230' stroke-width='.3'/%3E%3C/svg%3E");
          z-index: 0;
        }

        .grid-lines {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,111,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,111,0,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          z-index: 1;
        }

        .scan-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,111,0,0.6), transparent);
          animation: scanDown 4s linear infinite;
          z-index: 2;
        }
        @keyframes scanDown {
          0% { top: 0; opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        .server-art {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
          opacity: 0.12;
        }

        .left-content {
          position: relative;
          z-index: 3;
        }

        .left-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #ff6f00;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .left-tag::before {
          content: '';
          width: 24px;
          height: 1px;
          background: #ff6f00;
        }

        .left-heading {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(42px, 5vw, 72px);
          font-weight: 800;
          line-height: 0.95;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          margin-bottom: 20px;
        }

        .left-heading span {
          color: #ff6f00;
          display: block;
        }

        .left-desc {
          font-size: 14px;
          color: #5a6a7a;
          max-width: 360px;
          line-height: 1.7;
          font-weight: 300;
        }

        .status-bar {
          display: flex;
          gap: 24px;
          margin-top: 40px;
        }

        .status-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .status-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: #3a4a5a;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .status-value {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #fff;
        }

        .status-value.green { color: #00e676; }
        .status-value.orange { color: #ff6f00; }

        /* RIGHT PANEL — form */
        .login-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          background: #0d1117;
          border-left: 1px solid #161c26;
          position: relative;
        }

        .login-right::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #ff6f00, transparent);
        }

        .form-container {
          width: 100%;
          max-width: 400px;
          opacity: 0;
          transform: translateY(24px);
          transition: all 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .form-container.mounted {
          opacity: 1;
          transform: translateY(0);
        }

        .form-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 48px;
        }

        .logo-icon {
          width: 44px;
          height: 44px;
          background: #ff6f00;
          display: flex;
          align-items: center;
          justify-content: center;
          clip-path: polygon(0 0, 100% 0, 100% 75%, 75% 100%, 0 100%);
        }

        .logo-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 18px;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          line-height: 1.2;
        }

        .logo-sub {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: #3a4a5a;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .form-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 32px;
          font-weight: 700;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          margin-bottom: 6px;
        }

        .form-subtitle {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #3a4a5a;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 40px;
        }

        .field-group {
          margin-bottom: 20px;
        }

        .field-label {
          display: block;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: #ff6f00;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .field-wrap {
          position: relative;
        }

        .field-input {
          width: 100%;
          background: #0a0c0f;
          border: 1px solid #1e2a38;
          border-left: 3px solid #1e2a38;
          color: #c8d8e8;
          font-family: 'Barlow', sans-serif;
          font-size: 14px;
          padding: 14px 44px 14px 16px;
          outline: none;
          transition: all 0.2s;
          font-weight: 400;
          letter-spacing: 0.02em;
        }

        .field-input:focus {
          border-color: #ff6f00;
          border-left-color: #ff6f00;
          background: #0d1117;
          box-shadow: 0 0 0 1px rgba(255,111,0,0.15), inset 0 0 30px rgba(255,111,0,0.03);
        }

        .field-input::placeholder { color: #2a3a4a; }

        .field-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #2a3a4a;
          cursor: pointer;
          transition: color 0.2s;
          display: flex;
          align-items: center;
        }

        .field-icon:hover { color: #ff6f00; }

        .submit-btn {
          width: 100%;
          padding: 16px;
          background: #ff6f00;
          border: none;
          color: #fff;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 16px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          margin-top: 32px;
          transition: all 0.2s;
          clip-path: polygon(0 0, 100% 0, 100% 80%, 96% 100%, 0 100%);
        }

        .submit-btn:hover {
          background: #e65c00;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(255,111,0,0.35);
        }

        .submit-btn:disabled {
          background: #2a3a4a;
          color: #3a4a5a;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .submit-btn .loader {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 32px 0;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: #161c26;
        }

        .divider-text {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          color: #2a3a4a;
          letter-spacing: 0.1em;
        }

        .sys-info {
          display: flex;
          justify-content: space-between;
          margin-top: 32px;
          padding-top: 20px;
          border-top: 1px solid #161c26;
        }

        .sys-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sys-key {
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px;
          color: #2a3a4a;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .sys-val {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #4a6a5a;
        }

        .sys-val.live::before {
          content: '● ';
          color: #00e676;
          font-size: 8px;
        }

        @media (max-width: 768px) {
          .login-left { display: none; }
          .login-right { flex: 1; }
        }
      `}</style>

      <div className="login-root">
        {/* LEFT PANEL */}
        <div className="login-left">
          <div className="grid-lines" />
          <div className="scan-line" />

          {/* SVG server rack art */}
          <svg className="server-art" width="400" height="500" viewBox="0 0 400 500" fill="none">
            {[0,1,2,3,4,5,6,7].map(i => (
              <g key={i} transform={`translate(40, ${60 + i*52})`}>
                <rect width="320" height="40" rx="2" fill="#ffffff" />
                <rect x="4" y="4" width="40" height="32" rx="1" fill="#cccccc" />
                <circle cx="60" cy="20" r="4" fill="#888888" />
                <circle cx="75" cy="20" r="4" fill="#888888" />
                <rect x="90" y="8" width="180" height="4" rx="1" fill="#bbbbbb" />
                <rect x="90" y="16" width="140" height="4" rx="1" fill="#bbbbbb" />
                <rect x="90" y="24" width="160" height="4" rx="1" fill="#bbbbbb" />
                <circle cx="296" cy="14" r="3" fill="#cccccc" />
                <circle cx="296" cy="26" r="3" fill="#cccccc" />
                <circle cx="308" cy="14" r="3" fill="#cccccc" />
                <circle cx="308" cy="26" r="3" fill="#cccccc" />
              </g>
            ))}
            <rect x="40" y="50" width="320" height="450" rx="2" fill="none" stroke="#ffffff" strokeWidth="1" />
          </svg>

          <div className="left-content">
            <div className="left-tag">Système de surveillance</div>
            <h1 className="left-heading">
              Server<br />
              <span>Room</span>
              Guardian
            </h1>
            <p className="left-desc">
              Plateforme industrielle de monitoring, vérification et analyse de risque pour salles serveurs critiques.
            </p>

            <div className="status-bar">
              <div className="status-item">
                <span className="status-label">Statut</span>
                <span className="status-value green">ONLINE</span>
              </div>
              <div className="status-item">
                <span className="status-label">Uptime</span>
                <span className="status-value">99.98%</span>
              </div>
              <div className="status-item">
                <span className="status-label">Alertes</span>
                <span className="status-value orange">02</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="login-right">
          <div className={`form-container ${mounted ? 'mounted' : ''}`}>
            <div className="form-logo">
              <div className="logo-icon">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M11 2L20 7V15L11 20L2 15V7L11 2Z" fill="white" />
                  <path d="M11 6L16 9V13L11 16L6 13V9L11 6Z" fill="#ff6f00" />
                </svg>
              </div>
              <div>
                <div className="logo-text">ServerRoom Guardian</div>
                <div className="logo-sub">Industrial Control System</div>
              </div>
            </div>

            <div className="form-title">Accès Sécurisé</div>
            <div className="form-subtitle">// Authentification requise</div>

            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <label className="field-label">Identifiant opérateur</label>
                <div className="field-wrap">
                  <input
                    className="field-input"
                    type="email"
                    placeholder="operateur@entreprise.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                  <span className="field-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </span>
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Code d'accès</label>
                <div className="field-wrap">
                  <input
                    className="field-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <span className="field-icon" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                      </svg>
                    )}
                  </span>
                </div>
              </div>

              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? (
                  <><span className="loader" />Authentification...</>
                ) : (
                  'Accéder au système'
                )}
              </button>
            </form>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">sys.v1.0.0</span>
              <div className="divider-line" />
            </div>

            <div className="sys-info">
              <div className="sys-item">
                <span className="sys-key">Connexion</span>
                <span className="sys-val live">Sécurisée TLS</span>
              </div>
              <div className="sys-item">
                <span className="sys-key">Protocole</span>
                <span className="sys-val">HTTPS/2</span>
              </div>
              <div className="sys-item">
                <span className="sys-key">Région</span>
                <span className="sys-val">EU-WEST</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}