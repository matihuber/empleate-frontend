import { ChevronLeft, Check, X } from 'lucide-react'
import { useState } from 'react'
import SubscriptionHistory from './SubscriptionHistory'

const Subscription = ({ onBack }) => {
  const [showHistory, setShowHistory] = useState(false)

  // Si está mostrando el historial, renderizar ese componente
  if (showHistory) {
    return <SubscriptionHistory onBack={() => setShowHistory(false)} />
  }

  const plans = [
    {
      name: 'Gratuito',
      price: '$0',
      description: 'Funcionalidades básicas para comenzar',
      current: true,
      features: [
        { text: 'Generación de 1 CV único', included: true },
        { text: 'Acceso a 1 template básico', included: true },
        { text: 'Análisis del perfil profesional de LinkedIn', included: false },
        { text: 'CVs optimizados para superar filtros ATS', included: false },
        { text: 'Estimación salarial', included: false },
        { text: 'Recomendaciones de cursos', included: false }
      ]
    },
    {
      name: 'Pro',
      price: '$6.99',
      period: '/mes',
      description: 'CVs profesionales optimizados con IA',
      features: [
        { text: 'Generar hasta 5 CVs por mes', included: true },
        { text: 'Acceso a todos los templates disponibles', included: true },
        { text: 'Análisis del perfil profesional de LinkedIn', included: true },
        { text: 'CVs optimizados para superar filtros ATS', included: true },
        { text: 'Estimación salarial', included: false },
        { text: 'Recomendaciones de cursos', included: false }
      ],
      buttonText: 'Obtener Pro',
      buttonClass: 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
    },
    {
      name: 'Premium',
      price: '$11.99',
      period: '/mes',
      description: 'Acceso completo a todas las funcionalidades',
      features: [
        { text: 'Generar hasta 100 CVs por mes', included: true },
        { text: 'Acceso a todos los templates disponibles', included: true },
        { text: 'Análisis del perfil profesional de LinkedIn', included: true },
        { text: 'CVs optimizados para superar filtros ATS', included: true },
        { text: 'Estimación salarial', included: true },
        { text: 'Recomendaciones de cursos personalizados', included: true }
      ],
      buttonText: 'Obtener Premium',
      buttonClass: 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
    }
  ]

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
          Suscripción
        </h1>
      </div>

      {/* Planes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <div 
            key={plan.name} 
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-md"
          >
            
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{plan.name}</h3>
            
            <div className="mb-4">
              <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
              {plan.period && <span className="text-gray-600">{plan.period}</span>}
            </div>
            
            <p className="text-sm text-gray-600 mb-6">{plan.description}</p>
            
            <button 
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors mb-6 ${
                plan.current 
                  ? 'bg-gray-600 text-white cursor-default' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
              }`}
              disabled={plan.current}
            >
              {plan.current ? 'Tu plan actual' : plan.buttonText}
            </button>
            
            <ul className="space-y-3">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  {feature.included ? (
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  ) : (
                    <X className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  )}
                  <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-500'}`}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Enlaces inferiores */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span className="text-sm font-medium">Volver</span>
        </button>
        
        <div className="flex items-center space-x-4 text-sm">
          <button 
            className="text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Gestionar suscripción
          </button>
          <button 
            onClick={() => setShowHistory(true)}
            className="text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Ver historial de facturación
          </button>
        </div>
      </div>
    </div>
  )
}

export default Subscription