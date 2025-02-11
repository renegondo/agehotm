import React from 'react';
import { ShoppingBag, MessageSquare, TrendingUp, Users, Globe, DollarSign } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-gray-50 p-8 rounded-xl shadow-lg mb-16">
          <h3 className="text-2xl font-bold mb-4 text-center">
            Prueba Gratuita 24 Horas
          </h3>
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="text-center">
              <Globe className="w-10 h-10 text-blue-600 mx-auto mb-2" />
              <span className="block font-semibold">Ventas Automatizadas 24/7</span>
              <p className="text-gray-600 text-sm">Tu agente IA nunca duerme.</p>
            </div>
            <div className="text-center">
              <MessageSquare className="w-10 h-10 text-blue-600 mx-auto mb-2" />
              <span className="block font-semibold">Conversaciones Personalizadas</span>
              <p className="text-gray-600 text-sm">Adaptadas a cada cliente potencial.</p>
            </div>
            <div className="text-center">
              <DollarSign className="w-10 h-10 text-blue-600 mx-auto mb-2" />
              <span className="block font-semibold">Más Comisiones</span>
              <p className="text-gray-600 text-sm">Incrementa tus ingresos como afiliado.</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <button onClick={() => scrollToSection('registro')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Comenzar Prueba Gratuita
            </button>
          </div>
        </div>

        <div className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Afiliados Exitosos
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Carlos Méndez",
                  role: "Top Afiliado Hotmart",
                  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80",
                  quote: "Mis ventas se triplicaron desde que uso el asistente IA. La automatización es clave."
                },
                {
                  name: "Ana Martínez",
                  role: "Afiliada Platinum",
                  image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80",
                  quote: "El agente convierte visitantes en compradores 24/7. ¡Es increíble!"
                },
                {
                  name: "Roberto Silva",
                  role: "Productor Digital",
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80",
                  quote: "La mejor inversión para mi negocio de afiliados. Resultados desde el día uno."
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-blue-600 py-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¡Comienza a Vender Más!
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              24 horas gratis y luego solo $9.19 USD/mes
            </p>
            <button onClick={() => scrollToSection('demo')}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors">
              Activar mi Agente IA
            </button>
            <p className="text-blue-200 mt-4">Sin tarjeta de crédito • Cancela cuando quieras</p>
          </div>
        </div>
      </div>
    </div>
  );
};
