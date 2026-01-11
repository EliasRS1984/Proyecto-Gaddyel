/**
 * checkoutSchema.js
 * 
 * ✅ Esquema de validación centralizado para datos de checkout.
 * ✅ Usa constantes de validation.js para mantener consistencia
 * 
 * Usado por:
 * - useCheckoutState.js (Checkout modular - validación en tiempo real)
 * - orderService.js (validación antes de enviar)
 * - Componentes de Checkout (feedback de errores)
 */

import { VALIDATION_RULES, ERROR_MESSAGES } from '../constants/validation';

/**
 * Validadores individuales por campo
 */
const validators = {
  nombre: (value) => {
    if (!value || !value.trim()) {
      return ERROR_MESSAGES.NOMBRE_REQUIRED;
    }
    if (value.trim().length < VALIDATION_RULES.NOMBRE_MIN_LENGTH) {
      return ERROR_MESSAGES.NOMBRE_TOO_SHORT;
    }
    if (value.trim().length > VALIDATION_RULES.NOMBRE_MAX_LENGTH) {
      return ERROR_MESSAGES.NOMBRE_TOO_LONG;
    }
    // Permitir letras (con acentos), espacios, números y guiones
    if (!VALIDATION_RULES.NOMBRE_PATTERN.test(value)) {
      return ERROR_MESSAGES.NOMBRE_INVALID_CHARS;
    }
    return '';
  },

  email: (value) => {
    if (!value || !value.trim()) {
      return ERROR_MESSAGES.EMAIL_REQUIRED;
    }
    if (!VALIDATION_RULES.EMAIL_PATTERN.test(value)) {
      return ERROR_MESSAGES.EMAIL_INVALID;
    }
    if (value.length > VALIDATION_RULES.EMAIL_MAX_LENGTH) {
      return ERROR_MESSAGES.EMAIL_TOO_LONG;
    }
    return '';
  },

  whatsapp: (value) => {
    if (!value) {
      return ERROR_MESSAGES.WHATSAPP_REQUIRED;
    }
    if (!VALIDATION_RULES.WHATSAPP_PATTERN.test(value)) {
      return ERROR_MESSAGES.WHATSAPP_INVALID_FORMAT;
    }
    const digits = value.replace(/\D/g, '');
    if (digits.length < VALIDATION_RULES.WHATSAPP_MIN_DIGITS) {
      return ERROR_MESSAGES.WHATSAPP_TOO_SHORT;
    }
    if (digits.length > VALIDATION_RULES.WHATSAPP_MAX_DIGITS) {
      return ERROR_MESSAGES.WHATSAPP_TOO_LONG;
    }
    return '';
  },

  domicilio: (value) => {
    if (!value || !value.trim()) {
      return ERROR_MESSAGES.DIRECCION_REQUIRED;
    }
    if (value.trim().length < VALIDATION_RULES.DIRECCION_MIN_LENGTH) {
      return ERROR_MESSAGES.DIRECCION_TOO_SHORT;
    }
    if (value.trim().length > VALIDATION_RULES.DIRECCION_MAX_LENGTH) {
      return ERROR_MESSAGES.DIRECCION_TOO_LONG;
    }
    // Permitir letras, números, espacios, guiones, puntos, comas, º, #
    if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-.,º#]+$/.test(value)) {
      return 'El domicilio contiene caracteres no permitidos';
    }
    return '';
  },

  localidad: (value) => {
    if (!value || !value.trim()) {
      return ERROR_MESSAGES.LOCALIDAD_REQUIRED;
    }
    if (value.trim().length < VALIDATION_RULES.LOCALIDAD_MIN_LENGTH) {
      return ERROR_MESSAGES.LOCALIDAD_TOO_SHORT;
    }
    if (value.trim().length > VALIDATION_RULES.LOCALIDAD_MAX_LENGTH) {
      return ERROR_MESSAGES.LOCALIDAD_TOO_LONG;
    }
    // Permitir letras, números, espacios, guiones y acentos
    if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-.]+$/.test(value)) {
      return 'La localidad contiene caracteres no permitidos';
    }
    return '';
  },

  provincia: (value) => {
    if (!value || !value.trim()) {
      return ERROR_MESSAGES.PROVINCIA_REQUIRED;
    }
    if (value.trim().length < VALIDATION_RULES.PROVINCIA_MIN_LENGTH) {
      return ERROR_MESSAGES.PROVINCIA_TOO_SHORT;
    }
    if (value.trim().length > VALIDATION_RULES.PROVINCIA_MAX_LENGTH) {
      return ERROR_MESSAGES.PROVINCIA_TOO_LONG;
    }
    // Permitir letras, números, espacios, guiones y acentos
    if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-.]+$/.test(value)) {
      return 'La provincia contiene caracteres no permitidos';
    }
    return '';
  },

  codigoPostal: (value) => {
    if (!value || !value.trim()) {
      return ERROR_MESSAGES.CODIGO_POSTAL_REQUIRED;
    }
    const cleaned = value.replace(/\s/g, '');
    if (cleaned.length < VALIDATION_RULES.CODIGO_POSTAL_MIN_LENGTH || 
        cleaned.length > VALIDATION_RULES.CODIGO_POSTAL_MAX_LENGTH) {
      return ERROR_MESSAGES.CODIGO_POSTAL_INVALID;
    }
    if (!VALIDATION_RULES.CODIGO_POSTAL_PATTERN.test(cleaned)) {
      return ERROR_MESSAGES.CODIGO_POSTAL_INVALID;
    }
    return '';
  },

  notasAdicionales: (value) => {
    if (value && value.length > VALIDATION_RULES.NOTAS_MAX_LENGTH) {
      return ERROR_MESSAGES.NOTAS_TOO_LONG;
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
 * Usa valores de VALIDATION_RULES para provincias
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
