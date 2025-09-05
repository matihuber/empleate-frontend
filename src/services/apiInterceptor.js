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
      localStorage.removeItem('empleate_access_token');
      localStorage.removeItem('empleate_refresh_token');
      localStorage.removeItem('empleate_user');
      
      // Limpiar cache de imágenes
      if (window.imageCacheService) {
        window.imageCacheService.clearAll();
      }
      
      // Notificar al componente padre sobre la sesión expirada
      if (this.onSessionExpired) {
        this.onSessionExpired();
        return response; // No lanzar error, dejar que el componente maneje la UI
      }
      
      // Fallback: redirigir directamente al modal de sesión expirada
      if (this.navigate) {
        this.navigate('/session-expired?message=session_expired');
      } else {
        window.location.href = '/session-expired?message=session_expired';
      }
      
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
    
    return response;
  }

  // Método para usar en fetch
  async fetchWithInterceptor(url, options = {}) {
    try {
      // Obtener el token de autenticación del localStorage
      const accessToken = localStorage.getItem('empleate_access_token');
      
      // Preparar headers con autenticación
      const headers = {
        ...options.headers
      };
      
      // Solo agregar Content-Type por defecto si no se especifica uno
      if (!headers['Content-Type'] && !headers['content-type']) {
        headers['Content-Type'] = 'application/json';
      }
      
      // Agregar token de autenticación si existe
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      // Crear opciones con headers actualizados
      const requestOptions = {
        ...options,
        headers
      };
      
      // Si es FormData, no agregar Content-Type para que el navegador lo establezca automáticamente
      if (options.body instanceof FormData) {
        delete requestOptions.headers['Content-Type'];
        delete requestOptions.headers['content-type'];
      }
      
      const response = await fetch(url, requestOptions);
      
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
