import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { AWS } from './pages/AWS';
import { Azure } from './pages/Azure';
import { GCP } from './pages/GCP';
import { AIAnalysis } from './pages/AIAnalysis';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { ThreatTester } from './pages/ThreatTester';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="aws" element={<AWS />} />
          <Route path="azure" element={<Azure />} />
          <Route path="gcp" element={<GCP />} />
          <Route path="analysis" element={<AIAnalysis />} />
          <Route path="threat-tester" element={<ThreatTester />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
