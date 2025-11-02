import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CreditCardForm from '../components/CreditCardForm';
import { useMercadoPago } from '../hooks/useMercadoPago';
import { useAuth } from '../contexts/AuthContext';

/**
 * Pantalla de Checkout para procesar suscripciones
 */
const Checkout = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();

    const plan = searchParams.get('plan') || 'PRO';

    const [pricing, setPricing] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const {
        isReady,
        isLoading,
        error: mpError,
        mp,
        createSubscription,
        getPricing,
        clearError,
    } = useMercadoPago();

    // Cargar precios al montar
    useEffect(() => {
        const loadPricing = async () => {
            try {
                const prices = await getPricing();
                setPricing(prices);
            } catch (err) {
                setError('No se pudieron cargar los precios. Intenta nuevamente.');
            }
        };

        if (isReady) {
            loadPricing();
        }
    }, [isReady, getPricing]);

    // Limpiar errores cuando cambie mpError
    useEffect(() => {
        if (mpError) {
            setError(mpError);
        }
    }, [mpError]);

    // Validar que el plan sea válido
    useEffect(() => {
        if (!['PRO', 'PREMIUM'].includes(plan)) {
            setError('Plan inválido');
        }
    }, [plan]);

    const handleFormSubmit = async (tokenData) => {
        try {
            setError(null);
            clearError();

            // Crear suscripción con el token generado por CardForm
            // Normalizar plan a lowercase para coincidir con los enum values del backend
            const result = await createSubscription({
                plan: plan.toLowerCase(),
                payment_token: tokenData.token,
                email: user.email,
            });

            // Mostrar éxito
            setSuccess(true);

            // Redirigir después de 2 segundos a configuración principal
            setTimeout(() => {
                // Navegar directamente a user-home/configuración con el parámetro para recargar
                navigate('/user-home?section=configuracion&subscriptionUpdated=true');
            }, 2000);
        } catch (err) {
            console.error('❌ Error en checkout:', err);
            setError(err.message || 'Error al procesar el pago. Intenta nuevamente.');
        }
    };

    const getPlanInfo = () => {
        if (!pricing) {
            return null;
        }

        // Normalizar plan a lowercase para coincidir con las keys del backend
        const planKey = plan.toLowerCase();

        if (!pricing[planKey]) {
            return null;
        }

        const planData = pricing[planKey];

        return {
            name: planData.name,
            priceUSD: planData.price_usd,
            priceARS: planData.price_ars,
            rate: planData.usd_ars_rate,
        };
    };

    const planInfo = getPlanInfo();

    // Pantalla de carga inicial
    if (!isReady || !pricing) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    // Pantalla de éxito
    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        ¡Suscripción exitosa!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Tu suscripción al plan {plan} ha sido procesada correctamente.
                    </p>
                    <p className="text-sm text-gray-500">Redirigiendo...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <button
                        onClick={() => navigate('/user-home?section=configuracion&view=subscription')}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Volver a planes
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                    <p className="text-gray-600 mt-2">
                        Completa tu suscripción al plan {plan}
                    </p>
                </div>

                {/* Resumen del plan */}
                {planInfo && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            Resumen de suscripción
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Plan</span>
                                <span className="font-semibold text-gray-900">
                                    {planInfo.name}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Precio (USD)</span>
                                <span className="font-semibold text-gray-900">
                                    ${planInfo.priceUSD} USD
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Precio (ARS)</span>
                                <span className="font-semibold text-gray-900">
                                    ${planInfo.priceARS.toFixed(2)} ARS
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Tasa de cambio</span>
                                <span className="text-gray-500">
                                    1 USD = ${planInfo.rate.toFixed(2)} ARS
                                </span>
                            </div>
                            <div className="border-t border-gray-200 pt-3 mt-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-900">
                                        Total mensual
                                    </span>
                                    <span className="text-2xl font-bold text-blue-600">
                                        ${planInfo.priceARS.toFixed(2)} ARS
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-4">
                            * La suscripción se renovará automáticamente cada mes. Puedes
                            cancelarla en cualquier momento desde tu configuración.
                        </p>
                    </div>
                )}

                {/* Error message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start">
                            <svg
                                className="w-5 h-5 text-red-600 mt-0.5 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <div>
                                <h3 className="text-sm font-semibold text-red-800">
                                    Error al procesar el pago
                                </h3>
                                <p className="text-sm text-red-600 mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Formulario de tarjeta */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">
                        Datos de pago
                    </h2>

                    <CreditCardForm
                        onSubmit={handleFormSubmit}
                        isLoading={isLoading}
                        submitButtonText={`Suscribirse por $${planInfo?.priceARS.toFixed(2)} ARS/mes`}
                        amount={planInfo?.priceARS?.toString() || "0"}
                        mp={mp}
                    />
                </div>

                {/* Info de seguridad */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Procesado de forma segura por MercadoPago
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-2">
                        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <p className="text-xs text-gray-500">
                            Tus datos están encriptados y seguros
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
