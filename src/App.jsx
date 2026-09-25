import React, { useState, useEffect } from 'react';
import { DataProvider, useData } from './services/dataContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import OverviewView from './views/OverviewView';
import FunnelView from './views/FunnelView';
import RevenueView from './views/RevenueView';
import RetentionView from './views/RetentionView';
import MatrixView from './views/MatrixView';
import CarolView from './views/CarolView';
import LauraView from './views/LauraView';
import LoginModal from './components/LoginModal';
import { isUserAuthenticated, logoutUser } from './services/authService';
import { Activity } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturou erro:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          padding: '2rem',
          color: '#ffffff',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--vinteum-orange)' }}>
            Ops! Ocorreu um problema ao renderizar o painel
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '500px' }}>
            {this.state.error?.message || 'Erro inesperado na renderização.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="btn btn-primary"
          >
            Recarregar Página
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function DashboardContent({ onLogout }) {
  const { loading, activeView } = useData();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        background: 'var(--bg-canvas)',
        color: '#ffffff'
      }}>
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, var(--vinteum-orange), #ff8c33)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 30px rgba(240, 112, 16, 0.4)',
          marginBottom: '1.25rem'
        }}>
          <Activity size={28} color="#ffffff" className="animate-spin" />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: '0.4rem' }}>
          Sincronizando com a Planilha 'Dashboard'...
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Carregando dados em tempo real e identificando meses vigentes
        </p>
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return <OverviewView />;
      case 'funnel':
        return <FunnelView />;
      case 'revenue':
        return <RevenueView />;
      case 'retention':
        return <RetentionView />;
      case 'matrix':
        return <MatrixView />;
      case 'carol':
        return <CarolView />;
      case 'laura':
        return <LauraView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header onLogout={onLogout} />
        <main className="content-body">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [authenticated, setAuthenticated] = useState(isUserAuthenticated());

  const handleLogout = () => {
    logoutUser();
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <LoginModal onLoginSuccess={() => setAuthenticated(true)} />;
  }

  return (
    <ErrorBoundary>
      <DataProvider>
        <DashboardContent onLogout={handleLogout} />
      </DataProvider>
    </ErrorBoundary>
  );
}
