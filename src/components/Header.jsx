import React, { useState, useEffect } from 'react';
import { useData } from '../services/dataContext';
import { 
  RefreshCw, 
  ExternalLink, 
  Clock, 
  CalendarDays,
  LogOut
} from 'lucide-react';
import { SHEET_ID, DASHBOARD_GID, CAROL_SHEET_ID } from '../services/sheetsClient';
import { getAuthenticatedUser } from '../services/authService';

export default function Header({ onLogout }) {
  const { 
    lastUpdated, 
    refreshing, 
    refreshNow, 
    syncInterval, 
    setSyncInterval,
    selectedPeriod,
    setSelectedPeriod,
    activeView,
    dashboardData,
    carolSelectedPeriod,
    setCarolSelectedPeriod,
  } = useData();

  const [timeAgo, setTimeAgo] = useState('agora');
  const currentUser = getAuthenticatedUser();

  useEffect(() => {
    if (!lastUpdated) return;
    const interval = setInterval(() => {
      const diffSec = Math.floor((new Date() - lastUpdated) / 1000);
      if (diffSec < 5) setTimeAgo('agora');
      else if (diffSec < 60) setTimeAgo(`${diffSec}s atrás`);
      else setTimeAgo(`${Math.floor(diffSec / 60)}m atrás`);
    }, 2000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  const { monthsList, quartersList } = dashboardData;

  const isCarolView = activeView === 'carol';
  const isLauraView = activeView === 'laura';

  return (
    <header className="glass-card" style={{
      margin: '1.25rem 2rem 0 2rem',
      padding: '1rem 1.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem',
      borderTop: '3px solid var(--vinteum-orange)',
      background: 'rgba(21, 13, 67, 0.75)'
    }}>
      {/* Brand & Connection State */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, var(--vinteum-orange), #ff8c33)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 18px rgba(240, 112, 16, 0.4)'
        }}>
          {isCarolView ? (
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-display)' }}>C</span>
          ) : isLauraView ? (
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-display)' }}>L</span>
          ) : (
            <img 
              src={`${import.meta.env.BASE_URL}vinteum-logo.svg`}
              alt="Vinteum Icon" 
              style={{ width: '26px', height: '26px', filter: 'brightness(0) invert(1)' }} 
            />
          )}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h1 style={{ fontSize: '1.35rem', color: '#ffffff', letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }}>
              {isCarolView 
                ? 'Carol · SDR Outbound' 
                : isLauraView 
                ? 'Laura · SDR Comercial' 
                : 'Vinteum Executive Dashboard'}
            </h1>
            <span className={isLauraView ? 'badge badge-amber' : 'badge badge-emerald'} style={{ fontSize: '0.7rem' }}>
              <span className={refreshing ? 'live-dot-updating' : 'live-dot'} />
              {isLauraView ? 'Em Espera' : refreshing ? 'Sincronizando...' : 'Ao Vivo'}
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {isCarolView ? (
              <>Planilha Individual <strong style={{ color: 'var(--vinteum-orange-light)' }}>'Carol - Metas'</strong> (Contagem a partir do Q3) · Atualizado {timeAgo}</>
            ) : isLauraView ? (
              <>Aguardando disponibilização da planilha individual de metas</>
            ) : (
              <>Planilha Oficial <strong style={{ color: 'var(--vinteum-orange-light)' }}>'Dashboard'</strong> · Atualizado {timeAgo}</>
            )}
          </p>
        </div>
      </div>

      {/* Dynamic Unified Period Filter & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        
        {/* Period Selector Dropdown */}
        {!isLauraView && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(240, 112, 16, 0.4)',
            borderRadius: 'var(--radius-md)',
            padding: '0.45rem 0.85rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.25)'
          }}>
            <CalendarDays size={16} color="var(--vinteum-orange)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Período:</span>
            
            {isCarolView ? (
              <select 
                value={carolSelectedPeriod}
                onChange={(e) => setCarolSelectedPeriod(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  outline: 'none',
                  cursor: 'pointer',
                  minWidth: '220px'
                }}
              >
                <option value="Q3_PLUS" style={{ background: '#150D43', fontWeight: 'bold', color: 'var(--vinteum-orange-light)' }}>
                  ⭐ Acumulado Ativo (Desde Q3 / Agosto)
                </option>
                <optgroup label="── TRIMESTRES (CAROL) ──" style={{ background: '#150D43', color: '#8b85ad' }}>
                  <option value="Q3" style={{ background: '#150D43', color: '#ffffff' }}>
                    📊 Total Q3 (Jul-Set)
                  </option>
                  <option value="Q4" style={{ background: '#150D43', color: '#ffffff' }}>
                    📊 Total Q4 (Out-Dez)
                  </option>
                </optgroup>
                <optgroup label="── MESES ATIVOS ──" style={{ background: '#150D43', color: '#8b85ad' }}>
                  <option value="August" style={{ background: '#150D43', color: '#ffffff' }}>
                    ● Agosto (Mês de Estreia)
                  </option>
                  <option value="September" style={{ background: '#150D43', color: '#ffffff' }}>
                    ● Setembro
                  </option>
                  <option value="October" style={{ background: '#150D43', color: '#ffffff' }}>
                    ● Outubro
                  </option>
                </optgroup>
              </select>
            ) : (
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  outline: 'none',
                  cursor: 'pointer',
                  minWidth: '220px'
                }}
              >
                {/* Option 1: Ano Todo até a data vigente */}
                <option value="YTD" style={{ background: '#150D43', fontWeight: 'bold', color: 'var(--vinteum-orange-light)' }}>
                  🌟 Ano Todo (Até a data vigente)
                </option>

                {/* Quarters Group */}
                <optgroup label="── TRIMESTRES ──" style={{ background: '#150D43', color: '#8b85ad' }}>
                  {quartersList.map(q => (
                    <option key={q} value={q} style={{ background: '#150D43', color: '#ffffff' }}>
                      📊 Total {q}
                    </option>
                  ))}
                </optgroup>

                {/* Months Group (Auto-populated from sheet) */}
                <optgroup label="── MESES (PLANILHA) ──" style={{ background: '#150D43', color: '#8b85ad' }}>
                  {monthsList.map(m => (
                    <option key={m.id} value={m.id} style={{ background: '#150D43', color: m.hasData ? '#ffffff' : '#64748b' }}>
                      {m.hasData ? '● ' : '○ '} {m.name} ({m.quarter}) {m.hasData ? '' : '— Sem dados'}
                    </option>
                  ))}
                </optgroup>
              </select>
            )}
          </div>
        )}

        {/* Auto-sync Interval */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.45rem 0.75rem'
        }}>
          <Clock size={14} color="var(--text-muted)" />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Auto-Sync:</span>
          <select 
            value={syncInterval}
            onChange={(e) => setSyncInterval(Number(e.target.value))}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontFamily: 'var(--font-display)',
              fontSize: '0.8rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value={30} style={{ background: '#150D43' }}>30 seg</option>
            <option value={60} style={{ background: '#150D43' }}>1 min</option>
            <option value={300} style={{ background: '#150D43' }}>5 min</option>
            <option value={0} style={{ background: '#150D43' }}>Manual</option>
          </select>
        </div>

        {/* Sync Button in Vinteum Orange */}
        <button 
          onClick={refreshNow}
          disabled={refreshing}
          className="btn btn-primary"
          title="Buscar alterações na planilha agora"
          style={{ padding: '0.55rem 1.15rem' }}
        >
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          <span>{refreshing ? 'Atualizando...' : 'Sincronizar'}</span>
        </button>

        {/* Open Sheet Link */}
        <a 
          href={isCarolView 
            ? `https://docs.google.com/spreadsheets/d/${CAROL_SHEET_ID}/edit#gid=0` 
            : `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit#gid=${DASHBOARD_GID}`}
          target="_blank" 
          rel="noreferrer"
          className="btn btn-secondary"
          title={isCarolView ? "Abrir planilha de metas da Carol no Google Sheets" : "Abrir aba 'Dashboard' no Google Sheets"}
          style={{ padding: '0.55rem 0.85rem' }}
        >
          <ExternalLink size={15} />
          <span>{isCarolView ? 'Planilha Carol' : 'Planilha'}</span>
        </a>

        {/* User Badge & Logout Button */}
        {onLogout && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            paddingLeft: '0.5rem',
            borderLeft: '1px solid rgba(255, 255, 255, 0.12)'
          }}>
            <button
              onClick={onLogout}
              className="btn btn-secondary"
              title={`Conectado como ${currentUser}. Clique para encerrar sessão`}
              style={{
                padding: '0.55rem 0.85rem',
                color: '#f87171',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                background: 'rgba(239, 68, 68, 0.08)'
              }}
            >
              <LogOut size={15} />
              <span style={{ fontSize: '0.8rem' }}>Sair</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
