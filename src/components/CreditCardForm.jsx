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
        identificationNumber: '',
    });

    const [cardType, setCardType] = useState('visa');
    const [isFlipped, setIsFlipped] = useState(false);
    const mpCardFormRef = useRef(null);

    // Inicializar CardForm de MercadoPago
    useEffect(() => {
        if (!mp) return;
        if (mpCardFormRef.current) return; // Ya inicializado

        const cardForm = mp.cardForm({
            amount: amount,
            iframe: false,
            form: {
                id: "form-checkout",
                cardNumber: {
                    id: "form-checkout__cardNumber",
                    placeholder: "Número de tarjeta",
                },
                expirationDate: {
                    id: "form-checkout__expirationDate",
                    placeholder: "MM/YY",
                },
                securityCode: {
                    id: "form-checkout__securityCode",
                    placeholder: "CVV",
                },
                cardholderName: {
                    id: "form-checkout__cardholderName",
                    placeholder: "Titular de la tarjeta",
                },
                issuer: {
                    id: "form-checkout__issuer",
                    placeholder: "Banco emisor",
                },
                installments: {
                    id: "form-checkout__installments",
                    placeholder: "Cuotas",
                },
                identificationType: {
                    id: "form-checkout__identificationType",
                },
                identificationNumber: {
                    id: "form-checkout__identificationNumber",
                    placeholder: "Número de documento",
                },
            },
            callbacks: {
                onFormMounted: (error) => {
                    if (error) {
                        return;
                    }
                    if (onFormReady) onFormReady();
                },
                onSubmit: async (event) => {
                    event.preventDefault();

                    const { token, ...cardData } = cardForm.getCardFormData();
                    // Llamar al callback del componente padre
                    onSubmit({
                        token: token,
                        paymentMethodId: cardData.payment_method_id,
                    });
                },
                onFetching: (resource) => {
                },
            },
        });

        mpCardFormRef.current = cardForm;
    }, [mp, amount, onSubmit, onFormReady]);

    // Sincronizar valores de los inputs con la tarjeta visual 3D
    useEffect(() => {
        const syncInterval = setInterval(() => {
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

    // Formatear número de tarjeta automáticamente (espacios cada 4 dígitos)
    useEffect(() => {
        const cardNumberInput = document.getElementById('form-checkout__cardNumber');
        if (!cardNumberInput) return;

        const formatCardNumber = (e) => {
            let value = e.target.value.replace(/\D/g, ''); // Solo números
            value = value.substring(0, 16); // Máximo 16 dígitos
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value; // Agregar espacios cada 4
            e.target.value = formattedValue;
        };

        cardNumberInput.addEventListener('input', formatCardNumber);

        return () => {
            cardNumberInput.removeEventListener('input', formatCardNumber);
        };
    }, [mpCardFormRef.current]);

    // Formatear nombre del titular (mayúsculas automáticas)
    useEffect(() => {
        const cardHolderInput = document.getElementById('form-checkout__cardholderName');
        if (!cardHolderInput) return;

        const formatCardHolder = (e) => {
            e.target.value = e.target.value.toUpperCase();
        };

        cardHolderInput.addEventListener('input', formatCardHolder);

        return () => {
            cardHolderInput.removeEventListener('input', formatCardHolder);
        };
    }, [mpCardFormRef.current]);

    // Formatear fecha de vencimiento automáticamente (MM/YY)
    useEffect(() => {
        const expiryInput = document.getElementById('form-checkout__expirationDate');
        if (!expiryInput) return;

        const formatExpiry = (e) => {
            let value = e.target.value.replace(/\D/g, ''); // Solo números
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        };

        expiryInput.addEventListener('input', formatExpiry);

        return () => {
            expiryInput.removeEventListener('input', formatExpiry);
        };
    }, [mpCardFormRef.current]);

    // Formatear CVV (solo números, máximo 4 dígitos) y manejar flip
    useEffect(() => {
        const cvvInput = document.getElementById('form-checkout__securityCode');
        if (!cvvInput) return;

        const formatCVV = (e) => {
            let value = e.target.value.replace(/\D/g, ''); // Solo números
            e.target.value = value.substring(0, 4); // Máximo 4 dígitos
        };

        const handleCVVFocus = () => setIsFlipped(true);
        const handleCVVBlur = () => setIsFlipped(false);

        cvvInput.addEventListener('input', formatCVV);
        cvvInput.addEventListener('focus', handleCVVFocus);
        cvvInput.addEventListener('blur', handleCVVBlur);

        return () => {
            cvvInput.removeEventListener('input', formatCVV);
            cvvInput.removeEventListener('focus', handleCVVFocus);
            cvvInput.removeEventListener('blur', handleCVVBlur);
        };
    }, [mpCardFormRef.current]);

    // Formatear DNI (solo números, máximo 8 dígitos)
    useEffect(() => {
        const dniInput = document.getElementById('form-checkout__identificationNumber');
        if (!dniInput) return;

        const formatDNI = (e) => {
            let value = e.target.value.replace(/\D/g, ''); // Solo números
            e.target.value = value.substring(0, 8); // Máximo 8 dígitos
        };

        dniInput.addEventListener('input', formatDNI);

        return () => {
            dniInput.removeEventListener('input', formatDNI);
        };
    }, [mpCardFormRef.current]);

    return (
        <div className="w-full max-w-md mx-auto">
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

            {/* Formulario de MercadoPago CardForm */}
            <form
                id="form-checkout"
                className="space-y-4"
            >
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
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                        name="cardholderName"
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
                            name="expirationDate"
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                            name="securityCode"
                            placeholder="123"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                        Número de documento (DNI)
                    </label>
                    <input
                        type="text"
                        id="form-checkout__identificationNumber"
                        name="identificationNumber"
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
                    disabled={isLoading || !mpCardFormRef.current}
                    className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
                        isLoading || !mpCardFormRef.current
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
