import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { fetchDashboardCsv, fetchCarolCsv } from './sheetsClient';
import { parseDashboardSheet, MONTH_NAMES_MAP } from './sheetsParser';
import { parseCarolSheet, CAROL_MONTHS_MAP } from './carolParser';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [status, setStatus] = useState('connecting');
  const [syncInterval, setSyncInterval] = useState(60); // 30, 60, 300, 0 (manual)
  
  // Selected period: 'YTD' (Ano Todo), 'Q1', 'Q2', 'Q3', 'Q4', or specific month 'January', 'September', etc.
  const [selectedPeriod, setSelectedPeriod] = useState('YTD');
  
  // Active navigation view: 'overview', 'funnel', 'revenue', 'retention', 'matrix', 'carol', 'laura'
  const [activeView, setActiveView] = useState('overview');

  // Carol's selected period: 'Q3_PLUS' (Acumulado a partir do Q3), 'Q3', 'August', 'September', 'Q4', 'October'
  const [carolSelectedPeriod, setCarolSelectedPeriod] = useState('Q3_PLUS');

  // Parsed dataset from Dashboard tab
  const [dashboardData, setDashboardData] = useState({
    periods: {},
    monthsList: [],
    quartersList: ['Q1', 'Q2', 'Q3', 'Q4'],
    latestActiveMonth: 'September',
    monthlyHistory: [],
    rawMatrix: [],
  });

  // Parsed dataset from Carol's SDR sheet
  const [carolData, setCarolData] = useState({
    periods: {},
    monthlyData: {},
    cumulativeQ3Plus: null,
    monthlyHistory: [],
    rawRows: [],
    hiredInfo: { month: 'August', quarter: 'Q3', year: 2026 },
  });

  const loadData = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const [rawRows, rawCarolRows] = await Promise.all([
        fetchDashboardCsv(),
        fetchCarolCsv(),
      ]);

      const parsedDashboard = parseDashboardSheet(rawRows);
      setDashboardData(parsedDashboard);

      const parsedCarol = parseCarolSheet(rawCarolRows);
      setCarolData(parsedCarol);

      setLastUpdated(new Date());
      setStatus('connected');
    } catch (err) {
      console.error('Erro ao sincronizar planilhas:', err);
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

  // Derived current metrics for the selected period in general dashboard
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

  // Derived current metrics for Carol based on carolSelectedPeriod
  const carolCurrentMetrics = useMemo(() => {
    if (!carolData) return null;
    if (carolSelectedPeriod === 'Q3_PLUS') {
      return carolData.cumulativeQ3Plus;
    }
    if (carolSelectedPeriod.startsWith('Q')) {
      return carolData.periods[carolSelectedPeriod] || null;
    }
    return carolData.monthlyData[carolSelectedPeriod] || null;
  }, [carolData, carolSelectedPeriod]);

  // Label for Carol's selected period
  const carolPeriodLabel = useMemo(() => {
    if (carolSelectedPeriod === 'Q3_PLUS') {
      return 'Acumulado Ativo (Desde Q3 / Agosto)';
    }
    if (carolSelectedPeriod.startsWith('Q')) {
      return `Total ${carolSelectedPeriod}`;
    }
    if (CAROL_MONTHS_MAP[carolSelectedPeriod]) {
      return `${CAROL_MONTHS_MAP[carolSelectedPeriod].pt} (${CAROL_MONTHS_MAP[carolSelectedPeriod].quarter})`;
    }
    return carolSelectedPeriod;
  }, [carolSelectedPeriod]);

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
        carolData,
        carolSelectedPeriod,
        setCarolSelectedPeriod,
        carolCurrentMetrics,
        carolPeriodLabel,
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
