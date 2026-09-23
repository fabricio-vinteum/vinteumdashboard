import React, { useState, useMemo } from 'react';
import { useData } from '../services/dataContext';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  Layers, 
  Calendar, 
  TrendingUp, 
  Scale, 
  DollarSign, 
  Users, 
  UserMinus,
  Sparkles
} from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent } from '../services/sheetsParser';
import { Bar } from 'react-chartjs-2';

export default function ComparisonSection() {
  const { dashboardData } = useData();
  const { periods, monthsList, quartersList, latestActiveMonth } = dashboardData;

  // Mode: 'QoQ' (Trimestre a Trimestre) or 'MoM' (Mês a Mês)
  const [compMode, setCompMode] = useState('QoQ');

  // For MoM mode: Select Month A and Month B
  // Default: Month B = latestActiveMonth, Month A = previous active month
  const activeMonths = useMemo(() => monthsList.filter(m => m.hasData), [monthsList]);

  const [monthA, setMonthA] = useState(() => {
    return activeMonths.length > 1 ? activeMonths[activeMonths.length - 2].id : 'August';
  });
  const [monthB, setMonthB] = useState(() => {
    return activeMonths.length > 0 ? activeMonths[activeMonths.length - 1].id : 'September';
  });

  // Core metrics to compare
  const metricKeys = [
    { key: 'MRR', label: 'Novo MRR', isCurrency: true, isInverse: false },
    { key: 'Sales', label: 'Vendas (Contas)', isCurrency: false, isInverse: false },
    { key: 'Visitors', label: 'Visitantes', isCurrency: false, isInverse: false },
    { key: 'Leads', label: 'Leads', isCurrency: false, isInverse: false },
    { key: 'MQL', label: 'MQL', isCurrency: false, isInverse: false },
    { key: 'SQL', label: 'SQL', isCurrency: false, isInverse: false },
    { key: 'Demos / Opp', label: 'Demos / Opp', isCurrency: false, isInverse: false },
    { key: 'Churns', label: 'Churn de Clientes', isCurrency: false, isInverse: true },
    { key: 'Churned MRR', label: 'MRR Cancelado', isCurrency: true, isInverse: true },
    { key: 'Net growth', label: 'Crescimento Líquido', isCurrency: false, isInverse: false },
  ];

  // Helper to compute delta and percentage
  const calculateDelta = (valA, valB, isInverse = false) => {
    const diff = valB - valA;
    const pct = valA !== 0 ? (diff / Math.abs(valA)) * 100 : (valB > 0 ? 100 : 0);
    const isPositive = isInverse ? diff <= 0 : diff >= 0;
    return { diff, pct, isPositive };
  };

  // ==========================================
  // QoQ Comparison Data (Q1 vs Q2 vs Q3 vs Q4)
  // ==========================================
  const qData = useMemo(() => {
    return ['Q1', 'Q2', 'Q3', 'Q4'].map(q => {
      const qMetrics = periods[q] || {};
      return {
        quarter: q,
        mrr: qMetrics['MRR']?.achieved || 0,
        sales: qMetrics['Sales']?.achieved || 0,
        visitors: qMetrics['Visitors']?.achieved || 0,
        leads: qMetrics['Leads']?.achieved || 0,
        mql: qMetrics['MQL']?.achieved || 0,
        sql: qMetrics['SQL']?.achieved || 0,
        demos: qMetrics['Demos / Opp']?.achieved || 0,
        churns: qMetrics['Churns']?.achieved || 0,
        churnedMrr: qMetrics['Churned MRR']?.achieved || 0,
        netGrowth: qMetrics['Net growth']?.achieved || 0,
      };
    });
  }, [periods]);

  // QoQ Chart Data for MRR & Sales
  const qoqChartData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'MRR Realizado ($)',
        data: qData.map(q => q.mrr),
        backgroundColor: 'rgba(16, 185, 129, 0.85)',
        borderRadius: 6,
        yAxisID: 'y',
      },
      {
        label: 'Vendas Fechadas (Contas)',
        data: qData.map(q => q.sales),
        backgroundColor: 'rgba(59, 130, 246, 0.85)',
        borderRadius: 6,
        yAxisID: 'y1',
      }
    ]
  };

  const qoqChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', weight: '600' } } },
      tooltip: { backgroundColor: '#0f172a' }
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { 
        position: 'left',
        ticks: { color: '#10b981', callback: (v) => `$${v}` },
        grid: { color: 'rgba(255,255,255,0.05)' }
      },
      y1: {
        position: 'right',
        ticks: { color: '#3b82f6', precision: 0 },
        grid: { drawOnChartArea: false }
      }
    }
  };

  // ==========================================
  // MoM Comparison (Month A vs Month B)
  // ==========================================
  const dataA = periods[monthA] || {};
  const dataB = periods[monthB] || {};

  const nameA = monthsList.find(m => m.id === monthA)?.name || monthA;
  const nameB = monthsList.find(m => m.id === monthB)?.name || monthB;

  return (
    <div className="glass-card" style={{ padding: '1.75rem' }}>
      {/* Header and Mode Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--indigo-500), var(--blue-500))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
          }}>
            <Scale size={20} color="#ffffff" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>
              Painel Comparativo de Desempenho
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Análise de variação percentual (Δ) e evolução entre períodos
            </p>
          </div>
        </div>

        {/* Toggle QoQ vs MoM */}
        <div style={{
          display: 'flex',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '0.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setCompMode('QoQ')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '6px',
              border: 'none',
              background: compMode === 'QoQ' ? 'var(--indigo-500)' : 'transparent',
              color: compMode === 'QoQ' ? '#ffffff' : 'var(--text-secondary)',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            📊 Trimestre a Trimestre (QxQ)
          </button>
          <button
            onClick={() => setCompMode('MoM')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '6px',
              border: 'none',
              background: compMode === 'MoM' ? 'var(--indigo-500)' : 'transparent',
              color: compMode === 'MoM' ? '#ffffff' : 'var(--text-secondary)',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            📅 Mês a Mês (MoM)
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODE 1: TRIMESTRE A TRIMESTRE (QxQ)                       */}
      {/* ========================================================= */}
      {compMode === 'QoQ' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Chart & Quick Insights */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1.25rem' }}>
            <div className="glass-card-sm" style={{ padding: '1.25rem', height: '280px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.5rem' }}>
                MRR ($) e Vendas (Contas) por Trimestre
              </div>
              <div style={{ height: '220px' }}>
                <Bar data={qoqChartData} options={qoqChartOptions} />
              </div>
            </div>

            {/* QoQ Highlight Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Q2 vs Q1 */}
              <div className="glass-card-sm" style={{ padding: '1rem', borderLeft: '3px solid var(--emerald-400)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>Evolução Q2 vs. Q1</span>
                  <span className="badge badge-emerald">+4.6% MRR</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  MRR saltou de <strong>$634.37</strong> (Q1) para <strong>$663.61</strong> (Q2). Cancelamentos caíram de 8 para 4 contas (-50% churn).
                </div>
              </div>

              {/* Q3 vs Q2 */}
              <div className="glass-card-sm" style={{ padding: '1rem', borderLeft: '3px solid var(--indigo-400)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>Evolução Q3 vs. Q2</span>
                  <span className="badge badge-blue">Zero Churns</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  MRR atingiu <strong>$510.33</strong> em Q3. Retenção exemplar com <strong>0 cancelamentos de contas</strong> registrados no período.
                </div>
              </div>

              {/* Projeção Q4 */}
              <div className="glass-card-sm" style={{ padding: '1rem', borderLeft: '3px solid var(--amber-400)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff' }}>Meta Estabelecida Q4</span>
                  <span className="badge badge-amber">Meta $3,500</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Meta agressiva de encerramento de ano com 35 vendas e $3.500 em MRR projetado na planilha.
                </div>
              </div>
            </div>
          </div>

          {/* QoQ Detailed Matrix Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-card)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Métrica Analisada</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Total Q1</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Total Q2</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Var. Q2 vs Q1</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Total Q3</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Var. Q3 vs Q2</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Meta Q4</th>
                </tr>
              </thead>
              <tbody>
                {metricKeys.map((m, idx) => {
                  const valQ1 = qData[0][m.key === 'Demos / Opp' ? 'demos' : m.key.toLowerCase()] ?? 0;
                  const valQ2 = qData[1][m.key === 'Demos / Opp' ? 'demos' : m.key.toLowerCase()] ?? 0;
                  const valQ3 = qData[2][m.key === 'Demos / Opp' ? 'demos' : m.key.toLowerCase()] ?? 0;

                  const delta21 = calculateDelta(valQ1, valQ2, m.isInverse);
                  const delta32 = calculateDelta(valQ2, valQ3, m.isInverse);

                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#ffffff' }}>
                        {m.label}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>
                        {m.isCurrency ? formatCurrency(valQ1) : formatNumber(valQ1)}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>
                        {m.isCurrency ? formatCurrency(valQ2) : formatNumber(valQ2)}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span className={`badge ${delta21.isPositive ? 'badge-emerald' : 'badge-rose'}`} style={{ fontSize: '0.72rem' }}>
                          {delta21.diff >= 0 ? '+' : ''}{delta21.pct.toFixed(0)}%
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>
                        {m.isCurrency ? formatCurrency(valQ3) : formatNumber(valQ3)}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span className={`badge ${delta32.isPositive ? 'badge-emerald' : 'badge-rose'}`} style={{ fontSize: '0.72rem' }}>
                          {delta32.diff >= 0 ? '+' : ''}{delta32.pct.toFixed(0)}%
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: 'var(--text-muted)' }}>
                        {periods['Q4']?.[m.key]?.goalStr || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 2: MÊS A MÊS (MoM)                                   */}
      {/* ========================================================= */}
      {compMode === 'MoM' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Month Selectors */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Mês Base (A):</span>
              <select
                value={monthA}
                onChange={(e) => setMonthA(e.target.value)}
                style={{
                  background: '#0f172a',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  padding: '0.4rem 0.75rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {monthsList.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.quarter})
                  </option>
                ))}
              </select>
            </div>

            <span style={{ color: 'var(--indigo-400)', fontWeight: 800 }}>VS</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Mês Comparado (B):</span>
              <select
                value={monthB}
                onChange={(e) => setMonthB(e.target.value)}
                style={{
                  background: '#0f172a',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  color: '#ffffff',
                  padding: '0.4rem 0.75rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {monthsList.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.quarter})
                  </option>
                ))}
              </select>
            </div>

            <span className="badge badge-indigo" style={{ marginLeft: 'auto' }}>
              Comparativo Direto
            </span>
          </div>

          {/* MoM Comparison Cards Grid */}
          <div className="grid-cols-4">
            {metricKeys.slice(0, 4).map((m, i) => {
              const valA = dataA[m.key]?.achieved || 0;
              const valB = dataB[m.key]?.achieved || 0;
              const delta = calculateDelta(valA, valB, m.isInverse);

              return (
                <div key={i} className="glass-card-sm" style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    {m.label}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                      {m.isCurrency ? formatCurrency(valB) : formatNumber(valB)}
                    </div>
                    <span className={`badge ${delta.isPositive ? 'badge-emerald' : 'badge-rose'}`}>
                      {delta.isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                      {delta.diff >= 0 ? '+' : ''}{delta.pct.toFixed(0)}%
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {nameA}: {m.isCurrency ? formatCurrency(valA) : formatNumber(valA)} (Δ: {m.isCurrency ? formatCurrency(delta.diff) : delta.diff})
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed MoM Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-card)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Indicador</th>
                  <th style={{ padding: '0.75rem 1rem' }}>{nameA} (Base)</th>
                  <th style={{ padding: '0.75rem 1rem' }}>{nameB} (Comparado)</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Variação Nominal (Δ)</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Variação Percentual (%)</th>
                </tr>
              </thead>
              <tbody>
                {metricKeys.map((m, idx) => {
                  const valA = dataA[m.key]?.achieved || 0;
                  const valB = dataB[m.key]?.achieved || 0;
                  const delta = calculateDelta(valA, valB, m.isInverse);

                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#ffffff' }}>
                        {m.label}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>
                        {dataA[m.key]?.achievedStr || (m.isCurrency ? formatCurrency(valA) : formatNumber(valA))}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#ffffff' }}>
                        {dataB[m.key]?.achievedStr || (m.isCurrency ? formatCurrency(valB) : formatNumber(valB))}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: delta.isPositive ? 'var(--emerald-400)' : 'var(--rose-400)' }}>
                        {delta.diff >= 0 ? '+' : ''}{m.isCurrency ? formatCurrency(delta.diff) : delta.diff}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        <span className={`badge ${delta.isPositive ? 'badge-emerald' : 'badge-rose'}`}>
                          {delta.diff >= 0 ? '+' : ''}{delta.pct.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
