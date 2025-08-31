// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_VERSION = '/api/v1';

// URLs de los endpoints
const ENDPOINTS = {
  LOGIN: `${API_BASE_URL}${API_VERSION}/auth/login`,
  REGISTER: `${API_BASE_URL}${API_VERSION}/auth/register`,
  LOGOUT: `${API_BASE_URL}${API_VERSION}/auth/logout`,
  REFRESH_TOKEN: `${API_BASE_URL}${API_VERSION}/auth/refresh`,
  GOOGLE_LOGIN: `${API_BASE_URL}${API_VERSION}/auth/google`,
  LINKEDIN_LOGIN: `${API_BASE_URL}${API_VERSION}/auth/linkedin`,
  MICROSOFT_LOGIN: `${API_BASE_URL}${API_VERSION}/auth/microsoft`,
  USER_INFO: `${API_BASE_URL}${API_VERSION}/auth/user-info`,
  PASSWORD_RESET: `${API_BASE_URL}${API_VERSION}/auth/password-reset`,
  VERIFY_EMAIL: `${API_BASE_URL}${API_VERSION}/auth/verify-email`
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
      console.log('AuthService: Haciendo petición a:', url, 'con opciones:', options)
      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders(options.includeAuth !== false),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
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
          console.log('AuthService: Error 401 - Credenciales incorrectas')
          throw new Error('Credenciales incorrectas. Verifica tu email y contraseña.');
        } else if (response.status === 500) {
          // Error del servidor
          throw new Error('Error del servidor. Intenta más tarde.');
        } else {
          // Otros errores
          throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
        }
      }

      const responseData = await response.json();
      console.log('AuthService: Respuesta exitosa:', responseData)
      return responseData;
    } catch (error) {
      console.error('AuthService request error:', error);
      throw error;
    }
  }

  // Login básico con email y password
  async loginBasic(email, password) {
    try {
      console.log('AuthService: Iniciando login con:', { email, password: '***' })
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

      console.log('AuthService: Respuesta del backend:', response)
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
      throw new Error(`Error en login: ${error.message}`);
    }
  }

  // Login con Google OAuth
  async loginGoogle() {
    try {
      // Obtener el código de autorización de Google
      const googleAuthUrl = `${API_BASE_URL}${API_VERSION}/auth/google/authorize`;
      
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
      const linkedinAuthUrl = `${API_BASE_URL}${API_VERSION}/auth/linkedin/authorize`;
      
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
      const microsoftAuthUrl = `${API_BASE_URL}${API_VERSION}/auth/microsoft/authorize`;
      
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
      throw new Error(`Error en registro: ${error.message}`);
    }
  }

  // Logout
  async logout() {
    try {
      console.log('AuthService: Iniciando logout, refreshToken:', this.refreshToken ? 'existe' : 'no existe');
      
      if (this.refreshToken) {
        const logoutBody = {
          refresh_token: this.refreshToken
        };
        console.log('AuthService: Enviando logout con body:', logoutBody);
        
        await this.makeRequest(ENDPOINTS.LOGOUT, {
          method: 'POST',
          body: JSON.stringify(logoutBody)
        });
        
        console.log('AuthService: Logout exitoso en el servidor');
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
