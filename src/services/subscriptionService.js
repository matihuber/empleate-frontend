/**
 * Servicio para manejar información de suscripción del usuario
 */

import authService from './authService';

class SubscriptionService {
  constructor() {
    // Usar la misma configuración que authService
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const API_VERSION = '/api/v1';
    this.baseURL = `${API_BASE_URL}${API_VERSION}`;
  }

  /**
   * Obtiene información de suscripción del usuario actual (versión de prueba sin autenticación)
   */
  async getSubscriptionInfoTest(userId) {
    try {
      const response = await fetch(`${this.baseURL}/subscription/info-test/${userId}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error obteniendo información de suscripción (prueba):', error);
      throw error;
    }
  }

  /**
   * Obtiene información de suscripción del usuario actual
   */
  async getSubscriptionInfo() {
    try {
      const response = await authService.authenticatedRequest(`${this.baseURL}/subscription/info`);
      
      // authService.authenticatedRequest ya devuelve los datos parseados
      return response;
    } catch (error) {
      console.error('Error obteniendo información de suscripción:', error);
      throw error;
    }
  }

  /**
   * Verifica si el usuario puede acceder a una funcionalidad específica
   */
  async checkFeatureAccess(feature) {
    try {
      const response = await authService.authenticatedRequest(`${this.baseURL}/subscription/feature-access/${feature}`);
      
      // authService.authenticatedRequest ya devuelve los datos parseados
      return response;
    } catch (error) {
      console.error(`Error verificando acceso a funcionalidad ${feature}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene límites de CV del usuario
   */
  async getCVLimits() {
    try {
      const response = await authService.authenticatedRequest(`${this.baseURL}/subscription/cv-limits`);
      
      // authService.authenticatedRequest ya devuelve los datos parseados
      return response;
    } catch (error) {
      console.error('Error obteniendo límites de CV:', error);
      throw error;
    }
  }

  /**
   * Verifica si el usuario puede crear más CVs
   */
  async canCreateCV() {
    try {
      const limits = await this.getCVLimits();
      return limits.can_create;
    } catch (error) {
      console.error('Error verificando si puede crear CV:', error);
      return false;
    }
  }

  /**
   * Obtiene mensaje de actualización para una funcionalidad
   */
  getUpgradeMessage(tier, feature) {
    const messages = {
      free: {
        templates: "¡Actualiza a PRO ($6.99/mes) para acceder a templates avanzados!",
        profile_analysis: "¡Actualiza a PRO ($6.99/mes) para acceder al análisis de perfil profesional!",
        salary_estimation: "¡Actualiza a PREMIUM ($11.99/mes) para acceder a estimación salarial!",
        course_recommendations: "¡Actualiza a PREMIUM ($11.99/mes) para acceder a recomendaciones de cursos!",
        export_pdf: "¡Actualiza a PRO ($6.99/mes) para exportar tu CV a PDF!",
        import_linkedin: "¡Actualiza a PRO ($6.99/mes) para importar tu perfil de LinkedIn!",
        cvs: "¡Actualiza a PRO ($6.99/mes) para crear hasta 5 CVs!"
      },
      pro: {
        salary_estimation: "¡Actualiza a PREMIUM ($11.99/mes) para acceder a estimación salarial!",
        course_recommendations: "¡Actualiza a PREMIUM ($11.99/mes) para acceder a recomendaciones de cursos!",
        cvs: "¡Actualiza a PREMIUM ($11.99/mes) para CVs ilimitados!"
      }
    };
    const featureName = {
      salary_estimation: "estimación salarial",
      course_recommendations: "recomendaciones de cursos",
      export_pdf: "exportación a PDF",
      import_linkedin: "importación de LinkedIn",
      cvs: "creación de CVs"
    };
    return messages[tier]?.[feature] || `¡Actualiza tu suscripción para acceder a ${featureName[feature]}!`;
  }

  /**
   * Obtiene información de planes de suscripción
   */
  getSubscriptionPlans() {
    return {
      free: {
        name: "Gratuito",
        price: 0,
        features: [
          "1 CV básico",
          "Análisis de perfil profesional",
          "Exportación a PDF",
          "Templates básicos"
        ],
        limitations: [
          "Sin importación de LinkedIn",
          "Sin estimación salarial",
          "Sin recomendaciones de cursos"
        ]
      },
      pro: {
        name: "PRO",
        price: 6.99,
        features: [
          "Hasta 5 CVs optimizados",
          "Acceso a todos los templates",
          "Análisis del perfil profesional",
          "Importación de LinkedIn",
          "Exportación a PDF"
        ],
        limitations: [
          "Sin estimación salarial",
          "Sin recomendaciones de cursos"
        ]
      },
      premium: {
        name: "PREMIUM",
        price: 11.99,
        features: [
          "CVs ilimitados",
          "Acceso a todos los templates",
          "Análisis del perfil profesional",
          "Importación de LinkedIn",
          "Estimación salarial",
          "Recomendaciones de cursos",
          "Exportación a PDF"
        ],
        limitations: []
      }
    };
  }

  /**
   * Maneja errores de restricción de suscripción
   */
  handleSubscriptionError(error, feature) {
    if (error.status === 403) {
      // Error de permisos - mostrar mensaje de actualización
      const tier = this.getCurrentTier();
      return {
        type: 'subscription_required',
        message: this.getUpgradeMessage(tier, feature),
        feature: feature
      };
    }
    
    return {
      type: 'error',
      message: error.message || 'Error desconocido',
      feature: feature
    };
  }

  /**
   * Obtiene el tier actual del usuario (desde localStorage o contexto)
   */
  getCurrentTier() {
    // Esto se puede mejorar para obtener desde el contexto de React
    // Por ahora retornamos 'free' por defecto
    return 'free';
  }
}

// Crear instancia única
const subscriptionService = new SubscriptionService();

export default subscriptionService;
