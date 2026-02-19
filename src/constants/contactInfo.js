/**
 * 📞 Configuración de Contacto Centralizada
 * 
 * Este archivo contiene todos los datos de contacto y redes sociales.
 * Se usa en todo el proyecto para evitar duplicación de datos.
 * 
 * ¿Por qué centralizado?
 * - Single source of truth: Un lugar para actualizar datos
 * - Evita inconsistencias: Todas las páginas usan los mismos valores
 * - Fácil mantenimiento: Cambiar teléfono = 1 archivo a editar
 */

export const CONTACT_INFO = {
  // WhatsApp Business
  whatsapp: {
    // URL para chat directo (Business Message)
    url: 'https://wa.me/message/NBXNXYM5ZVE7D1',
    // Número en formato E.164 (para schema.org)
    number: '+5491155098426',
    // Nombre para mostrar
    label: 'WhatsApp'
  },

  // Instagram
  instagram: {
    url: 'https://www.instagram.com/gaddyel.oficial/',
    username: 'gaddyel.oficial',
    label: 'Instagram'
  },

  // Facebook
  facebook: {
    url: 'https://www.facebook.com/gaddyel.gaddyel.184/',
    label: 'Facebook'
  },

  // Email
  email: 'gaddyel.gaddyel@gmail.com',

  // Teléfono principal (formato E.164 sin guiones para schema.org)
  phone: '+5491155098426',

  // Ubicación
  address: {
    street: 'Virrey del Pino', // Actualizar con dirección real
    city: 'Buenos Aires',
    region: 'Buenos Aires',
    country: 'AR',
    postalCode: '1763' // Si conoces el código postal
  },

  // Horarios de atención
  hours: {
    weekday: {
      opens: '09:00',
      closes: '18:00',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    weekend: {
      opens: '10:00',
      closes: '14:00',
      dayOfWeek: ['Saturday']
    }
  }
};

/**
 * Exportar URLs de redes para fácil acceso
 * Uso: import { SOCIAL_URLS } from '../constants/contactInfo'
 */
export const SOCIAL_URLS = {
  instagram: CONTACT_INFO.instagram.url,
  facebook: CONTACT_INFO.facebook.url,
  whatsapp: CONTACT_INFO.whatsapp.url
};

/**
 * Exportar información para schema.org
 * Uso: en SchemaMarkup.jsx
 */
export const SCHEMA_CONTACT = {
  telephone: CONTACT_INFO.phone,
  email: CONTACT_INFO.email,
  sameAs: [
    CONTACT_INFO.instagram.url,
    CONTACT_INFO.facebook.url,
    CONTACT_INFO.whatsapp.url
  ]
};

export default CONTACT_INFO;
