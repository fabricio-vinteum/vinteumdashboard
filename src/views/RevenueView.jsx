import React from 'react';
import { useData } from '../services/dataContext';
import MetricCard from '../components/MetricCard';
import { 
  DollarSign, 
  Award, 
  TrendingUp, 
  Briefcase, 
  ShoppingBag,
  Zap
} from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent } from '../services/sheetsParser';
import { Bar } from 'react-chartjs-2';

export default function RevenueView() {
  const { currentMetrics, selectedPeriodLabel, dashboardData } = useData();

  const mrr = currentMetrics['MRR'] || { achieved: 0, goal: 0, pct: 0 };
  const sales = currentMetrics['Sales'] || { achieved: 0, goal: 0, pct: 0 };
  const laura = currentMetrics["Laura's Sales"] || { achieved: 0, goal: 0, pct: 0 };
  const katie = currentMetrics["Katie's Sales"] || { achieved: 0, goal: 0, pct: 0 };
  const mrrNetGrowth = currentMetrics['MRR net growth'] || { achieved: 0, goal: 0, pct: 0 };
  const hubspot = currentMetrics['Deals last day - HubSpot'] || { achieved: 0, goal: 0, pct: 0 };

  const history = dashboardData.monthlyHistory || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', color: '#ffffff' }}>
          Receita, MRR & Desempenho Comercial · {selectedPeriodLabel}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Acompanhamento de metas de faturamento, consultoras e deals fechados
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid-cols-4">
        <MetricCard
          title="Novo MRR"
          value={mrr.achievedStr || formatCurrency(mrr.achieved)}
          goal={mrr.goalStr || formatCurrency(mrr.goal)}
          percentage={mrr.pct}
          subtitle="Receita Recorrente"
          icon={DollarSign}
          accentColor="emerald"
        />
        <MetricCard
          title="Laura (MRR)"
          value={laura.achievedStr || '$0.00'}
          goal={laura.goalStr || '—'}
          percentage={laura.pct}
          subtitle="Consultora Comercial"
          icon={Award}
          accentColor="purple"
        />
        <MetricCard
          title="Katie (MRR)"
          value={katie.achievedStr || '$0.00'}
          goal={katie.goalStr || '—'}
          percentage={katie.pct}
          subtitle="Consultora Comercial"
          icon={Award}
          accentColor="blue"
        />
        <MetricCard
          title="Deals HubSpot"
          value={`${hubspot.achievedStr || hubspot.achieved} deals`}
          goal={`Meta: ${hubspot.goalStr || hubspot.goal}`}
          percentage={hubspot.pct}
          subtitle="Fechamentos Último Dia"
          icon={Briefcase}
          accentColor="amber"
        />
      </div>

      {/* Monthly Breakdown Table */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>Tabela de Receita Mês a Mês</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Meta vs Realizado de MRR e Contratos
            </p>
          </div>
          <span className="badge badge-emerald">Dados Oficiais</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-card)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Mês</th>
                <th style={{ padding: '0.75rem 1rem' }}>Meta de MRR</th>
                <th style={{ padding: '0.75rem 1rem' }}>MRR Realizado</th>
                <th style={{ padding: '0.75rem 1rem' }}>% Atingido</th>
                <th style={{ padding: '0.75rem 1rem' }}>Meta Vendas</th>
                <th style={{ padding: '0.75rem 1rem' }}>Vendas Realizadas</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>MRR Líquido</th>
              </tr>
            </thead>
            <tbody>
              {history.map((m, idx) => {
                const pct = m.mrrGoal > 0 ? ((m.mrr / m.mrrGoal) * 100).toFixed(0) : 0;
                let badge = 'badge-emerald';
                if (pct < 30) badge = 'badge-rose';
                else if (pct < 70) badge = 'badge-amber';

                return (
                  <tr key={idx} style={{ 
                    borderBottom: '1px solid var(--border-subtle)',
                    opacity: m.hasData ? 1 : 0.45 
                  }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#ffffff' }}>
                      {m.name} ({m.quarter})
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{formatCurrency(m.mrrGoal)}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#ffffff' }}>{formatCurrency(m.mrr)}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span className={`badge ${badge}`}>{pct}%</span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{m.salesGoal} contas</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--blue-400)' }}>{m.sales} contas</td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700, color: 'var(--emerald-400)' }}>
                      {formatCurrency(m.mrr - m.churnedMrr)}
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
