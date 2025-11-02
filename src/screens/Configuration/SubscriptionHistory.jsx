import { ChevronLeft } from 'lucide-react'

const SubscriptionHistory = ({ onBack }) => {
  // Mock data - ordenado del más reciente al más antiguo
  const subscriptionHistory = [
    {
      id: 5,
      plan: 'Pro',
      date: '10/10/2025',
      price: '$6.99'
    },
    {
      id: 4,
      plan: 'Pro',
      date: '06/09/2025',
      price: '$6.99'
    },
    {
      id: 3,
      plan: 'Pro',
      date: '03/08/2025',
      price: '$6.99'
    },
    {
      id: 2,
      plan: 'Premium',
      date: '07/07/2025',
      price: '$11.99'
    },
    {
      id: 1,
      plan: 'Premium',
      date: '05/06/2025',
      price: '$11.99'
    }
  ]

  const getPlanColor = (plan) => {
    switch(plan) {
      case 'Premium':
        return 'text-blue-500'
      case 'Pro':
        return 'text-yellow-600'
      case 'Gratuito':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
          Historial de facturación
        </h1>
      </div>

      {/* Lista de suscripciones */}
      <div className="flex-1 space-y-4">
        {subscriptionHistory.map((subscription) => (
          <div 
            key={subscription.id}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex items-center justify-between"
          >
            <span className={`text-xl font-semibold ${getPlanColor(subscription.plan)} w-32`}>
              {subscription.plan}
            </span>
            
            <span className="text-gray-600 flex-1 text-center">
              {subscription.date}
            </span>
            
            <span className="text-lg font-semibold text-gray-800 w-32 text-right">
              {subscription.price}
            </span>
          </div>
        ))}
      </div>

      {/* Botón volver */}
      <div className="mt-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span className="text-sm font-medium">Volver</span>
        </button>
      </div>
    </div>
  )
}

export default SubscriptionHistory