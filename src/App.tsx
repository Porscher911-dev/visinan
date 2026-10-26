import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { VessaTicker } from './components/vessa/VessaTicker';
import { LoginPage } from './components/auth/LoginPage';
import { VessaTopHeader } from './components/vessa/VessaTopHeader';
import { VessaSidebar } from './components/vessa/VessaSidebar';
import { VessaCommandFinder } from './components/vessa/VessaCommandFinder';
import { VessaExecutiveDashboard } from './components/vessa/VessaExecutiveDashboard';
import { VessaEstimatesView } from './components/vessa/VessaEstimatesView';
import { VessaOrdersView } from './components/vessa/VessaOrdersView';
import { VessaProductionKanbanView } from './components/vessa/VessaProductionKanbanView';
import { VessaInventoryView } from './components/vessa/VessaInventoryView';
import { VessaInstallationView } from './components/vessa/VessaInstallationView';
import { VessaCrmView } from './components/vessa/VessaCrmView';
import { VessaSettingsView } from './components/vessa/VessaSettingsView';

import { AttendanceView } from './components/attendance/AttendanceView';
import { TasksView } from './components/tasks/TasksView';
import { PerformanceView } from './components/performance/PerformanceView';
import { ReportsView } from './components/reports/ReportsView';
import { ResourcesView } from './components/resources/ResourcesView';
import { EmployeesView } from './components/employees/EmployeesView';
import { AnnouncementsView } from './components/announcements/AnnouncementsView';
import { BoardView } from './components/board/BoardView';
import { WorkloadView } from './components/workload/WorkloadView';
import { PayrollView } from './components/payroll/PayrollView';
import { DocsView } from './components/docs/DocsView';
import { FinanceView } from './components/finance/FinanceView';
import { UserProfileModal } from './components/common/UserProfileModal';
import { CompanyGroupChat } from './components/chat/CompanyGroupChat';
import { VessaMobileNav } from './components/vessa/VessaMobileNav';

const MainLayout: React.FC = () => {
  const { activeTab, setActiveTab, isAuthenticated, isProfileModalOpen, closeProfileModal } = useApp();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFinderOpen, setIsFinderOpen] = useState(false);
  const [quickAddCustomer, setQuickAddCustomer] = useState(false);
  const [quickAddInventory, setQuickAddInventory] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Sync theme with html root dataset
  useEffect(() => {
    document.documentElement.dataset.theme = isDarkMode ? 'dark' : 'light';
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sync sidebar collapse state
  useEffect(() => {
    if (!isSidebarCollapsed) {
      document.documentElement.classList.add('side-open');
    } else {
      document.documentElement.classList.remove('side-open');
    }
  }, [isSidebarCollapsed]);

  // Keyboard shortcut for Command Finder (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsFinderOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleQuickCreate = (type: 'estimate' | 'order' | 'inventory' | 'customer') => {
    if (type === 'estimate') setActiveTab('estimates');
    if (type === 'order') setActiveTab('orders');
    if (type === 'inventory') {
      setQuickAddInventory(true);
      setActiveTab('inventory');
    }
    if (type === 'customer') {
      setQuickAddCustomer(true);
      setActiveTab('crm');
    }
  };

  return (
    <div className="vessa-shell">
      {/* Vessa Sticky Top Header */}
      <VessaTopHeader
        onOpenFinder={() => setIsFinderOpen(true)}
        onOpenQuickCreate={handleQuickCreate}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onOpenMobileNav={() => setIsMobileDrawerOpen(true)}
      />

      {/* Vessa Sticky Sidebar Rail */}
      <VessaSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Content Area */}
      <main className="min-w-0 relative pb-16">
        <VessaTicker />
        <div key={activeTab} className="page-enter">
        {activeTab === 'dashboard' && <VessaExecutiveDashboard />}
        {activeTab === 'estimates' && <VessaEstimatesView />}
        {activeTab === 'orders' && <VessaOrdersView />}
        {activeTab === 'production' && <VessaProductionKanbanView />}
        {activeTab === 'inventory' && <VessaInventoryView initialOpenAdd={quickAddInventory} />}
        {activeTab === 'installation' && <VessaInstallationView />}
        {activeTab === 'crm' && <VessaCrmView initialOpenAdd={quickAddCustomer} />}
        {activeTab === 'finance' && <FinanceView />}
        {activeTab === 'settings' && (
          <VessaSettingsView
            isDarkMode={isDarkMode}
            onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          />
        )}

        {/* Existing modules smoothly integrated */}
        {activeTab === 'attendance' && <AttendanceView />}
        {activeTab === 'tasks' && <TasksView />}
        {activeTab === 'docs' && <DocsView />}
        {activeTab === 'performance' && <PerformanceView />}
        {activeTab === 'reports' && <ReportsView />}
        {activeTab === 'employees' && <EmployeesView />}
        {activeTab === 'announcements' && <AnnouncementsView />}
        {activeTab === 'board' && <BoardView />}
        {activeTab === 'workload' && <WorkloadView />}
        {activeTab === 'payroll' && <PayrollView />}
        {activeTab === 'resources' && <ResourcesView />}
        {activeTab === 'chat' && <CompanyGroupChat />}
        </div>
      </main>

      {/* Global Command Finder Modal (⌘K) */}
      <VessaCommandFinder
        isOpen={isFinderOpen}
        onClose={() => setIsFinderOpen(false)}
      />

      {/* User Profile Settings Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
      />

      {/* Mobile Floating Bottom Bar and Slide-in Drawer */}
      <VessaMobileNav
        isOpen={isMobileDrawerOpen}
        onOpen={() => setIsMobileDrawerOpen(true)}
        onClose={() => setIsMobileDrawerOpen(false)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

