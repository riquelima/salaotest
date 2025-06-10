
import React, { useState } from 'react';
import AdminHeader from '../components/admin/AdminHeader';
import AdminBottomNav from '../components/admin/AdminBottomNav';
import SchedulingPanel from '../components/admin/SchedulingPanel';
import ClientManagement from '../components/admin/ClientManagement';
import FinancialControl from '../components/admin/FinancialControl';
import FollowUpMessages from '../components/admin/FollowUpMessages';
import DataExport from '../components/admin/DataExport';

export type AdminView = 'schedule' | 'clients' | 'finance' | 'followup' | 'export';

const AdminDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<AdminView>('schedule');

  const renderView = () => {
    switch (currentView) {
      case 'schedule':
        return <SchedulingPanel />;
      case 'clients':
        return <ClientManagement />;
      case 'finance':
        return <FinancialControl />;
      case 'followup':
        return <FollowUpMessages />;
      case 'export':
        return <DataExport />;
      default:
        return <SchedulingPanel />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      {/* Main content area inherits background from App.tsx body or main div */}
      <main className={`flex-grow p-4 sm:p-6 pb-24 transition-colors duration-300`}>
        <div className="container mx-auto">
          {renderView()}
        </div>
      </main>
      <AdminBottomNav currentView={currentView} onNavigate={(view) => setCurrentView(view)} />
    </div>
  );
};

export default AdminDashboard;
