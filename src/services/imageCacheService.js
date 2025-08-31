// Servicio para cachear imágenes del usuario
class ImageCacheService {
  constructor() {
    this.memoryCache = new Map();
    this.cacheKey = 'empleate_image_cache';
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 horas en ms
  }

  // Generar clave única para cada usuario y tipo de imagen
  _getCacheKey(userId, imageType = 'profile') {
    return `${this.cacheKey}_${userId}_${imageType}`;
  }

  // Guardar imagen en cache (memoria + localStorage)
  setImage(userId, imageType, imageData) {
    const cacheKey = this._getCacheKey(userId, imageType);
    const cacheData = {
      ...imageData,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.cacheExpiry
    };

    // Cache en memoria (más rápido)
    this.memoryCache.set(cacheKey, cacheData);

    // Cache en localStorage (persistente)
    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.log('ImageCacheService: No se pudo guardar en localStorage:', error);
    }

    console.log('ImageCacheService: Imagen cacheada:', { userId, imageType, cacheKey });
  }

  // Obtener imagen del cache
  getImage(userId, imageType = 'profile') {
    const cacheKey = this._getCacheKey(userId, imageType);

    // Primero buscar en memoria (más rápido)
    if (this.memoryCache.has(cacheKey)) {
      const cachedData = this.memoryCache.get(cacheKey);
      if (this._isValid(cachedData)) {
        console.log('ImageCacheService: Imagen obtenida de memoria:', { userId, imageType });
        return cachedData;
      } else {
        // Eliminar cache expirado
        this.memoryCache.delete(cacheKey);
      }
    }

    // Buscar en localStorage
    try {
      const storedData = localStorage.getItem(cacheKey);
      if (storedData) {
        const cachedData = JSON.parse(storedData);
        if (this._isValid(cachedData)) {
          // Restaurar en memoria
          this.memoryCache.set(cacheKey, cachedData);
          console.log('ImageCacheService: Imagen obtenida de localStorage:', { userId, imageType });
          return cachedData;
        } else {
          // Eliminar cache expirado
          localStorage.removeItem(cacheKey);
        }
      }
    } catch (error) {
      console.log('ImageCacheService: Error leyendo localStorage:', error);
    }

    return null;
  }

  // Verificar si el cache es válido
  _isValid(cachedData) {
    if (!cachedData || !cachedData.expiresAt) return false;
    return Date.now() < cachedData.expiresAt;
  }

  // Limpiar cache expirado
  cleanup() {
    const now = Date.now();
    
    // Limpiar memoria
    for (const [key, value] of this.memoryCache.entries()) {
      if (!this._isValid(value)) {
        this.memoryCache.delete(key);
      }
    }

    // Limpiar localStorage
    try {
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.startsWith(this.cacheKey)) {
          const value = localStorage.getItem(key);
          if (value) {
            const cachedData = JSON.parse(value);
            if (!this._isValid(cachedData)) {
              localStorage.removeItem(key);
            }
          }
        }
      }
    } catch (error) {
      console.log('ImageCacheService: Error limpiando localStorage:', error);
    }
  }

  // Limpiar cache específico del usuario
  clearUserCache(userId) {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith(`${this.cacheKey}_${userId}`)) {
        localStorage.removeItem(key);
        this.memoryCache.delete(key);
      }
    }
    console.log('ImageCacheService: Cache limpiado para usuario:', userId);
  }

  // Limpiar todo el cache
  clearAll() {
    this.memoryCache.clear();
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith(this.cacheKey)) {
        localStorage.removeItem(key);
      }
    }
    console.log('ImageCacheService: Todo el cache limpiado');
  }
}

// Instancia global
const imageCacheService = new ImageCacheService();

// Limpiar cache expirado cada hora
setInterval(() => {
  imageCacheService.cleanup();
}, 60 * 60 * 1000);

export default imageCacheService;
