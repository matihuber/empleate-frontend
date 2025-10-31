import { useState, useCallback } from 'react';

/**
 * Hook personalizado para validación de tarjetas de crédito
 * Implementa algoritmo de Luhn, detección de tipo de tarjeta, y validaciones
 */
export const useCardValidation = () => {
    const [errors, setErrors] = useState({});

    /**
     * Algoritmo de Luhn para validar número de tarjeta
     */
    const luhnCheck = useCallback((cardNumber) => {
        const digits = cardNumber.replace(/\D/g, '');
        if (digits.length < 13 || digits.length > 19) return false;

        let sum = 0;
        let isEven = false;

        for (let i = digits.length - 1; i >= 0; i--) {
            let digit = parseInt(digits[i]);

            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            isEven = !isEven;
        }

        return sum % 10 === 0;
    }, []);

    /**
     * Detecta el tipo de tarjeta basándose en el número
     */
    const detectCardType = useCallback((cardNumber) => {
        const digits = cardNumber.replace(/\D/g, '');

        // Visa: empieza con 4
        if (/^4/.test(digits)) {
            return 'visa';
        }

        // Mastercard: empieza con 51-55 o 2221-2720
        if (/^(5[1-5]|2(2[2-9][1-9]|[3-6][0-9]{2}|7[0-1][0-9]|720))/.test(digits)) {
            return 'mastercard';
        }

        // American Express: empieza con 34 o 37
        if (/^3[47]/.test(digits)) {
            return 'amex';
        }

        return 'unknown';
    }, []);

    /**
     * Valida el número de tarjeta
     */
    const validateCardNumber = useCallback((cardNumber) => {
        const digits = cardNumber.replace(/\D/g, '');

        if (!digits) {
            return { isValid: false, error: 'El número de tarjeta es requerido' };
        }

        if (digits.length < 13) {
            return { isValid: false, error: 'Número de tarjeta incompleto' };
        }

        if (digits.length > 19) {
            return { isValid: false, error: 'Número de tarjeta demasiado largo' };
        }

        const cardType = detectCardType(cardNumber);
        if (cardType === 'unknown') {
            return { isValid: false, error: 'Tipo de tarjeta no válido' };
        }

        if (!luhnCheck(cardNumber)) {
            return { isValid: false, error: 'Número de tarjeta inválido' };
        }

        return { isValid: true, error: null, cardType };
    }, [luhnCheck, detectCardType]);

    /**
     * Valida el nombre del titular
     */
    const validateCardHolder = useCallback((cardHolder) => {
        if (!cardHolder || !cardHolder.trim()) {
            return { isValid: false, error: 'El nombre del titular es requerido' };
        }

        if (cardHolder.trim().length < 3) {
            return { isValid: false, error: 'El nombre debe tener al menos 3 caracteres' };
        }

        // Verificar que solo contenga letras y espacios
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(cardHolder)) {
            return { isValid: false, error: 'El nombre solo puede contener letras' };
        }

        return { isValid: true, error: null };
    }, []);

    /**
     * Valida la fecha de vencimiento
     */
    const validateExpiryDate = useCallback((expiryDate) => {
        if (!expiryDate || !expiryDate.trim()) {
            return { isValid: false, error: 'La fecha de vencimiento es requerida' };
        }

        // Formato: MM/YY
        const match = expiryDate.match(/^(\d{2})\/(\d{2})$/);
        if (!match) {
            return { isValid: false, error: 'Formato inválido (MM/YY)' };
        }

        const month = parseInt(match[1]);
        const year = parseInt(match[2]) + 2000; // Convertir YY a YYYY

        if (month < 1 || month > 12) {
            return { isValid: false, error: 'Mes inválido' };
        }

        // Verificar que no esté vencida
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            return { isValid: false, error: 'Tarjeta vencida' };
        }

        // No permitir fechas muy lejanas (más de 20 años)
        if (year > currentYear + 20) {
            return { isValid: false, error: 'Fecha inválida' };
        }

        return { isValid: true, error: null };
    }, []);

    /**
     * Valida el CVV
     */
    const validateCVV = useCallback((cvv, cardType = 'visa') => {
        if (!cvv || !cvv.trim()) {
            return { isValid: false, error: 'El código de seguridad es requerido' };
        }

        const digits = cvv.replace(/\D/g, '');

        // American Express tiene CVV de 4 dígitos, otros 3
        const expectedLength = cardType === 'amex' ? 4 : 3;

        if (digits.length !== expectedLength) {
            return {
                isValid: false,
                error: `El código debe tener ${expectedLength} dígitos`
            };
        }

        return { isValid: true, error: null };
    }, []);

    /**
     * Valida todo el formulario de tarjeta
     */
    const validateCardForm = useCallback((formData) => {
        const newErrors = {};

        // Validar número de tarjeta
        const cardNumberValidation = validateCardNumber(formData.cardNumber);
        if (!cardNumberValidation.isValid) {
            newErrors.cardNumber = cardNumberValidation.error;
        }

        // Validar titular
        const cardHolderValidation = validateCardHolder(formData.cardHolder);
        if (!cardHolderValidation.isValid) {
            newErrors.cardHolder = cardHolderValidation.error;
        }

        // Validar fecha
        const expiryValidation = validateExpiryDate(formData.expiryDate);
        if (!expiryValidation.isValid) {
            newErrors.expiryDate = expiryValidation.error;
        }

        // Validar CVV
        const cardType = cardNumberValidation.cardType || 'visa';
        const cvvValidation = validateCVV(formData.cvv, cardType);
        if (!cvvValidation.isValid) {
            newErrors.cvv = cvvValidation.error;
        }

        setErrors(newErrors);

        return {
            isValid: Object.keys(newErrors).length === 0,
            errors: newErrors,
            cardType: cardNumberValidation.cardType
        };
    }, [validateCardNumber, validateCardHolder, validateExpiryDate, validateCVV]);

    /**
     * Formatea el número de tarjeta con espacios
     */
    const formatCardNumber = useCallback((value) => {
        const digits = value.replace(/\D/g, '');
        const groups = digits.match(/.{1,4}/g) || [];
        return groups.join(' ');
    }, []);

    /**
     * Formatea la fecha de vencimiento (MM/YY)
     */
    const formatExpiryDate = useCallback((value) => {
        const digits = value.replace(/\D/g, '');

        if (digits.length <= 2) {
            return digits;
        }

        return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }, []);

    /**
     * Formatea el CVV (solo dígitos)
     */
    const formatCVV = useCallback((value, cardType = 'visa') => {
        const maxLength = cardType === 'amex' ? 4 : 3;
        return value.replace(/\D/g, '').slice(0, maxLength);
    }, []);

    /**
     * Limpia los errores
     */
    const clearErrors = useCallback(() => {
        setErrors({});
    }, []);

    /**
     * Limpia un error específico
     */
    const clearFieldError = useCallback((fieldName) => {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
        });
    }, []);

    return {
        // Validaciones individuales
        validateCardNumber,
        validateCardHolder,
        validateExpiryDate,
        validateCVV,

        // Validación completa
        validateCardForm,

        // Formateadores
        formatCardNumber,
        formatExpiryDate,
        formatCVV,

        // Utilidades
        detectCardType,
        luhnCheck,

        // Estado de errores
        errors,
        clearErrors,
        clearFieldError,
    };
};

export default useCardValidation;
