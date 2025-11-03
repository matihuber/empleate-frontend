/**
 * Configuración centralizada de la API
 *
 * Las variables de entorno se cargan desde el archivo .env
 * Para desarrollo local: usar .env.development
 * Para producción: usar .env.production
 */

// Base URL de la API - viene del archivo .env
// IMPORTANTE: Para producción, asegúrate de definir VITE_API_BASE_URL antes del build
// Ejemplos:
//   - https://www.empleate.work  (si el backend está en el mismo dominio)
//   - https://api.empleate.work   (si usas subdominio api)
//   - http://localhost:8000       (desarrollo local)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://www.empleate.work';

// Versión de la API
export const API_VERSION = '/api/v1';

// URL completa de la API
export const API_URL = `${API_BASE_URL}${API_VERSION}`;

// Configuración para desarrollo
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

/**
 * Helper para construir URLs de endpoints
 * @param {string} path - Path del endpoint (ej: '/auth/login')
 * @returns {string} URL completa
 */
export const buildApiUrl = (path) => {
  // Si ya es una URL completa, retornarla tal cual
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Si el path ya incluye /api/v1, solo agregar la base URL
  if (path.startsWith('/api/v1')) {
    return `${API_BASE_URL}${path}`;
  }

  // Si no tiene el prefijo /api/v1, agregarlo
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${cleanPath}`;
};

// Logs de configuración (siempre, para debug)
console.log('🔧 API Configuration:');
console.log('   Base URL:', API_BASE_URL);
console.log('   API Version:', API_VERSION);
console.log('   Full API URL:', API_URL);
console.log('   Environment:', isProduction ? 'Production' : 'Development');
console.log('   VITE_API_BASE_URL from env:', import.meta.env.VITE_API_BASE_URL);
