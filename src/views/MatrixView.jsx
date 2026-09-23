import React, { useState } from 'react';
import { useData } from '../services/dataContext';
import { Search, Download, Table, ExternalLink } from 'lucide-react';
import { SHEET_ID, DASHBOARD_GID } from '../services/sheetsClient';

export default function MatrixView() {
  const { dashboardData } = useData();
  const rawRows = dashboardData.rawMatrix || [];
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRows = rawRows.filter(r => {
    if (!searchTerm) return true;
    return r.some(cell => String(cell).toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const handleExportCsv = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + rawRows.map(e => e.map(c => `"${c}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vinteum_dashboard_raw_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', color: '#ffffff' }}>
          Matriz Original da Planilha 'Dashboard'
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Visualização transparente e auditoria de todas as células sincronizadas da planilha oficial
        </p>
      </div>

      {/* Control Bar */}
      <div className="glass-card" style={{
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '0.45rem 0.85rem',
          minWidth: '280px'
        }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Filtrar por qualquer texto ou valor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              outline: 'none',
              width: '100%'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={handleExportCsv}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 1rem' }}
          >
            <Download size={15} />
            <span>Exportar CSV</span>
          </button>
          <a
            href={`https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit#gid=${DASHBOARD_GID}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
            style={{ padding: '0.5rem 1rem' }}
          >
            <ExternalLink size={15} />
            <span>Editar no Google Sheets</span>
          </a>
        </div>
      </div>

      {/* Raw Matrix Grid */}
      <div className="glass-card" style={{ padding: '1.25rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
          <tbody>
            {filteredRows.map((row, rIdx) => {
              const isSectionHeader = ['Q1', 'Q2', 'Q3', 'Q4'].includes(row[0]?.trim());
              const isSubheader = row.includes('January') || row.includes('April') || row.includes('July') || row.includes('October') || row.includes('TOTAL');
              const isLabelRow = row.includes('Goal') && row.includes('Achieved');

              let rowBg = 'transparent';
              let textColor = '#cbd5e1';
              let fontWeight = 400;

              if (isSectionHeader) {
                rowBg = 'rgba(16, 185, 129, 0.15)';
                textColor = 'var(--emerald-400)';
                fontWeight = 800;
              } else if (isSubheader) {
                rowBg = 'rgba(99, 102, 241, 0.12)';
                textColor = '#ffffff';
                fontWeight = 700;
              } else if (isLabelRow) {
                rowBg = 'rgba(255, 255, 255, 0.03)';
                textColor = 'var(--text-muted)';
                fontWeight = 600;
              }

              return (
                <tr key={rIdx} style={{ background: rowBg, borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.5rem 0.75rem', color: 'var(--text-muted)', fontSize: '0.7rem', width: '35px' }}>
                    {rIdx + 1}
                  </td>
                  {row.slice(0, 18).map((cell, cIdx) => (
                    <td 
                      key={cIdx} 
                      style={{ 
                        padding: '0.5rem 0.75rem', 
                        color: cIdx === 0 && !isSectionHeader ? '#ffffff' : textColor,
                        fontWeight: cIdx === 0 ? 600 : fontWeight,
                        borderRight: '1px solid rgba(255, 255, 255, 0.03)'
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
