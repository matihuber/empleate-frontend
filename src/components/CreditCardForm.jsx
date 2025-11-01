import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import CreditCard from './CreditCard';

/**
 * Formulario de tarjeta de crédito integrado con MercadoPago CardForm
 * Muestra una visualización 3D de la tarjeta que se actualiza mientras el usuario escribe
 */
const CreditCardForm = ({
    onSubmit,
    onFormReady,
    isLoading = false,
    submitButtonText = 'Continuar',
    amount = "0",
    mp = null
}) => {
    const [formData, setFormData] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
    });

    const [cardType, setCardType] = useState('visa');
    const [isFlipped, setIsFlipped] = useState(false);
    const [mpCardForm, setMpCardForm] = useState(null);
    const formRef = useRef(null);

    // Inicializar CardForm de MercadoPago
    useEffect(() => {
        if (!mp) return;

        // Evitar doble inicialización (React StrictMode)
        if (mpCardForm) return;

        const initCardForm = async () => {
            try {
                console.log('🔄 Inicializando CardForm de MercadoPago...');
                console.log('🔍 Objeto mp:', mp);
                console.log('🔍 Tipo de mp:', typeof mp);
                console.log('🔍 Propiedades de mp:', Object.keys(mp || {}));
                console.log('🔍 ¿Tiene cardForm?:', typeof mp?.cardForm);

                const cardForm = await mp.cardForm({
                    amount: amount,
                    iframe: false, // Usar campos HTML normales, no iframe
                    form: {
                        id: "form-checkout",
                        cardNumber: {
                            id: "form-checkout__cardNumber",
                            placeholder: "1234 5678 9012 3456",
                        },
                        expirationDate: {
                            id: "form-checkout__expirationDate",
                            placeholder: "MM/YY",
                        },
                        securityCode: {
                            id: "form-checkout__securityCode",
                            placeholder: "123",
                        },
                        cardholderName: {
                            id: "form-checkout__cardholderName",
                            placeholder: "NOMBRE DEL TITULAR",
                        },
                        identificationType: {
                            id: "form-checkout__identificationType",
                        },
                        identificationNumber: {
                            id: "form-checkout__identificationNumber",
                            placeholder: "Número de documento",
                        },
                        issuer: {
                            id: "form-checkout__issuer",
                            placeholder: "Banco emisor",
                        },
                        installments: {
                            id: "form-checkout__installments",
                            placeholder: "Cuotas",
                        },
                    },
                    callbacks: {
                        onFormMounted: error => {
                            if (error) {
                                console.error("❌ Error montando formulario:", error);
                                return;
                            }
                            console.log("✅ Formulario de MercadoPago montado");
                            if (onFormReady) onFormReady();
                        },
                        onSubmit: async (event) => {
                            event.preventDefault();

                            try {
                                const cardFormData = cardForm.getCardFormData();
                                console.log('✅ Datos del formulario obtenidos:', cardFormData);

                                // Llamar al callback con el token y datos
                                onSubmit({
                                    token: cardFormData.token,
                                    paymentMethodId: cardFormData.paymentMethodId,
                                    issuerId: cardFormData.issuerId,
                                    installments: cardFormData.installments,
                                    identificationType: cardFormData.identificationType,
                                    identificationNumber: cardFormData.identificationNumber,
                                    cardholderName: cardFormData.cardholderName,
                                });
                            } catch (error) {
                                console.error('❌ Error en submit:', error);
                            }
                        },
                        onFetching: (resource) => {
                            console.log("Fetching resource:", resource);
                        },
                    },
                });

                setMpCardForm(cardForm);
                console.log('✅ CardForm inicializado correctamente');
            } catch (error) {
                console.error('❌ Error inicializando CardForm:', error);
            }
        };

        initCardForm();
    }, [mp, amount, onSubmit, onFormReady, mpCardForm]);

    // Sincronizar valores con la tarjeta visual
    useEffect(() => {
        const syncInterval = setInterval(() => {
            if (!formRef.current) return;

            const cardNumberInput = document.getElementById('form-checkout__cardNumber');
            const cardHolderInput = document.getElementById('form-checkout__cardholderName');
            const expiryInput = document.getElementById('form-checkout__expirationDate');
            const cvvInput = document.getElementById('form-checkout__securityCode');

            if (cardNumberInput) {
                const value = cardNumberInput.value || '';
                if (value !== formData.cardNumber) {
                    setFormData(prev => ({ ...prev, cardNumber: value }));

                    // Detectar tipo de tarjeta
                    if (value.startsWith('4')) {
                        setCardType('visa');
                    } else if (value.startsWith('5') || value.startsWith('2')) {
                        setCardType('mastercard');
                    }
                }
            }

            if (cardHolderInput) {
                const value = cardHolderInput.value || '';
                if (value !== formData.cardHolder) {
                    setFormData(prev => ({ ...prev, cardHolder: value }));
                }
            }

            if (expiryInput) {
                const value = expiryInput.value || '';
                if (value !== formData.expiryDate) {
                    setFormData(prev => ({ ...prev, expiryDate: value }));
                }
            }

            if (cvvInput) {
                const value = cvvInput.value || '';
                if (value !== formData.cvv) {
                    setFormData(prev => ({ ...prev, cvv: value }));
                }
            }
        }, 100);

        return () => clearInterval(syncInterval);
    }, [formData]);

    // Manejar focus/blur en CVV (voltear tarjeta)
    useEffect(() => {
        const cvvInput = document.getElementById('form-checkout__securityCode');
        if (!cvvInput) return;

        const handleCVVFocus = () => setIsFlipped(true);
        const handleCVVBlur = () => setIsFlipped(false);

        cvvInput.addEventListener('focus', handleCVVFocus);
        cvvInput.addEventListener('blur', handleCVVBlur);

        return () => {
            cvvInput.removeEventListener('focus', handleCVVFocus);
            cvvInput.removeEventListener('blur', handleCVVBlur);
        };
    }, [mpCardForm]);

    return (
        <div className="w-full max-w-md mx-auto" ref={formRef}>
            {/* Tarjeta 3D */}
            <div className="mb-8">
                <CreditCard
                    cardNumber={formData.cardNumber}
                    cardHolder={formData.cardHolder}
                    expiryDate={formData.expiryDate}
                    cvv={formData.cvv}
                    isFlipped={isFlipped}
                    cardType={cardType}
                />
            </div>

            {/* Formulario de MercadoPago */}
            <form id="form-checkout" className="space-y-4">
                {/* Número de tarjeta */}
                <div>
                    <label
                        htmlFor="form-checkout__cardNumber"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Número de tarjeta
                    </label>
                    <input
                        type="text"
                        id="form-checkout__cardNumber"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isLoading}
                    />
                </div>

                {/* Nombre del titular */}
                <div>
                    <label
                        htmlFor="form-checkout__cardholderName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Nombre del titular
                    </label>
                    <input
                        type="text"
                        id="form-checkout__cardholderName"
                        placeholder="JUAN PÉREZ"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isLoading}
                    />
                </div>

                {/* Fecha y CVV */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Fecha de vencimiento */}
                    <div>
                        <label
                            htmlFor="form-checkout__expirationDate"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Vencimiento
                        </label>
                        <input
                            type="text"
                            id="form-checkout__expirationDate"
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isLoading}
                        />
                    </div>

                    {/* CVV */}
                    <div>
                        <label
                            htmlFor="form-checkout__securityCode"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            CVV
                        </label>
                        <input
                            type="text"
                            id="form-checkout__securityCode"
                            placeholder="123"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {/* Tipo de identificación (oculto, valor por defecto DNI para Argentina) */}
                <input type="hidden" id="form-checkout__identificationType" value="DNI" />

                {/* Número de identificación */}
                <div>
                    <label
                        htmlFor="form-checkout__identificationNumber"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Número de documento
                    </label>
                    <input
                        type="text"
                        id="form-checkout__identificationNumber"
                        placeholder="12345678"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isLoading}
                    />
                </div>

                {/* Campos ocultos que MercadoPago completa automáticamente */}
                <select id="form-checkout__issuer" style={{ display: 'none' }}></select>
                <select id="form-checkout__installments" style={{ display: 'none' }}></select>

                {/* Botón de submit */}
                <button
                    type="submit"
                    disabled={isLoading || !mpCardForm}
                    className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
                        isLoading || !mpCardForm
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                    }`}
                >
                    {isLoading ? 'Procesando...' : submitButtonText}
                </button>

                {/* Mensaje de seguridad */}
                <p className="text-xs text-gray-500 text-center mt-4">
                    🔒 Tu información está protegida y encriptada
                </p>
            </form>
        </div>
    );
};

CreditCardForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onFormReady: PropTypes.func,
    isLoading: PropTypes.bool,
    submitButtonText: PropTypes.string,
    amount: PropTypes.string,
    mp: PropTypes.object,
};

export default CreditCardForm;
