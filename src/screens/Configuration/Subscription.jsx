import { ChevronLeft, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SubscriptionHistory from './SubscriptionHistory';
import { useMercadoPago } from '../../hooks/useMercadoPago';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmationModal from '../../components/ConfirmationModal';

const Subscription = ({ onBack }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [showHistory, setShowHistory] = useState(false);
    const [pricing, setPricing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPlan, setCurrentPlan] = useState('FREE'); // TODO: Obtener del contexto/API
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const {
        getPricing,
        cancelSubscription,
        getCurrentSubscription,
        isLoading: mpLoading,
    } = useMercadoPago();

    // Cargar precios y suscripción actual al montar
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                // Cargar precios
                const prices = await getPricing();
                setPricing(prices);

                // Cargar suscripción actual
                const subscription = await getCurrentSubscription();
                if (subscription) {
                    setCurrentPlan(subscription.plan);
                }
            } catch (err) {
                console.error('Error cargando datos:', err);
                setError('No se pudieron cargar los datos de suscripción');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [getPricing, getCurrentSubscription]);

    // Si está mostrando el historial, renderizar ese componente
    if (showHistory) {
        return <SubscriptionHistory onBack={() => setShowHistory(false)} />;
    }

    // Obtener nombre legible del plan actual
    const getCurrentPlanName = () => {
        const planMap = {
            'FREE': 'Gratuito',
            'free': 'Gratuito',
            'PRO': 'Pro',
            'pro': 'Pro',
            'PREMIUM': 'Premium',
            'premium': 'Premium'
        };
        return planMap[currentPlan] || currentPlan;
    };

    // Manejar click en plan
    const handlePlanClick = async (planName) => {
        if (planName === 'Gratuito') {
            // Mostrar modal de confirmación para cancelar suscripción
            setShowCancelModal(true);
        } else {
            // Navegar a checkout con el plan seleccionado
            const planKey = planName === 'Pro' ? 'PRO' : 'PREMIUM';
            navigate(`/checkout?plan=${planKey}`);
        }
    };

    // Confirmar cancelación de suscripción
    const handleConfirmCancel = async () => {
        try {
            setLoading(true);
            setError(null);
            await cancelSubscription('Cambio a plan gratuito');
            setCurrentPlan('FREE');
            setShowCancelModal(false);
            setShowSuccessModal(true);
            // Los datos se recargarán cuando se cierre el modal y se navegue a configuración
        } catch (err) {
            setError(err.message || 'Error al cancelar suscripción. Intenta nuevamente.');
            setShowCancelModal(false);
        } finally {
            setLoading(false);
        }
    };

    const plans = [
        {
            name: 'Gratuito',
            planKey: 'FREE',
            price: '$0',
            priceARS: null,
            description: 'Funcionalidades básicas para comenzar',
            features: [
                { text: 'Generación de 1 CV único', included: true },
                { text: 'Acceso a 1 template básico', included: true },
                { text: 'Análisis del perfil profesional de LinkedIn', included: false },
                { text: 'CVs optimizados para superar filtros ATS', included: false },
                { text: 'Estimación salarial', included: false },
                { text: 'Recomendaciones de cursos', included: false },
            ],
        },
        {
            name: 'Pro',
            planKey: 'PRO',
            price: '$6.99',
            priceARS: pricing?.pro?.price_ars,
            period: '/mes',
            description: 'CVs profesionales optimizados con IA',
            features: [
                { text: 'Generar hasta 5 CVs por mes', included: true },
                { text: 'Acceso a todos los templates disponibles', included: true },
                { text: 'Análisis del perfil profesional de LinkedIn', included: true },
                { text: 'CVs optimizados para superar filtros ATS', included: true },
                { text: 'Estimación salarial', included: false },
                { text: 'Recomendaciones de cursos', included: false },
            ],
            buttonText: 'Obtener Pro',
        },
        {
            name: 'Premium',
            planKey: 'PREMIUM',
            price: '$11.99',
            priceARS: pricing?.premium?.price_ars,
            period: '/mes',
            description: 'Acceso completo a todas las funcionalidades',
            features: [
                { text: 'Generar hasta 100 CVs por mes', included: true },
                { text: 'Acceso a todos los templates disponibles', included: true },
                { text: 'Análisis del perfil profesional de LinkedIn', included: true },
                { text: 'CVs optimizados para superar filtros ATS', included: true },
                { text: 'Estimación salarial', included: true },
                { text: 'Recomendaciones de cursos personalizados', included: true },
            ],
            buttonText: 'Obtener Premium',
        },
    ];

    if (loading || mpLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full pb-4">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
                    Suscripción
                </h1>
                <p className="text-gray-600 mt-2">
                    Elige el plan que mejor se adapte a tus necesidades
                </p>
            </div>

            {/* Error message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}

            {/* Planes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => {
                    // Normalizar a mayúsculas para comparación (backend devuelve minúsculas)
                    const normalizedCurrentPlan = currentPlan?.toUpperCase();
                    const isCurrent = plan.planKey === normalizedCurrentPlan;

                    // Determinar texto y estilo del botón
                    let buttonText, buttonClass, isDisabled = false, buttonAction;

                    if (isCurrent) {
                        // Es el plan actual
                        if (plan.planKey === 'FREE') {
                            buttonText = 'Tu plan actual';
                            buttonClass = 'bg-gray-200 text-gray-500 cursor-default';
                            isDisabled = true;
                        } else {
                            // PRO o PREMIUM
                            buttonText = 'Cancelar suscripción';
                            buttonClass = 'bg-red-600 hover:bg-red-700 text-white cursor-pointer active:scale-95';
                            buttonAction = () => setShowCancelModal(true);
                        }
                    } else {
                        // No es el plan actual
                        if (plan.planKey === 'FREE') {
                            buttonText = 'Plan gratuito';
                            buttonClass = 'bg-gray-200 text-gray-500 cursor-default';
                            isDisabled = true;
                        } else {
                            // PRO o PREMIUM
                            buttonText = plan.buttonText;
                            buttonClass = 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-95';
                            buttonAction = () => handlePlanClick(plan.name);
                        }
                    }

                    return (
                        <div
                            key={plan.name}
                            className={`bg-white rounded-xl border-2 p-6 shadow-md transition-all ${
                                isCurrent
                                    ? 'border-blue-600 ring-2 ring-blue-100'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    {plan.name}
                                </h3>
                                {isCurrent && (
                                    <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                                        Plan actual
                                    </span>
                                )}
                            </div>

                            <div className="mb-2">
                                <span className="text-3xl font-bold text-gray-900">
                                    {plan.price}
                                </span>
                                {plan.period && (
                                    <span className="text-gray-600">{plan.period}</span>
                                )}
                            </div>

                            {/* Mostrar precio en ARS o un espaciador para alinear todos los planes */}
                            <div className="mb-4 h-7">
                                {plan.priceARS && (
                                    <>
                                        <span className="text-lg text-gray-600">
                                            ≈ ${plan.priceARS.toFixed(2)} ARS
                                        </span>
                                        <span className="text-gray-500 text-sm">{plan.period}</span>
                                    </>
                                )}
                            </div>

                            <p className="text-sm text-gray-600 mb-6">{plan.description}</p>

                            <button
                                onClick={buttonAction}
                                disabled={isDisabled}
                                className={`w-full py-3 px-4 rounded-lg font-medium transition-all mb-6 ${buttonClass}`}
                            >
                                {buttonText}
                            </button>

                            <ul className="space-y-3">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start">
                                        {feature.included ? (
                                            <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        ) : (
                                            <X className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                        )}
                                        <span
                                            className={`text-sm ${
                                                feature.included ? 'text-gray-700' : 'text-gray-500'
                                            }`}
                                        >
                                            {feature.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>

            {/* Nota sobre conversión */}
            {pricing && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        💡 Los precios en ARS se calculan usando la cotización del dólar oficial
                        del día 15 de cada mes. Tasa actual: 1 USD ≈ $
                        {pricing.pro?.usd_ars_rate?.toFixed(2) || pricing.premium?.usd_ars_rate?.toFixed(2) || 'N/A'} ARS
                    </p>
                </div>
            )}

            {/* Enlaces inferiores */}
            <div className="mt-6 mb-2 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    <span className="text-sm font-medium">Volver</span>
                </button>

                <div className="flex items-center space-x-4 text-sm">
                    <button
                        onClick={() => setShowHistory(true)}
                        className="text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                        Ver historial de facturación
                    </button>
                </div>
            </div>

            {/* Modal de confirmación para cancelar suscripción */}
            <ConfirmationModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleConfirmCancel}
                title="Cancelar suscripción"
                message={`¿Estás seguro de que deseas cancelar tu suscripción al plan ${getCurrentPlanName()}? Perderás acceso a las funcionalidades del plan ${getCurrentPlanName()}.`}
                confirmText="Sí, cancelar"
                cancelText="No, mantener"
                type="danger"
            />

            {/* Modal de éxito después de cancelar */}
            {showSuccessModal && (
                <div className="fixed inset-0 backdrop-brightness-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-xl relative">
                        <button
                            onClick={() => {
                                setShowSuccessModal(false);
                                // Usar onBack que ya recarga los datos y vuelve a main
                                if (onBack) {
                                    onBack();
                                }
                            }}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Suscripción cancelada
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Tu suscripción ha sido cancelada exitosamente. Has vuelto al plan gratuito.
                            </p>
                            <button
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    // Usar onBack que ya recarga los datos y vuelve a main
                                    if (onBack) {
                                        onBack();
                                    }
                                }}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Subscription;
