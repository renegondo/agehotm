import React, { useState, useEffect } from 'react';
    import { Check, Star, TrendingUp, Clock, MessageSquare, Shield, DollarSign, Zap, Award } from 'lucide-react';

    export const ThankYouPage: React.FC = () => {
      const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds

      useEffect(() => {
        const intervalId = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime <= 0) {
              clearInterval(intervalId);
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);

        return () => clearInterval(intervalId);
      }, []);

      const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      };

      const handlePremiumClick = () => {
        window.open("https://buy.stripe.com/7sIaH9fft3M1aoE8wz", "_blank");
      };

      return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
          {/* Hero Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 mb-8">
                <Check className="w-5 h-5 mr-2" />
                ¡Tu agente IA está siendo configurado!
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                ¡Gracias por Unirte a la Revolución de la IA!
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Tu prueba gratuita de 24 horas ha comenzado. Pronto experimentarás cómo la IA transforma tu negocio.
              </p>
            </div>

            {/* Timer Banner */}
            <div className="bg-blue-600 text-white py-6 px-4 rounded-xl mb-16">
              <p className="text-lg mb-2">Tu prueba gratuita expira en:</p>
              <div className="text-4xl font-bold">{formatTime(timeLeft)}</div>
            </div>

            {/* Value Proposition */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: TrendingUp,
                  title: "Aumenta tus Ventas 3x",
                  description: "Nuestros clientes reportan un incremento promedio del 300% en conversiones"
                },
                {
                  icon: Clock,
                  title: "Ahorra 120+ Horas/Mes",
                  description: "Automatiza las respuestas y dedica tiempo a lo que realmente importa"
                },
                {
                  icon: MessageSquare,
                  title: "0% Clientes Perdidos",
                  description: "Respuestas instantáneas 24/7 significa que nunca más perderás una venta"
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Social Proof */}
            <div className="mb-16">
              <div className="flex justify-center items-center gap-2 mb-6">
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
                <span className="text-lg font-semibold ml-2">4.9/5 de satisfacción</span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {[
                  {
                    name: "Carlos Rodríguez",
                    business: "Restaurante El Sabor",
                    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&q=80",
                    quote: "Incrementamos nuestros pedidos en un 280% el primer mes. ¡Increíble!"
                  },
                  {
                    name: "Ana Martínez",
                    business: "Boutique Elegance",
                    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80",
                    quote: "De perder ventas por no contestar a tiempo a vender 24/7. La mejor inversión."
                  },
                  {
                    name: "Miguel Torres",
                    business: "Clínica Dental Sonrisas",
                    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80",
                    quote: "Duplicamos las citas mensuales gracias al agente IA. Simplemente funciona."
                  }
                ].map((testimonial, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.business}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Offer */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white max-w-4xl mx-auto mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white text-blue-600 mb-6">
                <Zap className="w-5 h-5 mr-2" />
                Oferta Especial de Lanzamiento
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                ¡Desbloquea Todo el Poder de la IA por Solo $9.19 USD/mes!
              </h2>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Lo que Obtienes:</h3>
                  <ul className="space-y-3">
                    {[
                      "Respuestas ilimitadas 24/7",
                      "Soporte prioritario",
                      "Actualizaciones premium"
                    ].map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-400" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col justify-center items-center bg-white/10 rounded-xl p-6">
                  <div className="text-5xl font-bold mb-2">$9.19</div>
                  <div className="text-lg mb-6">USD/mes</div>
                  <button onClick={handlePremiumClick} className="w-full bg-white text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    Activar Suscripción Premium
                  </button>
                  <p className="mt-4 text-sm opacity-90">Cancela cuando quieras · Sin compromisos</p>
                </div>
              </div>
            </div>

            {/* Final CTA */}
            <div className="max-w-3xl mx-auto text-center mb-20">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                No Dejes que tu Competencia te Gane en la Era Digital
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Cada minuto que pasa sin un agente IA es una oportunidad perdida. 
                Únete a los negocios que ya están aprovechando el futuro.
              </p>
              <button onClick={handlePremiumClick} className="bg-blue-600 text-white py-4 px-8 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
                Comenzar con Premium Ahora
              </button>
              <p className="mt-4 text-sm text-gray-500">
                100% garantía de satisfacción · Soporte 24/7 · Configuración instantánea
              </p>
            </div>
          </div>
        </div>
      );
    };
