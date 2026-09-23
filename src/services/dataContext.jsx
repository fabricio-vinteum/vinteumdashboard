import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { fetchDashboardCsv } from './sheetsClient';
import { parseDashboardSheet, MONTH_NAMES_MAP } from './sheetsParser';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [status, setStatus] = useState('connecting');
  const [syncInterval, setSyncInterval] = useState(60); // 30, 60, 300, 0 (manual)
  
  // Selected period: 'YTD' (Ano Todo), 'Q1', 'Q2', 'Q3', 'Q4', or specific month 'January', 'September', etc.
  const [selectedPeriod, setSelectedPeriod] = useState('YTD');
  
  // Active navigation view: 'overview', 'funnel', 'revenue', 'retention', 'matrix'
  const [activeView, setActiveView] = useState('overview');

  // Parsed dataset from Dashboard tab
  const [dashboardData, setDashboardData] = useState({
    periods: {},
    monthsList: [],
    quartersList: ['Q1', 'Q2', 'Q3', 'Q4'],
    latestActiveMonth: 'September',
    monthlyHistory: [],
    rawMatrix: [],
  });

  const loadData = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const rawRows = await fetchDashboardCsv();
      const parsed = parseDashboardSheet(rawRows);
      setDashboardData(parsed);
      setLastUpdated(new Date());
      setStatus('connected');
    } catch (err) {
      console.error('Erro ao sincronizar planilha Dashboard:', err);
      setStatus('error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-refresh timer
  useEffect(() => {
    if (!syncInterval || syncInterval <= 0) return;
    const timer = setInterval(() => {
      loadData();
    }, syncInterval * 1000);
    return () => clearInterval(timer);
  }, [syncInterval, loadData]);

  // Derived current metrics for the selected period
  const currentMetrics = useMemo(() => {
    return dashboardData.periods[selectedPeriod] || dashboardData.periods['YTD'] || {};
  }, [dashboardData, selectedPeriod]);

  // Human-readable label for selected period
  const selectedPeriodLabel = useMemo(() => {
    if (selectedPeriod === 'YTD') {
      const latestMonthName = MONTH_NAMES_MAP[dashboardData.latestActiveMonth]?.pt || dashboardData.latestActiveMonth;
      return `Ano Todo (Até ${latestMonthName})`;
    }
    if (selectedPeriod.startsWith('Q')) {
      return `Total ${selectedPeriod}`;
    }
    if (MONTH_NAMES_MAP[selectedPeriod]) {
      return `${MONTH_NAMES_MAP[selectedPeriod].pt} (${MONTH_NAMES_MAP[selectedPeriod].quarter})`;
    }
    return selectedPeriod;
  }, [selectedPeriod, dashboardData.latestActiveMonth]);

  return (
    <DataContext.Provider
      value={{
        loading,
        refreshing,
        lastUpdated,
        status,
        syncInterval,
        setSyncInterval,
        selectedPeriod,
        setSelectedPeriod,
        selectedPeriodLabel,
        activeView,
        setActiveView,
        dashboardData,
        currentMetrics,
        refreshNow: () => loadData(true),
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData deve ser utilizado dentro de um DataProvider');
  }
  return context;
}
