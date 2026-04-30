import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from './pages/ThemeContext';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import RoomsPage from './pages/RoomsPage';
import ChecklistsPage from './pages/ChecklistsPage';
import HistoryPage from './pages/HistoryPage';
import RoomVerificationHistoryPage from './pages/RoomVerificationHistoryPage';
import RoomRiskAnalysisPage from './pages/RoomRiskAnalysisPage';
import SettingsPage from './pages/SettingsPage';
import ActiveVerificationPage from './pages/ActiveVerificationPage';

export default function App() {
  return (
    <ThemeProvider>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="rooms" element={<RoomsPage />} />
              <Route path="checklists" element={<ChecklistsPage />} />
              <Route path="verification/:verificationId" element={<ActiveVerificationPage />} />
              <Route path="history-salles" element={<RoomVerificationHistoryPage />} />
              <Route path="analyse-salles" element={<RoomRiskAnalysisPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}