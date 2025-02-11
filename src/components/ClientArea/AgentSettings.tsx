import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useAppConfig } from '../../config/AppConfig';
import axios from 'axios';

export const AgentSettings: React.FC = () => {
  const { clientData, updateClientData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [businessDescription, setBusinessDescription] = useState('');
  const [agentFunctions, setAgentFunctions] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { config } = useAppConfig();

  useEffect(() => {
    const fetchAgentData = async () => {
      if (clientData?.email) {
        try {
          const response = await axios.get(
            `${config.baserowApiUrl}/api/database/rows/table/${config.baserowTableId}/`,
            {
              headers: {
                Authorization: `Token ${config.baserowToken}`,
              },
              params: {
                user_field_names: true,
                [`filter__field_${config.baserowEmailColumn}__equal`]: clientData.email,
              },
            }
          );

          if (response.data.results && response.data.results.length > 0) {
            const userData = response.data.results[0];
            setBusinessDescription(userData[config.baserowDescriptionColumn] || '');
            setAgentFunctions(userData[config.baserowFunctionColumn] || '');
          }
        } catch (error) {
          console.error('Error fetching agent data from Baserow:', error);
          setError('Error al cargar los datos del agente');
        }
      }
    };

    fetchAgentData();
  }, [clientData, config]);

  const handleSave = async () => {
    setError('');
    setIsSaving(true);
    setSuccessMessage('');
    try {
      if (clientData?.email) {
        // Send data to webhook
        try {
          await axios.post(config.agentUpdateWebhook, {
            email: clientData.email,
            businessDescription: businessDescription,
            agentFunctions: agentFunctions,
          });
          console.log('Agent update webhook triggered successfully');
        } catch (webhookError) {
          console.error('Error triggering agent update webhook:', webhookError);
          setError('Error al notificar la actualización del agente');
          setIsSaving(false);
          return;
        }
      }

      const updateData = {
        businessDescription,
        agentFunctions
      };
      await updateClientData(updateData);
      setIsEditing(false);
      setSuccessMessage('Las instrucciones del agente han sido actualizadas');
    } catch (err) {
      console.error("Error during update:", err);
      setError('Error al guardar los cambios');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Configuración del Agente</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Editar
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        )}
      </div>

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

      {successMessage && (
        <div className="mb-4 p-4 rounded-md bg-green-50">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">{successMessage}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción del Negocio
          </label>
          <textarea
            value={businessDescription}
            onChange={(e) => setBusinessDescription(e.target.value)}
            disabled={!isEditing}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Funciones del Agente
          </label>
          <textarea
            value={agentFunctions}
            onChange={(e) => setAgentFunctions(e.target.value)}
            disabled={!isEditing}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
      </div>
    </div>
  );
};
