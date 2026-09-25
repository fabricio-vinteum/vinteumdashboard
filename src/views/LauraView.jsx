import React from 'react';
import { useData } from '../services/dataContext';
import { Clock, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';

export default function LauraView() {
  const { setActiveView } = useData();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px', margin: '0 auto', paddingTop: '2rem' }}>
      
      {/* Header */}
      <div className="glass-card" style={{
        padding: '2.5rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(21, 13, 67, 0.95), rgba(35, 20, 80, 0.8))',
        borderTop: '4px solid var(--vinteum-orange)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px dashed rgba(240, 112, 16, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
          boxShadow: '0 0 25px rgba(240, 112, 16, 0.15)'
        }}>
          <Clock size={32} color="var(--vinteum-orange)" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-amber" style={{ fontSize: '0.8rem' }}>
            Aguardando Planilha
          </span>
          <span className="badge badge-purple" style={{ fontSize: '0.8rem' }}>
            SDR Comercial
          </span>
        </div>

        <h2 style={{ fontSize: '1.8rem', color: '#ffffff', fontFamily: 'var(--font-display)', fontWeight: 800, marginBottom: '0.75rem' }}>
          Dashboard da Laura em Preparação
        </h2>

        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '560px', lineHeight: '1.6', marginBottom: '1.75rem' }}>
          Os dados individuais da Laura ainda não foram disponibilizados na planilha. Assim que o link da planilha oficial for fornecido, este painel será liberado automaticamente em tempo real.
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          textAlign: 'left',
          maxWidth: '540px',
          marginBottom: '2rem'
        }}>
          <AlertCircle size={22} color="var(--vinteum-orange)" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <strong style={{ color: '#ffffff' }}>Status Atual:</strong> O dashboard da <strong>Carol</strong> já está liberado com dados a partir do Q3. Você pode alternar para visualizar o desempenho da equipe ativa.
          </div>
        </div>

        <button
          onClick={() => setActiveView('carol')}
          className="btn btn-primary"
          style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
        >
          <UserCheck size={18} />
          <span>Acessar Dashboard da Carol</span>
          <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}
