import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { ClientData, AuthContextType } from '../types';
import { useAppConfig } from '../config/AppConfig';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const { config } = useAppConfig();

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    const storedPassword = localStorage.getItem('authPassword');
    console.log('Stored credentials:', { storedEmail, storedPassword: storedPassword ? '****' : null });
    if (storedEmail && storedPassword) {
      login(storedEmail, storedPassword);
    }
  }, []);

  const fetchClientData = async (email: string, password: string): Promise<ClientData | null> => {
    try {
      console.log('Fetching client data for email:', email);
      console.log('Using Baserow config:', {
        url: config.baserowApiUrl,
        tableId: config.baserowTableId,
        emailColumn: config.baserowEmailColumn,
        passwordColumn: config.baserowPasswordColumn
      });

      // Primero buscamos por email exacto
      const response = await axios.get(
        `${config.baserowApiUrl}/api/database/rows/table/${config.baserowTableId}/`,
        {
          headers: {
            'Authorization': `Token ${config.baserowToken}`,
          },
          params: {
            user_field_names: true,
            [`filter__field_${config.baserowEmailColumn}__equal`]: email
          }
        }
      );

      console.log('Baserow response:', {
        status: response.status,
        resultsCount: response.data.results?.length,
      });

      // Verificar si encontramos el usuario y si la contraseña coincide
      const userMatch = response.data.results?.find(
        (user: any) => 
          user[config.baserowEmailColumn] === email && 
          user[config.baserowPasswordColumn] === password
      );

      if (userMatch) {
        console.log('User found with matching credentials');
        return {
          id: userMatch.id,
          fullName: userMatch[config.baserowNameColumn],
          email: userMatch[config.baserowEmailColumn],
          whatsapp: userMatch[config.baserowWhatsappColumn],
          businessDescription: userMatch[config.baserowDescriptionColumn],
          agentFunctions: userMatch[config.baserowFunctionColumn],
          membership: userMatch.membership || 'trial',
          trialEndsAt: userMatch.trial_ends_at,
          qrCode: userMatch.qr_code,
          qrCodeExpiry: userMatch.qr_code_expiry
        };
      }

      console.log('No matching user found or invalid password');
      return null;
    } catch (error) {
      console.error('Error fetching client data:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          config: error.config
        });
      }
      return null;
    }
  };

  const login = async (email: string, password: string) => {
    console.log('Attempting login for email:', email);
    const data = await fetchClientData(email, password);
    if (data && data.email === email) { // Verificación adicional del email
      console.log('Login successful:', { email: data.email, id: data.id });
      setClientData(data);
      setIsAuthenticated(true);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('authPassword', password);
    } else {
      console.log('Login failed: Invalid credentials');
      setIsAuthenticated(false);
      setClientData(null);
      localStorage.removeItem('userEmail');
      localStorage.removeItem('authPassword');
      throw new Error('Credenciales inválidas');
    }
  };

  const logout = () => {
    console.log('Logging out user');
    setIsAuthenticated(false);
    setClientData(null);
    localStorage.removeItem('userEmail');
    localStorage.removeItem('authPassword');
  };

  const updateClientData = async (data: Partial<ClientData>) => {
    if (!clientData?.id) {
      console.log('Cannot update client data: No client ID');
      return;
    }

    try {
      console.log('Updating client data:', { id: clientData.id, ...data });
      
      // Primero actualizamos en Baserow
      const response = await axios.patch(
        `${config.baserowApiUrl}/api/database/rows/table/${config.baserowTableId}/${clientData.id}/`,
        {
          [config.baserowDescriptionColumn]: data.businessDescription || clientData.businessDescription,
          [config.baserowFunctionColumn]: data.agentFunctions || clientData.agentFunctions,
        },
        {
          headers: {
            'Authorization': `Token ${config.baserowToken}`,
          }
        }
      );

      if (response.data) {
        console.log('Baserow update successful');
        
        // Si la actualización en Baserow fue exitosa, notificamos a n8n
        console.log('Notifying n8n of update');
        await axios.post(config.agentUpdateWebhook, {
          email: clientData.email,
          businessDescription: data.businessDescription || clientData.businessDescription,
          agentFunctions: data.agentFunctions || clientData.agentFunctions
        });

        // Create a new clientData object with the updated values
        const updatedClientData: ClientData = {
          id: clientData.id,
          fullName: clientData.fullName,
          email: clientData.email,
          whatsapp: clientData.whatsapp,
          businessDescription: data.businessDescription !== undefined ? data.businessDescription : clientData.businessDescription,
          agentFunctions: data.agentFunctions !== undefined ? data.agentFunctions : clientData.agentFunctions,
          membership: clientData.membership,
          trialEndsAt: clientData.trialEndsAt,
          qrCode: clientData.qrCode,
          qrCodeExpiry: clientData.qrCodeExpiry,
        };
        console.log("Setting updated client data:", updatedClientData);
        setClientData(updatedClientData);
        console.log('Client data updated successfully');
      }
    } catch (error) {
      console.error('Error updating client data:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          config: error.config
        });
      }
      throw new Error('Error al actualizar los datos');
    }
  };

  const refreshQRCode = async () => {
    if (!clientData?.id) {
      console.log('Cannot refresh QR code: No client ID');
      return;
    }

    try {
      console.log('Requesting new QR code for email:', clientData.email);
      const response = await axios.post(config.qrWebhook, {
        email: clientData.email,
        action: 'refreshQR'
      });

      if (response.data.qrCode) {
        console.log('New QR code received');
        setClientData(prev => prev ? { ...prev, qrCode: response.data.qrCode } : null);
      }
    } catch (error) {
      console.error('Error refreshing QR code:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          config: error.config
        });
      }
      throw new Error('Error al actualizar el código QR');
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      clientData,
      login,
      logout,
      updateClientData,
      refreshQRCode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
