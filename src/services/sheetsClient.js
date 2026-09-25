import Papa from 'papaparse';
import fallbackSnapshot from './snapshotData.json';
import fallbackCarolSnapshot from './carolSnapshotData.json';

export const SHEET_ID = '1xdeFF-5oC3lUiWByzB5bk4zbdLBJphhoJXwUK_Ae9xk';

// Foco exclusivo na planilha "Dashboard"
export const DASHBOARD_GID = '2067051393';

// Planilha individual da SDR Carol
export const CAROL_SHEET_ID = '1KRcG5_TA-SKzUITWqDBMyQWrJXGS0zVWgKswuBAs00M';
export const CAROL_GID = '0';

const CACHE_KEY = 'vinteum_dashboard_cache_v2';
const CAROL_CACHE_KEY = 'vinteum_carol_cache_v1';

/**
 * Busca a aba "Dashboard" em tempo real.
 * 
 * 1. Tenta fetch direto da URL oficial CSV do Google Sheets com cache-busting.
 * 2. Se houver falha de rede/offline, verifica o cache local válido (mínimo 75 linhas).
 * 3. Se não houver cache, utiliza o snapshot estático de 80 linhas embutido no bundle.
 */
export async function fetchDashboardCsv() {
  const timestamp = Date.now();
  const primaryUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${DASHBOARD_GID}&_t=${timestamp}`;

  // 1. Tentar fetch direto da planilha oficial
  try {
    const res = await fetch(primaryUrl);
    if (res.ok) {
      const text = await res.text();
      const data = parseCsvText(text);
      if (Array.isArray(data) && data.length >= 75) {
        saveToCache(CACHE_KEY, data);
        return data;
      }
    }
  } catch (err) {
    console.warn('Fetch direto da planilha falhou ou foi bloqueado, buscando cache/snapshot:', err);
  }

  // 2. Tentar fallback do LocalStorage
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsedCache = JSON.parse(cached);
      if (Array.isArray(parsedCache) && parsedCache.length >= 75) {
        console.info('Utilizando dados em cache local.');
        return parsedCache;
      }
    }
  } catch (e) {
    console.warn('Erro ao ler cache local:', e);
  }

  // 3. Fallback garantido: Snapshot de 80 linhas embutido
  console.info('Utilizando snapshot estático da planilha com 80 linhas.');
  return fallbackSnapshot;
}

/**
 * Busca a planilha de metas da Carol em tempo real.
 * 
 * 1. Tenta fetch direto da URL oficial CSV do Google Sheets.
 * 2. Se houver falha de rede/offline, verifica o cache local.
 * 3. Se não houver cache, utiliza o snapshot estático embutido.
 */
export async function fetchCarolCsv() {
  const timestamp = Date.now();
  const primaryUrl = `https://docs.google.com/spreadsheets/d/${CAROL_SHEET_ID}/export?format=csv&gid=${CAROL_GID}&_t=${timestamp}`;

  try {
    const res = await fetch(primaryUrl);
    if (res.ok) {
      const text = await res.text();
      const data = parseCsvText(text);
      if (Array.isArray(data) && data.length >= 20) {
        saveToCache(CAROL_CACHE_KEY, data);
        return data;
      }
    }
  } catch (err) {
    console.warn('Fetch da planilha da Carol falhou, buscando cache/snapshot:', err);
  }

  try {
    const cached = localStorage.getItem(CAROL_CACHE_KEY);
    if (cached) {
      const parsedCache = JSON.parse(cached);
      if (Array.isArray(parsedCache) && parsedCache.length >= 20) {
        return parsedCache;
      }
    }
  } catch (e) {
    console.warn('Erro ao ler cache local da Carol:', e);
  }

  console.info('Utilizando snapshot estático da planilha da Carol.');
  return fallbackCarolSnapshot;
}

function saveToCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    // Ignorar erro se cota exceder
  }
}

function parseCsvText(csvText) {
  const parsed = Papa.parse(csvText, {
    skipEmptyLines: false,
    header: false,
  });
  return parsed.data;
}
