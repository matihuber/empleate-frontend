import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import subscriptionService from '../services/subscriptionService';

// Estados de suscripción
const SUBSCRIPTION_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error'
};

// Acciones del reducer
const SUBSCRIPTION_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_SUBSCRIPTION_INFO: 'SET_SUBSCRIPTION_INFO',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_CV_COUNT: 'UPDATE_CV_COUNT'
};

// Estado inicial
const initialState = {
  subscriptionInfo: null,
  subscriptionState: SUBSCRIPTION_STATES.IDLE,
  error: null,
  isLoading: false
};

// Reducer para manejar el estado
function subscriptionReducer(state, action) {
  switch (action.type) {
    case SUBSCRIPTION_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        subscriptionState: action.payload ? SUBSCRIPTION_STATES.LOADING : SUBSCRIPTION_STATES.LOADED
      };
    
    case SUBSCRIPTION_ACTIONS.SET_SUBSCRIPTION_INFO:
      return {
        ...state,
        subscriptionInfo: action.payload,
        subscriptionState: SUBSCRIPTION_STATES.LOADED,
        error: null,
        isLoading: false
      };
    
    case SUBSCRIPTION_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        subscriptionState: SUBSCRIPTION_STATES.ERROR,
        isLoading: false
      };
    
    case SUBSCRIPTION_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
        subscriptionState: SUBSCRIPTION_STATES.LOADED
      };
    
    case SUBSCRIPTION_ACTIONS.UPDATE_CV_COUNT:
      return {
        ...state,
        subscriptionInfo: {
          ...state.subscriptionInfo,
          cv_count: action.payload
        }
      };
    
    default:
      return state;
  }
}

// Crear el contexto
const SubscriptionContext = createContext();

// Hook personalizado para usar el contexto
export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription debe ser usado dentro de un SubscriptionProvider');
  }
  return context;
};

// Proveedor del contexto
export const SubscriptionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(subscriptionReducer, initialState);

  // Cargar información de suscripción
  const loadSubscriptionInfo = useCallback(async () => {
    try {
      dispatch({ type: SUBSCRIPTION_ACTIONS.SET_LOADING, payload: true });
      
        // Primero intentar cargar desde localStorage
        const storedInfo = localStorage.getItem('empleate_subscription_info');
        
        if (storedInfo) {
          const subscriptionInfo = JSON.parse(storedInfo);
          dispatch({ type: SUBSCRIPTION_ACTIONS.SET_SUBSCRIPTION_INFO, payload: subscriptionInfo });
          return;
        }
      
      // Fallback: crear información de suscripción por defecto (FREE)
      const fallbackInfo = {
        tier: 'free',
        limits: {
          max_cvs: 1,
          can_access_templates: false,
          can_access_profile_analysis: true,
          can_access_salary_estimation: false,
          can_access_course_recommendations: false,
          can_export_pdf: true,
          can_import_linkedin: false
        },
        cv_count: 0,
        max_cvs: 1,
        can_create_cv: true,
        upgrade_message: null
      };
      
        dispatch({ type: SUBSCRIPTION_ACTIONS.SET_SUBSCRIPTION_INFO, payload: fallbackInfo });
      
    } catch (error) {
      console.error('Error cargando información de suscripción:', error);
      
      // Fallback: crear información de suscripción por defecto (FREE)
      const fallbackInfo = {
        tier: 'free',
        limits: {
          max_cvs: 1,
          can_access_templates: false,
          can_access_profile_analysis: true,
          can_access_salary_estimation: false,
          can_access_course_recommendations: false,
          can_export_pdf: true,
          can_import_linkedin: false
        },
        cv_count: 0,
        max_cvs: 1,
        can_create_cv: true,
        upgrade_message: null
      };
      
        dispatch({ type: SUBSCRIPTION_ACTIONS.SET_SUBSCRIPTION_INFO, payload: fallbackInfo });
      dispatch({ type: SUBSCRIPTION_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, []);

  // Actualizar información de suscripción (llamada desde AuthContext después del login)
  const updateSubscriptionInfo = useCallback(async (userId) => {
    try {
      
      // Usar endpoint de prueba para obtener información actualizada
      const subscriptionInfo = await subscriptionService.getSubscriptionInfoTest(userId);
      
      // Actualizar el estado
      dispatch({ type: SUBSCRIPTION_ACTIONS.SET_SUBSCRIPTION_INFO, payload: subscriptionInfo });
      
      // Guardar en localStorage
      localStorage.setItem('empleate_subscription_info', JSON.stringify(subscriptionInfo));
      
      return subscriptionInfo;
    } catch (error) {
      console.error('SubscriptionContext: Error actualizando información de suscripción:', error);
      // No cambiar el estado si hay error, mantener el fallback actual
      return null;
    }
  }, []);

  // Verificar acceso a funcionalidad
  const checkFeatureAccess = useCallback(async (feature) => {
    try {
      const accessInfo = await subscriptionService.checkFeatureAccess(feature);
      return accessInfo;
    } catch (error) {
      console.error(`Error verificando acceso a ${feature}:`, error);
      throw error;
    }
  }, []);

  // Verificar si puede crear CV
  const canCreateCV = useCallback(async () => {
    try {
      const canCreate = await subscriptionService.canCreateCV();
      return canCreate;
    } catch (error) {
      console.error('Error verificando si puede crear CV:', error);
      return false;
    }
  }, []);

  // Actualizar conteo de CVs
  const updateCVCount = useCallback((newCount) => {
    dispatch({ type: SUBSCRIPTION_ACTIONS.UPDATE_CV_COUNT, payload: newCount });
  }, []);

  // Limpiar error
  const clearError = useCallback(() => {
    dispatch({ type: SUBSCRIPTION_ACTIONS.CLEAR_ERROR });
  }, []);

  // Cargar información inicial
  useEffect(() => {
    loadSubscriptionInfo();
  }, [loadSubscriptionInfo]);

  // Escuchar eventos de actualización de suscripción desde AuthContext
  useEffect(() => {
        const handleSubscriptionUpdate = (event) => {
          const { userId } = event.detail;
          updateSubscriptionInfo(userId);
        };

    window.addEventListener('subscriptionUpdate', handleSubscriptionUpdate);
    
    return () => {
      window.removeEventListener('subscriptionUpdate', handleSubscriptionUpdate);
    };
  }, [updateSubscriptionInfo]);

  // Valor del contexto
  const value = {
    // Estado
    subscriptionInfo: state.subscriptionInfo,
    subscriptionState: state.subscriptionState,
    error: state.error,
    isLoading: state.isLoading,
    
    // Acciones
    loadSubscriptionInfo,
    updateSubscriptionInfo,
    checkFeatureAccess,
    canCreateCV,
    updateCVCount,
    clearError,
    
    // Utilidades
    getUpgradeMessage: subscriptionService.getUpgradeMessage.bind(subscriptionService),
    getSubscriptionPlans: subscriptionService.getSubscriptionPlans.bind(subscriptionService),
    handleSubscriptionError: subscriptionService.handleSubscriptionError.bind(subscriptionService)
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionContext;
