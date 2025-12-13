/**
 * checkoutSchema.js
 * 
 * Esquema de validación centralizado para datos de checkout.
 * Usado por:
 * - useCheckoutForm.js (validación en tiempo real)
 * - orderService.js (validación antes de enviar)
 * - Componentes (feedback de errores)
 * 
 * Mantener en UN SOLO LUGAR para evitar inconsistencias.
 */

/**
 * Validadores individuales por campo
 */
const validators = {
  nombre: (value) => {
    if (!value || !value.trim()) {
      return 'El nombre es obligatorio';
    }
    if (value.trim().length < 2) {
      return 'El nombre debe tener al menos 2 caracteres';
    }
    // Permitir letras (con acentos), espacios, números y guiones (para nombres como "Juan-Pablo" o "María 2da")
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\-'0-9]+$/.test(value)) {
      return 'El nombre contiene caracteres no permitidos';
    }
    return '';
  },

  email: (value) => {
    if (!value || !value.trim()) {
      return 'El email es obligatorio';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Email inválido';
    }
    return '';
  },

  whatsapp: (value) => {
    if (!value) {
      return 'El WhatsApp es obligatorio';
    }
    if (!/^[\d\s\+\-\(\)]+$/.test(value)) {
      return 'Formato de teléfono inválido';
    }
    const digits = value.replace(/\D/g, '');
    if (digits.length < 10) {
      return 'El número debe tener al menos 10 dígitos';
    }
    return '';
  },

  domicilio: (value) => {
    if (!value || !value.trim()) {
      return 'El domicilio es obligatorio';
    }
    if (value.trim().length < 5) {
      return 'Por favor, ingresa un domicilio completo (mínimo 5 caracteres)';
    }
    // Permitir letras, números, espacios, guiones, puntos, comas, º, #
    if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-.,º#]+$/.test(value)) {
      return 'El domicilio contiene caracteres no permitidos';
    }
    return '';
  },

  localidad: (value) => {
    if (!value || !value.trim()) {
      return 'La localidad es obligatoria';
    }
    if (value.trim().length < 2) {
      return 'La localidad debe tener al menos 2 caracteres';
    }
    // Permitir letras, números, espacios, guiones y acentos en nombres de ciudades
    if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-.]+$/.test(value)) {
      return 'La localidad contiene caracteres no permitidos';
    }
    return '';
  },

  provincia: (value) => {
    if (!value || !value.trim()) {
      return 'La provincia es obligatoria';
    }
    if (value.trim().length < 2) {
      return 'La provincia debe tener al menos 2 caracteres';
    }
    // Permitir letras, números, espacios, guiones y acentos en nombres de provincias
    if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-.]+$/.test(value)) {
      return 'La provincia contiene caracteres no permitidos';
    }
    return '';
  },

  codigoPostal: (value) => {
    if (!value || !value.trim()) {
      return 'El código postal es obligatorio';
    }
    const cleaned = value.replace(/\s/g, '');
    // Permitir letras y números (4-10 caracteres sin espacios)
    if (!/^[a-zA-Z0-9]{4,10}$/.test(cleaned)) {
      return 'Código postal inválido (4-10 caracteres alfanuméricos)';
    }
    return '';
  },

  notasAdicionales: (value) => {
    // Campo opcional, no tiene validación obligatoria
    if (value && value.length > 500) {
      return 'Las notas no pueden exceder 500 caracteres';
    }
    return '';
  }
};

/**
 * Formateo automático de campos
 */
const formatters = {
  nombre: (value) => value.trim(),

  email: (value) => value.trim().toLowerCase(),

  whatsapp: (value) => {
    // Permitir múltiples formatos: con o sin código país
    // Formato de salida: "54 9 11 1234-5678"
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length === 0) return '';
    
    // Si comienza con 54, es código de Argentina (opcional)
    let formatted = numbers;
    
    // Limitar a máximo 13 dígitos (54 9 11 1234-5678)
    if (formatted.length > 13) {
      formatted = formatted.slice(-13);
    }

    // Aplicar formato visual
    if (formatted.startsWith('54')) {
      // Formato: 54 9 11 1234-5678
      if (formatted.length <= 2) return formatted;
      if (formatted.length <= 3) return `${formatted.slice(0, 2)} ${formatted.slice(2)}`;
      if (formatted.length <= 4) return `${formatted.slice(0, 2)} ${formatted.slice(2, 3)} ${formatted.slice(3)}`;
      if (formatted.length <= 6) return `${formatted.slice(0, 2)} ${formatted.slice(2, 3)} ${formatted.slice(3, 5)} ${formatted.slice(5)}`;
      return `${formatted.slice(0, 2)} ${formatted.slice(2, 3)} ${formatted.slice(3, 5)} ${formatted.slice(5, 9)}-${formatted.slice(9)}`;
    } else {
      // Formato sin código país: 9 11 1234-5678
      if (formatted.length <= 1) return formatted;
      if (formatted.length <= 2) return `${formatted.slice(0, 1)} ${formatted.slice(1)}`;
      if (formatted.length <= 4) return `${formatted.slice(0, 1)} ${formatted.slice(1, 3)} ${formatted.slice(3)}`;
      return `${formatted.slice(0, 1)} ${formatted.slice(1, 3)} ${formatted.slice(3, 7)}-${formatted.slice(7)}`;
    }
  },

  domicilio: (value) => value,
  localidad: (value) => value,
  provincia: (value) => value,
  codigoPostal: (value) => value.replace(/\s/g, '').trim(),
  notasAdicionales: (value) => value
};

/**
 * Valida un campo individual
 * @param {string} fieldName - Nombre del campo
 * @param {any} value - Valor a validar
 * @returns {string} Mensaje de error (vacío si es válido)
 */
export const validateField = (fieldName, value) => {
  const validator = validators[fieldName];
  if (!validator) {
    return ''; // Campo no tiene validador definido
  }
  return validator(value);
};

/**
 * Formatea un campo individual
 * @param {string} fieldName - Nombre del campo
 * @param {any} value - Valor a formatear
 * @returns {string} Valor formateado
 */
export const formatField = (fieldName, value) => {
  const formatter = formatters[fieldName];
  if (!formatter) {
    return value; // Sin formateador, devolver como está
  }
  return formatter(value);
};

/**
 * Valida todos los campos de una forma
 * @param {Object} formData - Objeto con los datos del formulario
 * @returns {Object} { isValid: boolean, errors: { [field]: error } }
 */
export const validateForm = (formData) => {
  const errors = {};
  const requiredFields = ['nombre', 'email', 'whatsapp', 'domicilio', 'localidad', 'provincia', 'codigoPostal'];

  requiredFields.forEach(field => {
    const error = validateField(field, formData[field]);
    if (error) {
      errors[field] = error;
    }
  });

  // Validar campos opcionales (notasAdicionales)
  if (formData.notasAdicionales) {
    const error = validateField('notasAdicionales', formData.notasAdicionales);
    if (error) {
      errors.notasAdicionales = error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Obtiene todos los validadores
 * @returns {Object} Objeto con validadores
 */
export const getValidators = () => validators;

/**
 * Obtiene todos los formateadores
 * @returns {Object} Objeto con formateadores
 */
export const getFormatters = () => formatters;

/**
 * Campos requeridos en el checkout
 */
export const REQUIRED_FIELDS = ['nombre', 'email', 'whatsapp', 'domicilio', 'localidad', 'provincia', 'codigoPostal'];

/**
 * Campos opcionales en el checkout
 */
export const OPTIONAL_FIELDS = ['notasAdicionales'];

/**
 * Todos los campos del checkout
 */
export const ALL_FIELDS = [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS];

/**
 * Estructura inicial del formulario
 */
export const INITIAL_FORM_STATE = {
  nombre: '',
  email: '',
  whatsapp: '',
  domicilio: '',
  localidad: '',
  provincia: '',
  codigoPostal: '',
  notasAdicionales: ''
};

export default {
  validateField,
  formatField,
  validateForm,
  getValidators,
  getFormatters,
  REQUIRED_FIELDS,
  OPTIONAL_FIELDS,
  ALL_FIELDS,
  INITIAL_FORM_STATE
};
