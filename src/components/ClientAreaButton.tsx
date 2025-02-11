import React from 'react';
import { UserCircle2 } from 'lucide-react';

export const ClientAreaButton: React.FC = () => {
  const handleClick = () => {
    window.location.href = '/cliente';
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-blue-50 transition-all border border-blue-100"
    >
      <UserCircle2 className="w-5 h-5" />
      <span className="font-medium">Área de Clientes</span>
    </button>
  );
};
