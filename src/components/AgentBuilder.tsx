import React, { useState, useEffect } from 'react';
    import { useForm } from 'react-hook-form';
    import { AgentConfig, UserRegistration } from '../types';
    import { useAppConfig } from '../config/AppConfig';
    import { Globe, Settings, MessageSquare, Info } from 'lucide-react';
    import { Dialog } from '@headlessui/react';
    import OpenAI from 'openai';
    import axios from 'axios';
    import * as cheerio from 'cheerio';

    const LOCAL_STORAGE_AGENT_CONFIG_KEY = 'agentConfig';

    export const AgentBuilder: React.FC<{
      onComplete: (config: AgentConfig) => void;
    }> = ({ onComplete }) => {
      const [step, setStep] = useState(1);
      const { config } = useAppConfig();
      const { register, handleSubmit, formState: { errors }, watch, setValue, setError } = useForm<AgentConfig>();
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [isAnalyzing, setIsAnalyzing] = useState(false);
      const productUrl = watch('businessDescription');
      const affiliateLink = watch('agentFunctions');
      const userEmail = localStorage.getItem('userEmail') || '';
      const [isProductInfoModalOpen, setIsProductInfoModalOpen] = useState(false);
      const [isAffiliateLinkModalOpen, setIsAffiliateLinkModalOpen] = useState(false);
      const LOCAL_STORAGE_AGENT_CONFIG_KEY = `agentConfig_${userEmail}`;
      const [registrationData, setRegistrationData] = useState<UserRegistration | null>(null);

      useEffect(() => {
        try {
          const storedConfig = localStorage.getItem(LOCAL_STORAGE_AGENT_CONFIG_KEY);
          if (storedConfig) {
            const parsedConfig = JSON.parse(storedConfig);
            setValue('businessDescription', parsedConfig.businessDescription);
            setValue('agentFunctions', parsedConfig.agentFunctions);
          }
        } catch (error) {
          console.error('Error loading agent config from local storage:', error);
        }
        const storedRegistrationData = localStorage.getItem('userRegistration');
        if (storedRegistrationData) {
          setRegistrationData(JSON.parse(storedRegistrationData));
        }
      }, [setValue, userEmail]);

      const analyzeProductUrl = async (url: string) => {
        setIsAnalyzing(true);
        try {
          // Fetch the HTML content of the webpage
          const response = await axios.get(url);
          const html = response.data;

          // Extract the text from the HTML content
          const $ = cheerio.load(html);
          let text = $('body').text();

          // Truncate the text to a maximum of 8000 characters (adjust as needed)
          const maxLength = 8000;
          if (text.length > maxLength) {
            text = text.substring(0, maxLength);
            console.warn('Truncated text to ' + maxLength + ' characters.');
          }

          // Initialize the OpenAI API
          const openai = new OpenAI({
            apiKey: config.openaiApiKey,
            dangerouslyAllowBrowser: true
          });

          // Refined prompt for OpenAI
          const prompt = `Analice el contenido de la siguiente página web e identifique el lenguaje utilizado para que lo utilices en la respuesta . Luego, extraiga la información clave, que incluya:

          - Descripción del producto o servicio
          - Beneficios clave
          - Público objetivo
          - Precios (si están disponibles)
          - Llamado a la acción

          Proporcione un resumen conciso del contenido de la página web en el MISMO IDIOMA que el contenido original, centrándose en la propuesta de valor para los clientes potenciales.`;

          // Send the text to the gpt-4 model
          const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: `${prompt} Contenido de la página web: ${text}` }],
          });

          // Return the analysis
          let analysis = chatCompletion.choices[0]?.message?.content;
          if (analysis) {
            setValue('businessDescription', analysis);
          }
        } catch (error) {
          console.error('Error analyzing product:', error);
          if (error.name === 'RateLimitError' || error.message.includes('429')) {
            setError('businessDescription', {
              type: 'manual',
              message: 'Demasiada información en la URL. Intenta con una URL más pequeña o contacta con soporte.'
            });
          } else {
            setError('businessDescription', {
              type: 'manual',
              message: 'Error al analizar el producto. Por favor, verifica la URL.'
            });
          }
        } finally {
          setIsAnalyzing(false);
        }
      };

      const handleComplete = async (data: AgentConfig) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
          localStorage.setItem(LOCAL_STORAGE_AGENT_CONFIG_KEY, JSON.stringify({
            businessDescription: productUrl,
            agentFunctions: affiliateLink
          }));
          
          if (registrationData) {
            const baserowData = {
              [config.baserowNameColumn]: registrationData.fullName,
              [config.baserowEmailColumn]: registrationData.email,
              [config.baserowWhatsappColumn]: registrationData.whatsapp,
              [config.baserowDescriptionColumn]: productUrl,
              [config.baserowFunctionColumn]: affiliateLink,
              [config.baserowPasswordColumn]: registrationData.password,
            };
            
            const response = await fetch(
              `${config.baserowApiUrl}/api/database/rows/table/${config.baserowTableId}/?user_field_names=true`,
              {
                method: 'POST',
                headers: {
                  'Authorization': `Token ${config.baserowToken}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(baserowData),
              }
            );
            
            if (!response.ok) {
              const errorData = await response.json();
              console.error('Error saving to Baserow:', errorData);
              setError('root', {
                type: 'submitError',
                message: `No se pudo guardar la información en la base de datos. Por favor, intente nuevamente. Status: ${response.status}`
              });
              return;
            }
          } else {
            console.error('No registration data found.');
            setError('root', {
              type: 'submitError',
              message: 'No se pudo guardar la información en la base de datos. Por favor, intente nuevamente.'
            });
            return;
          }

          onComplete(data);
        } catch (error) {
          console.error('Error saving agent config:', error);
          setError('root', {
            type: 'submitError',
            message: 'Error al guardar la configuración. Por favor, intente nuevamente.'
          });
        } finally {
          setIsSubmitting(false);
        }
      };

      return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              Configura tu Agente de Ventas IA
            </h2>
            <Settings className="w-6 h-6 text-gray-600 cursor-pointer" />
          </div>

          <div className="flex justify-between mb-8">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                <Globe className="w-6 h-6" />
              </div>
              <span className={`text-sm ${step === 1 ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>URL del Producto</span>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                <Settings className="w-6 h-6" />
              </div>
              <span className={`text-sm ${step === 2 ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>Link de Afiliado</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-gray-200 text-gray-600">
                <MessageSquare className="w-6 h-6" />
              </div>
              <span className="text-sm text-gray-500">Conectar WhatsApp</span>
            </div>
          </div>

          <form>
            {errors.root && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {errors.root.message}
              </div>
            )}

            {step === 1 && (
              <div>
                <div className="flex items-center mb-4">
                  <h3 className="text-xl font-bold mr-2">URL del Producto</h3>
                  <button
                    type="button"
                    onClick={() => setIsProductInfoModalOpen(true)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  <textarea
                    {...register('businessDescription', { 
                      required: 'Por favor, ingresa la URL del producto' 
                    })}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://hotmart.com/product/..."
                    rows={10}
                  />
                  <button
                    type="button"
                    onClick={() => analyzeProductUrl(productUrl)}
                    disabled={isAnalyzing}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                  >
                    {isAnalyzing ? 'Analizando...' : 'Analizar Producto'}
                  </button>
                </div>
                {errors.businessDescription && (
                  <p className="mt-1 text-red-500">{errors.businessDescription.message}</p>
                )}
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Siguiente Paso
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="flex items-center mb-4">
                  <h3 className="text-xl font-bold mr-2">Link de Afiliado</h3>
                  <button
                    type="button"
                    onClick={() => setIsAffiliateLinkModalOpen(true)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="url"
                  {...register('agentFunctions', {
                    required: 'Por favor, ingresa tu link de afiliado'
                  })}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tu link de afiliado de Hotmart..."
                />
                {errors.agentFunctions && (
                  <p className="mt-1 text-red-500">{errors.agentFunctions.message}</p>
                )}
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit(handleComplete)}
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                  >
                    {isSubmitting ? 'Configurando...' : 'Crear Agente'}
                  </button>
                </div>
              </div>
            )}
          </form>

          <Dialog open={isProductInfoModalOpen} onClose={() => setIsProductInfoModalOpen(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 shadow-xl">
                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Conecta tu Producto Digital
                </Dialog.Title>
                <ul className="list-disc list-inside text-gray-700">
                  <li>Ingresa la URL completa de tu producto en Hotmart</li>
                  <li>Asegúrate que la URL sea pública y accesible</li>
                  <li>La IA analizará automáticamente el producto</li>
                  <li>Se generará una descripción optimizada para ventas</li>
                  <li>Puedes editar la descripción si lo deseas</li>
                </ul>
                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={() => setIsProductInfoModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Entendido
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>

          <Dialog open={isAffiliateLinkModalOpen} onClose={() => setIsAffiliateLinkModalOpen(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 shadow-xl">
                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Configura tu Link de Afiliado
                </Dialog.Title>
                <ul className="list-disc list-inside text-gray-700">
                  <li>Usa tu link de afiliado personalizado de Hotmart</li>
                  <li>Asegúrate de incluir tu ID de afiliado</li>
                  <li>El agente usará este link para todas las ventas</li>
                  <li>Puedes actualizar el link en cualquier momento</li>
                  <li>Todas las conversiones serán rastreadas</li>
                </ul>
                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={() => setIsAffiliateLinkModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Entendido
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </div>
      );
    };
