import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { QrCode, RefreshCw, AlertCircle } from 'lucide-react';
import { useAppConfig } from '../../config/AppConfig';
import axios from 'axios';

export const QRCodeSection: React.FC = () => {
  const { clientData, refreshQRCode } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { config } = useAppConfig();

  const handleRefresh = async () => {
    setError('');
    setIsLoading(true);
    try {
      // Enviar solicitud al webhook de QR con el email del usuario
      const response = await fetch(config.qrWebhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: clientData?.email,
          action: 'refreshQR'
        })
      });

      console.log("QR Webhook Response:", response); // Log the entire response

      if (response.ok) {
        const data = await response.json();
        if (data && data.qrCode) {
          console.log("Raw QR Code Data:", data.qrCode); // Inspect the raw data

          // Clean the QR code data if it's malformed
          let cleanedQrCode = data.qrCode;
          if (data.qrCode.startsWith("data:image/png;base64,data:image/png;base64,")) {
            cleanedQrCode = data.qrCode.replace("data:image/png;base64,data:image/png;base64,", "data:image/png;base64,");
          }

          // Update the clientData with only the new QR code
          await refreshQRCode();
        } else {
          setError('No se pudo obtener el código QR');
        }
      } else {
        console.error("QR Webhook Error:", response.status, response.statusText);
        setError(`Error al generar el código QR: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      console.error("QR Webhook Error:", err); // Log the entire error object
      setError('Error al actualizar el código QR');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Conexión WhatsApp</h2>

      {error && (
        <div className="mb-4 p-4 rounded-md bg-red-50">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center space-y-6">
        {clientData?.qrCode ? (
          <>
            <div className="bg-gray-50 p-4 rounded-lg">
              <img
                src={`data:image/png;base64,${clientData.qrCode}`}
                alt="WhatsApp QR Code"
                className="w-64 h-64"
              />
            </div>
            <p className="text-sm text-gray-500">
              Escanea este código QR con WhatsApp para reconectar tu agente
            </p>
          </>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg w-full">
            <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay código QR disponible</p>
          </div>
        )}

        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          <RefreshCw className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Generando...' : 'Generar Nuevo Código QR'}
        </button>
      </div>
    </div>
  );
};
