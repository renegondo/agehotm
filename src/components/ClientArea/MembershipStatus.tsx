import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Crown, Clock } from 'lucide-react';

export const MembershipStatus: React.FC = () => {
  const { clientData } = useAuth();

  const getMembershipInfo = () => {
    switch (clientData?.membership) {
      case 'premium':
        return {
          title: 'Premium',
          description: 'Acceso completo a todas las funciones',
          bgColor: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
          icon: Crown
        };
      case 'trial':
        return {
          title: 'Prueba Gratuita',
          description: clientData.trialEndsAt 
            ? `Expira el ${new Date(clientData.trialEndsAt).toLocaleDateString()}`
            : 'Periodo de prueba activo',
          bgColor: 'bg-gradient-to-r from-blue-400 to-blue-600',
          icon: Clock
        };
      default:
        return {
          title: 'Membresía Expirada',
          description: 'Actualiza tu plan para continuar',
          bgColor: 'bg-gradient-to-r from-gray-400 to-gray-600',
          icon: Clock
        };
    }
  };

  const membershipInfo = getMembershipInfo();

  return (
    <div className={`${membershipInfo.bgColor} rounded-lg shadow-lg p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">{membershipInfo.title}</h2>
          <p className="text-white/90">{membershipInfo.description}</p>
        </div>
        <membershipInfo.icon className="h-12 w-12 opacity-90" />
      </div>

      {clientData?.membership !== 'premium' && (
        <div className="mt-6">
          <a
            href="https://buy.stripe.com/7sIaH9fft3M1aoE8wz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Actualizar a Premium
          </a>
        </div>
      )}
    </div>
  );
};
