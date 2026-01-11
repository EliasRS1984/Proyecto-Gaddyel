/**
 * validation.js - Constantes de validación para formularios
 * 
 * Centraliza todas las reglas de validación y mensajes de error
 * para mantener consistencia en toda la aplicación
 */

/**
 * Reglas de validación
 */
export const VALIDATION_RULES = {
    // Nombre
    NOMBRE_MIN_LENGTH: 3,
    NOMBRE_MAX_LENGTH: 100,
    NOMBRE_PATTERN: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,

    // Email
    EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    EMAIL_MAX_LENGTH: 100,

    // WhatsApp / Teléfono
    WHATSAPP_MIN_DIGITS: 10,
    WHATSAPP_MAX_DIGITS: 15,
    WHATSAPP_PATTERN: /^[\d\s\+\-\(\)]+$/,

    // Dirección
    DIRECCION_MIN_LENGTH: 10,
    DIRECCION_MAX_LENGTH: 200,

    // Localidad/Ciudad
    LOCALIDAD_MIN_LENGTH: 3,
    LOCALIDAD_MAX_LENGTH: 100,

    // Provincia
    PROVINCIA_MIN_LENGTH: 3,
    PROVINCIA_MAX_LENGTH: 100,

    // Código Postal
    CODIGO_POSTAL_PATTERN: /^\d{4,6}$/,
    CODIGO_POSTAL_MIN_LENGTH: 4,
    CODIGO_POSTAL_MAX_LENGTH: 6,

    // Notas Adicionales
    NOTAS_MAX_LENGTH: 500,

    // Contraseña (para autenticación)
    PASSWORD_MIN_LENGTH: 6,
    PASSWORD_MAX_LENGTH: 100
};

/**
 * Mensajes de error de validación
 */
export const ERROR_MESSAGES = {
    // Nombre
    NOMBRE_REQUIRED: 'El nombre es obligatorio',
    NOMBRE_TOO_SHORT: `El nombre debe tener al menos ${VALIDATION_RULES.NOMBRE_MIN_LENGTH} caracteres`,
    NOMBRE_TOO_LONG: `El nombre no puede exceder ${VALIDATION_RULES.NOMBRE_MAX_LENGTH} caracteres`,
    NOMBRE_INVALID_CHARS: 'El nombre solo puede contener letras y espacios',

    // Email
    EMAIL_REQUIRED: 'El email es obligatorio',
    EMAIL_INVALID: 'El email no es válido',
    EMAIL_TOO_LONG: `El email no puede exceder ${VALIDATION_RULES.EMAIL_MAX_LENGTH} caracteres`,

    // WhatsApp / Teléfono
    WHATSAPP_REQUIRED: 'El WhatsApp es obligatorio',
    WHATSAPP_INVALID_FORMAT: 'El formato del teléfono no es válido',
    WHATSAPP_TOO_SHORT: `El número debe tener al menos ${VALIDATION_RULES.WHATSAPP_MIN_DIGITS} dígitos`,
    WHATSAPP_TOO_LONG: `El número no puede exceder ${VALIDATION_RULES.WHATSAPP_MAX_DIGITS} dígitos`,

    // Dirección
    DIRECCION_REQUIRED: 'La dirección es obligatoria',
    DIRECCION_TOO_SHORT: `Por favor, ingresa una dirección más completa (mínimo ${VALIDATION_RULES.DIRECCION_MIN_LENGTH} caracteres)`,
    DIRECCION_TOO_LONG: `La dirección no puede exceder ${VALIDATION_RULES.DIRECCION_MAX_LENGTH} caracteres`,

    // Localidad
    LOCALIDAD_REQUIRED: 'La localidad es obligatoria',
    LOCALIDAD_TOO_SHORT: `La localidad debe tener al menos ${VALIDATION_RULES.LOCALIDAD_MIN_LENGTH} caracteres`,
    LOCALIDAD_TOO_LONG: `La localidad no puede exceder ${VALIDATION_RULES.LOCALIDAD_MAX_LENGTH} caracteres`,

    // Provincia
    PROVINCIA_REQUIRED: 'La provincia es obligatoria',
    PROVINCIA_TOO_SHORT: `La provincia debe tener al menos ${VALIDATION_RULES.PROVINCIA_MIN_LENGTH} caracteres`,
    PROVINCIA_TOO_LONG: `La provincia no puede exceder ${VALIDATION_RULES.PROVINCIA_MAX_LENGTH} caracteres`,

    // Código Postal
    CODIGO_POSTAL_REQUIRED: 'El código postal es obligatorio',
    CODIGO_POSTAL_INVALID: 'El código postal debe tener entre 4 y 6 dígitos',

    // Notas
    NOTAS_TOO_LONG: `Las notas no pueden exceder ${VALIDATION_RULES.NOTAS_MAX_LENGTH} caracteres`,

    // Contraseña
    PASSWORD_REQUIRED: 'La contraseña es obligatoria',
    PASSWORD_TOO_SHORT: `La contraseña debe tener al menos ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} caracteres`,
    PASSWORD_TOO_LONG: `La contraseña no puede exceder ${VALIDATION_RULES.PASSWORD_MAX_LENGTH} caracteres`,

    // Genéricos
    FIELD_REQUIRED: 'Este campo es obligatorio',
    INVALID_FORMAT: 'El formato no es válido'
};

/**
 * Mensajes de éxito
 */
export const SUCCESS_MESSAGES = {
    ORDER_CREATED: '¡Pedido creado exitosamente!',
    PROFILE_UPDATED: 'Perfil actualizado correctamente',
    LOGIN_SUCCESS: 'Inicio de sesión exitoso',
    REGISTER_SUCCESS: 'Registro exitoso',
    LOGOUT_SUCCESS: 'Sesión cerrada correctamente'
};

/**
 * Provincias de Argentina (para selects/autocomplete)
 */
export const PROVINCIAS_ARGENTINA = [
    'Buenos Aires',
    'CABA',
    'Catamarca',
    'Chaco',
    'Chubut',
    'Córdoba',
    'Corrientes',
    'Entre Ríos',
    'Formosa',
    'Jujuy',
    'La Pampa',
    'La Rioja',
    'Mendoza',
    'Misiones',
    'Neuquén',
    'Río Negro',
    'Salta',
    'San Juan',
    'San Luis',
    'Santa Cruz',
    'Santa Fe',
    'Santiago del Estero',
    'Tierra del Fuego',
    'Tucumán'
];

/**
 * Helper: Validar email
 */
export const isValidEmail = (email) => {
    return VALIDATION_RULES.EMAIL_PATTERN.test(email);
};

/**
 * Helper: Validar WhatsApp
 */
export const isValidWhatsApp = (whatsapp) => {
    const digits = whatsapp.replace(/\D/g, '');
    return (
        digits.length >= VALIDATION_RULES.WHATSAPP_MIN_DIGITS &&
        digits.length <= VALIDATION_RULES.WHATSAPP_MAX_DIGITS
    );
};

/**
 * Helper: Validar código postal
 */
export const isValidCodigoPostal = (codigo) => {
    return VALIDATION_RULES.CODIGO_POSTAL_PATTERN.test(codigo.replace(/\s/g, ''));
};

export default {
    VALIDATION_RULES,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    PROVINCIAS_ARGENTINA,
    isValidEmail,
    isValidWhatsApp,
    isValidCodigoPostal
};
