import React from 'react';
import { useData } from '../services/dataContext';
import MetricCard from '../components/MetricCard';
import FunnelChart from '../components/FunnelChart';
import ComparisonSection from '../components/ComparisonSection';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  UserMinus, 
  Award,
  Calendar,
  Briefcase,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent } from '../services/sheetsParser';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function OverviewView() {
  const { currentMetrics, selectedPeriodLabel, selectedPeriod, dashboardData } = useData();

  // Metrics from current selected period
  const mrr = currentMetrics['MRR'] || { achieved: 0, goal: 0, pct: 0 };
  const sales = currentMetrics['Sales'] || { achieved: 0, goal: 0, pct: 0 };
  const visitors = currentMetrics['Visitors'] || { achieved: 0, goal: 0, pct: 0 };
  const leads = currentMetrics['Leads'] || { achieved: 0, goal: 0, pct: 0 };
  const mql = currentMetrics['MQL'] || { achieved: 0, goal: 0, pct: 0 };
  const sql = currentMetrics['SQL'] || { achieved: 0, goal: 0, pct: 0 };
  const demos = currentMetrics['Demos / Opp'] || { achieved: 0, goal: 0, pct: 0 };
  const churns = currentMetrics['Churns'] || { achieved: 0, goal: 3, pct: 0 };
  const churnedMrr = currentMetrics['Churned MRR'] || { achieved: 0, goal: 0, pct: 0 };
  const churnRate = currentMetrics['% churn'] || { achieved: 0, goal: 1.30, pct: 0 };
  const netGrowth = currentMetrics['Net growth'] || { achieved: 0, goal: 0, pct: 0 };
  const mrrNetGrowth = currentMetrics['MRR net growth'] || { achieved: 0, goal: 0, pct: 0 };
  const hubspot = currentMetrics['Deals last day - HubSpot'] || { achieved: 0, goal: 0, pct: 0 };
  const ratio = currentMetrics['Ratio'] || { achieved: 0, goal: 3.0, pct: 0 };
  const laura = currentMetrics["Laura's Sales"] || { achieved: 0, goal: 0, pct: 0 };
  const katie = currentMetrics["Katie's Sales"] || { achieved: 0, goal: 0, pct: 0 };

  // Funnel data
  const funnel = {
    visitors,
    leads,
    mql,
    sql,
    demos,
    sales,
  };

  // Evolution chart across all 12 months
  const monthlyHistory = dashboardData.monthlyHistory || [];
  const chartLabels = monthlyHistory.map(m => m.short);
  const mrrAchievedSeries = monthlyHistory.map(m => m.mrr);
  const mrrGoalSeries = monthlyHistory.map(m => m.mrrGoal);

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        type: 'bar',
        label: 'MRR Realizado ($)',
        data: mrrAchievedSeries,
        backgroundColor: monthlyHistory.map(m => m.monthId === selectedPeriod ? '#34d399' : 'rgba(16, 185, 129, 0.75)'),
        borderRadius: 6,
      },
      {
        type: 'line',
        label: 'Meta de MRR ($)',
        data: mrrGoalSeries,
        borderColor: '#6366f1',
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: '#6366f1',
        pointRadius: 4,
        fill: false,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8',
          font: { family: 'Plus Jakarta Sans', weight: '600' },
          boxWidth: 12,
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { family: 'Inter' } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { 
          color: '#94a3b8', 
          font: { family: 'Inter' },
          callback: (value) => `$${value}`
        }
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Title & Period Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: '#ffffff' }}>
            Cockpit Executivo · {selectedPeriodLabel}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Visão consolidada de todas as métricas operacionais e comerciais da planilha
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="badge badge-emerald" style={{ fontSize: '0.78rem' }}>
            Ratio Vendas/Churn: <strong>{ratio.achieved || '1.05'}</strong>
          </span>
          <span className="badge badge-indigo" style={{ fontSize: '0.78rem' }}>
            HubSpot Deals: <strong>{hubspot.achieved || '139'}</strong>
          </span>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid-cols-4">
        <MetricCard
          title="Novo MRR"
          value={mrr.achievedStr || formatCurrency(mrr.achieved)}
          goal={mrr.goalStr || formatCurrency(mrr.goal)}
          percentage={mrr.pct}
          subtitle="Receita Recorrente Atingida"
          icon={DollarSign}
          accentColor="emerald"
        />
        <MetricCard
          title="Vendas (Contratos)"
          value={sales.achievedStr || formatNumber(sales.achieved)}
          goal={`${sales.goalStr || formatNumber(sales.goal)} contas`}
          percentage={sales.pct}
          subtitle="Novos Clientes Fechados"
          icon={ShoppingBag}
          accentColor="blue"
        />
        <MetricCard
          title="Churn de Clientes"
          value={churns.achievedStr || formatNumber(churns.achieved)}
          goal={`Meta/Teto: ${churns.goalStr || churns.goal || 3}`}
          percentage={churns.goal > 0 ? (churns.achieved / churns.goal) * 100 : 0}
          subtitle={`MRR Cancelado: ${churnedMrr.achievedStr || formatCurrency(churnedMrr.achieved)}`}
          icon={UserMinus}
          accentColor={churns.achieved > 3 ? 'rose' : 'amber'}
          isInverse={true}
        />
        <MetricCard
          title="Crescimento Líquido"
          value={`${netGrowth.achieved > 0 ? '+' : ''}${netGrowth.achievedStr || netGrowth.achieved}`}
          goal={`Meta: ${netGrowth.goalStr || netGrowth.goal}`}
          percentage={netGrowth.pct}
          subtitle={`MRR Líquido: ${mrrNetGrowth.achievedStr || formatCurrency(mrrNetGrowth.achieved)}`}
          icon={TrendingUp}
          accentColor="indigo"
        />
      </div>

      {/* Row 2: Funnel on Left + 12-Month MRR Evolution on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem' }}>
        <FunnelChart funnelData={funnel} />

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>Evolução de MRR (Mês a Mês)</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Meta vs. Realizado em todos os meses da planilha
              </p>
            </div>
            <span className="badge badge-emerald">Meta Global $13.3k</span>
          </div>

          <div style={{ flex: 1, minHeight: '300px' }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Row 3: Comparativo Dinâmico (Mês a Mês / QxQ) */}
      <ComparisonSection />
    </div>
  );
}
