import React from 'react';
import { Helmet } from 'react-helmet-async';
import { CONTACT_INFO, SCHEMA_CONTACT } from '../constants/contactInfo';

/**
 * 📋 Componente JSON-LD LocalBusiness + ProfessionalService
 * 
 * FLUJO DE DATOS:
 * 1. Componente monta en App.jsx
 * 2. Helmet inyecta <script type="application/ld+json">
 * 3. Google crawlea el schema.org y entiende:
 *    - Quiénes somos (LocalBusiness)
 *    - Qué servicios ofrecemos (ProfessionalService)
 *    - Dónde operamos (Argentina)
 *    - Cómo contactarnos
 * 4. Aparecemos en Knowledge Panel y búsquedas locales
 * 
 * VENTAJA SEO:
 * - Google Rich Results: Muestra info en SERP
 * - Voice Search: Optimizado para búsqueda por voz
 * - Local Search: Ranking en búsquedas geográficas
 * - Trust: Signals adicionales de autoridad
 * 
 * SCHEMA INCLUIDOS:
 * ✅ LocalBusiness - Para búsquedas locales
 * ✅ ProfessionalService - Para servicios de personalización
 * ✅ Organization - Info corporativa
 */
const SchemaMarkup = ({ additionalSchema = null }) => {
  // Schema LocalBusiness unificado (Google exige image, telephone, address en entidad principal)
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://gaddyel.vercel.app',
    name: 'Gaddyel',
    image: 'https://gaddyel.vercel.app/logo.jpg', // Logo principal
    description: 'Blanquería personalizada premium para centros de estética, spas y gabinetes en Argentina',
    url: 'https://gaddyel.vercel.app',
    telephone: SCHEMA_CONTACT.telephone,
    email: SCHEMA_CONTACT.email,
    priceRange: '$$', // Rango de precios medio
    
    // ✅ Dirección completa (requerido por Google)
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT_INFO.address.street,
      addressLocality: CONTACT_INFO.address.city,
      addressRegion: CONTACT_INFO.address.region,
      addressCountry: CONTACT_INFO.address.country,
      postalCode: CONTACT_INFO.address.postalCode || ''
    },

    // ✅ Ubicación de servicio (Argentina completa)
    areaServed: {
      '@type': 'Country',
      name: 'Argentina'
    },

    // ✅ Horarios de servicio
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: CONTACT_INFO.hours.weekday.dayOfWeek,
        opens: CONTACT_INFO.hours.weekday.opens,
        closes: CONTACT_INFO.hours.weekday.closes
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: CONTACT_INFO.hours.weekend.dayOfWeek,
        opens: CONTACT_INFO.hours.weekend.opens,
        closes: CONTACT_INFO.hours.weekend.closes
      }
    ],

    // ✅ Redes sociales
    sameAs: SCHEMA_CONTACT.sameAs,

    // ✅ Catálogo de servicios (en lugar de múltiples ProfessionalService independientes)
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicios de Personalización Textil',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Personalización de Vinchas Faciales',
            description: 'Vinchas bordadas con logo personalizado para tratamientos faciales de spas y centros de estética'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Batas Personalizadas con Logo Bordado',
            description: 'Batas de satén y algodón con bordado industrial de logos para centros de estética'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Toallas Bordadas Personalizadas',
            description: 'Toallas de estética bordadas con logos y diseños personalizados. Mínimo 12 unidades'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Insumos Textiles para Estética',
            description: 'Blanquería y textiles premium para gabinetes, spas y centros de belleza con opciones de personalización'
          }
        }
      ]
    }

    // ⚠️ aggregateRating eliminado: No incluir reseñas falsas
    // Se agregará cuando haya un sistema real de reseñas
  };

  // Schema Organization (para Knowledge Panel)
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gaddyel',
    alternateName: 'Gaddyel Blanquería Personalizada',
    url: 'https://gaddyel.vercel.app',
    logo: 'https://gaddyel.vercel.app/logo.jpg',
    image: 'https://gaddyel.vercel.app/logo.jpg',
    description: 'Especialistas en blanquería personalizada para estética y spa',
    sameAs: SCHEMA_CONTACT.sameAs,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT_INFO.address.street,
      addressLocality: CONTACT_INFO.address.city,
      addressRegion: CONTACT_INFO.address.region,
      addressCountry: CONTACT_INFO.address.country,
      postalCode: CONTACT_INFO.address.postalCode || ''
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: SCHEMA_CONTACT.telephone,
      email: SCHEMA_CONTACT.email,
      areaServed: 'AR',
      availableLanguage: ['es-AR']
    }
  };

  // Schema WebSite (para Search Appearance)
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Gaddyel',
    url: 'https://gaddyel.vercel.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://gaddyel.vercel.app/catalogo?search={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <Helmet>
      {/* LocalBusiness Schema */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>

      {/* Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>

      {/* WebSite Schema */}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>

      {/* Schema adicional (si se pasa como prop) */}
      {additionalSchema && (
        <script type="application/ld+json">
          {JSON.stringify(additionalSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SchemaMarkup;
