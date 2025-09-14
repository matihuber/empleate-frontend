import { apiClient } from './apiClient';

class SalaryEstimationService {
  constructor() {
    this.baseURL = '/api/v1/salary';
  }

  async estimateSalary(formData) {
    try {
      const response = await apiClient.post(`${this.baseURL}/estimate`, formData);
      return response.data;
    } catch (error) {
      console.error('Error estimating salary:', error);
      throw new Error(error.response?.data?.detail || 'Error al estimar el salario');
    }
  }

  async getHealthStatus() {
    try {
      const response = await apiClient.get(`${this.baseURL}/health`);
      return response.data;
    } catch (error) {
      console.error('Error getting health status:', error);
      throw new Error('Error al verificar el estado del servicio');
    }
  }

  async getModelInfo() {
    try {
      const response = await apiClient.get(`${this.baseURL}/model/info`);
      return response.data;
    } catch (error) {
      console.error('Error getting model info:', error);
      throw new Error('Error al obtener información del modelo');
    }
  }

  async trainInitialModel() {
    try {
      const response = await apiClient.post(`${this.baseURL}/train-initial`);
      return response.data;
    } catch (error) {
      console.error('Error training initial model:', error);
      throw new Error('Error al entrenar el modelo inicial');
    }
  }
}

export const salaryEstimationService = new SalaryEstimationService();
