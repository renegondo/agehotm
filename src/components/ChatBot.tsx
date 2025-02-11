import React, { useState, useEffect, useRef } from 'react';
    import { Send, ArrowLeft, Save, AlertCircle, CheckCircle2, MessageSquare, ThumbsUp, ThumbsDown, HelpCircle } from 'lucide-react';
    import { ChatMessage } from '../types';
    import { useAppConfig } from '../config/AppConfig';
    import OpenAI from 'openai';
    import axios from 'axios';

    const LOCAL_STORAGE_AGENT_CONFIG_KEY = 'agentConfig';

    const SUGGESTED_TESTS = [
      "¿Cuáles son tus horarios de atención?",
      "¿Qué productos/servicios ofrecen?",
      "¿Cuáles son sus precios?",
      "¿Hacen envíos a domicilio?",
      "¿Tienen promociones vigentes?",
    ];

    export const ChatBot: React.FC<{
      businessContext: string;
      agentFunctions: string;
      onEdit: () => void;
    }> = ({ businessContext, agentFunctions, onEdit }) => {
      const [messages, setMessages] = useState<ChatMessage[]>([]);
      const [input, setInput] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const [satisfactionLevel, setSatisfactionLevel] = useState<'satisfied' | 'unsatisfied' | null>(null);
      const [showTestingGuide, setShowTestingGuide] = useState(true);
      const [testingProgress, setTestingProgress] = useState(0);
      const messagesEndRef = useRef<null | HTMLDivElement>(null);
      const { config } = useAppConfig();
      const userEmail = localStorage.getItem('userEmail') || '';

      // Log the businessContext and agentFunctions
      useEffect(() => {
        console.log("Business Context:", businessContext);
        console.log("Agent Functions:", agentFunctions);
      }, [businessContext, agentFunctions]);

      const openai = new OpenAI({
        apiKey: config.openaiApiKey,
        dangerouslyAllowBrowser: true
      });

      const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      };

      useEffect(() => {
        scrollToBottom();
      }, [messages]);

      useEffect(() => {
        // Mostrar mensaje inicial de bienvenida
        if (messages.length === 0) {
          setMessages([{
            role: 'assistant',
            content: '👋 ¡Hola! Soy tu asistente virtual de prueba. Antes de conectarme a WhatsApp, es importante que me pruebes para asegurarte de que respondo exactamente como necesitas. Prueba hacerme diferentes preguntas sobre tu negocio.'
          }]);
        }
      }, []);

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessage: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, newMessage]);
        setInput('');
        setIsLoading(true);
        setTestingProgress(prev => Math.min(prev + 20, 100));

        try {
          // Log the messages being sent to OpenAI
          console.log("Messages being sent to OpenAI:", messages);

          const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: `Eres un agente de ventas AI experto en persuasión y técnicas de venta orgánica para el negocio: ${businessContext}. Tus funciones incluyen: promocionar productos digitales usando tu enlace de afiliado de Hotmart (${agentFunctions}), destacar beneficios, crear urgencia y guiar al cliente hacia la compra. Responde de manera profesional, amigable y persuasiva, usando preguntas abiertas y llamadas a la acción claras. Mantén las respuestas breves (máximo 400 caracteres), con saltos de linea para facilitar la lectura y bullets cuando sea necesarios y adaptadas a WhatsApp. Ejemplo: "¡Hola! ¿Sabías que [producto] puede ayudarte a [beneficio clave]? 🚀 Es perfecto para ti. ¿Quieres más info o el enlace directo para adquirirlo? 😊"`
              },
              ...messages.map(m => ({ role: m.role, content: m.content })),
              { role: "user", content: input }
            ]
          });

          const assistantMessage: ChatMessage = {
            role: 'assistant',
            content: response.choices[0]?.message?.content || 'Lo siento, hubo un error en mi respuesta.'
          };

          setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
          // Log the error in more detail
          console.error('Error al procesar mensaje:', error);
          console.error('Error Details:', error.message, error.stack);
          const errorMessage: ChatMessage = {
            role: 'assistant',
            content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta nuevamente.'
          };
          setMessages(prev => [...prev, errorMessage]);
        } finally {
          setIsLoading(false);
        }
      };

      const handleSaveAgent = () => {
        if (messages.length < 5) {
          alert('Te recomendamos hacer más pruebas antes de conectar el agente a WhatsApp. ¡Es importante asegurarse de que todo funcione perfectamente!');
          return;
        }

        if (!satisfactionLevel) {
          alert('Por favor, indícanos si estás satisfecho con las respuestas del agente antes de continuar.');
          return;
        }

        if (satisfactionLevel === 'unsatisfied') {
          if (window.confirm('Parece que no estás completamente satisfecho con el agente. ¿Deseas volver atrás y ajustar la configuración?')) {
            onEdit();
            return;
          }
        }

        try {
          localStorage.setItem(LOCAL_STORAGE_AGENT_CONFIG_KEY, JSON.stringify({
            businessContext: businessContext,
            agentFunctions,
            userEmail
          }));
          alert('¡Excelente! Tu agente está listo para ser conectado a WhatsApp.');
        } catch (error) {
          console.error('Error saving agent config to local storage:', error);
        }
      };

      const useSuggestedTest = (test: string) => {
        setInput(test);
      };

      return (
        <div className="max-w-4xl mx-auto">
          {showTestingGuide && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    🎯 Guía de Prueba del Agente
                  </h3>
                  <p className="text-blue-700 mb-4">
                    Para garantizar la mejor experiencia, te recomendamos:
                  </p>
                  <ul className="list-disc list-inside text-blue-600 space-y-2 mb-4">
                    <li>Hacer al menos 5 preguntas diferentes</li>
                    <li>Probar escenarios reales de tu negocio</li>
                    <li>Verificar que las respuestas sean precisas</li>
                    <li>Asegurarte que el tono sea adecuado</li>
                  </ul>
                </div>
                <button 
                  onClick={() => setShowTestingGuide(false)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-2 mb-4">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${testingProgress}%` }}
                />
              </div>
              <p className="text-blue-700 text-sm">
                Progreso de prueba: {testingProgress}%
              </p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Prueba tu Agente IA</h2>
                <p className="text-sm text-gray-500">
                  Asegúrate de que todo funcione perfectamente antes de conectarlo a WhatsApp
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onEdit}
                  className="text-blue-600 hover:text-blue-700 transition-colors flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Ajustar Config.
                </button>
                <button
                  onClick={handleSaveAgent}
                  className={`text-white px-4 py-2 rounded-lg flex items-center gap-2 ${
                    satisfactionLevel === 'satisfied' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400'
                  } transition-colors`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Conectar WhatsApp
                </button>
              </div>
            </div>

            <div className="p-4 border-b bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">Prueba estas preguntas comunes:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_TESTS.map((test, index) => (
                  <button
                    key={index}
                    onClick={() => useSuggestedTest(test)}
                    className="text-sm bg-white px-3 py-1 rounded-full border border-gray-300 hover:border-blue-500 hover:text-blue-500 transition-colors"
                  >
                    {test}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-96 overflow-y-auto p-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.role === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="text-center">
                  <div className="animate-pulse">Escribiendo...</div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length > 3 && !satisfactionLevel && (
              <div className="p-4 border-t bg-gray-50">
                <p className="text-sm text-gray-700 mb-2">¿Estás satisfecho con las respuestas del agente?</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setSatisfactionLevel('satisfied')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Sí, funciona bien
                  </button>
                  <button
                    onClick={() => setSatisfactionLevel('unsatisfied')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    Necesita ajustes
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Escribe tu pregunta de prueba..."
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  disabled={isLoading}
                >
                  <Send className="w-4 h-4" />
                  Probar
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    };
