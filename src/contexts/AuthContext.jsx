import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import authService from '../services/authService';

// Estados de autenticación
const AUTH_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  ERROR: 'error'
};

// Tipos de login
const LOGIN_TYPES = {
  BASIC: 'basic',
  GOOGLE: 'google',
  LINKEDIN: 'linkedin',
  MICROSOFT: 'microsoft'
};

// Estado inicial
const initialState = {
  user: null,
  isAuthenticated: false,
  authState: AUTH_STATES.IDLE,
  loginType: null,
  accessToken: null,
  refreshToken: null,
  error: null,
  isLoading: false,
  sessionExpired: false
};

// Acciones del reducer
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_TOKENS: 'SET_TOKENS',
  SET_AUTH_STATE: 'SET_AUTH_STATE',
  SET_LOGIN_TYPE: 'SET_LOGIN_TYPE',
  SET_ERROR: 'SET_ERROR',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_SESSION_EXPIRED: 'SET_SESSION_EXPIRED'
};

// Reducer para manejar el estado
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        authState: action.payload ? AUTH_STATES.LOADING : state.authState
      };
    
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        authState: action.payload ? AUTH_STATES.AUTHENTICATED : AUTH_STATES.UNAUTHENTICATED,
        error: null
      };
    
    case AUTH_ACTIONS.SET_TOKENS:
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        error: null,
        // Si tenemos tokens y usuario, establecer como autenticado
        isAuthenticated: !!(action.payload.accessToken && state.user)
      };
    
    case AUTH_ACTIONS.SET_AUTH_STATE:
      return {
        ...state,
        authState: action.payload
      };
    
    case AUTH_ACTIONS.SET_LOGIN_TYPE:
      return {
        ...state,
        loginType: action.payload
      };
    
    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        authState: AUTH_STATES.ERROR,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        authState: AUTH_STATES.UNAUTHENTICATED
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
        authState: state.isAuthenticated ? AUTH_STATES.AUTHENTICATED : AUTH_STATES.UNAUTHENTICATED
      };
    
    case AUTH_ACTIONS.SET_SESSION_EXPIRED:
      return {
        ...state,
        sessionExpired: action.payload,
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        authState: AUTH_STATES.UNAUTHENTICATED
      };
    
    default:
      return state;
  }
}

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar si hay tokens guardados al cargar la app
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Usar authService para inicializar desde localStorage
        if (authService.initializeFromStorage()) {
          const user = authService.getCurrentUser();
          const accessToken = authService.getAccessToken();
          const refreshToken = authService.getRefreshToken();
          
          // Verificar si el token no ha expirado
          if (accessToken && !isTokenExpired(accessToken)) {
            dispatch({ type: AUTH_ACTIONS.SET_TOKENS, payload: { accessToken, refreshToken } });
            dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user });
            dispatch({ type: AUTH_ACTIONS.SET_AUTH_STATE, payload: AUTH_STATES.AUTHENTICATED });
          } else {
            // Token expirado, intentar refresh
            await refreshAuthToken(refreshToken);
          }
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_AUTH_STATE, payload: AUTH_STATES.UNAUTHENTICATED });
        }
      } catch (error) {
        console.error('Error inicializando autenticación:', error);
        dispatch({ type: AUTH_ACTIONS.SET_AUTH_STATE, payload: AUTH_STATES.UNAUTHENTICATED });
      }
    };

    initializeAuth();
  }, []);

  // Función para verificar si un token ha expirado
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  // Función para refresh del token
  const refreshAuthToken = async (refreshToken) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      // Llamada real al backend a través de authService
      const response = await authService.refreshAccessToken();
      
      // Actualizar estado con los nuevos tokens
      dispatch({ type: AUTH_ACTIONS.SET_TOKENS, payload: {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken
      }});
      
    } catch (error) {
      console.error('Error refreshing token:', error);
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Función para login básico
  const loginBasic = useCallback(async (email, password) => {
    try {
      console.log('AuthContext: Iniciando login básico')
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.SET_LOGIN_TYPE, payload: LOGIN_TYPES.BASIC });
      
      // Llamada real al backend a través de authService
      const response = await authService.loginBasic(email, password);
      
      console.log('AuthContext: Login exitoso, respuesta:', response)
      
      // Establecer tokens en el servicio de autenticación
      authService.setTokens(response.accessToken, response.refreshToken)
      authService.setUser(response.user)
      
      // Actualizar estado con la respuesta real
      dispatch({ type: AUTH_ACTIONS.SET_TOKENS, payload: {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken
      }});
      console.log('AuthContext: Tokens establecidos')
      
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: response.user });
      console.log('AuthContext: Usuario establecido')
      
      console.log('AuthContext: Estado final - isAuthenticated:', !!response.user, 'user:', response.user)
      
    } catch (error) {
      // Asegurar que el estado de autenticación se mantenga como no autenticado
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      // Siempre limpiar el loading, sin importar si fue exitoso o no
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Función para login con Google
  const loginGoogle = useCallback(async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.SET_LOGIN_TYPE, payload: LOGIN_TYPES.GOOGLE });
      
      // Llamada real al backend a través de authService
      const response = await authService.loginGoogle();
      
      // El usuario será redirigido a Google OAuth
      // El flujo se completa en el backend
      return response;
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      // Siempre limpiar el loading, sin importar si fue exitoso o no
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Función para login con LinkedIn
  const loginLinkedIn = useCallback(async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.SET_LOGIN_TYPE, payload: LOGIN_TYPES.LINKEDIN });
      
      // Llamada real al backend a través de authService
      const response = await authService.loginLinkedIn();
      
      // El usuario será redirigido a LinkedIn OAuth
      // El flujo se completa en el backend
      return response;
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      // Siempre limpiar el loading, sin importar si fue exitoso o no
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Función para login con Microsoft
  const loginMicrosoft = useCallback(async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.SET_LOGIN_TYPE, payload: LOGIN_TYPES.MICROSOFT });
      
      // Llamada real al backend a través de authService
      const response = await authService.loginMicrosoft();
      
      // El usuario será redirigido a Microsoft OAuth
      // El flujo se completa en el backend
      return response;
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      // Siempre limpiar el loading, sin importar si fue exitoso o no
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Función para registro de usuario
  const register = useCallback(async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      // Llamada real al backend a través de authService
      const response = await authService.register(userData);
      
      return response;
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      // Siempre limpiar el loading, sin importar si fue exitoso o no
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Función para logout
  const logout = useCallback(async () => {
    try {
      // Llamar al backend para logout
      await authService.logout();
    } catch (error) {
      console.warn('Error en logout del servidor:', error);
    } finally {
      // Limpiar estado local
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  }, []);

  // Función para reset de contraseña
  const requestPasswordReset = useCallback(async (email) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      // Llamada real al backend a través de authService
      const response = await authService.requestPasswordReset(email);
      
      return response;
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      // Siempre limpiar el loading, sin importar si fue exitoso o no
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Función para limpiar errores
  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  // Función para manejar sesión expirada
  const handleSessionExpired = useCallback(() => {
    console.log('AuthContext: Sesión expirada detectada');
    dispatch({ type: AUTH_ACTIONS.SET_SESSION_EXPIRED, payload: true });
  }, []);

  // Setters para callbacks OAuth
  const setUser = useCallback((user) => dispatch({ type: AUTH_ACTIONS.SET_USER, payload: user }), []);
  const setTokens = useCallback((accessToken, refreshToken) => dispatch({ 
    type: AUTH_ACTIONS.SET_TOKENS, 
    payload: { accessToken, refreshToken } 
  }), []);

  // Valor del contexto
  const contextValue = useMemo(() => ({
    // Estado
    ...state,
    
    // Constantes
    AUTH_STATES,
    LOGIN_TYPES,
    
    // Funciones
    loginBasic,
    loginGoogle,
    loginLinkedIn,
    loginMicrosoft,
    register,
    requestPasswordReset,
    logout,
    clearError,
    handleSessionExpired,
    
    // Setters para callbacks OAuth
    setUser,
    setTokens,
    
    // Helpers
    isTokenExpired
  }), [state, loginBasic, loginGoogle, loginLinkedIn, loginMicrosoft, register, requestPasswordReset, logout, clearError, handleSessionExpired, setUser, setTokens]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
