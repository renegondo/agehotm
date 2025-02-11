import React, { useState, useEffect, useRef } from 'react';
    import { Hero } from './components/Hero';
    import { RegistrationForm } from './components/RegistrationForm';
    import { AgentBuilder } from './components/AgentBuilder';
    import { ChatBot } from './components/ChatBot';
    import { WhatsAppModal } from './components/WhatsAppModal';
    import { ThankYouPage } from './components/ThankYouPage';
    import { AppConfigProvider } from './config/AppConfig';
    import { AuthProvider } from './context/AuthContext';
    import { LoginForm } from './components/ClientArea/LoginForm';
    import { Dashboard } from './components/ClientArea/Dashboard';
    import { AdminButton } from './components/AdminButton';
    import { ClientAreaButton } from './components/ClientAreaButton';
    import { AgentConfig } from './types';
    import { Footer } from './components/Footer';
    import { useAuth } from './context/AuthContext';

    const ClientArea: React.FC = () => {
      const { isAuthenticated } = useAuth();
      return isAuthenticated ? <Dashboard /> : <LoginForm />;
    };

    function App() {
      const [isRegistered, setIsRegistered] = useState(false);
      const [userEmail, setUserEmail] = useState('');
      const [agentConfig, setAgentConfig] = useState<AgentConfig | null>(null);
      const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
      const [showThankYou, setShowThankYou] = useState(false);
      const [showClientArea, setShowClientArea] = useState(false);
      const appRef = useRef<HTMLDivElement>(null);

      const handleRegistrationSuccess = (email: string) => {
        setIsRegistered(true);
        setUserEmail(email);
        localStorage.setItem('userEmail', email);
      };

      const handleAgentConfigChange = (config: AgentConfig) => {
        setAgentConfig(config);
      };

      const handleWhatsAppModalClose = () => {
        setIsWhatsAppModalOpen(false);
        setShowThankYou(true);
        // Scroll to the top of the app
        if (appRef.current) {
          appRef.current.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        } else {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }
      };

      useEffect(() => {
        const path = window.location.pathname;
        setShowClientArea(path === '/cliente');
      }, []);

      return (
        <AppConfigProvider>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50" ref={appRef}>
              {/* Navigation Bar */}
              <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-16">
                    <div>
                      <AdminButton />
                    </div>
                    <div>
                      <ClientAreaButton />
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content with top padding to account for fixed nav */}
              <div className="pt-16">
                {showClientArea ? (
                  <ClientArea />
                ) : showThankYou ? (
                  <ThankYouPage />
                ) : (
                  <>
                    <Hero />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                      {!isRegistered ? (
                        <RegistrationForm onSuccess={handleRegistrationSuccess} />
                      ) : !agentConfig ? (
                        <AgentBuilder onComplete={handleAgentConfigChange} />
                      ) : (
                        <div className="space-y-8">
                          <ChatBot
                            businessContext={agentConfig.businessDescription}
                            agentFunctions={agentConfig.agentFunctions}
                            onEdit={() => setAgentConfig(null)}
                          />
                          
                          <div className="text-center">
                            <button
                              onClick={() => setIsWhatsAppModalOpen(true)}
                              className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors"
                            >
                              Conectar a WhatsApp
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <WhatsAppModal
                      isOpen={isWhatsAppModalOpen}
                      onClose={handleWhatsAppModalClose}
                      userEmail={userEmail}
                      agentConfig={agentConfig}
                    />
                    {agentConfig && (
                      <div className="text-center mt-8">
                        <p className="text-gray-600">
                          Esta es una prueba de 24 horas. Si deseas la versión completa, contáctanos.
                        </p>
                      </div>
                    )}
                    <Footer />
                  </>
                )}
              </div>
            </div>
          </AuthProvider>
        </AppConfigProvider>
      );
    }

    export default App;
