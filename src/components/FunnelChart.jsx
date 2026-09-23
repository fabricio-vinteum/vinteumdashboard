import React from 'react';
import { ArrowDown, Users, UserPlus, Filter, CheckSquare, Presentation, Trophy } from 'lucide-react';
import { formatNumber } from '../services/sheetsParser';

export default function FunnelChart({ funnelData }) {
  // Steps definitions
  const steps = [
    { key: 'visitors', label: 'Visitantes', icon: Users, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' },
    { key: 'leads', label: 'Leads', icon: UserPlus, color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)' },
    { key: 'mql', label: 'MQL (Qualificados Mkt)', icon: Filter, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)' },
    { key: 'sql', label: 'SQL (Qualificados Vendas)', icon: CheckSquare, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)' },
    { key: 'demos', label: 'Demonstrações / Opp', icon: Presentation, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
    { key: 'sales', label: 'Vendas Fechadas', icon: Trophy, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  ];

  const maxVal = Math.max(...steps.map(s => funnelData[s.key]?.achieved || 1), 1);

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>Funil de Conversão Comercial</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Fluxo completo de aquisição do visitante ao cliente fechado com taxas de passagem
          </p>
        </div>
        <span className="badge badge-blue">Pipeline Ativo</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {steps.map((step, idx) => {
          const item = funnelData[step.key] || { achieved: 0, goal: 0, pct: 0 };
          const achieved = item.achieved || 0;
          const goal = item.goal || 0;
          const nextStep = steps[idx + 1];
          const nextVal = nextStep ? (funnelData[nextStep.key]?.achieved || 0) : null;
          
          // Step conversion rate to next
          const stepConversion = achieved > 0 && nextVal !== null ? ((nextVal / achieved) * 100).toFixed(1) : null;
          const widthPercent = Math.max((achieved / maxVal) * 100, 12);

          const StepIcon = step.icon;

          return (
            <div key={step.key}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.35rem',
                fontSize: '0.82rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    padding: '0.3rem',
                    borderRadius: '6px',
                    background: step.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <StepIcon size={14} color={step.color} />
                  </div>
                  <span style={{ fontWeight: 600, color: '#ffffff' }}>{step.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>
                    Meta: {formatNumber(goal)}
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>
                    {formatNumber(achieved)}
                  </span>
                  <span className={`badge ${item.pct >= 100 ? 'badge-emerald' : 'badge-amber'}`} style={{ minWidth: '45px', justifyContent: 'center' }}>
                    {item.pct ? `${item.pct}%` : '0%'}
                  </span>
                </div>
              </div>

              {/* Funnel Bar Container */}
              <div style={{
                width: '100%',
                height: '24px',
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '6px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                padding: '0 8px'
              }}>
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${widthPercent}%`,
                  background: `linear-gradient(90deg, ${step.color}88, ${step.color})`,
                  borderRadius: '6px',
                  transition: 'width 0.8s ease'
                }} />
                <span style={{ position: 'relative', zIndex: 1, fontSize: '0.72rem', fontWeight: 600, color: '#ffffff' }}>
                  {formatNumber(achieved)} {step.label.toLowerCase()}
                </span>
              </div>

              {/* Conversion indicator between steps */}
              {stepConversion !== null && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.2rem 1.5rem',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)'
                }}>
                  <ArrowDown size={12} color="var(--indigo-400)" />
                  <span>Taxa de Passagem: <strong style={{ color: 'var(--indigo-400)' }}>{stepConversion}%</strong></span>
                  <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
                  <span>Perda: {(100 - parseFloat(stepConversion)).toFixed(1)}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
