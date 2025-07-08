import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import AuthContainer from './components/Auth/AuthContainer';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import Portfolio from './components/Portfolio/Portfolio';
import InvestmentPlans from './components/Investment/InvestmentPlans';
import Settings from './components/Settings/Settings';
import TradingPanel from './components/Trading/TradingPanel';
import Watchlist from './components/Watchlist/Watchlist';

function App() {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthContainer onAuthSuccess={() => {}} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'portfolio':
        return <Portfolio />;
      case 'investments':
        return <InvestmentPlans />;
      case 'trading':
        return <TradingPanel />;
      case 'watchlist':
        return <Watchlist />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <main className="flex-1 min-h-[calc(100vh-64px)] lg:ml-0">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;