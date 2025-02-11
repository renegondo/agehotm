import React, { createContext, useContext, useState } from 'react';
    import { AppConfig } from '../types';

    const AppConfigContext = createContext<{
      config: AppConfig;
      setConfig: (config: AppConfig) => void;
    }>({
      config: {
        registrationWebhook: 'https://n8n.prospectos.pro/webhook/844c226b-f793-4759-abfc-a83ac1f2a884',
        agentConfigWebhook: 'https://n8n.prospectos.pro/webhook/7dadf219-7fac-4e17-bc33-dea4670329e0',
        agentUpdateWebhook: 'https://n8n.prospectos.pro/webhook/agent-update',
        qrWebhook: 'https://n8n.prospectos.pro/webhook/f356ac57-4f9b-463e-8c6d-13eeeebbfe60',
        openaiApiKey: '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',
        geminiApiKey: 'AIzaSyARrlf8wQkV8uVhgx7OApZ0r8ZdxfIBk6Y',
        baserowApiUrl: 'https://api.baserow.io',
        baserowToken: 'f8Fons1isKInSy2hhtmIrVcJT0IuDX70',
        baserowTableId: '430560',
        baserowNameColumn: 'Nombre',
        baserowEmailColumn: 'email',
        baserowWhatsappColumn: 'Whatsapp',
        baserowBusinessColumn: 'negocio',
        baserowDescriptionColumn: 'descripcionnegocio',
        baserowFunctionColumn: 'funcionagente',
        baserowPasswordColumn: 'password',
      },
      setConfig: () => {},
    });

    export const AppConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
      const [config, setConfig] = useState<AppConfig>({
        registrationWebhook: 'https://n8n.prospectos.pro/webhook/844c226b-f793-4759-abfc-a83ac1f2a884',
        agentConfigWebhook: 'https://n8n.prospectos.pro/webhook/117383b5-998e-4fa3-a959-24e89dcb545b',
        agentUpdateWebhook: 'https://n8n.prospectos.pro/webhook/agent-update',
        qrWebhook: 'https://n8n.prospectos.pro/webhook/f356ac57-4f9b-463e-8c6d-13eeeebbfe60',
        openaiApiKey: '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',
        geminiApiKey: 'AIzaSyARrlf8wQkV8uVhgx7OApZ0r8ZdxfIBk6Y',
        baserowApiUrl: 'https://api.baserow.io',
        baserowToken: 'f8Fons1isKInSy2hhtmIrVcJT0IuDX70',
        baserowTableId: '430560',
        baserowNameColumn: 'Nombre',
        baserowEmailColumn: 'email',
        baserowWhatsappColumn: 'Whatsapp',
        baserowBusinessColumn: 'negocio',
        baserowDescriptionColumn: 'descripcionnegocio',
        baserowFunctionColumn: 'funcionagente',
        baserowPasswordColumn: 'password',
      });

      return (
        <AppConfigContext.Provider value={{ config, setConfig }}>
          {children}
        </AppConfigContext.Provider>
      );
    };

    export const useAppConfig = () => useContext(AppConfigContext);
