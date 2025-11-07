
import React, { useState, useCallback, useMemo } from 'react';
import type { User, View } from './types';
import { api } from './services/api';
import Login from './components/Login';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Invoices from './components/Invoices';
import Claims from './components/Claims';
import ReportPayment from './components/ReportPayment';
import Plans from './components/Plans';
import News from './components/News';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const handleLogin = useCallback((user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  }, []);

  const handleLogout = useCallback(() => {
    api.logout(); // Limpiar el token de sesión
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, []);

  const handleNavigate = useCallback((view: View) => {
    setCurrentView(view);
    setSidebarOpen(false); // Close sidebar on navigation
  }, []);

  const renderContent = useMemo(() => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={currentUser!} onNavigate={handleNavigate} />;
      case 'invoices':
        return <Invoices />;
      case 'claims':
        return <Claims user={currentUser!} />;
      case 'report-payment':
        return <ReportPayment />;
      case 'plans':
        return <Plans currentPlanId={currentUser!.planId} />;
      case 'news':
        return <News />;
      default:
        return <Dashboard user={currentUser!} onNavigate={handleNavigate} />;
    }
  }, [currentView, currentUser, handleNavigate]);

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          user={currentUser!}
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
          {renderContent}
        </main>
      </div>
    </div>
  );
};

export default App;
