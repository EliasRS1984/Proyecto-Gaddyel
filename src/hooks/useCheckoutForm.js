import { useState, useEffect } from 'react';

/**
 * Hook personalizado para gestionar formularios de checkout con validación
 */
export const useCheckoutForm = (initialData = {}) => {
    const defaultData = {
        nombre: '',
        email: '',
        whatsapp: '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        notasAdicionales: '',
        ...initialData
    };

    // Cargar datos guardados del localStorage
    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem('checkoutDraft');
        if (saved) {
            try {
                return { ...defaultData, ...JSON.parse(saved) };
            } catch {
                return defaultData;
            }
        }
        return defaultData;
    });

    const [touched, setTouched] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});

    // Auto-guardar borrador
    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem('checkoutDraft', JSON.stringify(formData));
        }, 500);
        return () => clearTimeout(timer);
    }, [formData]);

    // Validaciones por campo
    const validators = {
        nombre: (value) => {
            if (!value.trim()) return 'El nombre es obligatorio';
            if (value.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres';
            if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return 'Solo se permiten letras y espacios';
            return '';
        },
        
        email: (value) => {
            if (!value.trim()) return 'El email es obligatorio';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email inválido';
            return '';
        },
        
        whatsapp: (value) => {
            if (!value) return 'El WhatsApp es obligatorio';
            if (!/^[\d\s\+\-\(\)]+$/.test(value)) return 'Formato de teléfono inválido';
            const digits = value.replace(/\D/g, '');
            if (digits.length < 10) return 'El número debe tener al menos 10 dígitos';
            return '';
        },
        
        direccion: (value) => {
            if (!value.trim()) return 'La dirección es obligatoria';
            if (value.trim().length < 10) return 'Por favor, ingresa una dirección completa';
            return '';
        },
        
        ciudad: (value) => {
            if (!value.trim()) return 'La ciudad es obligatoria';
            return '';
        },
        
        codigoPostal: (value) => {
            if (!value.trim()) return 'El código postal es obligatorio';
            if (!/^\d{4,6}$/.test(value.replace(/\s/g, ''))) return 'Código postal inválido';
            return '';
        }
    };

    // Formatear WhatsApp automáticamente
    const formatWhatsApp = (value) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 2) return numbers;
        if (numbers.length <= 4) return `${numbers.slice(0, 2)} ${numbers.slice(2)}`;
        if (numbers.length <= 8) return `${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4)}`;
        return `${numbers.slice(0, 2)} ${numbers.slice(2, 4)} ${numbers.slice(4, 8)} ${numbers.slice(8, 12)}`;
    };

    const validateField = (name, value) => {
        const validator = validators[name];
        return validator ? validator(value) : '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        let processedValue = value;
        if (name === 'whatsapp') {
            processedValue = formatWhatsApp(value);
        }
        
        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));
        
        // Validar si el campo ya fue tocado
        if (touched[name]) {
            const error = validateField(name, processedValue);
            setFieldErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        
        const error = validateField(name, value);
        setFieldErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const validateAll = () => {
        const requiredFields = ['nombre', 'email', 'whatsapp', 'direccion', 'ciudad', 'codigoPostal'];
        const newErrors = {};
        const newTouched = {};

        requiredFields.forEach(field => {
            newTouched[field] = true;
            const error = validateField(field, formData[field]);
            if (error) newErrors[field] = error;
        });

        setTouched(newTouched);
        setFieldErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const isFormValid = () => {
        const requiredFields = ['nombre', 'email', 'whatsapp', 'direccion', 'ciudad', 'codigoPostal'];
        return requiredFields.every(field => {
            const error = validateField(field, formData[field]);
            return !error;
        });
    };

    const clearDraft = () => {
        localStorage.removeItem('checkoutDraft');
    };

    const getCleanData = () => ({
        nombre: formData.nombre.trim(),
        email: formData.email.trim().toLowerCase(),
        whatsapp: formData.whatsapp.replace(/\D/g, ''),
        direccion: formData.direccion.trim(),
        ciudad: formData.ciudad.trim(),
        codigoPostal: formData.codigoPostal.trim(),
        notasAdicionales: formData.notasAdicionales.trim()
    });

    return {
        formData,
        touched,
        fieldErrors,
        handleChange,
        handleBlur,
        validateAll,
        isFormValid,
        clearDraft,
        getCleanData
    };
};

export default useCheckoutForm;
