import { cleanNumber, cleanPercent, formatNumber, formatPercent } from './sheetsParser.js';

export const CAROL_MONTHS_MAP = {
  January: { pt: 'Janeiro', short: 'Jan', quarter: 'Q1', isBeforeHiring: true },
  February: { pt: 'Fevereiro', short: 'Fev', quarter: 'Q1', isBeforeHiring: true },
  March: { pt: 'Março', short: 'Mar', quarter: 'Q1', isBeforeHiring: true },
  April: { pt: 'Abril', short: 'Abr', quarter: 'Q2', isBeforeHiring: true },
  May: { pt: 'Maio', short: 'Mai', quarter: 'Q2', isBeforeHiring: true },
  June: { pt: 'Junho', short: 'Jun', quarter: 'Q2', isBeforeHiring: true },
  July: { pt: 'Julho', short: 'Jul', quarter: 'Q3', isBeforeHiring: true },
  August: { pt: 'Agosto', short: 'Ago', quarter: 'Q3', isBeforeHiring: false, isStartMonth: true },
  September: { pt: 'Setembro', short: 'Set', quarter: 'Q3', isBeforeHiring: false },
  October: { pt: 'Outubro', short: 'Out', quarter: 'Q4', isBeforeHiring: false },
  November: { pt: 'Novembro', short: 'Nov', quarter: 'Q4', isBeforeHiring: false },
  December: { pt: 'Dezembro', short: 'Dez', quarter: 'Q4', isBeforeHiring: false },
};

/**
 * Parser para a planilha individual da SDR Carol
 * Regra de negócio mandatória: Carol ingressou em Agosto de 2026.
 * Portanto, o cômputo de metas e atividades é considerado exclusivamente a partir do Q3.
 */
export function parseCarolSheet(rows) {
  if (!rows || rows.length < 15) {
    return createEmptyCarolData();
  }

  // 1. Mapear índices de linhas onde cada trimestre se inicia
  const quarterRowIndices = {};
  rows.forEach((r, idx) => {
    const firstCell = (r[0] || '').trim();
    if (['Q1', 'Q2', 'Q3', 'Q4'].includes(firstCell)) {
      quarterRowIndices[firstCell] = idx;
    }
  });

  const quarterMonths = {
    Q1: ['January', 'February', 'March'],
    Q2: ['April', 'May', 'June'],
    Q3: ['July', 'August', 'September'],
    Q4: ['October', 'November', 'December'],
  };

  const periods = {
    Q1: createEmptyPeriodMetrics('Q1', true),
    Q2: createEmptyPeriodMetrics('Q2', true),
    Q3: createEmptyPeriodMetrics('Q3', false),
    Q4: createEmptyPeriodMetrics('Q4', false),
  };

  const monthlyData = {};
  Object.keys(CAROL_MONTHS_MAP).forEach((m) => {
    monthlyData[m] = createEmptyPeriodMetrics(m, CAROL_MONTHS_MAP[m].isBeforeHiring);
  });

  // 2. Extrair dados por trimestre
  ['Q1', 'Q2', 'Q3', 'Q4'].forEach((qKey) => {
    const qRowIdx = quarterRowIndices[qKey];
    if (qRowIdx === undefined) return;

    const mNames = quarterMonths[qKey];
    const colTargets = {
      quarter: { key: qKey, gCol: 5, aCol: 6, pCol: 7 },
      m1: { key: mNames[0], gCol: 8, aCol: 9, pCol: 10 },
      m2: { key: mNames[1], gCol: 11, aCol: 12, pCol: 13 },
      m3: { key: mNames[2], gCol: 14, aCol: 15, pCol: 16 },
    };

    const nextQuarterIdx = getNextQuarterIndex(quarterRowIndices, qKey, rows.length);

    for (let r = qRowIdx; r < nextQuarterIdx; r++) {
      const row = rows[r] || [];
      const rowLabel = (row[0] || '').trim();

      // Métricas operacionais
      if (['E-mails', 'Calls', 'SMS', 'Demo Scheduling', 'Demo Done'].includes(rowLabel)) {
        Object.values(colTargets).forEach(({ key, gCol, aCol, pCol }) => {
          const target = key.startsWith('Q') ? periods[key] : monthlyData[key];
          if (!target) return;

          const gRaw = row[gCol] || '';
          const aRaw = row[aCol] || '';
          const pRaw = row[pCol] || '';

          const goal = cleanNumber(gRaw);
          const achieved = cleanNumber(aRaw);
          let pct = cleanPercent(pRaw);

          if (!pct && goal > 0 && achieved > 0) {
            pct = Number(((achieved / goal) * 100).toFixed(0));
          }

          target.metrics[rowLabel] = {
            goal,
            achieved,
            pct,
            goalStr: gRaw.trim(),
            achievedStr: aRaw.trim(),
            pctStr: pRaw.trim(),
          };
        });
      }

      // Conversão na lateral (col 18+)
      if (row.length > 18) {
        const crLabel = (row[18] || '').trim();
        if (crLabel === 'Sched./Touches' || crLabel === 'Done/Sched.') {
          const goalCr = (row[19] || '').trim();
          const qCr = (row[20] || '').trim();
          const m1Cr = (row[21] || '').trim();
          const m2Cr = (row[22] || '').trim();
          const m3Cr = (row[23] || '').trim();

          if (periods[qKey]) {
            periods[qKey].conversions[crLabel] = {
              goalStr: goalCr,
              achievedStr: qCr,
              achievedPct: cleanPercent(qCr),
            };
          }

          if (monthlyData[mNames[0]]) {
            monthlyData[mNames[0]].conversions[crLabel] = {
              goalStr: goalCr,
              achievedStr: m1Cr,
              achievedPct: cleanPercent(m1Cr),
            };
          }
          if (monthlyData[mNames[1]]) {
            monthlyData[mNames[1]].conversions[crLabel] = {
              goalStr: goalCr,
              achievedStr: m2Cr,
              achievedPct: cleanPercent(m2Cr),
            };
          }
          if (monthlyData[mNames[2]]) {
            monthlyData[mNames[2]].conversions[crLabel] = {
              goalStr: goalCr,
              achievedStr: m3Cr,
              achievedPct: cleanPercent(m3Cr),
            };
          }
        }
      }
    }
  });

  // 3. Regra de Negócio Crítica: Cômputo a partir do Q3
  // Carol entrou em Agosto (Q3). Ignoramos Q1 e Q2 no acumulado oficial da Carol.
  const q3Scheduling = periods.Q3.metrics['Demo Scheduling']?.achieved || 0;
  const q4Scheduling = periods.Q4.metrics['Demo Scheduling']?.achieved || 0;
  const totalSchedulingQ3Plus = q3Scheduling + q4Scheduling; // 9 + 1 = 10

  const q3Done = periods.Q3.metrics['Demo Done']?.achieved || 0;
  const q4Done = periods.Q4.metrics['Demo Done']?.achieved || 0;
  const totalDoneQ3Plus = q3Done + q4Done; // 8 + 0 = 8

  // Taxa de comparecimento acumulada a partir do Q3
  const overallDoneToSchedRate = totalSchedulingQ3Plus > 0
    ? Number(((totalDoneQ3Plus / totalSchedulingQ3Plus) * 100).toFixed(1))
    : 0; // 80.0%

  // Meses com atividades ativas da Carol (Agosto, Setembro, Outubro)
  const activeMonthsList = ['August', 'September', 'October'];
  let activeSchedulingGoal = 0;
  let activeDoneGoal = 0;

  activeMonthsList.forEach((mKey) => {
    activeSchedulingGoal += monthlyData[mKey]?.metrics['Demo Scheduling']?.goal || 16;
    activeDoneGoal += monthlyData[mKey]?.metrics['Demo Done']?.goal || 8;
  });

  const cumulativeQ3Plus = {
    periodKey: 'Q3_PLUS',
    label: 'Acumulado Ativo (Desde Q3 / Agosto)',
    hiredNote: 'Carol ingressou na Vinteum em Agosto (Q3). Contagem oficial a partir do Q3.',
    metrics: {
      'Demo Scheduling': {
        goal: activeSchedulingGoal, // 48 (16 * 3)
        achieved: totalSchedulingQ3Plus, // 10
        pct: activeSchedulingGoal > 0 ? Number(((totalSchedulingQ3Plus / activeSchedulingGoal) * 100).toFixed(0)) : 0,
        goalStr: String(activeSchedulingGoal),
        achievedStr: String(totalSchedulingQ3Plus),
      },
      'Demo Done': {
        goal: activeDoneGoal, // 24 (8 * 3)
        achieved: totalDoneQ3Plus, // 8
        pct: activeDoneGoal > 0 ? Number(((totalDoneQ3Plus / activeDoneGoal) * 100).toFixed(0)) : 0,
        goalStr: String(activeDoneGoal),
        achievedStr: String(totalDoneQ3Plus),
      },
      'E-mails': {
        goal: 420 * activeMonthsList.length,
        achieved: 0,
        pct: 0,
        goalStr: String(420 * activeMonthsList.length),
        achievedStr: '0',
      },
      'Calls': {
        goal: 200 * activeMonthsList.length,
        achieved: 0,
        pct: 0,
        goalStr: String(200 * activeMonthsList.length),
        achievedStr: '0',
      },
      'SMS': {
        goal: 200 * activeMonthsList.length,
        achieved: 0,
        pct: 0,
        goalStr: String(200 * activeMonthsList.length),
        achievedStr: '0',
      },
    },
    conversions: {
      'Done/Sched.': {
        goalStr: '50,0%',
        achievedStr: `${overallDoneToSchedRate}%`,
        achievedPct: overallDoneToSchedRate,
      },
      'Sched./Touches': {
        goalStr: '2,0%',
        achievedStr: '0,0%',
        achievedPct: 0,
      },
    },
  };

  // 4. Histórico Mensal para gráficos
  const monthlyHistory = Object.keys(CAROL_MONTHS_MAP).map((mKey) => {
    const meta = CAROL_MONTHS_MAP[mKey];
    const data = monthlyData[mKey] || createEmptyPeriodMetrics(mKey, meta.isBeforeHiring);
    const sched = data.metrics['Demo Scheduling'] || { goal: 16, achieved: 0, pct: 0 };
    const done = data.metrics['Demo Done'] || { goal: 8, achieved: 0, pct: 0 };
    const doneRate = data.conversions['Done/Sched.']?.achievedPct || 0;

    return {
      id: mKey,
      name: meta.pt,
      short: meta.short,
      quarter: meta.quarter,
      isBeforeHiring: meta.isBeforeHiring,
      isStartMonth: meta.isStartMonth || false,
      hasActivity: sched.achieved > 0 || done.achieved > 0,
      scheduling: sched.achieved,
      schedulingGoal: sched.goal || 16,
      schedulingPct: sched.pct,
      done: done.achieved,
      doneGoal: done.goal || 8,
      donePct: done.pct,
      doneRate,
    };
  });

  return {
    periods,
    monthlyData,
    cumulativeQ3Plus,
    monthlyHistory,
    rawRows: rows,
    hiredInfo: {
      month: 'August',
      quarter: 'Q3',
      year: 2026,
      message: 'Carol ingressou na empresa em Agosto de 2026 (Q3). Contagem autorizada a partir do Q3.',
    },
  };
}

function createEmptyPeriodMetrics(id, isBeforeHiring = false) {
  return {
    id,
    isBeforeHiring,
    metrics: {
      'E-mails': { goal: 0, achieved: 0, pct: 0, goalStr: '0', achievedStr: '0', pctStr: '0%' },
      'Calls': { goal: 0, achieved: 0, pct: 0, goalStr: '0', achievedStr: '0', pctStr: '0%' },
      'SMS': { goal: 0, achieved: 0, pct: 0, goalStr: '0', achievedStr: '0', pctStr: '0%' },
      'Demo Scheduling': { goal: 0, achieved: 0, pct: 0, goalStr: '0', achievedStr: '0', pctStr: '0%' },
      'Demo Done': { goal: 0, achieved: 0, pct: 0, goalStr: '0', achievedStr: '0', pctStr: '0%' },
    },
    conversions: {
      'Sched./Touches': { goalStr: '2,0%', achievedStr: '0,0%', achievedPct: 0 },
      'Done/Sched.': { goalStr: '50,0%', achievedStr: '0,0%', achievedPct: 0 },
    },
  };
}

function createEmptyCarolData() {
  return {
    periods: {},
    monthlyData: {},
    cumulativeQ3Plus: createEmptyPeriodMetrics('Q3_PLUS', false),
    monthlyHistory: [],
    rawRows: [],
    hiredInfo: {
      month: 'August',
      quarter: 'Q3',
      year: 2026,
      message: 'Sem dados da Carol carregados.',
    },
  };
}

function getNextQuarterIndex(quarterIndices, currentQ, totalLength) {
  const order = ['Q1', 'Q2', 'Q3', 'Q4'];
  const curIdx = order.indexOf(currentQ);
  if (curIdx < 0 || curIdx === order.length - 1) return totalLength;
  for (let i = curIdx + 1; i < order.length; i++) {
    const nextQ = order[i];
    if (quarterIndices[nextQ] !== undefined) {
      return quarterIndices[nextQ];
    }
  }
  return totalLength;
}
