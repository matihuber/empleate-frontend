import { useNavigate } from 'react-router-dom';

// Interceptor global para manejar respuestas 401
class ApiInterceptor {
  constructor() {
    this.navigate = null;
  }

  setNavigate(navigate) {
    this.navigate = navigate;
  }

  async handleResponse(response, options = {}) {
    if (response.status === 401) {
      console.log('API Interceptor: Token expirado o inválido, redirigiendo al login');
      
      // Limpiar datos de sesión del localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      // Mostrar mensaje al usuario
      if (this.navigate) {
        // Redirigir al login con mensaje de sesión expirada
        this.navigate('/login?message=session_expired');
      } else {
        // Fallback: recargar la página para que AuthContext maneje la redirección
        window.location.href = '/login?message=session_expired';
      }
      
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
    
    return response;
  }

  // Método para usar en fetch
  async fetchWithInterceptor(url, options = {}) {
    try {
      const response = await fetch(url, options);
      return await this.handleResponse(response, options);
    } catch (error) {
      if (error.message.includes('Sesión expirada')) {
        throw error;
      }
      // Re-lanzar otros errores
      throw error;
    }
  }
}

// Instancia global
const apiInterceptor = new ApiInterceptor();

export default apiInterceptor;
