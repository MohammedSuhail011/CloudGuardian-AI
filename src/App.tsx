import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DatasetProvider } from './store/DatasetContext';

const Dashboard = React.lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const AWS = React.lazy(() => import('./pages/AWS').then(m => ({ default: m.AWS })));
const Azure = React.lazy(() => import('./pages/Azure').then(m => ({ default: m.Azure })));
const GCP = React.lazy(() => import('./pages/GCP').then(m => ({ default: m.GCP })));
const AIAnalysis = React.lazy(() => import('./pages/AIAnalysis').then(m => ({ default: m.AIAnalysis })));
const Reports = React.lazy(() => import('./pages/Reports').then(m => ({ default: m.Reports })));
const Settings = React.lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const ThreatTester = React.lazy(() => import('./pages/ThreatTester').then(m => ({ default: m.ThreatTester })));

function App() {
  return (
    <BrowserRouter>
      <DatasetProvider>
        <Suspense fallback={<div className="flex items-center justify-center h-screen bg-cyber-darker"><div className="text-neon-cyan font-mono text-sm animate-pulse">Loading CLOUDCORE X...</div></div>}>
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
        </Suspense>
      </DatasetProvider>
    </BrowserRouter>
  );
}

export default App;
