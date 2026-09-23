import React from 'react';
import { useData } from '../services/dataContext';
import FunnelChart from '../components/FunnelChart';
import MetricCard from '../components/MetricCard';
import { 
  Users, 
  UserPlus, 
  Filter, 
  CheckSquare, 
  Presentation, 
  Trophy,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { formatNumber } from '../services/sheetsParser';

export default function FunnelView() {
  const { currentMetrics, selectedPeriodLabel, dashboardData } = useData();

  const visitors = currentMetrics['Visitors'] || { achieved: 0, goal: 0, pct: 0 };
  const leads = currentMetrics['Leads'] || { achieved: 0, goal: 0, pct: 0 };
  const mql = currentMetrics['MQL'] || { achieved: 0, goal: 0, pct: 0 };
  const sql = currentMetrics['SQL'] || { achieved: 0, goal: 0, pct: 0 };
  const demos = currentMetrics['Demos / Opp'] || { achieved: 0, goal: 0, pct: 0 };
  const sales = currentMetrics['Sales'] || { achieved: 0, goal: 0, pct: 0 };

  const funnel = { visitors, leads, mql, sql, demos, sales };

  const history = dashboardData.monthlyHistory || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', color: '#ffffff' }}>
          Funil Comercial & Eficiência de Passagem · {selectedPeriodLabel}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Análise de conversão passo a passo da atração de tráfego até o fechamento de contas
        </p>
      </div>

      {/* Funnel Big Card */}
      <FunnelChart funnelData={funnel} />

      {/* Funnel Monthly Matrix Table */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>Histórico do Funil Mês a Mês</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Acompanhamento de volume em cada etapa ao longo de 2026
            </p>
          </div>
          <span className="badge badge-blue">Dados da Planilha</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-card)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Mês</th>
                <th style={{ padding: '0.75rem 1rem' }}>Visitantes</th>
                <th style={{ padding: '0.75rem 1rem' }}>Leads</th>
                <th style={{ padding: '0.75rem 1rem' }}>MQL</th>
                <th style={{ padding: '0.75rem 1rem' }}>SQL</th>
                <th style={{ padding: '0.75rem 1rem' }}>Demos / Opp</th>
                <th style={{ padding: '0.75rem 1rem' }}>Vendas</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Tx. Geral (Vis ➔ Venda)</th>
              </tr>
            </thead>
            <tbody>
              {history.map((m, idx) => {
                const visToSale = m.visitors > 0 && m.sales > 0 ? ((m.sales / m.visitors) * 100).toFixed(2) + '%' : '—';
                return (
                  <tr key={idx} style={{ 
                    borderBottom: '1px solid var(--border-subtle)',
                    opacity: m.hasData ? 1 : 0.45 
                  }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#ffffff' }}>
                      {m.name} ({m.quarter})
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#93c5fd' }}>{formatNumber(m.visitors)}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#67e8f9' }}>{formatNumber(m.leads)}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#a5b4fc' }}>{formatNumber(m.mql)}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#c084fc' }}>{formatNumber(m.sql)}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#fde047' }}>{formatNumber(m.demos)}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--emerald-400)' }}>{formatNumber(m.sales)}</td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600, color: '#ffffff' }}>
                      {visToSale}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
