import React, { useState } from 'react';
import { Crown, Zap, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';

const SubscriptionInfo = ({ showDetails = false }) => {
  const { subscriptionInfo, isLoading } = useSubscription();
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading || !subscriptionInfo) {
    return (
      <div className="bg-gray-100 rounded-lg p-3 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  const { tier, cv_count, max_cvs, can_create_cv } = subscriptionInfo;

  const getTierInfo = (tier) => {
    const tierInfo = {
      free: {
        name: 'Gratuito',
        icon: <Crown className="w-4 h-4 text-gray-500" />,
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        borderColor: 'border-gray-200'
      },
      pro: {
        name: 'PRO',
        icon: <Zap className="w-4 h-4 text-blue-500" />,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      },
      premium: {
        name: 'PREMIUM',
        icon: <Star className="w-4 h-4 text-purple-500" />,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
      }
    };
    return tierInfo[tier] || tierInfo.free;
  };

  const tierInfo = getTierInfo(tier);

  const getProgressPercentage = () => {
    if (max_cvs === 0) return 0;
    if (max_cvs === null || max_cvs === "Ilimitado") return 0; // No mostrar barra para ilimitado
    return Math.min((cv_count / max_cvs) * 100, 100);
  };

  const getProgressColor = () => {
    const percentage = getProgressPercentage();
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={`rounded-lg border ${tierInfo.borderColor} ${tierInfo.bgColor} p-3`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {tierInfo.icon}
          <span className={`font-medium ${tierInfo.color}`}>
            Plan {tierInfo.name}
          </span>
        </div>
        
        {showDetails && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* CV Usage */}
      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">CVs creados</span>
          <span className={`font-medium ${tierInfo.color}`}>
            {max_cvs === null || max_cvs === "Ilimitado" ? `${cv_count} (Ilimitado)` : `${cv_count}/${max_cvs}`}
          </span>
        </div>
        
        {/* Progress Bar - Solo mostrar si no es ilimitado */}
        {max_cvs !== null && max_cvs !== "Ilimitado" && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        )}
        
        {!can_create_cv && max_cvs !== "Ilimitado" && (
          <p className="text-xs text-red-600 mt-1">
            Límite alcanzado
          </p>
        )}
        
        {max_cvs === "Ilimitado" && (
          <p className="text-xs text-green-600 mt-1">
            CVs ilimitados disponibles
          </p>
        )}
      </div>

      {/* Expanded Details */}
      {isExpanded && showDetails && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Templates avanzados</span>
              <span className={tierInfo.color}>
                {tier === 'free' ? '❌' : '✅'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Análisis de perfil</span>
              <span className={tierInfo.color}>
                ✅
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Importar LinkedIn</span>
              <span className={tierInfo.color}>
                {tier === 'free' ? '❌' : '✅'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Exportar PDF</span>
              <span className={tierInfo.color}>
                ✅
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estimación salarial</span>
              <span className={tierInfo.color}>
                {tier === 'premium' ? '✅' : '❌'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Recomendaciones</span>
              <span className={tierInfo.color}>
                {tier === 'premium' ? '✅' : '❌'}
              </span>
            </div>
          </div>
          
          {tier !== 'premium' && (
            <button className="w-full mt-3 bg-blue-600 text-white text-sm py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors">
              Actualizar Plan
            </button>
          )}
        </div>
      )}

      {/* Upgrade Message */}
      {!can_create_cv && tier === 'free' && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
          ¡Actualiza a PRO para crear hasta 5 CVs!
        </div>
      )}
      {!can_create_cv && tier === 'pro' && (
        <div className="mt-2 p-2 bg-purple-50 border border-purple-200 rounded text-xs text-purple-800">
          ¡Actualiza a PREMIUM para CVs ilimitados!
        </div>
      )}
    </div>
  );
};

export default SubscriptionInfo;
