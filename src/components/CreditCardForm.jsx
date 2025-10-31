import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CreditCard from './CreditCard';
import { useCardValidation } from '../hooks/useCardValidation';

/**
 * Formulario de tarjeta de crédito con validación en tiempo real
 * Muestra una visualización 3D de la tarjeta que se actualiza mientras el usuario escribe
 */
const CreditCardForm = ({ onSubmit, isLoading = false, submitButtonText = 'Continuar' }) => {
    const [formData, setFormData] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
    });

    const [cardType, setCardType] = useState('visa');
    const [isFlipped, setIsFlipped] = useState(false);
    const [touchedFields, setTouchedFields] = useState({});

    const {
        validateCardForm,
        formatCardNumber,
        formatExpiryDate,
        formatCVV,
        detectCardType,
        errors,
        clearFieldError,
    } = useCardValidation();

    // Detectar tipo de tarjeta mientras el usuario escribe
    useEffect(() => {
        if (formData.cardNumber) {
            const type = detectCardType(formData.cardNumber);
            if (type !== 'unknown') {
                setCardType(type);
            }
        }
    }, [formData.cardNumber, detectCardType]);

    // Manejar cambios en los inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Aplicar formateadores según el campo
        let formattedValue = value;

        if (name === 'cardNumber') {
            formattedValue = formatCardNumber(value);
            // Limitar a 19 dígitos (16 + 3 espacios)
            if (formattedValue.replace(/\s/g, '').length > 19) return;
        } else if (name === 'expiryDate') {
            formattedValue = formatExpiryDate(value);
            if (formattedValue.length > 5) return;
        } else if (name === 'cvv') {
            formattedValue = formatCVV(value, cardType);
        } else if (name === 'cardHolder') {
            // Solo letras y espacios
            formattedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '').toUpperCase();
            if (formattedValue.length > 30) return;
        }

        setFormData((prev) => ({
            ...prev,
            [name]: formattedValue,
        }));

        // Limpiar error del campo si estaba marcado
        if (touchedFields[name]) {
            clearFieldError(name);
        }
    };

    // Manejar focus en CVV (voltear tarjeta)
    const handleCVVFocus = () => {
        setIsFlipped(true);
    };

    // Manejar blur en CVV (volver al frente)
    const handleCVVBlur = () => {
        setIsFlipped(false);
        setTouchedFields((prev) => ({ ...prev, cvv: true }));
    };

    // Manejar blur en otros campos
    const handleBlur = (fieldName) => {
        setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
    };

    // Manejar submit del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        // Marcar todos los campos como touched
        setTouchedFields({
            cardNumber: true,
            cardHolder: true,
            expiryDate: true,
            cvv: true,
        });

        // Validar formulario completo
        const validation = validateCardForm(formData);

        if (validation.isValid) {
            // Llamar al callback de submit con los datos
            onSubmit({
                ...formData,
                cardType: validation.cardType,
            });
        }
    };

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

            {/* Selector de tipo de tarjeta */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de tarjeta
                </label>
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => setCardType('visa')}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                            cardType === 'visa'
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                        }`}
                    >
                        <span className="font-semibold text-blue-700">VISA</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setCardType('mastercard')}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                            cardType === 'mastercard'
                                ? 'border-orange-600 bg-orange-50'
                                : 'border-gray-300 hover:border-gray-400'
                        }`}
                    >
                        <span className="font-semibold text-orange-700">MASTERCARD</span>
                    </button>
                </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Número de tarjeta */}
                <div>
                    <label
                        htmlFor="cardNumber"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Número de tarjeta
                    </label>
                    <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('cardNumber')}
                        placeholder="1234 5678 9012 3456"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            touchedFields.cardNumber && errors.cardNumber
                                ? 'border-red-500'
                                : 'border-gray-300'
                        }`}
                        disabled={isLoading}
                    />
                    {touchedFields.cardNumber && errors.cardNumber && (
                        <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                    )}
                </div>

                {/* Nombre del titular */}
                <div>
                    <label
                        htmlFor="cardHolder"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Nombre del titular
                    </label>
                    <input
                        type="text"
                        id="cardHolder"
                        name="cardHolder"
                        value={formData.cardHolder}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('cardHolder')}
                        placeholder="JUAN PÉREZ"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            touchedFields.cardHolder && errors.cardHolder
                                ? 'border-red-500'
                                : 'border-gray-300'
                        }`}
                        disabled={isLoading}
                    />
                    {touchedFields.cardHolder && errors.cardHolder && (
                        <p className="mt-1 text-sm text-red-600">{errors.cardHolder}</p>
                    )}
                </div>

                {/* Fecha y CVV */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Fecha de vencimiento */}
                    <div>
                        <label
                            htmlFor="expiryDate"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Vencimiento
                        </label>
                        <input
                            type="text"
                            id="expiryDate"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            onBlur={() => handleBlur('expiryDate')}
                            placeholder="MM/YY"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                touchedFields.expiryDate && errors.expiryDate
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                            }`}
                            disabled={isLoading}
                        />
                        {touchedFields.expiryDate && errors.expiryDate && (
                            <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                        )}
                    </div>

                    {/* CVV */}
                    <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                        </label>
                        <input
                            type="text"
                            id="cvv"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            onFocus={handleCVVFocus}
                            onBlur={handleCVVBlur}
                            placeholder="123"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                touchedFields.cvv && errors.cvv
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                            }`}
                            disabled={isLoading}
                        />
                        {touchedFields.cvv && errors.cvv && (
                            <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                        )}
                    </div>
                </div>

                {/* Botón de submit */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
                        isLoading
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
    isLoading: PropTypes.bool,
    submitButtonText: PropTypes.string,
};

export default CreditCardForm;
