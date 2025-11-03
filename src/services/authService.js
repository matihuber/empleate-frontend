// Configuración de la API
import { API_URL } from '../config/api';

// URLs de los endpoints
const ENDPOINTS = {
  LOGIN: `${API_URL}/auth/login`,
  REGISTER: `${API_URL}/auth/register`,
  LOGOUT: `${API_URL}/auth/logout`,
  REFRESH_TOKEN: `${API_URL}/auth/refresh`,
  GOOGLE_LOGIN: `${API_URL}/auth/google`,
  LINKEDIN_LOGIN: `${API_URL}/auth/linkedin`,
  MICROSOFT_LOGIN: `${API_URL}/auth/microsoft`,
  USER_INFO: `${API_URL}/auth/user-info`,
  PASSWORD_RESET: `${API_URL}/auth/password-reset`,
  VERIFY_EMAIL: `${API_URL}/auth/verify-email`
};

// Clase principal del servicio de autenticación
class AuthService {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
    this.user = null;
  }

  // Configurar headers para las peticiones
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  // Función helper para hacer peticiones HTTP
  async makeRequest(url, options = {}) {
    try {
      // Los ENDPOINTS ya incluyen API_URL completo, así que usar directamente
      // Si es una URL completa (empieza con http), usarla tal cual
      // Si es un path relativo, agregarlo a API_URL
      let fullUrl = url;
      if (!url.startsWith('http')) {
        // Es un path relativo, construir URL completa
        fullUrl = url.startsWith('/') ? `${API_URL}${url}` : `${API_URL}/${url}`;
      }
      
      const response = await fetch(fullUrl, {
        ...options,
        headers: this.getHeaders(options.includeAuth !== false),
      });
      

      if (!response.ok) {
        console.log('AuthService: Response no es ok:', response);
        console.log('AuthService: Response status:', response.status);
        console.log('AuthService: Response statusText:', response.statusText);
        console.log('AuthService: Response ok:', response.ok);

        // Manejar 403 específicamente (puede devolver HTML en lugar de JSON)
        if (response.status === 403) {
          const error = new Error('Acceso denegado. Esta funcionalidad requiere un plan Premium.');
          error.status = 403;
          error.code = 'SUBSCRIPTION_REQUIRED';
          throw error;
        }

        // Para otros errores, intentar parsear JSON si el content-type es apropiado
        const contentType = response.headers.get('content-type');
        let errorData = {};

        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json().catch(() => ({}));
        }

        console.error('Backend error response:', errorData);

        // Manejar diferentes tipos de errores
        if (response.status === 422) {
          // Error de validación
          const validationErrors = errorData.detail || errorData;
          if (Array.isArray(validationErrors)) {
            const errorMessages = validationErrors.map(err => err.msg || err.message || 'Error de validación').join(', ');
            throw new Error(`Error de validación: ${errorMessages}`);
          } else {
            throw new Error(`Error de validación: ${JSON.stringify(validationErrors)}`);
          }
        } else if (response.status === 400) {
          // Error de solicitud
          throw new Error(errorData.detail || 'Datos incorrectos');
        } else if (response.status === 401) {
          // No autorizado
          throw new Error('Credenciales incorrectas. Verifica tu email y contraseña.');
        } else if (response.status === 409) {
          // Conflicto - usuario ya existe
          throw new Error(errorData.detail || 'Ya existe una cuenta con este email. Por favor, usa un email diferente.');
        } else if (response.status === 500) {
          // Error del servidor
          throw new Error('Error del servidor. Intenta más tarde.');
        } else {
          // Otros errores
          const status = response.status || 'undefined';
          const statusText = response.statusText || 'undefined';
          throw new Error(errorData.detail || `Error ${status}: ${statusText}`);
        }
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('AuthService request error:', error);
      throw error;
    }
  }

  // Login básico con email y password
  async loginBasic(email, password) {
    try {
      const response = await this.makeRequest(ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          redirect_uri: `${window.location.origin}/auth/callback`,
          state: 'basic_login'
        }),
        includeAuth: false
      });

      // Guardar tokens y datos del usuario
      this.setTokens(response.access_token, response.refresh_token);
      this.setUser(response.user);

      return {
        success: true,
        user: response.user,
        accessToken: response.access_token,
        refreshToken: response.refresh_token
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Login con Google OAuth
  async loginGoogle() {
    try {
      // Obtener el código de autorización de Google
      const googleAuthUrl = `${API_URL}/auth/google/authorize`;
      
      // Redirigir al usuario a Google OAuth
      window.location.href = googleAuthUrl;
      
      // Nota: El flujo completo se maneja en el backend
      // El usuario será redirigido de vuelta con un código
      return { success: true, message: 'Redirigiendo a Google...' };
    } catch (error) {
      throw new Error(`Error en login con Google: ${error.message}`);
    }
  }

  // Login con LinkedIn OAuth
  async loginLinkedIn() {
    try {
      const linkedinAuthUrl = `${API_URL}/auth/linkedin/authorize`;
      
      // Redirigir al usuario a LinkedIn OAuth
      window.location.href = linkedinAuthUrl;
      
      return { success: true, message: 'Redirigiendo a LinkedIn...' };
    } catch (error) {
      throw new Error(`Error en login con LinkedIn: ${error.message}`);
    }
  }

  // Login con Microsoft OAuth
  async loginMicrosoft() {
    try {
      const microsoftAuthUrl = `${API_URL}/auth/microsoft/authorize`;
      
      // Redirigir al usuario a Microsoft OAuth
      window.location.href = microsoftAuthUrl;
      
      return { success: true, message: 'Redirigiendo a Microsoft...' };
    } catch (error) {
      throw new Error(`Error en login con Microsoft: ${error.message}`);
    }
  }

  // Registrar nuevo usuario
  async register(userData) {
    try {
      const response = await this.makeRequest(ENDPOINTS.REGISTER, {
        method: 'POST',
        body: JSON.stringify(userData),
        includeAuth: false
      });

      return {
        success: true,
        message: 'Usuario registrado exitosamente',
        user: response.user
      };
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  // Logout
  async logout() {
    try {
      
      if (this.refreshToken) {
        const logoutBody = {
          refresh_token: this.refreshToken
        };
        
        await this.makeRequest(ENDPOINTS.LOGOUT, {
          method: 'POST',
          body: JSON.stringify(logoutBody)
        });
        
      } else {
        console.warn('AuthService: No hay refreshToken para enviar al logout');
      }
    } catch (error) {
      console.error('AuthService: Error en logout del servidor:', error);
      throw error; // Re-lanzar el error para que se maneje en el componente
    } finally {
      // Limpiar tokens y datos del usuario localmente
      this.clearTokens();
      this.clearUser();
    }
  }

  // Refrescar token de acceso
  async refreshAccessToken() {
    try {
      if (!this.refreshToken) {
        throw new Error('No hay refresh token disponible');
      }

      const response = await this.makeRequest(ENDPOINTS.REFRESH_TOKEN, {
        method: 'POST',
        body: JSON.stringify({
          refresh_token: this.refreshToken
        }),
        includeAuth: false
      });

      // Actualizar tokens
      this.setTokens(response.access_token, response.refresh_token);

      return {
        success: true,
        accessToken: response.access_token,
        refreshToken: response.refresh_token
      };
    } catch (error) {
      // Si falla el refresh, limpiar todo
      this.clearTokens();
      this.clearUser();
      throw new Error(`Error refrescando token: ${error.message}`);
    }
  }

  // Obtener información del usuario actual
  async getUserInfo() {
    try {
      const response = await this.makeRequest(ENDPOINTS.USER_INFO);
      
      this.setUser(response.user);
      return response.user;
    } catch (error) {
      throw new Error(`Error obteniendo información del usuario: ${error.message}`);
    }
  }

  // Reset de contraseña
  async requestPasswordReset(email) {
    try {
      await this.makeRequest(ENDPOINTS.PASSWORD_RESET, {
        method: 'POST',
        body: JSON.stringify({ email }),
        includeAuth: false
      });

      return {
        success: true,
        message: 'Email de reset enviado'
      };
    } catch (error) {
      throw new Error(`Error solicitando reset de contraseña: ${error.message}`);
    }
  }

  // Verificar email
  async verifyEmail(token) {
    try {
      const response = await this.makeRequest(ENDPOINTS.VERIFY_EMAIL, {
        method: 'POST',
        body: JSON.stringify({ token }),
        includeAuth: false
      });

      return {
        success: true,
        message: 'Email verificado exitosamente'
      };
    } catch (error) {
      throw new Error(`Error verificando email: ${error.message}`);
    }
  }

  // Procesar callback de Google OAuth
  async processGoogleCallback(code, state) {
    try {
      const response = await this.makeRequest(`${ENDPOINTS.GOOGLE_LOGIN}/callback`, {
        method: 'POST',
        body: JSON.stringify({ code, state }),
        includeAuth: false
      });

      // Guardar tokens y datos del usuario
      this.setTokens(response.access_token, response.refresh_token);
      this.setUser(response.user);

      return {
        success: true,
        user: response.user,
        accessToken: response.access_token,
        refreshToken: response.refresh_token
      };
    } catch (error) {
      throw new Error(`Error procesando callback de Google: ${error.message}`);
    }
  }

  // Procesar callback de LinkedIn OAuth
  async processLinkedInCallback(code, state) {
    try {
      const response = await this.makeRequest(`${ENDPOINTS.LINKEDIN_LOGIN}/callback`, {
        method: 'POST',
        body: JSON.stringify({ code, state }),
        includeAuth: false
      });

      // Guardar tokens y datos del usuario
      this.setTokens(response.access_token, response.refresh_token);
      this.setUser(response.user);

      return {
        success: true,
        user: response.user,
        accessToken: response.access_token,
        refreshToken: response.refresh_token
      };
    } catch (error) {
      throw new Error(`Error procesando callback de LinkedIn: ${error.message}`);
    }
  }

  // Procesar callback de Microsoft OAuth
  async processMicrosoftCallback(code, state) {
    try {
      const response = await this.makeRequest(`${ENDPOINTS.MICROSOFT_LOGIN}/callback`, {
        method: 'POST',
        body: JSON.stringify({ code, state }),
        includeAuth: false
      });

      // Guardar tokens y datos del usuario
      this.setTokens(response.access_token, response.refresh_token);
      this.setUser(response.user);

      return {
        success: true,
        user: response.user,
        accessToken: response.access_token,
        refreshToken: response.refresh_token
      };
    } catch (error) {
      throw new Error(`Error procesando callback de Microsoft: ${error.message}`);
    }
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    return !!this.accessToken && !!this.user;
  }

  // Verificar si el token ha expirado
  isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  // Obtener token de acceso
  getAccessToken() {
    return this.accessToken;
  }

  // Obtener refresh token
  getRefreshToken() {
    return this.refreshToken;
  }

  // Obtener usuario actual
  getCurrentUser() {
    return this.user;
  }

  // Establecer tokens
  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    
    // Guardar en localStorage
    if (accessToken && refreshToken) {
      localStorage.setItem('empleate_access_token', accessToken);
      localStorage.setItem('empleate_refresh_token', refreshToken);
    }
  }

  // Establecer usuario
  setUser(user) {
    this.user = user;
    
    if (user) {
      localStorage.setItem('empleate_user', JSON.stringify(user));
    }
  }

  // Limpiar tokens
  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    
    localStorage.removeItem('empleate_access_token');
    localStorage.removeItem('empleate_refresh_token');
  }

  // Limpiar usuario
  clearUser() {
    this.user = null;
    localStorage.removeItem('empleate_user');
  }

  // Inicializar desde localStorage
  initializeFromStorage() {
    try {
      const accessToken = localStorage.getItem('empleate_access_token');
      const refreshToken = localStorage.getItem('empleate_refresh_token');
      const user = localStorage.getItem('empleate_user');

      if (accessToken && refreshToken && user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = JSON.parse(user);
        return true;
      }
    } catch (error) {
      console.error('Error inicializando desde localStorage:', error);
      this.clearTokens();
      this.clearUser();
    }
    return false;
  }

  // Interceptor para peticiones HTTP que requieren autenticación
  async authenticatedRequest(url, options = {}) {
    // Verificar si el token ha expirado
    if (this.accessToken && this.isTokenExpired(this.accessToken)) {
      try {
        await this.refreshAccessToken();
      } catch (error) {
        // Si falla el refresh, redirigir al login
        this.logout();
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
    }

    return this.makeRequest(url, options);
  }
}

// Crear instancia singleton
const authService = new AuthService();

// Inicializar desde localStorage al cargar
authService.initializeFromStorage();

export default authService;
