import React from 'react';
import { useData } from '../services/dataContext';
import MetricCard from '../components/MetricCard';
import { 
  UserMinus, 
  DollarSign, 
  Percent, 
  TrendingUp, 
  ShieldAlert, 
  ShieldCheck,
  Scale
} from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent } from '../services/sheetsParser';
import { Bar } from 'react-chartjs-2';

export default function RetentionView() {
  const { currentMetrics, selectedPeriodLabel, dashboardData } = useData();

  const churns = currentMetrics['Churns'] || { achieved: 0, goal: 3, pct: 0 };
  const churnedMrr = currentMetrics['Churned MRR'] || { achieved: 0, goal: 0, pct: 0 };
  const churnRate = currentMetrics['% churn'] || { achieved: 0, goal: 1.30, pct: 0 };
  const netGrowth = currentMetrics['Net growth'] || { achieved: 0, goal: 0, pct: 0 };
  const mrrNetGrowth = currentMetrics['MRR net growth'] || { achieved: 0, goal: 0, pct: 0 };
  const ratio = currentMetrics['Ratio'] || { achieved: 0, goal: 3.0, pct: 0 };

  const history = dashboardData.monthlyHistory || [];
  const chartLabels = history.map(m => m.short);

  const churnChartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Vendas Novas (Contas)',
        data: history.map(m => m.sales),
        backgroundColor: 'rgba(16, 185, 129, 0.85)',
        borderRadius: 6,
      },
      {
        label: 'Cancelamentos (Churn)',
        data: history.map(m => m.churns),
        backgroundColor: 'rgba(244, 63, 94, 0.85)',
        borderRadius: 6,
      }
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', color: '#ffffff' }}>
          Retenção, Churn & Crescimento Líquido · {selectedPeriodLabel}
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Monitoramento do cancelamento de clientes, receita perdida e taxa líquida de expansão
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid-cols-4">
        <MetricCard
          title="Churn de Clientes"
          value={churns.achievedStr || formatNumber(churns.achieved)}
          goal={`Meta/Teto: ${churns.goalStr || 3}`}
          percentage={churns.goal > 0 ? (churns.achieved / churns.goal) * 100 : 0}
          subtitle="Contas Canceladas"
          icon={UserMinus}
          accentColor={churns.achieved > 3 ? 'rose' : 'amber'}
          isInverse={true}
        />
        <MetricCard
          title="MRR Cancelado"
          value={churnedMrr.achievedStr || formatCurrency(churnedMrr.achieved)}
          goal={churnedMrr.goalStr || '—'}
          percentage={churnedMrr.pct}
          subtitle="Receita Mensal Perdida"
          icon={DollarSign}
          accentColor="rose"
          isInverse={true}
        />
        <MetricCard
          title="Taxa de Churn (%)"
          value={churnRate.achievedStr || `${churnRate.achieved}%`}
          goal={`Meta: ${churnRate.goalStr || '1.30%'}`}
          percentage={churnRate.pct}
          subtitle="Percentual da Base"
          icon={Percent}
          accentColor="amber"
          isInverse={true}
        />
        <MetricCard
          title="Ratio Vendas/Churn"
          value={ratio.achievedStr || ratio.achieved}
          goal={`Meta: ${ratio.goalStr || '3.00'}`}
          percentage={ratio.pct}
          subtitle="Multiplicador de Expansão"
          icon={Scale}
          accentColor="indigo"
        />
      </div>

      {/* Comparative Chart: Sales vs Churn */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>Comparativo Mês a Mês: Vendas vs. Churn</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Equilíbrio entre novas adições e cancelamentos
            </p>
          </div>
          <span className="badge badge-indigo">Dinâmica de Base</span>
        </div>
        <div style={{ height: '300px' }}>
          <Bar
            data={churnChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top', labels: { color: '#94a3b8' } }
              },
              scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
