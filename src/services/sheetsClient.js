import Papa from 'papaparse';
import fallbackSnapshot from './snapshotData.json';

export const SHEET_ID = '1xdeFF-5oC3lUiWByzB5bk4zbdLBJphhoJXwUK_Ae9xk';

// Foco exclusivo na planilha "Dashboard"
export const DASHBOARD_GID = '2067051393';

/**
 * Busca a aba "Dashboard" em tempo real.
 * 
 * Estratégia de Alta Disponibilidade (Resiliente a CORS):
 * 1. JSONP via Google Visualization API (<script> tag - 100% livre de bloqueio de CORS no GitHub Pages)
 * 2. Fetch CSV Direto
 * 3. Fetch GViz CSV
 * 4. Cache do LocalStorage
 * 5. Snapshot embutido offline (garante que NUNCA fique em branco)
 */
export async function fetchDashboardCsv() {
  const timestamp = Date.now();

  // 1. Tentar via JSONP (Perfeito para GitHub Pages sem bloqueio de CORS)
  try {
    const jsonpData = await fetchViaJsonp(timestamp);
    if (jsonpData && jsonpData.length > 0) {
      saveToCache(jsonpData);
      return jsonpData;
    }
  } catch (jsonpErr) {
    console.warn('JSONP fetch falhou, tentando fetch CSV direto:', jsonpErr);
  }

  // 2. Tentar fetch direto (funciona em localhost ou com proxy)
  const primaryUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${DASHBOARD_GID}&_t=${timestamp}`;
  try {
    const res = await fetch(primaryUrl);
    if (res.ok) {
      const text = await res.text();
      const data = parseCsvText(text);
      if (data && data.length > 0) {
        saveToCache(data);
        return data;
      }
    }
  } catch (err) {
    console.warn('Fetch direto falhou:', err);
  }

  // 3. Tentar fallback do LocalStorage
  const cached = localStorage.getItem('vinteum_dashboard_cache');
  if (cached) {
    try {
      console.info('Utilizando dados em cache local.');
      return JSON.parse(cached);
    } catch (e) {}
  }

  // 4. Último fallback: Snapshot estático embutido
  console.info('Utilizando snapshot estático da planilha.');
  return fallbackSnapshot;
}

/**
 * Executa requisição JSONP via tag <script> dinâmica para contornar qualquer restrição de CORS
 */
function fetchViaJsonp(timestamp) {
  return new Promise((resolve, reject) => {
    const callbackName = `__vinteum_gviz_cb_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=responseHandler:${callbackName}&gid=${DASHBOARD_GID}&_t=${timestamp}`;

    const script = document.createElement('script');
    script.src = url;
    script.async = true;

    const timeoutTimer = setTimeout(() => {
      cleanup();
      reject(new Error('JSONP request timed out (7s)'));
    }, 7000);

    function cleanup() {
      clearTimeout(timeoutTimer);
      delete window[callbackName];
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    }

    window[callbackName] = function (response) {
      cleanup();
      try {
        if (!response || !response.table) {
          reject(new Error('Resposta inválida do Google Visualization API'));
          return;
        }

        const table = response.table;
        // Linha de cabeçalho
        const headerRow = table.cols.map(c => (c && c.label !== undefined ? c.label : ''));
        
        // Linhas de dados
        const dataRows = table.rows.map(r => {
          if (!r || !r.c) return [];
          return r.c.map(cell => {
            if (!cell) return '';
            if (cell.f !== undefined && cell.f !== null) return cell.f;
            if (cell.v !== undefined && cell.v !== null) return String(cell.v);
            return '';
          });
        });

        const fullMatrix = [headerRow, ...dataRows];
        resolve(fullMatrix);
      } catch (err) {
        reject(err);
      }
    };

    script.onerror = function (e) {
      cleanup();
      reject(new Error('Erro ao carregar script JSONP do Google Sheets'));
    };

    document.head.appendChild(script);
  });
}

function saveToCache(data) {
  try {
    localStorage.setItem('vinteum_dashboard_cache', JSON.stringify(data));
  } catch (e) {
    // Ignorar erro de cota de armazenamento se cheio
  }
}

function parseCsvText(csvText) {
  const parsed = Papa.parse(csvText, {
    skipEmptyLines: false,
    header: false,
  });
  return parsed.data;
}
