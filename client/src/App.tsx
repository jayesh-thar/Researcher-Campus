import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/profile" element={<ProfileSettings />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/project/new" element={<IdeaLab />} />
        <Route path="/project/:id/report" element={<GateReport />} />
        <Route path="/project/:id/literature" element={<WhitespaceBoard />} />
        <Route path="/project/:id/roadmap" element={<Roadmap />} />
        <Route path="/project/:id/editor" element={<PaperStudio />} />
        <Route path="/project/:id/audit" element={<PreFlightAudit />} />
        <Route path="/project/:id/venues" element={<VenueMatcher />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
