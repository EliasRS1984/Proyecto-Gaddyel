// ============================================================
// ¿QUÉ ES ESTO?
// Archivo especial que Vercel ejecuta EN EL SERVIDOR antes de servir cualquier página.
// Su trabajo: cuando un bot de redes sociales (Facebook, WhatsApp, LinkedIn,
// etc.) pide una página, inyecta los metadatos correctos de imagen y título
// para ESA página específica.
//
// ¿POR QUÉ ES NECESARIO?
// El sitio es una SPA (Single Page Application): existe un único archivo
// index.html que siempre contiene los datos de la página de inicio.
// Los bots NO ejecutan JavaScript, por lo que sin este archivo siempre
// verían el título e imagen del inicio, sin importar qué URL comparten.
//
// ¿CÓMO FUNCIONA?
// 1. Llega una solicitud de /catalogo (u otra ruta configurada abajo)
// 2. Se detecta si quien pide es un bot de redes sociales por su "firma"
// 3. Si es bot: descarga el index.html, reemplaza los metadatos, entrega la versión correcta
// 4. Si es usuario normal: deja pasar la solicitud sin tocar nada (React carga normal)
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// - ¿La imagen incorrecta en WhatsApp? → Revisar OG_PAGES más abajo
// - ¿Sigue mostrando datos del inicio? → Verificar que el User-Agent del bot
//   esté incluido en CRAWLER_REGEX
// - ¿Error en el deploy? → Revisar que el archivo esté en la raíz del proyecto
// ============================================================

const DOMAIN = 'https://gaddyel.vercel.app';

// ======== DATOS ESPECÍFICOS POR PÁGINA ========
// Cada ruta tiene su título, descripción e imagen propia.
// Cuando alguien comparte esa URL en redes, esto es lo que verá.
const OG_PAGES = {
    '/catalogo': {
        title: 'Catálogo de Blanquería Personalizada | Vinchas, Batas y Toallas | Gaddyel',
        description: 'Explore nuestro catálogo completo: vinchas para tratamientos faciales, batas bordadas con logo para spa, toallas personalizadas y más. Envíos a Argentina.',
        image: `${DOMAIN}/og-catalogo.jpg`,
        url: `${DOMAIN}/catalogo`
    },
    '/nosotros': {
        title: 'Quiénes Somos | Gaddyel - Blanquería Premium para Profesionales de la Estética',
        description: 'Gaddyel es tu aliado en elevar la identidad de marca de tu centro estético. Especialistas en blanquería personalizada: vinchas, batas y toallas bordadas para spas y gabinetes en Argentina.',
        image: `${DOMAIN}/og-about.jpg`,
        url: `${DOMAIN}/nosotros`
    },
    '/proceso': {
        title: 'Nuestro Proceso de Personalización | Gaddyel Blanquería',
        description: 'Conocé cómo llevamos a cabo la personalización de tu blanquería: desde el diseño hasta la entrega. Proceso transparente y garantizado.',
        image: `${DOMAIN}/og-proceso.jpg`,
        url: `${DOMAIN}/proceso`
    },
    '/contacto': {
        title: 'Contactar Gaddyel | Personalización de Blanquería para Estética y Spa',
        description: 'Contactanos para conocer nuestras opciones de personalización. Asesoramiento gratuito sobre bordado de logos, mínimos y envíos a todo Argentina.',
        image: `${DOMAIN}/og-contact.jpg`,
        url: `${DOMAIN}/contacto`
    }
};

// ======== LISTA DE BOTS CONOCIDOS ========
// "Firma" que cada red social deja en sus peticiones automáticas.
// Si el que pide la página tiene una de estas firmas, es un bot.
const CRAWLER_REGEX = /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|WhatsApp|Googlebot|Slackbot|TelegramBot|bingbot|DuckDuckBot|Discordbot|ia_archiver/i;

// ======== FUNCIÓN PRINCIPAL ========
// Esta función corre automáticamente en las rutas definidas en "config" al final.
export default async function middleware(request) {
    const { pathname } = new URL(request.url);

    // ¿Tenemos datos específicos para esta ruta?
    const ogData = OG_PAGES[pathname];
    if (!ogData) return; // No → dejar pasar sin cambios

    // ¿Es un bot de redes sociales?
    const userAgent = request.headers.get('user-agent') || '';
    if (!CRAWLER_REGEX.test(userAgent)) return; // No → dejar pasar sin cambios

    try {
        // Descargar el index.html base.
        // Usamos el mismo origen del request para que funcione tanto en
        // producción como en previews de deploy de Vercel.
        const origin = new URL(request.url).origin;
        const htmlResponse = await fetch(`${origin}/`, {
            headers: { 'user-agent': 'internal-og-fetch' }
        });

        if (!htmlResponse.ok) return; // Si falla la descarga, dejar pasar normalmente

        let html = await htmlResponse.text();

        // ======== REEMPLAZOS EN EL HTML ========
        // Cambiamos los metadatos del inicio por los de la página pedida.

        // Título de la pestaña del navegador
        html = html.replace(
            /<title>[^<]*<\/title>/,
            `<title>${ogData.title}</title>`
        );

        // Open Graph — lo que usa Facebook, WhatsApp, Instagram, LinkedIn
        html = html.replace(
            /<meta property="og:title" content="[^"]*" \/>/,
            `<meta property="og:title" content="${ogData.title}" />`
        );
        html = html.replace(
            /<meta property="og:description" content="[^"]*" \/>/,
            `<meta property="og:description" content="${ogData.description}" />`
        );
        html = html.replace(
            /<meta property="og:url" content="[^"]*" \/>/,
            `<meta property="og:url" content="${ogData.url}" />`
        );
        // NOTA: el patrón termina en '" />' para NO confundir
        // og:image con og:image:width, og:image:height, og:image:type
        html = html.replace(
            /<meta property="og:image" content="[^"]*" \/>/,
            `<meta property="og:image" content="${ogData.image}" />`
        );

        // Twitter Cards — lo que usa Twitter/X
        html = html.replace(
            /<meta name="twitter:title" content="[^"]*" \/>/,
            `<meta name="twitter:title" content="${ogData.title}" />`
        );
        html = html.replace(
            /<meta name="twitter:description" content="[^"]*" \/>/,
            `<meta name="twitter:description" content="${ogData.description}" />`
        );
        html = html.replace(
            /<meta name="twitter:image" content="[^"]*" \/>/,
            `<meta name="twitter:image" content="${ogData.image}" />`
        );

        // URL canónica — le dice a Google cuál es la dirección "oficial"
        html = html.replace(
            /<link rel="canonical" href="[^"]*" \/>/,
            `<link rel="canonical" href="${ogData.url}" />`
        );

        // Devolver el HTML modificado con código 200 (no 206)
        return new Response(html, {
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60'
            }
        });

    } catch {
        // Si algo falla inesperadamente, dejamos pasar la solicitud normalmente.
        // Mejor mostrar algo que tirar un error.
        return;
    }
}

// ======== RUTAS QUE ACTIVAN ESTE ARCHIVO ========
// Solo las páginas que tienen datos propios en OG_PAGES de arriba.
// La página de inicio (/) no necesita esto — su index.html ya es correcto.
export const config = {
    matcher: ['/catalogo', '/nosotros', '/proceso', '/contacto']
};
