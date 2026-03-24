// =====================================================
// ¿QUÉ ES ESTO?
// Archivo que centraliza todos los títulos, descripciones y metadatos
// de cada página del sitio (para Google y redes sociales).
//
// ¿CÓMO FUNCIONA?
// 1. Cada página importa { seoMeta } y llama a seoMeta.page('nombre').
// 2. Recibe un objeto con title, description, keywords, canonical y og
//    listos para pasar a react-helmet-async.
// 3. Para páginas de productos se usa seoMeta.product(producto, id),
//    que genera título y descripción dinámica a partir del producto.
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// ¿El título en Google no actualiza?  Revisá el <Helmet> en la página correspondiente.
// ¿El canonical está mal?             Verificá DOMAIN y que options.path sea correcto.
// ¿Agregar una página nueva?          Añadila en el objeto PAGES más abajo.
// =====================================================

import { SCHEMA_CONTACT } from '../constants/contactInfo';

const BRAND = 'Gaddyel';
// Lee el dominio del sitio desde la variable de entorno.
// Si no está definida, usa el dominio de producción actual como respaldo.
// Para cambiarlo: agregar VITE_SITE_URL=https://tudominio.com en el archivo .env
const DOMAIN = import.meta.env.VITE_SITE_URL || 'https://gaddyel.vercel.app';
const PHONE = SCHEMA_CONTACT.telephone;
const EMAIL = SCHEMA_CONTACT.email;

// Palabras clave agrupadas por intención de búsqueda
const KEYWORDS = {
  brand: 'Gaddyel, gaddyel blanquería',
  
  core: [
    'vinchas personalizadas',
    'batas con logo bordado',
    'toallas bordadas personalizadas',
    'blanquería personalizada spa',
    'insumos textiles estética',
  ],
  
  niche: [
    'vinchas para tratamientos faciales',
    'batas con logo para spa',
    'toallas bordadas para centros estética',
    'blanquería para gabinetes',
    'regalos empresariales pacientes',
  ],
  
  commercial: [
    'comprar blanquería personalizada',
    'bordado industrial mínimo bajo',
    'envíos a todo Argentina',
    'blanquería premium estética',
  ]
};

/**
 * Configuración de metadatos por página
 * Estructura:
 * {
 *   title: string (60-70 chars ideal para Google)
 *   description: string (155-160 chars ideal)
 *   keywords: string (top 5-7 keywords)
 *   og: { title, description, type, image? }
 * }
 */
const PAGES = {
  inicio: {
    title: 'Vinchas y Batas Personalizadas para Estética y Spa | Gaddyel Blanquería',
    description: 'Potenciá la imagen de tu centro de estética con blanquería personalizada de alta calidad. Vinchas, batas y toallas con tu logo bordado. Pedidos desde 12 unidades. Envíos a todo el país.',
    keywords: 'vinchas personalizadas, batas con logo, toallas bordadas, blanquería estética, personalización bordado',
    og: {
      type: 'website',
      title: 'Gaddyel - Blanquería Premium Personalizada para Spa y Estética',
      description: 'Elevá tu marca con blanquería personalizada. Vinchas, batas y toallas bordadas. Desde 12 unidades. Argentina.',
      image: `${DOMAIN}/og-home.jpg`
    }
  },
  
  catalogo: {
    title: 'Catálogo de Blanquería Personalizada | Vinchas, Batas y Toallas | Gaddyel',
    description: 'Explore nuestro catálogo completo: vinchas para tratamientos faciales, batas bordadas con logo para spa, toallas personalizadas y más. Entrega a nivel nacional. Personalización con mínimos bajos.',
    keywords: 'catálogo blanquería, vinchas spa, batas personalizadas, toallas bordadas, productos estética',
    og: {
      type: 'website',
      title: 'Catálogo Completo - Blanquería Personalizada Gaddyel',
      description: 'Descubra products premium con personalización industrial. Mínimo 12 unidades.',
      image: `${DOMAIN}/og-catalogo.jpg`
    }
  },
  
  contacto: {
    title: 'Contactar Gaddyel | Personalización de Blanquería para Estética y Spa',
    description: 'Contactanos para conocer nuestras opciones de personalización. Asesoramiento gratuito sobre bordado de logos, mínimos y envíos a todo Argentina.',
    keywords: 'contactar gaddyel, asesor personalización, bordado logos, blanquería personalizada',
    og: {
      type: 'website',
      title: 'Contacto - Gaddyel Blanquería Personalizada',
      description: 'Estamos aquí para ayudarte. Consulta sin cargo sobre tu proyecto.',
      image: `${DOMAIN}/og-contact.jpg`
    }
  },
  
  nosotros: {
    title: 'Quiénes Somos | Gaddyel - Blanquería Premium para Profesionales de la Estética',
    description: 'Gaddyel es tu aliado en elevar la identidad de marca de tu centro estético. Especialistas en blanquería personalizada de calidad: vinchas, batas y toallas bordadas para spas y gabinetes en Argentina.',
    keywords: 'quiénes somos, blanquería premium, marca estética, personalización textiles',
    og: {
      type: 'website',
      title: 'Quiénes Somos - Gaddyel',
      description: 'La historia detrás de Gaddyel: pasión por la calidad y el detalle.',
      image: `${DOMAIN}/og-about.jpg`
    }
  },
  
  proceso: {
    title: 'Nuestro Proceso de Personalización | Gaddyel Blanquería',
    description: 'Conocé cómo llevamos a cabo la personalización de tu blanquería: desde el diseño hasta la entrega. Proceso transparente y garantizado.',
    keywords: 'proceso personalización, bordado, diseño textiles, garantía',
    og: {
      type: 'website',
      title: 'Nuestro Proceso - Gaddyel',
      description: 'Pasos claros para tu proyecto personalizado.',
      image: `${DOMAIN}/og-proceso.jpg`
    }
  }
};

/**
 * Función principal para obtener metadatos de una página
 * 
 * @param {string} pageName - Nombre de la página ('inicio', 'catalogo', etc.)
 * @param {Object} options - Opciones adicionales
 * @returns {Object} { title, description, keywords, og, canonical }
 */
export const seoMeta = {
  page: (pageName, options = {}) => {
    const pageConfig = PAGES[pageName] || PAGES.inicio;
    const canonical = options.path
      ? `${DOMAIN}${options.path}`
      : `${DOMAIN}/`;

    return {
      title: options.customTitle || pageConfig.title,
      description: options.customDescription || pageConfig.description,
      keywords: options.customKeywords || pageConfig.keywords,
      canonical,
      og: {
        ...pageConfig.og,
        ...options.og,
        url: canonical,
        site_name: BRAND,
        locale: 'es_AR'
      }
    };
  },

  /**
   * Generar metadatos para página de detalle de producto
   * 
   * @param {Object} producto - { nombre, descripcion, precio, imagenSrc, categoria }
   * @param {string} productId - ID del producto para URL
   * @returns {Object} Metadatos del producto
   */
  product: (producto, productId) => {
    const { nombre, descripcion, precio, imagenSrc, categoria } = producto;
    const title = `${nombre} - ${categoria} Personalizado | Gaddyel`;
    const desc = descripcion
      ? `${descripcion.substring(0, 145)}... Compra en Gaddyel.`
      : `${nombre} personalizado con logo bordado. Desde $${precio}. Gaddyel.`;

    return {
      title,
      description: desc,
      keywords: `${nombre}, ${categoria} personalizado, blanquería estética, gaddyel`,
      canonical: `${DOMAIN}/catalogo/${productId}`,
      og: {
        type: 'product',
        title: `${nombre} - Gaddyel`,
        description: desc,
        image: imagenSrc,
        url: `${DOMAIN}/catalogo/${productId}`,
        site_name: BRAND,
        locale: 'es_AR',
        price: precio,
        currency: 'ARS'
      }
    };
  },

  /**
   * Extraer palabras clave por categoría
   * Útil para agregar dinámicamente en encabezados
   */
  getKeywords: (type = 'core') => {
    return KEYWORDS[type] || KEYWORDS.core;
  }
};

/**
 * CONSTANTES GLOBALES para Schema.org
 */
// IMPORTANTE: Debe coincidir con SchemaMarkup.jsx — usar el subtipo más específico.
// Google exige 'HomeGoodsStore' (LocalBusiness → Store → HomeGoodsStore) para comercios de textiles del hogar.
export const ORGANIZATION = {
  '@context': 'https://schema.org',
  '@type': 'HomeGoodsStore',
  name: 'Gaddyel',
  alternateName: 'Gaddyel Blanquería Personalizada',
  description: 'Blanquería personalizada premium para centros de estética, spas y gabinetes',
  url: DOMAIN,
  telephone: PHONE,
  email: EMAIL,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Argentina', // Actualizar con dirección real
    addressCountry: 'AR'
  },
  sameAs: SCHEMA_CONTACT.sameAs,
  knowsAbout: [
    'Textiles de estética',
    'Bordado personalizado',
    'Blanquería premium',
    'Personalización industrial'
  ]
};

export default seoMeta;
