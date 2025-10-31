import { ChevronLeft, Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SubscriptionHistory from './SubscriptionHistory';
import { useMercadoPago } from '../../hooks/useMercadoPago';
import { useAuth } from '../../contexts/AuthContext';

const Subscription = ({ onBack }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [showHistory, setShowHistory] = useState(false);
    const [pricing, setPricing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPlan, setCurrentPlan] = useState('FREE'); // TODO: Obtener del contexto/API

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

    // Manejar click en plan
    const handlePlanClick = async (planName) => {
        if (planName === 'Gratuito') {
            // Cancelar suscripción actual
            if (
                window.confirm(
                    '¿Estás seguro de que deseas cancelar tu suscripción? Perderás acceso a las funcionalidades premium.'
                )
            ) {
                try {
                    setLoading(true);
                    await cancelSubscription('Cambio a plan gratuito');
                    setCurrentPlan('FREE');
                    alert('Suscripción cancelada exitosamente');
                } catch (err) {
                    alert('Error al cancelar suscripción: ' + err.message);
                } finally {
                    setLoading(false);
                }
            }
        } else {
            // Navegar a checkout con el plan seleccionado
            const planKey = planName === 'Pro' ? 'PRO' : 'PREMIUM';
            navigate(`/checkout?plan=${planKey}`);
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
            priceARS: pricing?.PRO?.price_ars,
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
            priceARS: pricing?.PREMIUM?.price_ars,
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
                    const isCurrent = plan.planKey === currentPlan;

                    return (
                        <div
                            key={plan.name}
                            className={`bg-white rounded-xl border-2 p-6 shadow-md transition-all ${
                                isCurrent
                                    ? 'border-blue-600 ring-2 ring-blue-100'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            {isCurrent && (
                                <div className="mb-3">
                                    <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                                        Plan actual
                                    </span>
                                </div>
                            )}

                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {plan.name}
                            </h3>

                            <div className="mb-2">
                                <span className="text-3xl font-bold text-gray-900">
                                    {plan.price}
                                </span>
                                {plan.period && (
                                    <span className="text-gray-600">{plan.period}</span>
                                )}
                            </div>

                            {plan.priceARS && (
                                <div className="mb-4">
                                    <span className="text-lg text-gray-600">
                                        ≈ ${plan.priceARS.toFixed(2)} ARS
                                    </span>
                                    <span className="text-gray-500 text-sm">{plan.period}</span>
                                </div>
                            )}

                            <p className="text-sm text-gray-600 mb-6">{plan.description}</p>

                            <button
                                onClick={() => !isCurrent && handlePlanClick(plan.name)}
                                className={`w-full py-3 px-4 rounded-lg font-medium transition-all mb-6 ${
                                    isCurrent
                                        ? 'bg-gray-200 text-gray-500 cursor-default'
                                        : plan.planKey === 'FREE'
                                        ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer active:scale-95'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-95'
                                }`}
                                disabled={isCurrent}
                            >
                                {isCurrent
                                    ? 'Tu plan actual'
                                    : plan.planKey === 'FREE'
                                    ? 'Cancelar suscripción'
                                    : plan.buttonText}
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
                        {pricing.PRO?.usd_ars_rate?.toFixed(2)} ARS
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
        </div>
    );
};

export default Subscription;
