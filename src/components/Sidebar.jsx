import React from 'react';
import { useData } from '../services/dataContext';
import { 
  LayoutDashboard, 
  Filter, 
  TrendingUp, 
  ShieldAlert, 
  Table, 
  Radio
} from 'lucide-react';

export default function Sidebar() {
  const { activeView, setActiveView, selectedPeriodLabel } = useData();

  const navItems = [
    { id: 'overview', label: 'Cockpit Executivo', icon: LayoutDashboard, badge: 'Principal' },
    { id: 'funnel', label: 'Funil Comercial', icon: Filter, badge: '6 Etapas' },
    { id: 'revenue', label: 'Receita & MRR', icon: TrendingUp, badge: 'Vendas' },
    { id: 'retention', label: 'Retenção & Churn', icon: ShieldAlert, badge: 'Net Growth' },
    { id: 'matrix', label: 'Matriz da Planilha', icon: Table, badge: 'Auditoria' },
  ];

  return (
    <aside style={{
      width: '265px',
      background: 'rgba(15, 10, 48, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.5rem 1rem',
      flexShrink: 0
    }}>
      {/* Top Section */}
      <div>
        {/* Brand Header with Vinteum Logo */}
        <div style={{ padding: '0 0.5rem 1.5rem 0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img 
              src={`${import.meta.env.BASE_URL}vinteum-logo.svg`}
              alt="Vinteum Logo" 
              style={{ width: '38px', height: '38px', objectFit: 'contain' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div>
              <span style={{ 
                fontFamily: 'var(--font-display)', 
                fontWeight: 900, 
                fontSize: '1.25rem', 
                color: '#ffffff',
                letterSpacing: '0.06em' 
              }}>
                VINTE<span style={{ color: 'var(--vinteum-orange)' }}>UM</span>
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', letterSpacing: '0.04em' }}>
                NEIGBRS INTELLIGENCE
              </span>
            </div>
          </div>
        </div>

        {/* Selected Period Badge Card in Sidebar */}
        <div style={{
          padding: '0.65rem 0.85rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(240, 112, 16, 0.10)',
          border: '1px solid rgba(240, 112, 16, 0.3)',
          marginBottom: '1.25rem'
        }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Período Visualizado
          </span>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--vinteum-orange-light)', marginTop: '2px', fontFamily: 'var(--font-display)' }}>
            {selectedPeriodLabel}
          </div>
        </div>

        {/* Navigation items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '0.75rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: isActive ? '1px solid rgba(240, 112, 16, 0.45)' : '1px solid transparent',
                  background: isActive ? 'linear-gradient(90deg, rgba(240, 112, 16, 0.22), rgba(240, 112, 16, 0.05))' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={18} color={isActive ? 'var(--vinteum-orange)' : 'var(--text-muted)'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    fontSize: '0.68rem',
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-pill)',
                    background: isActive ? 'rgba(240, 112, 16, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                    color: isActive ? '#ffffff' : 'var(--text-muted)',
                    fontWeight: 700
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Section: Metas Individuais de SDRs */}
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ 
            padding: '0 0.5rem 0.5rem 0.5rem', 
            fontSize: '0.7rem', 
            fontWeight: 700, 
            color: 'var(--text-muted)', 
            letterSpacing: '0.06em', 
            textTransform: 'uppercase' 
          }}>
            Metas de SDRs (Outbound)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {/* Carol Button (Liberada) */}
            <button
              onClick={() => setActiveView('carol')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '0.75rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: activeView === 'carol' ? '1px solid rgba(240, 112, 16, 0.5)' : '1px solid rgba(255, 255, 255, 0.05)',
                background: activeView === 'carol' 
                  ? 'linear-gradient(90deg, rgba(240, 112, 16, 0.25), rgba(240, 112, 16, 0.08))' 
                  : 'rgba(255, 255, 255, 0.02)',
                color: activeView === 'carol' ? '#ffffff' : 'var(--text-secondary)',
                fontFamily: 'var(--font-display)',
                fontWeight: activeView === 'carol' ? 700 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--vinteum-orange), #ff8c33)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#ffffff'
                }}>
                  C
                </div>
                <span>Carol</span>
              </div>
              <span style={{
                fontSize: '0.65rem',
                padding: '0.15rem 0.45rem',
                borderRadius: 'var(--radius-pill)',
                background: 'rgba(16, 185, 129, 0.2)',
                color: 'var(--emerald-400)',
                fontWeight: 700,
                border: '1px solid rgba(16, 185, 129, 0.4)'
              }}>
                Q3+ Liberado
              </span>
            </button>

            {/* Laura Button (Aguardando Planilha) */}
            <button
              onClick={() => setActiveView('laura')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '0.75rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: activeView === 'laura' ? '1px solid rgba(148, 163, 184, 0.4)' : '1px solid transparent',
                background: activeView === 'laura' ? 'rgba(255, 255, 255, 0.06)' : 'transparent',
                color: activeView === 'laura' ? '#ffffff' : 'var(--text-muted)',
                fontFamily: 'var(--font-display)',
                fontWeight: activeView === 'laura' ? 700 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                textAlign: 'left',
                opacity: 0.85
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)'
                }}>
                  L
                </div>
                <span>Laura</span>
              </div>
              <span style={{
                fontSize: '0.65rem',
                padding: '0.15rem 0.45rem',
                borderRadius: 'var(--radius-pill)',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#fbbf24',
                fontWeight: 600,
                border: '1px solid rgba(245, 158, 11, 0.3)'
              }}>
                Aguardando
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Health & System Widget */}
      <div className="glass-card-sm" style={{ padding: '0.85rem', marginTop: '1.5rem', background: 'rgba(21, 13, 67, 0.8)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
          <Radio size={14} color="var(--vinteum-orange)" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-display)' }}>
            Google Sheets Feed
          </span>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          Conectado em tempo real com a planilha oficial Vinteum.
        </p>
      </div>
    </aside>
  );
}
