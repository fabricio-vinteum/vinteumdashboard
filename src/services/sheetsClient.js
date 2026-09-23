import Papa from 'papaparse';

export const SHEET_ID = '1xdeFF-5oC3lUiWByzB5bk4zbdLBJphhoJXwUK_Ae9xk';

// Foco exclusivo na planilha "Dashboard"
export const DASHBOARD_GID = '2067051393';

/**
 * Busca a aba "Dashboard" em formato CSV com cache-busting dinâmico
 */
export async function fetchDashboardCsv() {
  const timestamp = Date.now();
  const primaryUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${DASHBOARD_GID}&_t=${timestamp}`;
  const gvizUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${DASHBOARD_GID}&_t=${timestamp}`;

  try {
    const res = await fetch(primaryUrl);
    if (!res.ok) throw new Error(`Primary fetch failed: ${res.status}`);
    const text = await res.text();
    const data = parseCsvText(text);
    try {
      localStorage.setItem('vinteum_dashboard_cache', JSON.stringify(data));
    } catch (e) {
      // Quota safety
    }
    return data;
  } catch (err) {
    console.warn(`Tentando fallback GViz para o Dashboard:`, err);
    try {
      const res = await fetch(gvizUrl);
      if (!res.ok) throw new Error(`GViz fetch failed: ${res.status}`);
      const text = await res.text();
      const data = parseCsvText(text);
      try {
        localStorage.setItem('vinteum_dashboard_cache', JSON.stringify(data));
      } catch (e) {}
      return data;
    } catch (gvizErr) {
      console.error(`Falha ao buscar planilha Dashboard:`, gvizErr);
      const cached = localStorage.getItem('vinteum_dashboard_cache');
      if (cached) {
        console.info(`Carregando cache salvo localmente para a planilha Dashboard.`);
        return JSON.parse(cached);
      }
      throw gvizErr;
    }
  }
}

function parseCsvText(csvText) {
  const parsed = Papa.parse(csvText, {
    skipEmptyLines: false,
    header: false,
  });
  return parsed.data;
}
