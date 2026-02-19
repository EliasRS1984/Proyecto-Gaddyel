import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ORGANIZATION } from '../../utils/seoMeta';

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
  // Schema LocalBusiness con énfasis en servicios de personalización
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://gaddyel.vercel.app',
    name: 'Gaddyel',
    image: 'https://gaddyel.vercel.app/og-home.jpg',
    description: 'Blanquería personalizada premium para centros de estética, spas y gabinetes en Argentina',
    url: 'https://gaddyel.vercel.app',
    telephone: '+5491123456789', // Reemplazar con número real
    email: 'hola@gaddyel.com', // Reemplazar con email real
    
    // ✅ Servicios que ofrece
    service: [
      {
        '@type': 'ProfessionalService',
        name: 'Personalización de Vinchas Faciales',
        description: 'Vinchas bordadas con logo personalizado para tratamientos faciales de spas y centros de estética',
        areaServed: 'AR',
        availableLanguage: 'es-AR'
      },
      {
        '@type': 'ProfessionalService',
        name: 'Batas Personalizadas con Logo Bordado',
        description: 'Batas de satén y algodón con bordado industrial de logos para centros de estética',
        areaServed: 'AR',
        availableLanguage: 'es-AR'
      },
      {
        '@type': 'ProfessionalService',
        name: 'Toallas Bordadas Personalizadas',
        description: 'Toallas de estética bordadas con logos y diseños personalizados. Mínimo 12 unidades',
        areaServed: 'AR',
        availableLanguage: 'es-AR'
      },
      {
        '@type': 'ProfessionalService',
        name: 'Insumos Textiles para Estética',
        description: 'Blanquería y textiles premium para gabinetes, spas y centros de belleza con opciones de personalización',
        areaServed: 'AR',
        availableLanguage: 'es-AR'
      }
    ],

    // ✅ Ubicación (Argentina completa)
    areaServed: {
      '@type': 'Country',
      name: 'Argentina'
    },

    // ✅ Ubicación física (si hay sucursal, agregar)
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AR',
      addressRegion: 'Buenos Aires' // Actualizar con región real
    },

    // ✅ Horarios de servicio
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00'
      }
    ],

    // ✅ Redes sociales
    sameAs: [
      'https://www.instagram.com/gaddyel',
      'https://www.facebook.com/gaddyel',
      'https://wa.me/5491123456789'
    ],

    // ✅ Contacto
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        telephone: '+5491123456789',
        email: 'hola@gaddyel.com',
        areaServed: 'AR',
        availableLanguage: ['es-AR']
      }
    ],

    // ✅ Agregación de reseñas (importante para Trust)
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '12',
      bestRating: '5',
      worstRating: '1'
    }
  };

  // Schema Organization (para Knowledge Panel)
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gaddyel',
    alternateName: 'Gaddyel Blanquería Personalizada',
    url: 'https://gaddyel.vercel.app',
    logo: 'https://gaddyel.vercel.app/logo.jpg',
    description: 'Especialistas en blanquería personalizada para estética y spa',
    sameAs: [
      'https://www.instagram.com/gaddyel',
      'https://www.facebook.com/gaddyel'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: '+5491123456789'
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
