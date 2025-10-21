import { useState, useCallback } from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';

/**
 * Hook personalizado para manejar restricciones de suscripción
 */
export const useSubscriptionRestrictions = () => {
  const { subscriptionInfo, checkFeatureAccess, canCreateCV } = useSubscription();
  const [isRestrictionModalOpen, setIsRestrictionModalOpen] = useState(false);
  const [restrictedFeature, setRestrictedFeature] = useState(null);

  /**
   * Verifica si el usuario puede acceder a una funcionalidad
   */
  const canAccessFeature = useCallback(async (feature) => {
    try {
      const accessInfo = await checkFeatureAccess(feature);
      return accessInfo.allowed;
    } catch (error) {
      console.error(`Error verificando acceso a ${feature}:`, error);
      return false;
    }
  }, [checkFeatureAccess]);

  /**
   * Ejecuta una acción con verificación de suscripción
   */
  const executeWithSubscriptionCheck = useCallback(async (feature, action) => {
    try {
      const canAccess = await canAccessFeature(feature);
      
      if (canAccess) {
        return await action();
      } else {
        // Mostrar modal de restricción
        setRestrictedFeature(feature);
        setIsRestrictionModalOpen(true);
        return null;
      }
    } catch (error) {
      console.error(`Error ejecutando acción para ${feature}:`, error);
      throw error;
    }
  }, [canAccessFeature]);

  /**
   * Verifica si puede crear CV
   */
  const checkCVCreation = useCallback(async () => {
    try {
      const canCreate = await canCreateCV();
      
      if (!canCreate) {
        setRestrictedFeature('cvs');
        setIsRestrictionModalOpen(true);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error verificando creación de CV:', error);
      return false;
    }
  }, [canCreateCV]);

  /**
   * Cierra el modal de restricción
   */
  const closeRestrictionModal = useCallback(() => {
    setIsRestrictionModalOpen(false);
    setRestrictedFeature(null);
  }, []);

  /**
   * Obtiene información de límites de CV
   */
  const getCVLimits = useCallback(() => {
    if (!subscriptionInfo) return null;
    
    return {
      current: subscriptionInfo.cv_count || 0,
      max: subscriptionInfo.max_cvs || 1,
      canCreate: subscriptionInfo.can_create_cv || false,
      tier: subscriptionInfo.tier || 'free'
    };
  }, [subscriptionInfo]);

  /**
   * Obtiene mensaje de límite de CV
   */
  const getCVLimitMessage = useCallback(() => {
    const limits = getCVLimits();
    if (!limits) return '';

    if (limits.canCreate) {
      return `Puedes crear ${limits.max - limits.current} CV(s) más`;
    }

    const messages = {
      free: 'Has alcanzado el límite del plan gratuito (1 CV). ¡Actualiza a PRO para crear hasta 5 CVs!',
      pro: 'Has alcanzado el límite del plan PRO (5 CVs). ¡Actualiza a PREMIUM para más funcionalidades!',
      premium: 'Has alcanzado el límite de CVs permitidos'
    };

    return messages[limits.tier] || 'Has alcanzado el límite de CVs';
  }, [getCVLimits]);

  /**
   * Verifica si una funcionalidad está disponible según el tier actual
   */
  const isFeatureAvailable = useCallback((feature) => {
    if (!subscriptionInfo) return false;

    const tier = subscriptionInfo.tier || 'free';
    const limits = subscriptionInfo.limits || {};

    switch (feature) {
      case 'templates':
        return limits.can_access_templates || false;
      case 'profile_analysis':
        return limits.can_access_profile_analysis || false;
      case 'salary_estimation':
        return limits.can_access_salary_estimation || false;
      case 'course_recommendations':
        return limits.can_access_course_recommendations || false;
      case 'export_pdf':
        return limits.can_export_pdf || false;
      case 'import_linkedin':
        return limits.can_import_linkedin || false;
      default:
        return false;
    }
  }, [subscriptionInfo]);

  /**
   * Obtiene el tier mínimo requerido para una funcionalidad
   */
  const getRequiredTier = useCallback((feature) => {
    const tierRequirements = {
      templates: 'pro',
      profile_analysis: 'free', // Ahora FREE puede hacer análisis
      salary_estimation: 'premium',
      course_recommendations: 'premium',
      export_pdf: 'free', // Ahora FREE puede exportar PDF
      import_linkedin: 'pro',
      cvs: 'free' // Todos pueden crear CVs, pero con límites diferentes
    };

    return tierRequirements[feature] || 'free';
  }, []);

  /**
   * Verifica si el usuario necesita actualizar para acceder a una funcionalidad
   */
  const needsUpgrade = useCallback((feature) => {
    if (!subscriptionInfo) return true;

    const currentTier = subscriptionInfo.tier || 'free';
    const requiredTier = getRequiredTier(feature);

    const tierLevels = { free: 0, pro: 1, premium: 2 };
    return tierLevels[currentTier] < tierLevels[requiredTier];
  }, [subscriptionInfo, getRequiredTier]);

  return {
    // Estado
    subscriptionInfo,
    isRestrictionModalOpen,
    restrictedFeature,
    setRestrictedFeature,
    setIsRestrictionModalOpen,
    
    // Acciones
    executeWithSubscriptionCheck,
    checkCVCreation,
    closeRestrictionModal,
    
    // Utilidades
    canAccessFeature,
    getCVLimits,
    getCVLimitMessage,
    isFeatureAvailable,
    getRequiredTier,
    needsUpgrade
  };
};

export default useSubscriptionRestrictions;
