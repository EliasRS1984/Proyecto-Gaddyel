import { Helmet } from 'react-helmet-async';
import { CONTACT_INFO, SCHEMA_CONTACT } from '../constants/contactInfo';

// =====================================================================
// ¿QUÉ ES ESTO?
// Componente invisible — no muestra nada al usuario.
// Su único trabajo es inyectar datos estructurados (JSON-LD) en el HTML
// para que Google entienda quién es Gaddyel, qué ofrece y cómo contactarla.
//
// ¿CÓMO FUNCIONA?
// 1. Se monta una sola vez en App.jsx (envuelve todas las rutas)
// 2. react-helmet-async inyecta <script type="application/ld+json"> en el <head>
// 3. Google al rastrear el sitio lee esos scripts y muestra en los resultados:
//    - Panel de conocimiento (nombre, teléfono, horarios)
//    - Ubicación en búsquedas locales ("blanquería personalizada Argentina")
//    - Acciones directas (ir al sitio, llamar, ver horarios)
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// - Validar el output: https://search.google.com/test/rich-results
// - Si los datos de contacto son incorrectos → Revisar src/constants/contactInfo.js
// - Si Google no indexa → Verificar que SchemaMarkup esté montado en App.jsx
//
// NOTA: Los 3 schemas se definen UNA SOLA VEZ fuera del componente (son datos estáticos).
// Definirlos dentro haría que se reconstruyan en cada render innecesariamente.
// =====================================================================

// ======== DATOS COMPARTIDOS ========
// La dirección se usa en LocalBusiness y en Organization — definir una sola vez
// evita que queden desincronizados si la dirección cambia.
const sharedAddress = {
  '@type': 'PostalAddress',
  streetAddress: CONTACT_INFO.address.street,
  addressLocality: CONTACT_INFO.address.city,
  addressRegion: CONTACT_INFO.address.region,
  addressCountry: CONTACT_INFO.address.country,
  postalCode: CONTACT_INFO.address.postalCode || ''
};

// ======== SCHEMA: LOCAL BUSINESS ========
// Le dice a Google que Gaddyel es un negocio local en Argentina.
// Habilita: Knowledge Panel, búsquedas locales, horarios en SERP.
//
// ¿POR QUÉ 'HomeGoodsStore'?
// Google exige el subtipo MÁS ESPECÍFICO posible — 'LocalBusiness' es demasiado genérico.
// La jerarquía es: LocalBusiness → Store → HomeGoodsStore.
// Gaddyel vende blanquería/textiles para el hogar y estética, lo que encaja con HomeGoodsStore.
// Referencia oficial: https://developers.google.com/search/docs/appearance/structured-data/local-business
//
// ¿POR QUÉ 'image' es un array?
// Google recomienda proveer 3 relaciones de aspecto para máxima elegibilidad en carrusel:
// 1x1, 4x3 y 16x9. Cuando solo haya una URL disponible, igual debe ir como array.
// TODO: Crear/subir versiones 1x1 y 4x3 del logo cuando estén disponibles en Cloudinary.
const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'HomeGoodsStore',
    '@id': 'https://gaddyel.vercel.app',
    name: 'Gaddyel',
    image: [
      'https://gaddyel.vercel.app/logo.jpg'
      // TODO: agregar versiones 4x3 y 16x9 cuando estén disponibles
    ],
    description: 'Blanquería personalizada premium para centros de estética, spas y gabinetes en Argentina',
    url: 'https://gaddyel.vercel.app',
    telephone: SCHEMA_CONTACT.telephone,
    email: SCHEMA_CONTACT.email,
    priceRange: '$$', // Rango de precios medio
    
    // Dirección (datos centralizados en contactInfo.js)
    address: sharedAddress,

    // Área de cobertura del servicio (todo el país)
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

    // aggregateRating: se agregará cuando haya un sistema real de reseñas (no incluir datos falsos)
};

// ======== SCHEMA: ORGANIZATION ========
// Le dice a Google la identidad corporativa de Gaddyel.
// Habilita: Knowledge Panel, logo en resultados, redes sociales asociadas.
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Gaddyel',
  alternateName: 'Gaddyel Blanquería Personalizada',
  url: 'https://gaddyel.vercel.app',
  logo: 'https://gaddyel.vercel.app/logo.jpg',
  image: 'https://gaddyel.vercel.app/logo.jpg',
    description: 'Especialistas en blanquería y textiles personalizados para centros de estética y spa en Argentina',
  sameAs: SCHEMA_CONTACT.sameAs,
  address: sharedAddress,
  // contactPoint: Google recomienda incluir tanto telephone como email
  // Referencia: https://developers.google.com/search/docs/appearance/structured-data/organization
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    telephone: SCHEMA_CONTACT.telephone,
    email: SCHEMA_CONTACT.email,
    areaServed: 'AR',
    availableLanguage: ['es-AR']
  }
};

// ======== SCHEMA: WEBSITE ========
// Le dice a Google que el buscador interno del sitio (/catalogo?search=) puede usarse
// como acción directa desde los resultados de búsqueda (Sitelinks Searchbox).
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

// ======== COMPONENTE ========
// Solo renderiza los scripts JSON-LD — no tiene UI propia.
// additionalSchema permite que páginas individuales inyecten su propio schema
// (ej: DetalleProducto puede pasar un schema tipo Product).
const SchemaMarkup = ({ additionalSchema = null }) => (
  <Helmet>
    <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
    <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
    <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
    {additionalSchema && (
      <script type="application/ld+json">{JSON.stringify(additionalSchema)}</script>
    )}
  </Helmet>
);

export default SchemaMarkup;
