import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AgentSettings } from './AgentSettings';
import { MembershipStatus } from './MembershipStatus';
import { QRCodeSection } from './QRCodeSection';
import { LogOut } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { clientData, logout } = useAuth();

  if (!clientData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Panel de Control
              </h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 mr-4">{clientData.email}</span>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6">
            <MembershipStatus />
            <AgentSettings />
            <QRCodeSection />
          </div>
        </div>
      </main>
    </div>
  );
};
