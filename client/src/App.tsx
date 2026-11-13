import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Dashboard } from './pages/Dashboard';
import { IdeaLab } from './pages/IdeaLab';
import { GateReport } from './pages/GateReport';
import { WhitespaceBoard } from './pages/WhitespaceBoard';
import { Roadmap } from './pages/Roadmap';
import { PaperStudio } from './pages/PaperStudio';
import { PreFlightAudit } from './pages/PreFlightAudit';
import { VenueMatcher } from './pages/VenueMatcher';
import { Login } from './pages/Login';
import { Onboarding } from './pages/Onboarding';
import { ProfileSettings } from './pages/ProfileSettings';
import { LandingPage } from './pages/LandingPage';
import { NotFound } from './pages/NotFound';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes — Require Authentication */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/new"
              element={
                <ProtectedRoute>
                  <IdeaLab />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id/report"
              element={
                <ProtectedRoute>
                  <GateReport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id/whitespace"
              element={
                <ProtectedRoute>
                  <WhitespaceBoard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id/literature"
              element={
                <ProtectedRoute>
                  <WhitespaceBoard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id/roadmap"
              element={
                <ProtectedRoute>
                  <Roadmap />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id/editor"
              element={
                <ProtectedRoute>
                  <PaperStudio />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id/studio"
              element={
                <ProtectedRoute>
                  <PaperStudio />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id/audit"
              element={
                <ProtectedRoute>
                  <PreFlightAudit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id/venues"
              element={
                <ProtectedRoute>
                  <VenueMatcher />
                </ProtectedRoute>
              }
            />

            {/* Structured 404 Route for Unmatched URLs */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
