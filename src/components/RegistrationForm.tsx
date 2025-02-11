import React, { useState } from 'react';
    import { useForm } from 'react-hook-form';
    import { UserRegistration } from '../types';
    import { useAppConfig } from '../config/AppConfig';
    import axios from 'axios';
    import { Listbox } from '@headlessui/react';
    import { ChevronDown, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

    const countryCodes = [
      { name: 'México', code: '+52', flag: '🇲🇽' },
      { name: 'Estados Unidos', code: '+1', flag: '🇺🇸' },
      { name: 'España', code: '+34', flag: '🇪🇸' },
      { name: 'Colombia', code: '+57', flag: '🇨🇴' },
      { name: 'Argentina', code: '+54', flag: '🇦🇷' },
      { name: 'Chile', code: '+56', flag: '🇨🇱' },
      { name: 'Perú', code: '+51', flag: '🇵🇪' },
      // Mantener los más relevantes primero
    ];

    export const RegistrationForm: React.FC<{
      onSuccess: (email: string) => void;
    }> = ({ onSuccess }) => {
      const { config } = useAppConfig();
      const { register, handleSubmit, formState: { errors }, setError, watch } = useForm<UserRegistration>();
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
      const [currentStep, setCurrentStep] = useState(1);
      const whatsapp = watch('whatsapp');
      const password = watch('password'); // Get the password value

      const steps = [
        {
          title: '1. Datos Básicos',
          description: 'Comienza con tu información personal'
        },
        {
          title: '2. Configuración del Agente',
          description: 'Personaliza tu asistente virtual'
        },
        {
          title: '3. Conexión WhatsApp',
          description: 'Vincula tu número de WhatsApp'
        }
      ];

      const onSubmit = async (data: UserRegistration) => {
        if (!config.registrationWebhook) {
          setError('root', {
            type: 'submitError',
            message: 'Error de configuración: El webhook de registro no está configurado.'
          });
          return;
        }

        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
          // Enviar los datos al webhook, incluyendo la contraseña
          await axios.post(config.registrationWebhook, {
            ...data, // Incluye todos los campos del formulario (fullName, email, whatsapp)
            whatsapp: `${selectedCountry.code}${data.whatsapp}`, // Formatea el número de WhatsApp
            password: password, // Enviar la contraseña
          });
          localStorage.setItem('userRegistration', JSON.stringify(data));
          onSuccess(data.email);
        } catch (error) {
          console.error('Error al registrar:', error);
          setError('root', {
            type: 'submitError',
            message: 'No se pudo completar el registro. Por favor, intente nuevamente.'
          });
        } finally {
          setIsSubmitting(false);
        }
      };

      return (
        <div className="max-w-4xl mx-auto p-6">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between mb-4">
              {steps.map((step, index) => (
                <div key={index} className="flex-1">
                  <div className={`relative flex items-center justify-center ${
                    index < currentStep ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 
                      ${index < currentStep ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}
                      ${index === currentStep - 1 ? 'animate-pulse' : ''}`}>
                      {index < currentStep ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <span className="text-lg font-semibold">{index + 1}</span>
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`absolute left-1/2 w-full h-0.5 top-5 -z-10 
                        ${index < currentStep - 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                    )}
                  </div>
                  <div className="text-center mt-2">
                    <p className={`font-medium ${index === currentStep - 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                    <p className="text-sm text-gray-500 hidden md:block">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Crea tu Asistente Virtual IA</h2>
              <p className="text-gray-600 mt-2">
                En menos de 5 minutos tendrás tu propio agente de ventas trabajando 24/7
              </p>
            </div>

            {errors.root && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                <p>{errors.root.message}</p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Nombre Completo
                  <span className="text-blue-600 ml-1">*</span>
                </label>
                <input
                  {...register('fullName', { 
                    required: 'Por favor, ingresa tu nombre completo' 
                  })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ej: Juan Pérez"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Correo Electrónico
                  <span className="text-blue-600 ml-1">*</span>
                </label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'El email es requerido',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Por favor ingresa un email válido'
                    }
                  })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="tu@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Contraseña
                  <span className="text-blue-600 ml-1">*</span>
                </label>
                <input
                  type="password"
                  {...register('password', { 
                    required: 'La contraseña es requerida',
                    minLength: {
                      value: 8,
                      message: 'La contraseña debe tener al menos 8 caracteres'
                    },
                    pattern: {
                      value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                      message: 'La contraseña debe contener al menos una letra y un número'
                    }
                  })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ingresa tu contraseña"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  WhatsApp
                  <span className="text-blue-600 ml-1">*</span>
                </label>
                <div className="flex">
                  <Listbox value={selectedCountry} onChange={setSelectedCountry}>
                    <div className="relative">
                      <Listbox.Button className="relative w-32 py-3 pl-3 pr-10 border border-gray-300 rounded-l-lg text-left cursor-default focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                        <span className="flex items-center">
                          <span className="text-xl mr-2">{selectedCountry.flag}</span>
                          <span className="text-gray-900">{selectedCountry.code}</span>
                        </span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none">
                        {countryCodes.map((country) => (
                          <Listbox.Option
                            key={country.code}
                            value={country}
                            className={({ active }) =>
                              `cursor-default select-none relative py-2 pl-3 pr-9 ${
                                active ? 'text-blue-900 bg-blue-100' : 'text-gray-900'
                              }`
                            }
                          >
                            {({ selected, active }) => (
                              <div className="flex items-center">
                                <span className="text-xl mr-2">{country.flag}</span>
                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                  {country.name}
                                </span>
                                {selected && (
                                  <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                  </span>
                                )}
                              </div>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                  <input
                    type="tel"
                    {...register('whatsapp', { 
                      required: 'El número de WhatsApp es requerido',
                      pattern: {
                        value: /^[0-9]+$/,
                        message: 'Por favor, ingresa solo números'
                      }
                    })}
                    className="flex-1 px-4 py-3 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Número sin espacios ni guiones"
                  />
                </div>
                {errors.whatsapp && (
                  <p className="mt-1 text-sm text-red-600">{errors.whatsapp.message}</p>
                )}
              </div>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 
                  transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Crear mi Asistente Virtual
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </span>
                )}
              </button>
              <p className="text-center text-sm text-gray-500 mt-4">
                Al registrarte, aceptas nuestros términos y condiciones
              </p>
            </div>
          </form>

          {/* Features Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Configuración Simple</h3>
              <p className="text-gray-600">
                Sin conocimientos técnicos necesarios. Configura tu agente en minutos.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Prueba Gratuita</h3>
              <p className="text-gray-600">
                24 horas para probar todas las funciones sin compromiso.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Soporte 24/7</h3>
              <p className="text-gray-600">
                Asistencia personalizada cuando la necesites.
              </p>
            </div>
          </div>
        </div>
      );
    };
