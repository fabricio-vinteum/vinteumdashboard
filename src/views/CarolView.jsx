import React from 'react';
import { useData } from '../services/dataContext';
import MetricCard from '../components/MetricCard';
import { 
  CalendarCheck, 
  CheckCircle2, 
  TrendingUp, 
  Mail, 
  PhoneCall, 
  MessageSquare, 
  ExternalLink,
  Award,
  Info,
  Clock
} from 'lucide-react';
import { CAROL_SHEET_ID } from '../services/sheetsClient';
import { Bar } from 'react-chartjs-2';

export default function CarolView() {
  const { 
    carolData, 
    carolSelectedPeriod, 
    setCarolSelectedPeriod, 
    carolCurrentMetrics,
    carolPeriodLabel 
  } = useData();

  const isCumulative = carolSelectedPeriod === 'Q3_PLUS';
  const currentMetricsObj = carolCurrentMetrics?.metrics || {};
  const currentConversions = carolCurrentMetrics?.conversions || {};

  const sched = currentMetricsObj['Demo Scheduling'] || { achieved: 0, goal: 0, pct: 0, goalStr: '0', achievedStr: '0' };
  const done = currentMetricsObj['Demo Done'] || { achieved: 0, goal: 0, pct: 0, goalStr: '0', achievedStr: '0' };
  const doneRate = currentConversions['Done/Sched.'] || { achievedPct: 0, achievedStr: '0,0%', goalStr: '50,0%' };
  const touchesRate = currentConversions['Sched./Touches'] || { achievedPct: 0, achievedStr: '0,0%', goalStr: '2,0%' };

  // Taxa de comparecimento (Demos Feitas / Demos Agendadas)
  const comparecimentoTaxa = sched.achieved > 0
    ? Number(((done.achieved / sched.achieved) * 100).toFixed(1))
    : Number(doneRate.achievedPct || 0);

  const formattedComparecimento = comparecimentoTaxa % 1 === 0 
    ? `${comparecimentoTaxa.toFixed(0)}%` 
    : `${comparecimentoTaxa.toFixed(1)}%`;

  const emails = currentMetricsObj['E-mails'] || { achieved: 0, goal: 420, pct: 0, goalStr: '420', achievedStr: '0' };
  const calls = currentMetricsObj['Calls'] || { achieved: 0, goal: 200, pct: 0, goalStr: '200', achievedStr: '0' };
  const sms = currentMetricsObj['SMS'] || { achieved: 0, goal: 200, pct: 0, goalStr: '200', achievedStr: '0' };

  const isBeforeHiring = carolCurrentMetrics?.isBeforeHiring || ['Q1', 'Q2', 'January', 'February', 'March', 'April', 'May', 'June', 'July'].includes(carolSelectedPeriod);

  // Histórico apenas a partir do Q3 (meses de contratação em diante)
  const activeMonthsHistory = (carolData?.monthlyHistory || []).filter(m => !m.isBeforeHiring);

  // Gráfico 1: Agendadas vs Realizadas (Meses Ativos)
  const evolutionChartData = {
    labels: activeMonthsHistory.map(m => m.name),
    datasets: [
      {
        type: 'bar',
        label: 'Demos Agendadas',
        data: activeMonthsHistory.map(m => m.scheduling),
        backgroundColor: 'rgba(56, 189, 248, 0.85)',
        borderRadius: 6,
      },
      {
        type: 'bar',
        label: 'Demos Realizadas',
        data: activeMonthsHistory.map(m => m.done),
        backgroundColor: 'rgba(52, 211, 153, 0.85)',
        borderRadius: 6,
      },
      {
        type: 'line',
        label: 'Meta Agendamentos (16/mês)',
        data: activeMonthsHistory.map(() => 16),
        borderColor: '#f59e0b',
        borderWidth: 2,
        borderDash: [4, 4],
        pointRadius: 3,
        fill: false,
      },
      {
        type: 'line',
        label: 'Meta Demos Realizadas (8/mês)',
        data: activeMonthsHistory.map(() => 8),
        borderColor: '#a855f7',
        borderWidth: 2,
        borderDash: [3, 3],
        pointRadius: 3,
        fill: false,
      }
    ]
  };

  const evolutionChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8',
          font: { family: 'Plus Jakarta Sans', weight: '600', size: 11 },
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
        ticks: { color: '#cbd5e1', font: { family: 'Inter', weight: '600' } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { family: 'Inter' } }
      }
    }
  };

  // Gráfico 2: Taxa de Comparecimento / Conversão (Done/Sched)
  const augRate = carolData?.monthlyData?.August?.conversions?.['Done/Sched.']?.achievedPct ?? 100.0;
  const sepRate = carolData?.monthlyData?.September?.conversions?.['Done/Sched.']?.achievedPct ?? 85.7;
  const octRate = carolData?.monthlyData?.October?.conversions?.['Done/Sched.']?.achievedPct ?? 0.0;
  const q3Rate = carolData?.periods?.Q3?.conversions?.['Done/Sched.']?.achievedPct ?? 88.9;

  const conversionChartData = {
    labels: ['Agosto', 'Setembro', 'Outubro', 'Média Total Q3'],
    datasets: [
      {
        type: 'bar',
        label: 'Taxa Realizada (%)',
        data: [augRate, sepRate, octRate, q3Rate],
        backgroundColor: [
          'rgba(16, 185, 129, 0.9)',
          'rgba(52, 211, 153, 0.85)',
          'rgba(148, 163, 184, 0.3)',
          'rgba(240, 112, 16, 0.9)',
        ],
        borderRadius: 6,
      },
      {
        type: 'line',
        label: 'Meta de Comparecimento (50%)',
        data: [50, 50, 50, 50],
        borderColor: '#ef4444',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 4,
        fill: false,
      }
    ]
  };

  const periodButtons = [
    { id: 'Q3_PLUS', label: '⭐ Acumulado (Desde Q3)' },
    { id: 'Q3', label: 'Total Q3 (Ago-Set)' },
    { id: 'August', label: 'Agosto (Estreia)' },
    { id: 'September', label: 'Setembro' },
    { id: 'Q4', label: 'Total Q4' },
    { id: 'October', label: 'Outubro' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner / Hero Profile */}
      <div className="glass-card" style={{
        padding: '1.5rem 1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.25rem',
        background: 'linear-gradient(135deg, rgba(21, 13, 67, 0.95), rgba(30, 20, 90, 0.7))',
        borderLeft: '4px solid var(--vinteum-orange)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--vinteum-orange), #ff8c33)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(240, 112, 16, 0.45)',
            fontSize: '1.4rem',
            fontWeight: 800,
            color: '#ffffff',
            fontFamily: 'var(--font-display)'
          }}>
            C
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.6rem', color: '#ffffff', fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.02em' }}>
                Carol · SDR Comercial
              </h2>
              <span className="badge badge-orange" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                Entrou em Agosto (Q3)
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                Painel Liberado
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Acompanhamento de metas de agendamentos, demos realizadas e eficiência de prospecção outbound
            </p>
          </div>
        </div>

        {/* Action Link to Spreadsheet */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a
            href={`https://docs.google.com/spreadsheets/d/${CAROL_SHEET_ID}/edit#gid=0`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary"
            title="Abrir planilha de metas da Carol no Google Sheets"
            style={{ padding: '0.6rem 1rem' }}
          >
            <ExternalLink size={15} />
            <span>Planilha Oficial da Carol</span>
          </a>
        </div>
      </div>

      {/* Mandatory Business Rule Notice */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.85rem 1.15rem',
        borderRadius: 'var(--radius-md)',
        background: 'rgba(240, 112, 16, 0.08)',
        border: '1px solid rgba(240, 112, 16, 0.35)',
        color: '#ffedd5',
        fontSize: '0.85rem',
        lineHeight: '1.45'
      }}>
        <Info size={18} color="var(--vinteum-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ color: 'var(--vinteum-orange-light)' }}>Diretriz Comercial Vinteum:</strong> A Carol ingressou na equipe em <strong>Agosto de 2026</strong>. 
          Por regra de negócio, seu cômputo oficial de metas e atingimento é contado <strong>exclusivamente a partir do Q3</strong>, 
          não contabilizando períodos anteriores à sua contratação (Q1 e Q2).
        </div>
      </div>

      {/* Period Filter Buttons */}
      <div className="glass-card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: '0.25rem' }}>
            Filtrar Período:
          </span>
          {periodButtons.map((btn) => {
            const isActive = carolSelectedPeriod === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setCarolSelectedPeriod(btn.id)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: isActive ? '1px solid var(--vinteum-orange)' : '1px solid var(--border-subtle)',
                  background: isActive ? 'linear-gradient(135deg, rgba(240, 112, 16, 0.3), rgba(240, 112, 16, 0.1))' : 'rgba(255, 255, 255, 0.03)',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {btn.label}
              </button>
            );
          })}
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Visualizando: <strong style={{ color: '#ffffff' }}>{carolPeriodLabel}</strong>
        </div>
      </div>

      {/* Warning if a period before hiring was selected */}
      {isBeforeHiring && (
        <div className="glass-card" style={{
          padding: '1.25rem',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <Clock size={24} color="#60a5fa" />
          <div>
            <h4 style={{ color: '#93c5fd', fontSize: '0.95rem', fontWeight: 700, marginBottom: '2px' }}>
              Período Anterior à Admissão da Carol
            </h4>
            <p style={{ color: '#cbd5e1', fontSize: '0.82rem' }}>
              Carol começou na Vinteum em Agosto (Q3). Para avaliar seu desempenho real, utilize os filtros de <strong>Q3 em diante</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid-cols-4">
        {/* Demos Agendadas */}
        <MetricCard
          title="Demos Agendadas"
          value={`${sched.achieved} agend.`}
          goal={isBeforeHiring ? '—' : `${sched.goal}`}
          percentage={isBeforeHiring ? 0 : sched.pct}
          subtitle={
            isCumulative
              ? 'Total acumulado (Agosto a Outubro)'
              : carolSelectedPeriod === 'Q3'
              ? '9 agendadas no Q3 (Agosto e Setembro)'
              : 'Agendamentos no período'
          }
          icon={CalendarCheck}
          accentColor="blue"
        />

        {/* Demos Realizadas */}
        <MetricCard
          title="Demos Realizadas"
          value={`${done.achieved} feitas`}
          goal={isBeforeHiring ? '—' : `${done.goal}`}
          percentage={isBeforeHiring ? 0 : done.pct}
          subtitle={
            isCumulative
              ? 'Total de reuniões concluídas'
              : carolSelectedPeriod === 'Q3'
              ? '8 reuniões realizadas no Q3'
              : 'Conclusão de reuniões no mês'
          }
          icon={CheckCircle2}
          accentColor="emerald"
        />

        {/* Taxa de Comparecimento / Conversão */}
        <MetricCard
          title="Taxa de Comparecimento"
          value={isBeforeHiring ? '—' : formattedComparecimento}
          goal={isBeforeHiring ? '—' : '50%'}
          percentage={comparecimentoTaxa}
          isPositive={isBeforeHiring ? false : comparecimentoTaxa >= 50}
          subtitle={
            isBeforeHiring
              ? 'Não aplicável'
              : comparecimentoTaxa >= 50
              ? '🔥 Superando a meta de 50%!'
              : 'Abaixo da meta de 50%'
          }
          icon={TrendingUp}
          accentColor={comparecimentoTaxa >= 50 ? 'emerald' : 'amber'}
        />

        {/* Eficiência de Conversão */}
        <MetricCard
          title="Eficiência de Conversão"
          value={isBeforeHiring ? '—' : `${done.achieved} / ${sched.achieved}`}
          goal={isBeforeHiring ? '—' : '50% meta'}
          percentage={comparecimentoTaxa}
          isPositive={isBeforeHiring ? false : comparecimentoTaxa >= 50}
          subtitle={
            isBeforeHiring
              ? 'Não aplicável'
              : sched.achieved > 0
              ? `${formattedComparecimento} das reuniões realizadas`
              : 'Sem agendamentos no período'
          }
          icon={Award}
          accentColor="purple"
        />
      </div>

      {/* Row 2: Charts (Evolution on Left + Conversion Show-up on Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.25rem' }}>
        
        {/* Evolution Chart */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#ffffff', fontFamily: 'var(--font-display)' }}>
                Evolução de Agendamentos & Demos (Q3 em Diante)
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Comparativo mensal de agendamentos e reuniões realizadas a partir da contratação
              </p>
            </div>
            <span className="badge badge-emerald">Agosto a Outubro</span>
          </div>

          <div style={{ flex: 1, minHeight: '300px' }}>
            <Bar data={evolutionChartData} options={evolutionChartOptions} />
          </div>
        </div>

        {/* Conversion Show-up Rate Bar Chart */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#ffffff', fontFamily: 'var(--font-display)' }}>
                Taxa de Comparecimento
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Demos Realizadas ÷ Agendadas (Meta: 50%)
              </p>
            </div>
            <span className="badge badge-orange">Done/Sched</span>
          </div>

          <div style={{ flex: 1, minHeight: '300px' }}>
            <Bar data={conversionChartData} options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                  labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', weight: '600' } }
                },
                tooltip: {
                  callbacks: {
                    label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}%`
                  }
                }
              },
              scales: {
                x: { ticks: { color: '#cbd5e1', font: { weight: '600' } }, grid: { display: false } },
                y: { 
                  max: 120,
                  ticks: { 
                    color: '#94a3b8',
                    callback: (v) => `${v}%`
                  },
                  grid: { color: 'rgba(255, 255, 255, 0.05)' }
                }
              }
            }} />
          </div>
        </div>
      </div>

      {/* Row 2.5: Outbound Activities & Touches Reference Cards */}
      <div className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h4 style={{ fontSize: '1rem', color: '#ffffff', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              Volume de Atividades Outbound (Metas de Prospecção)
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Metas de canais de contato e conversão para agendamentos de demos (Sched./Touches)
            </p>
          </div>
          <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
            Benchmark 2% Conversão
          </span>
        </div>

        <div className="grid-cols-4">
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Mail size={20} color="#38bdf8" />
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>E-mails</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                {emails.achievedStr || '0'}
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                Meta: {emails.goalStr || '420'}
              </span>
            </div>
          </div>

          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(168, 85, 247, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <PhoneCall size={20} color="#a855f7" />
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ligações (Calls)</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                {calls.achievedStr || '0'}
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                Meta: {calls.goalStr || '200'}
              </span>
            </div>
          </div>

          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MessageSquare size={20} color="#f59e0b" />
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>SMS</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                {sms.achievedStr || '0'}
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                Meta: {sms.goalStr || '200'}
              </span>
            </div>
          </div>

          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp size={20} color="#10b981" />
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sched. / Touches</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                {touchesRate.achievedStr || '0,0%'}
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                Meta: {touchesRate.goalStr || '2,0%'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Performance Breakdown Table */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', fontFamily: 'var(--font-display)' }}>
              Detalhamento de Metas da Carol por Período
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Visão auditável de todos os trimestres e meses conforme a planilha oficial
            </p>
          </div>
          <span className="badge badge-emerald">Auditoria Oficial</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-card)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Período</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status de Contratação</th>
                <th style={{ padding: '0.75rem 1rem' }}>Meta Agend.</th>
                <th style={{ padding: '0.75rem 1rem' }}>Agendadas</th>
                <th style={{ padding: '0.75rem 1rem' }}>% Agend.</th>
                <th style={{ padding: '0.75rem 1rem' }}>Meta Demos</th>
                <th style={{ padding: '0.75rem 1rem' }}>Demos Feitas</th>
                <th style={{ padding: '0.75rem 1rem' }}>% Demos</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Tx. Comparecimento</th>
              </tr>
            </thead>
            <tbody>
              {/* Linha de Destaque: Acumulado Ativo (Desde Q3) */}
              <tr style={{ 
                background: 'rgba(240, 112, 16, 0.12)', 
                borderBottom: '2px solid rgba(240, 112, 16, 0.4)',
                fontWeight: 700 
              }}>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--vinteum-orange-light)', fontFamily: 'var(--font-display)' }}>
                  🌟 Acumulado Oficial (Q3 em diante)
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span className="badge badge-orange">Ativo (Entrada Ago)</span>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>48</td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--blue-400)', fontWeight: 800 }}>10</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span className="badge badge-blue">21%</span>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>24</td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--emerald-400)', fontWeight: 800 }}>8</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span className="badge badge-emerald">33%</span>
                </td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right', color: 'var(--emerald-400)', fontWeight: 800, fontSize: '0.95rem' }}>
                  80.0% (Meta 50%)
                </td>
              </tr>

              {/* Linha Total Q3 */}
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255, 255, 255, 0.02)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#ffffff' }}>
                  📊 Total Q3 (Julho a Setembro)
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span className="badge badge-emerald">Trimestre de Entrada</span>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>48</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--blue-400)', fontWeight: 700 }}>9</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span className="badge badge-blue">19%</span>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>24</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--emerald-400)', fontWeight: 700 }}>8</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span className="badge badge-emerald">33%</span>
                </td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700, color: 'var(--emerald-400)' }}>
                  88.9%
                </td>
              </tr>

              {/* Agosto */}
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#ffffff', paddingLeft: '2rem' }}>
                  ● Agosto (Mês de Estreia)
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span className="badge badge-orange">1º Mês de Trabalho</span>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>16</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#ffffff' }}>2</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span className="badge badge-amber">13%</span>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>8</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#ffffff' }}>2</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span className="badge badge-amber">25%</span>
                </td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700, color: 'var(--emerald-400)' }}>
                  100.0%
                </td>
              </tr>

              {/* Setembro */}
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#ffffff', paddingLeft: '2rem' }}>
                  ● Setembro
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span className="badge badge-emerald">Em Plena Operação</span>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>16</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#ffffff' }}>7</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span className="badge badge-blue">44%</span>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>8</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--emerald-400)' }}>6</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span className="badge badge-emerald">75%</span>
                </td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 700, color: 'var(--emerald-400)' }}>
                  85.7%
                </td>
              </tr>

              {/* Outubro (Q4) */}
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#ffffff', paddingLeft: '2rem' }}>
                  ● Outubro (Q4)
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span className="badge badge-blue">Mês Vigente</span>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>16</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#ffffff' }}>1</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span className="badge badge-amber">6%</span>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>8</td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#ffffff' }}>0</td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span className="badge badge-amber">0%</span>
                </td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-muted)' }}>
                  0.0%
                </td>
              </tr>

              {/* Q1 e Q2 (Períodos Anteriores) */}
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', opacity: 0.45 }}>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>
                  Q1 & Q2 (Jan a Jun)
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Não contratada</span>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>—</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>0</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>—</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>—</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>0</td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>—</td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: 'var(--text-muted)' }}>
                  Não se aplica
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
