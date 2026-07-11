import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type { CloudResource, AnalysisResult } from '../types/threatTester';

interface DatasetState {
  resources: CloudResource[];
  analysis: AnalysisResult | null;
  datasetName: string | null;
  isAnalyzing: boolean;
}

interface DatasetActions {
  loadDataset: (resources: CloudResource[], name: string) => void;
  clearDataset: () => void;
  setAnalysis: (analysis: AnalysisResult | null) => void;
  setAnalyzing: (val: boolean) => void;
}

type DatasetContextType = DatasetState & DatasetActions;

const DatasetContext = createContext<DatasetContextType | null>(null);

export function DatasetProvider({ children }: { children: ReactNode }) {
  const [resources, setResources] = useState<CloudResource[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [datasetName, setDatasetName] = useState<string | null>(null);
  const [isAnalyzing, setAnalyzing] = useState(false);

  const loadDataset = useCallback((res: CloudResource[], name: string) => {
    setResources(res);
    setDatasetName(name);
    setAnalysis(null);
    setAnalyzing(false);
  }, []);

  const clearDataset = useCallback(() => {
    setResources([]);
    setAnalysis(null);
    setDatasetName(null);
    setAnalyzing(false);
  }, []);

  const value = useMemo(() => ({
    resources, analysis, datasetName, isAnalyzing,
    loadDataset, clearDataset, setAnalysis, setAnalyzing,
  }), [resources, analysis, datasetName, isAnalyzing, loadDataset, clearDataset, setAnalysis, setAnalyzing]);

  return (
    <DatasetContext.Provider value={value}>
      {children}
    </DatasetContext.Provider>
  );
}

export function useDataset(): DatasetContextType {
  const ctx = useContext(DatasetContext);
  if (!ctx) throw new Error('useDataset must be used within a DatasetProvider');
  return ctx;
}
