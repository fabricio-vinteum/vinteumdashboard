import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { authenticateUser } from '../services/authService';

export default function LoginModal({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authenticateUser(username, password, remember);
      if (result.success) {
        onLoginSuccess();
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Ocorreu um erro durante a autenticação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 30%, rgba(30, 20, 90, 0.95), rgba(10, 6, 30, 0.98))',
      backdropFilter: 'blur(12px)',
      padding: '1.5rem',
      fontFamily: 'var(--font-sans)'
    }}>
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(240, 112, 16, 0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
        transform: 'translate(-30%, -20%)'
      }} />

      <div style={{
        position: 'absolute',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(97, 206, 112, 0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
        transform: 'translate(40%, 30%)'
      }} />

      {/* Main Login Card */}
      <div className="glass-card" style={{
        position: 'relative',
        width: '100%',
        maxWidth: '430px',
        background: 'rgba(21, 13, 67, 0.85)',
        border: '1px solid rgba(240, 112, 16, 0.35)',
        borderTop: '4px solid var(--vinteum-orange)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem 2.25rem',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(240, 112, 16, 0.15)',
        color: '#ffffff'
      }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 1.25rem auto',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, var(--vinteum-orange), #ff8c33)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(240, 112, 16, 0.45)'
          }}>
            <img 
              src="./vinteum-logo.svg" 
              alt="Vinteum Logo" 
              style={{ width: '38px', height: '38px', filter: 'brightness(0) invert(1)' }} 
            />
          </div>

          <h2 style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.02em',
            color: '#ffffff',
            marginBottom: '0.35rem'
          }}>
            Vinteum Dashboard
          </h2>
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)'
          }}>
            Acesso Restrito à Gestão e Diretoria
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            fontSize: '0.82rem',
            marginBottom: '1.5rem'
          }}>
            <AlertCircle size={17} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: '0.45rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              Usuário
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 'var(--radius-md)',
              padding: '0 0.85rem',
              transition: 'all 0.2s ease'
            }}>
              <User size={17} color="var(--text-muted)" style={{ marginRight: '0.65rem' }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: admin"
                autoComplete="username"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 0',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '0.92rem'
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: '0.45rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              Senha de Acesso
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 'var(--radius-md)',
              padding: '0 0.85rem',
              transition: 'all 0.2s ease'
            }}>
              <Lock size={17} color="var(--text-muted)" style={{ marginRight: '0.65rem' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha de acesso"
                autoComplete="current-password"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 0',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '0.92rem'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  outline: 'none'
                }}
                title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.75rem'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{
                  accentColor: 'var(--vinteum-orange)',
                  cursor: 'pointer'
                }}
              />
              Lembrar deste dispositivo
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.85rem 1.25rem',
              background: 'linear-gradient(135deg, var(--vinteum-orange), #ff8c33)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.95rem',
              fontFamily: 'var(--font-display)',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              boxShadow: '0 4px 18px rgba(240, 112, 16, 0.4)',
              transition: 'all 0.2s ease',
              opacity: loading ? 0.75 : 1
            }}
          >
            {loading ? (
              <span>Verificando credenciais...</span>
            ) : (
              <>
                <span>Acessar Dashboard</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        {/* Security Badge */}
        <div style={{
          marginTop: '1.75rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          color: 'var(--text-muted)',
          fontSize: '0.74rem'
        }}>
          <ShieldCheck size={14} color="var(--vinteum-green)" />
          <span>Autenticação criptografada com SHA-256 unidirecional</span>
        </div>
      </div>
    </div>
  );
}
