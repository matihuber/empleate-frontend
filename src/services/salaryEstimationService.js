// Importar authService para usar authenticatedRequest
import authService from './authService';
import { API_URL } from '../config/api';

// URLs de los endpoints
const ENDPOINTS = {
  ESTIMATE: `${API_URL}/salary/estimate`,
  HEALTH: `${API_URL}/salary/health`,
  MODEL_INFO: `${API_URL}/salary/model/info`,
  TRAIN_INITIAL: `${API_URL}/salary/train-initial`
};

class SalaryEstimationService {
  constructor() {
    this.baseURL = `${API_URL}/salary`;
  }

  async estimateSalary(formData) {
    try {
      const response = await authService.authenticatedRequest('/salary/estimate', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      // authService.authenticatedRequest ya devuelve los datos parseados
      return response;
    } catch (error) {
      console.error('Error estimating salary:', error);
      throw new Error(error.message || 'Error al estimar el salario');
    }
  }

  async getHealthStatus() {
    try {
      const response = await fetch(ENDPOINTS.HEALTH, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Error al verificar el estado del servicio');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting health status:', error);
      throw new Error('Error al verificar el estado del servicio');
    }
  }

  async getModelInfo() {
    try {
      const response = await fetch(ENDPOINTS.MODEL_INFO, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener información del modelo');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting model info:', error);
      throw new Error('Error al obtener información del modelo');
    }
  }

  async trainInitialModel() {
    try {
      const response = await fetch(ENDPOINTS.TRAIN_INITIAL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al entrenar el modelo inicial');
      }

      return await response.json();
    } catch (error) {
      console.error('Error training initial model:', error);
      throw new Error(error.message || 'Error al entrenar el modelo inicial');
    }
  }
}

export const salaryEstimationService = new SalaryEstimationService();
