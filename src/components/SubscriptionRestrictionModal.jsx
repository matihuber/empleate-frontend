import React from 'react';
import { AlertTriangle, Crown, Zap, Star, Linkedin } from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';

const SubscriptionRestrictionModal = ({ 
  isOpen, 
  onClose, 
  feature, 
  title = "Funcionalidad no disponible",
  showUpgradeButton = true 
}) => {
  const { subscriptionInfo, getUpgradeMessage, getSubscriptionPlans } = useSubscription();

  if (!isOpen) return null;

  const currentTier = subscriptionInfo?.tier || 'free';
  const upgradeMessage = getUpgradeMessage(currentTier, feature);
  const plans = getSubscriptionPlans();

  const getFeatureIcon = (feature) => {
    switch (feature) {
      case 'templates':
        return <Crown className="w-8 h-8 text-yellow-500" />;
      case 'profile_analysis':
        return <Zap className="w-8 h-8 text-blue-500" />;
      case 'salary_estimation':
        return <Star className="w-8 h-8 text-green-500" />;
      case 'course_recommendations':
        return <Star className="w-8 h-8 text-purple-500" />;
      case 'export_pdf':
        return <Zap className="w-8 h-8 text-orange-500" />;
      case 'import_linkedin':
        return <Linkedin className="w-8 h-8 text-blue-600" />;
      case 'cvs':
        return <Crown className="w-8 h-8 text-indigo-500" />;
      default:
        return <AlertTriangle className="w-8 h-8 text-red-500" />;
    }
  };

  const getFeatureName = (feature) => {
    const names = {
      templates: 'Templates Avanzados',
      profile_analysis: 'Análisis de Perfil Profesional',
      salary_estimation: 'Estimación Salarial',
      course_recommendations: 'Recomendaciones de Cursos',
      export_pdf: 'Exportación a PDF',
      import_linkedin: 'Importación de LinkedIn',
      cvs: 'Creación de CVs'
    };
    return names[feature] || feature;
  };

  const getRecommendedPlan = (feature) => {
    if (feature === 'salary_estimation' || feature === 'course_recommendations') {
      return 'premium';
    }
    return 'pro';
  };

  const recommendedPlan = getRecommendedPlan(feature);
  const planInfo = plans[recommendedPlan];

  return (
    <div className="fixed inset-0 backdrop-brightness-75 backdrop-saturate-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getFeatureIcon(feature)}
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          <div className="text-center mb-4">
            <p className="text-gray-600 mb-3">
              {getFeatureName(feature)} no está disponible en tu plan actual.
            </p>
            <p className="text-sm text-gray-500">
              {upgradeMessage}
            </p>
          </div>

          {/* Plan Recommendation */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 mb-4">
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-2">
                Plan Recomendado: {planInfo.name}
              </h4>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                ${planInfo.price}/mes
              </div>
              <ul className="text-sm text-gray-600 space-y-0.5">
                {planInfo.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Features Comparison */}
          <div className="mb-4">
            <h5 className="font-medium text-gray-900 mb-3">¿Qué incluye {planInfo.name}?</h5>
            <ul className="space-y-1">
              {planInfo.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-3">
            {showUpgradeButton && (
              <button
                onClick={() => {
                  // Aquí se implementaría la lógica de actualización
                  console.log(`Upgrade to ${recommendedPlan}`);
                  onClose();
                }}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Actualizar a {planInfo.name}
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionRestrictionModal;
