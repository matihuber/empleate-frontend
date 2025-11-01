import { useState, useEffect, useCallback, useRef } from 'react';
import mercadopagoService from '../services/mercadopagoService';

/**
 * Hook personalizado para integración con MercadoPago
 * Maneja la inicialización del SDK y creación de suscripciones
 *
 * El token de pago se crea ahora usando CardForm del SDK v2,
 * no se usa createCardToken directamente
 */
export const useMercadoPago = () => {
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [publicKey, setPublicKey] = useState(null);

    // Usar ref para almacenar la instancia de mp (evita problemas de serialización de React)
    const mpRef = useRef(null);

    /**
     * Inicializa el SDK de MercadoPago al montar el componente
     */
    useEffect(() => {
        const initMercadoPago = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Obtener public key del backend
                const key = await mercadopagoService.getPublicKey();
                setPublicKey(key);

                // Cargar SDK
                const mpInstance = await mercadopagoService.loadMercadoPagoSDK(key);

                // Almacenar en ref (evita problemas de serialización)
                mpRef.current = mpInstance;

                console.log('✅ MercadoPago SDK inicializado correctamente');
                console.log('🔍 mpRef.current almacenado:', mpRef.current);
                console.log('🔍 Tipo:', typeof mpRef.current);

                setIsReady(true);
            } catch (err) {
                console.error('❌ Error inicializando MercadoPago:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        initMercadoPago();
    }, []);

    /**
     * Crea una suscripción con MercadoPago
     * @param {Object} subscriptionData
     * @param {string} subscriptionData.plan - Plan (PRO o PREMIUM)
     * @param {string} subscriptionData.payment_token - Token de la tarjeta (generado por CardForm)
     * @param {string} subscriptionData.email - Email del usuario
     */
    const createSubscription = useCallback(
        async (subscriptionData) => {
            try {
                setIsLoading(true);
                setError(null);

                // Crear suscripción en el backend con el token generado por CardForm
                const result = await mercadopagoService.createSubscription({
                    plan: subscriptionData.plan,
                    payment_token: subscriptionData.payment_token,
                    email: subscriptionData.email,
                });

                console.log('✅ Suscripción creada exitosamente:', result);

                return result;
            } catch (err) {
                console.error('❌ Error creando suscripción:', err);
                const errorMessage =
                    err.message || 'No se pudo crear la suscripción. Intenta nuevamente.';
                setError(errorMessage);
                throw new Error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    /**
     * Cancela la suscripción activa
     * @param {string} reason - Razón de cancelación
     */
    const cancelSubscription = useCallback(async (reason = null) => {
        try {
            setIsLoading(true);
            setError(null);

            const result = await mercadopagoService.cancelSubscription(reason);

            console.log('✅ Suscripción cancelada exitosamente');

            return result;
        } catch (err) {
            console.error('❌ Error cancelando suscripción:', err);
            const errorMessage =
                err.message || 'No se pudo cancelar la suscripción. Intenta nuevamente.';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Obtiene los precios actuales de los planes
     */
    const getPricing = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const pricing = await mercadopagoService.getPricing();

            return pricing;
        } catch (err) {
            console.error('❌ Error obteniendo precios:', err);
            const errorMessage = err.message || 'No se pudieron obtener los precios';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Obtiene la suscripción activa del usuario
     */
    const getCurrentSubscription = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const subscription = await mercadopagoService.getCurrentSubscription();

            return subscription; // Retorna null si no hay suscripción activa
        } catch (err) {
            console.error('❌ Error obteniendo suscripción:', err);
            // No lanzar error ni setear error state si no hay suscripción
            // El servicio ya maneja el 404 devolviendo null
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Obtiene el historial de suscripciones
     */
    const getSubscriptionHistory = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const history = await mercadopagoService.getSubscriptionHistory();

            return history;
        } catch (err) {
            console.error('❌ Error obteniendo historial:', err);
            const errorMessage =
                err.message || 'No se pudo obtener el historial de suscripciones';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Limpia el error actual
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Debug: verificar qué estamos retornando
    console.log('🔍 Hook - Retornando mp:', mpRef.current);
    console.log('🔍 Hook - Tipo de mp:', typeof mpRef.current);

    return {
        // Estado
        isReady,
        isLoading,
        error,
        publicKey,

        // Instancia del SDK (para usar con CardForm)
        mp: mpRef.current,

        // Acciones
        createSubscription,
        cancelSubscription,
        getPricing,
        getCurrentSubscription,
        getSubscriptionHistory,
        clearError,
    };
};

export default useMercadoPago;
