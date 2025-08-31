// Interceptor global para manejar respuestas 401
class ApiInterceptor {
  constructor() {
    this.navigate = null;
    this.onSessionExpired = null;
  }

  setNavigate(navigate) {
    this.navigate = navigate;
  }

  setOnSessionExpired(callback) {
    this.onSessionExpired = callback;
  }

  async handleResponse(response, options = {}) {
    if (response.status === 401) {
      console.log('API Interceptor: Token expirado o inválido, ejecutando logout forzado');
      
      // Limpiar localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      // Limpiar cache de imágenes
      if (window.imageCacheService) {
        window.imageCacheService.clearAll();
      }
      
      // Notificar al componente padre sobre la sesión expirada
      if (this.onSessionExpired) {
        this.onSessionExpired();
        return response; // No lanzar error, dejar que el componente maneje la UI
      }
      
      // Fallback: redirigir al login
      if (this.navigate) {
        this.navigate('/login?message=session_expired');
      } else {
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
