// ============================================================
// ¿QUÉ ES ESTO?
// Archivo central con todos los datos de contacto de Gaddyel.
// Es la única fuente de verdad: si el teléfono o el mail cambia,
// solo hace falta editarlo aquí y se actualiza en todo el sitio.
//
// ¿CÓMO FUNCIONA?
// Exporta tres objetos que se importan según la necesidad:
//   CONTACT_INFO  → datos completos (paginas de contacto, footer, schema)
//   SCHEMA_CONTACT → solo los datos que Google necesita en su ficha
//   SOCIAL_URLS   → solo las URLs de redes (para botones o links)
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// ¿El número de WhatsApp no funciona? Revisa CONTACT_INFO.whatsapp.url
// ¿La ficha de Google tiene datos errados? Revisa SCHEMA_CONTACT
// ¿Las redes no abren? Revisa las URLs en CONTACT_INFO.instagram/facebook
// ============================================================

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
 * Exportar URLs de redes para fácil acceso en botones y links del sitio.
 * Uso: import { SOCIAL_URLS } from '../constants/contactInfo'
 */
export const SOCIAL_URLS = {
  instagram: CONTACT_INFO.instagram.url,
  facebook: CONTACT_INFO.facebook.url,
  whatsapp: CONTACT_INFO.whatsapp.url
};

/**
 * Exportar información para schema.org (datos estructurados para Google).
 * Uso: en SchemaMarkup.jsx y seoMeta.js
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

// Usa siempre los exports nombrados: { CONTACT_INFO }, { SCHEMA_CONTACT }, { SOCIAL_URLS }
// No hay export default — evita confusiones al importar.
