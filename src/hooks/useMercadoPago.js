import { useState, useEffect, useCallback, useRef } from 'react';
import mercadopagoService from '../services/mercadopagoService';

/**
 * Hook personalizado para integración con MercadoPago
 * Maneja la inicialización del SDK, tokenización y creación de suscripciones
 */
export const useMercadoPago = () => {
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [publicKey, setPublicKey] = useState(null);

    // Usar ref para la instancia de MercadoPago (es una clase, no debe ir en estado)
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
                mpRef.current = mpInstance;
                setIsReady(true);

                console.log('✅ MercadoPago SDK inicializado correctamente');
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
     * Crea un token de tarjeta de crédito
     * @param {Object} cardFormData - Datos del formulario de tarjeta
     */
    const createCardToken = useCallback(
        async (cardFormData) => {
            if (!mpRef.current) {
                throw new Error('MercadoPago SDK no está inicializado');
            }

            try {
                setIsLoading(true);
                setError(null);

                // Formatear datos para MercadoPago
                const cardData = mercadopagoService.formatCardDataForMP(cardFormData);

                // Crear token
                const token = await mercadopagoService.createCardToken(mpRef.current, cardData);

                console.log('✅ Token de tarjeta creado:', token.id);

                return token.id;
            } catch (err) {
                console.error('❌ Error creando token:', err);
                setError('No se pudo procesar la tarjeta. Verifica los datos ingresados.');
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    /**
     * Crea una suscripción con MercadoPago
     * @param {Object} subscriptionData
     * @param {string} subscriptionData.plan - Plan (PRO o PREMIUM)
     * @param {Object} subscriptionData.cardFormData - Datos de la tarjeta
     * @param {string} subscriptionData.email - Email del usuario
     */
    const createSubscription = useCallback(
        async (subscriptionData) => {
            try {
                setIsLoading(true);
                setError(null);

                // Paso 1: Crear token de tarjeta
                const cardToken = await createCardToken(subscriptionData.cardFormData);

                // Paso 2: Crear suscripción en el backend
                const result = await mercadopagoService.createSubscription({
                    plan: subscriptionData.plan,
                    payment_token: cardToken,
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
        [createCardToken]
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

    return {
        // Estado
        isReady,
        isLoading,
        error,
        publicKey,

        // Acciones
        createCardToken,
        createSubscription,
        cancelSubscription,
        getPricing,
        getCurrentSubscription,
        getSubscriptionHistory,
        clearError,
    };
};

export default useMercadoPago;
