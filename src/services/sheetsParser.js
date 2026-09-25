/**
 * Utilitários de sanitização e conversão para células do Google Sheets
 */
export function cleanNumber(val) {
  if (val === null || val === undefined) return 0;
  let str = String(val).trim();
  if (!str || str === '#N/A' || str === '#REF!' || str === '#DIV/0!' || str === '-') return 0;

  const isNegative = str.startsWith('-') || (str.startsWith('(') && str.endsWith(')'));

  // Remover símbolos de moeda, porcentagem e parênteses
  str = str.replace(/[$R%\s()]/g, '');

  if (str.includes(',') && str.includes('.')) {
    if (str.lastIndexOf(',') > str.lastIndexOf('.')) {
      // Formato brasileiro: 1.234,56
      str = str.replace(/\./g, '').replace(',', '.');
    } else {
      // Formato americano: 1,234.56
      str = str.replace(/,/g, '');
    }
  } else if (str.includes(',')) {
    // Se a vírgula é seguida por 1 ou 2 dígitos (ex: "100,0", "88,9", "50,0", "2,0"), é vírgula decimal
    if (/,\d{1,2}$/.test(str)) {
      str = str.replace(',', '.');
    } else {
      // Caso contrário, é separador de milhar americano: 113,125
      str = str.replace(/,/g, '');
    }
  } else if (str.includes('.')) {
    // Se for formato de milhar brasileiro: 5.040, 2.400, 1.260 (ponto seguido de exatamente 3 dígitos)
    if (/^\d{1,3}\.\d{3}$/.test(str)) {
      str = str.replace(/\./g, '');
    }
  }

  str = str.replace(/[^0-9.-]/g, '');
  const num = parseFloat(str);
  if (isNaN(num)) return 0;
  return isNegative ? -Math.abs(num) : num;
}

export function cleanPercent(val) {
  if (val === null || val === undefined) return 0;
  const str = String(val).trim();
  if (!str || str === '#N/A' || str === '#REF!' || str === '#DIV/0!') return 0;
  return cleanNumber(str);
}

export function formatCurrency(num) {
  if (num === null || num === undefined || isNaN(num)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatPercent(num) {
  if (num === null || num === undefined || isNaN(num)) return '0%';
  return `${Number(num).toFixed(1)}%`;
}

export const MONTH_NAMES_MAP = {
  January: { pt: 'Janeiro', short: 'Jan', quarter: 'Q1' },
  February: { pt: 'Fevereiro', short: 'Fev', quarter: 'Q1' },
  March: { pt: 'Março', short: 'Mar', quarter: 'Q1' },
  April: { pt: 'Abril', short: 'Abr', quarter: 'Q2' },
  May: { pt: 'Maio', short: 'Mai', quarter: 'Q2' },
  June: { pt: 'Junho', short: 'Jun', quarter: 'Q2' },
  July: { pt: 'Julho', short: 'Jul', quarter: 'Q3' },
  August: { pt: 'Agosto', short: 'Ago', quarter: 'Q3' },
  September: { pt: 'Setembro', short: 'Set', quarter: 'Q3' },
  October: { pt: 'Outubro', short: 'Out', quarter: 'Q4' },
  November: { pt: 'Novembro', short: 'Nov', quarter: 'Q4' },
  December: { pt: 'Dezembro', short: 'Dez', quarter: 'Q4' },
};

/**
 * Parser dinâmico completo focado na planilha "Dashboard"
 */
export function parseDashboardSheet(rows) {
  if (!rows || rows.length < 10) {
    return {
      periods: {},
      monthsList: [],
      quartersList: ['Q1', 'Q2', 'Q3', 'Q4'],
      latestActiveMonth: 'January',
      monthlyHistory: [],
      rawMatrix: [],
    };
  }

  // 1. Identificar blocos de trimestres (Q1, Q2, Q3, Q4)
  const qBlocks = [];
  rows.forEach((r, idx) => {
    const first = (r[0] || '').trim();
    if (['Q1', 'Q2', 'Q3', 'Q4'].includes(first)) {
      qBlocks.push({ rowIndex: idx, name: first });
    }
  });

  const periods = {
    YTD: {},
    Q1: {},
    Q2: {},
    Q3: {},
    Q4: {},
  };

  const detectedMonths = [];
  const quartersList = qBlocks.map(q => q.name);

  // 2. Extrair métricas por trimestre e mês
  qBlocks.forEach((block, qIdx) => {
    const qName = block.name;
    const subheaders = rows[block.rowIndex + 1] || [];

    const colMappings = [];

    subheaders.forEach((cell, colIdx) => {
      const val = (cell || '').trim();
      if (!val) return;

      if (val === 'TOTAL' && qName === 'Q1') {
        colMappings.push({ periodKey: 'YTD', gCol: colIdx, aCol: colIdx + 1, pCol: colIdx + 2 });
      } else if (val === `Total ${qName}` || val.startsWith('Total Q')) {
        colMappings.push({ periodKey: qName, gCol: colIdx, aCol: colIdx + 1, pCol: colIdx + 2 });
      } else if (MONTH_NAMES_MAP[val]) {
        colMappings.push({ periodKey: val, gCol: colIdx, aCol: colIdx + 1, pCol: colIdx + 2 });
        if (!detectedMonths.some(m => m.id === val)) {
          detectedMonths.push({
            id: val,
            name: MONTH_NAMES_MAP[val].pt,
            short: MONTH_NAMES_MAP[val].short,
            quarter: qName,
          });
        }
      }
    });

    const nextRow = qIdx + 1 < qBlocks.length ? qBlocks[qIdx + 1].rowIndex : rows.length;

    for (let r = block.rowIndex + 3; r < nextRow; r++) {
      let metricName = (rows[r][0] || '').trim();
      if (!metricName || metricName.startsWith('%vendas') || metricName.startsWith('%churn')) continue;

      // Padronizar nome de Demos
      if (metricName.includes('Demos')) metricName = 'Demos / Opp';

      colMappings.forEach(({ periodKey, gCol, aCol, pCol }) => {
        if (!periods[periodKey]) periods[periodKey] = {};

        const gRaw = rows[r][gCol];
        const aRaw = rows[r][aCol];
        const pRaw = rows[r][pCol];

        const goal = cleanNumber(gRaw);
        const achieved = cleanNumber(aRaw);
        let pct = cleanPercent(pRaw);

        if (!pct && goal > 0 && achieved > 0) {
          pct = Number(((achieved / goal) * 100).toFixed(0));
        }

        periods[periodKey][metricName] = {
          metric: metricName,
          goalStr: (gRaw || '').trim(),
          achievedStr: (aRaw || '').trim(),
          pctStr: (pRaw || '').trim(),
          goal,
          achieved,
          pct,
        };
      });
    }
  });

  // 3. Determinar quais meses possuem dados vigentes e identificar o mês mais recente
  let latestActiveMonth = 'January';
  const monthsList = detectedMonths.map(m => {
    const monthData = periods[m.id] || {};
    const visitorsAchieved = monthData['Visitors']?.achievedStr;
    const mrrAchieved = monthData['MRR']?.achievedStr;
    const hasData = (visitorsAchieved !== undefined && visitorsAchieved !== '' && visitorsAchieved !== '-') ||
                    (mrrAchieved !== undefined && mrrAchieved !== '' && mrrAchieved !== '-');

    if (hasData) {
      latestActiveMonth = m.id;
    }

    return {
      ...m,
      hasData,
    };
  });

  // 4. Histórico Mensal para gráficos de tendência
  const monthlyHistory = monthsList.map(m => {
    const mData = periods[m.id] || {};
    return {
      monthId: m.id,
      name: m.name,
      short: m.short,
      quarter: m.quarter,
      hasData: m.hasData,
      visitors: mData['Visitors']?.achieved || 0,
      visitorsGoal: mData['Visitors']?.goal || 0,
      leads: mData['Leads']?.achieved || 0,
      leadsGoal: mData['Leads']?.goal || 0,
      mql: mData['MQL']?.achieved || 0,
      sql: mData['SQL']?.achieved || 0,
      demos: mData['Demos / Opp']?.achieved || 0,
      sales: mData['Sales']?.achieved || 0,
      salesGoal: mData['Sales']?.goal || 0,
      mrr: mData['MRR']?.achieved || 0,
      mrrGoal: mData['MRR']?.goal || 0,
      churns: mData['Churns']?.achieved || 0,
      churnedMrr: mData['Churned MRR']?.achieved || 0,
      netGrowth: mData['Net growth']?.achieved || 0,
    };
  });

  return {
    periods,
    monthsList,
    quartersList,
    latestActiveMonth,
    monthlyHistory,
    rawMatrix: rows,
  };
}
