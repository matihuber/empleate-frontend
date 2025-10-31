import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_VERSION = '/api/v1';

/**
 * Servicio para interactuar con la API de suscripciones de MercadoPago
 */
class MercadoPagoService {
    /**
     * Obtiene la public key de MercadoPago
     */
    async getPublicKey() {
        try {
            const response = await axios.get(`${API_BASE_URL}${API_VERSION}/mercadopago/public-key`);
            return response.data.public_key;
        } catch (error) {
            console.error('Error obteniendo public key:', error);
            throw new Error('No se pudo obtener la clave pública de MercadoPago');
        }
    }

    /**
     * Obtiene los precios de los planes en USD y ARS
     */
    async getPricing() {
        try {
            const token = localStorage.getItem('empleate_access_token');
            const response = await axios.get(`${API_BASE_URL}${API_VERSION}/mercadopago/pricing`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error obteniendo precios:', error);
            throw new Error('No se pudieron obtener los precios');
        }
    }

    /**
     * Crea una nueva suscripción
     * @param {Object} subscriptionData
     * @param {string} subscriptionData.plan - Plan de suscripción (PRO o PREMIUM)
     * @param {string} subscriptionData.payment_token - Token de pago de MercadoPago
     * @param {string} subscriptionData.email - Email del usuario
     */
    async createSubscription(subscriptionData) {
        try {
            const token = localStorage.getItem('empleate_access_token');
            const response = await axios.post(
                `${API_BASE_URL}${API_VERSION}/mercadopago/create-subscription`,
                subscriptionData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error creando suscripción:', error);

            // Extraer mensaje de error específico
            const errorMessage =
                error.response?.data?.detail || 'No se pudo crear la suscripción';

            throw new Error(errorMessage);
        }
    }

    /**
     * Cancela la suscripción activa del usuario
     * @param {string} reason - Razón de cancelación (opcional)
     */
    async cancelSubscription(reason = null) {
        try {
            const token = localStorage.getItem('empleate_access_token');
            const response = await axios.post(
                `${API_BASE_URL}${API_VERSION}/mercadopago/cancel-subscription`,
                { reason },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error cancelando suscripción:', error);

            const errorMessage =
                error.response?.data?.detail || 'No se pudo cancelar la suscripción';

            throw new Error(errorMessage);
        }
    }

    /**
     * Obtiene la suscripción activa del usuario
     */
    async getCurrentSubscription() {
        try {
            const token = localStorage.getItem('empleate_access_token');
            const response = await axios.get(`${API_BASE_URL}${API_VERSION}/mercadopago/subscription`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            // Si no hay suscripción activa, devolver null en lugar de error
            if (error.response?.status === 404) {
                return null;
            }

            console.error('Error obteniendo suscripción:', error);
            throw new Error('No se pudo obtener la información de la suscripción');
        }
    }

    /**
     * Obtiene el historial de suscripciones del usuario
     */
    async getSubscriptionHistory() {
        try {
            const token = localStorage.getItem('empleate_access_token');
            const response = await axios.get(
                `${API_BASE_URL}${API_VERSION}/mercadopago/subscription-history`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error obteniendo historial:', error);
            throw new Error('No se pudo obtener el historial de suscripciones');
        }
    }

    /**
     * Obtiene el estado de una suscripción específica desde MercadoPago
     * @param {string} preapprovalId - ID de la suscripción en MercadoPago
     */
    async getSubscriptionStatus(preapprovalId) {
        try {
            const token = localStorage.getItem('empleate_access_token');
            const response = await axios.get(
                `${API_BASE_URL}${API_VERSION}/mercadopago/subscription-status/${preapprovalId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error obteniendo estado:', error);
            throw new Error('No se pudo obtener el estado de la suscripción');
        }
    }

    /**
     * Carga el script del SDK de MercadoPago dinámicamente
     * @param {string} publicKey - Public key de MercadoPago
     */
    loadMercadoPagoSDK(publicKey) {
        return new Promise((resolve, reject) => {
            // Verificar si ya está cargado
            if (window.MercadoPago) {
                resolve(window.MercadoPago);
                return;
            }

            // Crear script tag
            const script = document.createElement('script');
            script.src = 'https://sdk.mercadopago.com/js/v2';
            script.async = true;

            script.onload = () => {
                if (window.MercadoPago) {
                    // Inicializar MercadoPago con la public key
                    const mp = new window.MercadoPago(publicKey);
                    resolve(mp);
                } else {
                    reject(new Error('MercadoPago SDK no se cargó correctamente'));
                }
            };

            script.onerror = () => {
                reject(new Error('Error al cargar el SDK de MercadoPago'));
            };

            document.body.appendChild(script);
        });
    }

    /**
     * Crea un token de tarjeta usando el SDK de MercadoPago
     * @param {Object} mp - Instancia del SDK de MercadoPago
     * @param {Object} cardData - Datos de la tarjeta
     * @param {string} cardData.cardNumber - Número de tarjeta sin espacios
     * @param {string} cardData.cardholderName - Nombre del titular
     * @param {string} cardData.expirationMonth - Mes de vencimiento (MM)
     * @param {string} cardData.expirationYear - Año de vencimiento (YYYY)
     * @param {string} cardData.securityCode - Código de seguridad
     * @param {string} cardData.identificationType - Tipo de identificación (DNI, etc)
     * @param {string} cardData.identificationNumber - Número de identificación
     */
    async createCardToken(mp, cardData) {
        try {
            const token = await mp.createCardToken(cardData);
            return token;
        } catch (error) {
            console.error('Error creando token de tarjeta:', error);
            throw new Error('No se pudo tokenizar la tarjeta');
        }
    }

    /**
     * Formatea los datos de la tarjeta para MercadoPago
     * @param {Object} formData - Datos del formulario
     */
    formatCardDataForMP(formData) {
        // Extraer mes y año de la fecha MM/YY
        const [month, year] = formData.expiryDate.split('/');
        const fullYear = `20${year}`; // Convertir YY a YYYY

        return {
            cardNumber: formData.cardNumber.replace(/\s/g, ''), // Remover espacios
            cardholderName: formData.cardHolder.toUpperCase(),
            expirationMonth: month,
            expirationYear: fullYear,
            securityCode: formData.cvv,
            identificationType: 'DNI', // Valor por defecto para Argentina
            identificationNumber: '00000000', // TODO: Solicitar DNI al usuario
        };
    }
}

// Exportar instancia singleton
const mercadopagoService = new MercadoPagoService();
export default mercadopagoService;
