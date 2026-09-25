import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function MetricCard({
  title,
  value,
  goal,
  percentage,
  subtitle,
  icon: Icon,
  accentColor = 'indigo', // emerald, blue, indigo, amber, rose, purple
  isInverse = false, // for Churn where lower is better
  isPositive: customIsPositive,
}) {
  // Determine status color based on percentage
  const numPct = typeof percentage === 'number' ? percentage : parseFloat(percentage) || 0;
  
  let isPositive = customIsPositive !== undefined 
    ? customIsPositive 
    : (isInverse ? numPct <= 100 : numPct >= 100);

  let badgeType = 'badge-emerald';
  if (isInverse) {
    if (numPct > 100) {
      badgeType = 'badge-rose';
    } else if (numPct > 80) {
      badgeType = 'badge-amber';
    } else {
      badgeType = 'badge-emerald';
    }
  } else {
    if (customIsPositive !== undefined) {
      badgeType = customIsPositive ? 'badge-emerald' : 'badge-rose';
    } else {
      if (numPct >= 90) badgeType = 'badge-emerald';
      else if (numPct >= 50) badgeType = 'badge-blue';
      else if (numPct >= 25) badgeType = 'badge-amber';
      else badgeType = 'badge-rose';
    }
  }
  const colorMap = {
    orange: {
      border: 'rgba(240, 112, 16, 0.35)',
      iconBg: 'rgba(240, 112, 16, 0.15)',
      iconColor: 'var(--vinteum-orange-light)',
      barColor: 'var(--vinteum-orange)',
    },
    emerald: {
      border: 'rgba(97, 206, 112, 0.25)',
      iconBg: 'rgba(97, 206, 112, 0.12)',
      iconColor: 'var(--emerald-400)',
      barColor: 'var(--emerald-500)',
    },
    blue: {
      border: 'rgba(59, 130, 246, 0.25)',
      iconBg: 'rgba(59, 130, 246, 0.12)',
      iconColor: 'var(--blue-400)',
      barColor: 'var(--blue-500)',
    },
    indigo: {
      border: 'rgba(99, 102, 241, 0.25)',
      iconBg: 'rgba(99, 102, 241, 0.12)',
      iconColor: 'var(--indigo-400)',
      barColor: 'var(--indigo-500)',
    },
    purple: {
      border: 'rgba(168, 85, 247, 0.25)',
      iconBg: 'rgba(168, 85, 247, 0.12)',
      iconColor: 'var(--purple-400)',
      barColor: 'var(--purple-500)',
    },
    amber: {
      border: 'rgba(245, 158, 11, 0.25)',
      iconBg: 'rgba(245, 158, 11, 0.12)',
      iconColor: 'var(--amber-400)',
      barColor: 'var(--amber-500)',
    },
    rose: {
      border: 'rgba(244, 63, 94, 0.25)',
      iconBg: 'rgba(244, 63, 94, 0.12)',
      iconColor: 'var(--rose-400)',
      barColor: 'var(--rose-500)',
    },
  };

  const scheme = colorMap[accentColor] || colorMap.indigo;

  return (
    <div className="glass-card" style={{
      padding: '1.25rem',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      {/* Top row: Title and Icon */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <span style={{ 
            fontSize: '0.8rem', 
            fontWeight: 600, 
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            {title}
          </span>
          {subtitle && (
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {subtitle}
            </div>
          )}
        </div>
        {Icon && (
          <div style={{
            padding: '0.5rem',
            borderRadius: 'var(--radius-md)',
            background: scheme.iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Icon size={18} color={scheme.iconColor} />
          </div>
        )}
      </div>

      {/* Main Value Display */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.85rem' }}>
        <span style={{ 
          fontFamily: 'var(--font-display)', 
          fontSize: '1.85rem', 
          fontWeight: 800, 
          color: '#ffffff',
          lineHeight: '1.1'
        }}>
          {value || '—'}
        </span>
        {percentage !== undefined && percentage !== null && (
          <span className={`badge ${badgeType}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {typeof percentage === 'number' ? `${percentage.toFixed(0)}%` : percentage}
          </span>
        )}
      </div>

      {/* Progress Bar & Goal */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          marginBottom: '0.35rem'
        }}>
          <span>{(() => {
            if (!goal) return 'Progresso da Meta';
            const clean = String(goal).replace(/^(meta:\s*)+/i, '').trim();
            if (clean === '—' || clean === '-') return '—';
            return clean.toLowerCase().includes('meta') ? clean : `Meta: ${clean}`;
          })()}</span>
          <span>{numPct.toFixed(0)}%</span>
        </div>
        <div style={{
          width: '100%',
          height: '6px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius-pill)',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${Math.min(Math.max(numPct, 0), 100)}%`,
            height: '100%',
            background: scheme.barColor,
            borderRadius: 'var(--radius-pill)',
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }} />
        </div>
      </div>
    </div>
  );
}
