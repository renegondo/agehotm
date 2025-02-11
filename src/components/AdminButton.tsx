import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { useAppConfig } from '../config/AppConfig';

const ADMIN_PASSWORD = 'Vh1mtvtele';

export const AdminButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setConfig } = useAppConfig();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newConfig = {
      registrationWebhook: formData.get('registrationWebhook') as string,
      agentConfigWebhook: formData.get('agentConfigWebhook') as string,
      agentUpdateWebhook: formData.get('agentUpdateWebhook') as string,
      qrWebhook: formData.get('qrWebhook') as string,
      openaiApiKey: formData.get('openaiApiKey') as string,
      baserowApiUrl: formData.get('baserowApiUrl') as string,
      baserowToken: formData.get('baserowToken') as string,
      baserowTableId: formData.get('baserowTableId') as string,
      baserowNameColumn: formData.get('baserowNameColumn') as string,
      baserowEmailColumn: formData.get('baserowEmailColumn') as string,
      baserowWhatsappColumn: formData.get('baserowWhatsappColumn') as string,
      baserowBusinessColumn: formData.get('baserowBusinessColumn') as string,
      baserowDescriptionColumn: formData.get('baserowDescriptionColumn') as string,
      baserowFunctionColumn: formData.get('baserowFunctionColumn') as string,
      baserowPasswordColumn: formData.get('baserowPasswordColumn') as string,
    };
    setConfig(newConfig);
    setIsOpen(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setShowPasswordDialog(false);
      setIsOpen(true);
      setPassword('');
      setError('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const handleAdminClick = () => {
    setShowPasswordDialog(true);
  };

  return (
    <>
      <button
        onClick={handleAdminClick}
        className="p-2 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors"
        aria-label="Configuración"
      >
        <Settings className="w-5 h-5" />
      </button>

      <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm bg-white rounded-lg p-6 shadow-xl">
            <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Acceso Administrativo
            </Dialog.Title>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ingrese la contraseña"
                />
                {error && (
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordDialog(false);
                    setPassword('');
                    setError('');
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Acceder
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-4xl bg-white rounded-lg p-6 shadow-xl overflow-y-auto max-h-[90vh]">
            <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Configuración del Backend
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Webhook de Registro
                  </label>
                  <input
                    type="url"
                    name="registrationWebhook"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="URL del webhook de registro"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Webhook de Configuración de Agente
                  </label>
                  <input
                    type="url"
                    name="agentConfigWebhook"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="URL del webhook de configuración"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Webhook de Actualización de Agente
                  </label>
                  <input
                    type="url"
                    name="agentUpdateWebhook"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="URL del webhook de actualización"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Webhook de Código QR
                  </label>
                  <input
                    type="url"
                    name="qrWebhook"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="URL del webhook de código QR"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key de OpenAI
                  </label>
                  <input
                    type="password"
                    name="openaiApiKey"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="sk-..."
                    required
                  />
                </div>

                {/* Baserow Configuration */}
                <div className="col-span-2">
                  <h3 className="font-medium text-gray-900 mb-2">Configuración de Baserow</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL de API
                      </label>
                      <input
                        type="url"
                        name="baserowApiUrl"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://api.baserow.io"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Token
                      </label>
                      <input
                        type="password"
                        name="baserowToken"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ID de Tabla
                      </label>
                      <input
                        type="text"
                        name="baserowTableId"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* Column Names */}
                    <div className="grid grid-cols-2 gap-4 col-span-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Columna Nombre
                        </label>
                        <input
                          type="text"
                          name="baserowNameColumn"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Columna Email
                        </label>
                        <input
                          type="text"
                          name="baserowEmailColumn"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Columna WhatsApp
                        </label>
                        <input
                          type="text"
                          name="baserowWhatsappColumn"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Columna Negocio
                        </label>
                        <input
                          type="text"
                          name="baserowBusinessColumn"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Columna Descripción
                        </label>
                        <input
                          type="text"
                          name="baserowDescriptionColumn"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Columna Funciones
                        </label>
                        <input
                          type="text"
                          name="baserowFunctionColumn"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Columna Contraseña
                        </label>
                        <input
                          type="text"
                          name="baserowPasswordColumn"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Guardar
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};
