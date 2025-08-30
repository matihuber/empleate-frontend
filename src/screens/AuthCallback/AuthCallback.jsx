import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser, setTokens } = useAuth();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setStatus('loading');
        
        // Obtener parámetros de la URL
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const provider = searchParams.get('provider') || 'unknown';

        // Si hay error en la URL
        if (error) {
          throw new Error(`Error de autenticación: ${error}`);
        }

        // Si no hay código de autorización
        if (!code) {
          throw new Error('No se recibió código de autorización');
        }

        // Procesar el callback según el proveedor
        let response;
        switch (provider) {
          case 'google':
            response = await authService.processGoogleCallback(code, state);
            break;
          case 'linkedin':
            response = await authService.processLinkedInCallback(code, state);
            break;
          case 'microsoft':
            response = await authService.processMicrosoftCallback(code, state);
            break;
          default:
            // Intentar detectar el proveedor por la URL
            if (window.location.href.includes('google')) {
              response = await authService.processGoogleCallback(code, state);
            } else if (window.location.href.includes('linkedin')) {
              response = await authService.processLinkedInCallback(code, state);
            } else if (window.location.href.includes('microsoft')) {
              response = await authService.processMicrosoftCallback(code, state);
            } else {
              throw new Error('Proveedor de autenticación no reconocido');
            }
        }

        // Si la autenticación es exitosa
        if (response.success) {
          // Actualizar el contexto de autenticación
          setTokens(response.accessToken, response.refreshToken);
          setUser(response.user);
          
          setStatus('success');
          
          // Redirigir al usuario a la página principal
          setTimeout(() => {
            navigate('/user-home');
          }, 2000);
        } else {
          throw new Error(response.message || 'Error en la autenticación');
        }

      } catch (error) {
        console.error('Error en callback OAuth:', error);
        setError(error.message);
        setStatus('error');
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, setUser, setTokens]);

  // Renderizar según el estado
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Procesando autenticación...
          </h2>
          <p className="text-gray-600">
            Por favor, espera mientras completamos tu inicio de sesión.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            ¡Autenticación exitosa!
          </h2>
          <p className="text-gray-600 mb-4">
            Has iniciado sesión correctamente. Serás redirigido en unos segundos...
          </p>
          <div className="animate-pulse text-blue-600">
            Redirigiendo...
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error en la autenticación
          </h2>
          <p className="text-gray-600 mb-4">
            {error || 'Ocurrió un error durante el proceso de autenticación.'}
          </p>
          <p className="text-sm text-gray-500">
            Serás redirigido al login en unos segundos...
          </p>
        </div>
      </div>
    );
  }

  return null;
}
