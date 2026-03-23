import { Link } from 'react-router-dom';
import { SOCIAL_URLS } from '../../../constants/contactInfo';

/**
 * ============================================================================
 * FOOTER (PIE DE PÁGINA)
 * ============================================================================
 * 
 * ¿QUÉ ES ESTO?
 * El pie de página que aparece en todas las páginas del sitio.
 * Contiene información de la empresa, enlaces rápidos y redes sociales.
 * 
 * ¿CÓMO FUNCIONA?
 * 1. Muestra 3 columnas en desktop (info empresa, enlaces, redes)
 * 2. En móvil se apilan verticalmente
 * 3. Al hacer click en "Inicio", hace scroll suave hasta arriba
 * 4. Los links externos abren en nueva pestaña
 * 
 * ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
 * → "El scroll a inicio no funciona": Revisa manejarScrollAInicio()
 * → "Los links no se ven en dark mode": Revisa clases dark:text-xxx
 * → "El footer no se ve bien en móvil": Revisa grid responsive
 */

const Footer = () => {
    // ========================================================================
    // FUNCIÓN: SCROLL SUAVE AL INICIO
    // ========================================================================
    /**
     * Cuando el usuario hace click en "Inicio" desde el footer,
     * la página hace scroll suave hasta arriba.
     */
    const manejarScrollAInicio = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    // ========================================================================
    // DATOS: ENLACES DE NAVEGACIÓN
    // ========================================================================
    const enlacesRapidos = [
        { to: '/', label: 'Inicio' },
        { to: '/catalogo', label: 'Catálogo' },
        { to: '/proceso', label: 'Nuestro Proceso' },
        { to: '/nosotros', label: 'Sobre Gaddyel' },
        { to: '/contacto', label: 'Contacto' },
    ];

    // ========================================================================
    // DATOS: REDES SOCIALES
    // ========================================================================
    const redesSociales = [
        {
            href: SOCIAL_URLS.instagram,
            label: 'Instagram',
            icon: (
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth={2} 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-5 h-5"
                >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <circle cx="17.5" cy="6.5" r="1.5"></circle>
                </svg>
            ),
        },
        {
            href: SOCIAL_URLS.facebook,
            label: 'Facebook',
            icon: (
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth={2} 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-5 h-5"
                >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
            ),
        },
    ];

    return (
        <footer className="relative bg-slate-900 dark:bg-slate-950 text-slate-100 dark:text-slate-200 mt-24 border-t border-slate-800/50 dark:border-slate-900/50" style={{ zIndex: 20 }}>
            {/* ================================================================
                SECCIÓN PRINCIPAL - 3 COLUMNAS
                En desktop: grid de 3 columnas
                En tablet: grid de 3 columnas más compactas
                En móvil: apiladas verticalmente (1 columna)
            ================================================================ */}
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                
                {/* ============================================================
                    COLUMNA 1: INFORMACIÓN EMPRESARIAL
                    Logo, descripción breve y datos de contacto
                ============================================================ */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-semibold tracking-tight text-white dark:text-slate-50">
                        Gaddyel
                    </h3>
                    <p className="text-slate-300 dark:text-slate-400 text-[15px] leading-relaxed tracking-tight">
                        Blanquería personalizada para centros de estética y spa
                    </p>
                    
                    {/* Datos de contacto con iconos */}
                    <div className="pt-2 space-y-3 text-sm text-slate-300 dark:text-slate-400">
                        <p className="flex items-start gap-3">
                            <span className="text-slate-400 dark:text-slate-500 flex-shrink-0">📍</span>
                            <span>Virrey del Pino, Buenos Aires</span>
                        </p>
                        <p className="flex items-start gap-3">
                            <span className="text-slate-400 dark:text-slate-500 flex-shrink-0">📧</span>
                            <a 
                                href="mailto:gaddyel.gaddyel@gmail.com"
                                className="hover:text-slate-100 dark:hover:text-slate-200 transition-colors duration-500 ease-out"
                            >
                                gaddyel.gaddyel@gmail.com
                            </a>
                        </p>
                        <p className="flex items-start gap-3">
                            <span className="text-slate-400 dark:text-slate-500 flex-shrink-0">📱</span>
                            <a 
                                href="tel:+5491155098426"
                                className="hover:text-slate-100 dark:hover:text-slate-200 transition-colors duration-500 ease-out"
                            >
                                +54 9 11 5509-8426
                            </a>
                        </p>
                    </div>
                </div>

                {/* ============================================================
                    COLUMNA 2: ENLACES RÁPIDOS
                    Links de navegación principales del sitio
                ============================================================ */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-semibold tracking-tight text-white dark:text-slate-50">
                        Navega
                    </h3>
                    <nav role="navigation" aria-label="Enlaces de navegación del footer">
                        <ul className="space-y-3">
                            {enlacesRapidos.map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        onClick={link.to === '/' ? manejarScrollAInicio : undefined}
                                        className="text-slate-300 dark:text-slate-400 text-[15px] tracking-tight hover:text-slate-100 dark:hover:text-slate-200 transition-colors duration-500 ease-out inline-block group"
                                        aria-label={`Ir a ${link.label}`}
                                    >
                                        {link.label}
                                        {/* Indicador sutil en hover */}
                                        <span className="block h-[1px] w-0 bg-slate-300 dark:bg-slate-400 transition-all duration-500 ease-out group-hover:w-full"></span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                {/* ============================================================
                    COLUMNA 3: REDES SOCIALES
                    Iconos con links a redes sociales (abren en nueva pestaña)
                ============================================================ */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-semibold tracking-tight text-white dark:text-slate-50">
                        Síguenos
                    </h3>
                    <p className="text-slate-300 dark:text-slate-400 text-[15px] tracking-tight">
                        Conecta con nosotros en redes sociales
                    </p>
                    
                    {/* Iconos de redes sociales */}
                    <div className="flex gap-4 pt-2">
                        {redesSociales.map((red) => (
                            <a
                                key={red.href}
                                href={red.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                    w-11 h-11 
                                    rounded-full 
                                    border border-slate-700 dark:border-slate-800 
                                    flex items-center justify-center 
                                    text-slate-300 dark:text-slate-400 
                                    hover:text-slate-100 dark:hover:text-slate-200 
                                    hover:border-slate-500 dark:hover:border-slate-600
                                    transition-all duration-500 ease-out
                                    focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900
                                    group
                                "
                                aria-label={`Visitar ${red.label} de Gaddyel`}
                            >
                                <span className="transition-transform duration-500 ease-out group-hover:scale-110">
                                    {red.icon}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* ================================================================
                SEPARADOR SUTIL
                Línea divisoria entre sección principal y copyright
            ================================================================ */}
            <div className="border-t border-slate-800/60 dark:border-slate-900/60"></div>

            {/* ================================================================
                FOOTER BOTTOM - COPYRIGHT Y LEGAL
                Copyright, términos y política de privacidad
            ================================================================ */}
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-slate-400 dark:text-slate-500 text-xs tracking-tight">
                    © {new Date().getFullYear()} Gaddyel. Todos los derechos reservados.
                </p>
                
                {/* Links legales */}
                <nav className="flex gap-8 text-xs" aria-label="Enlaces legales">
                    <Link 
                        to="/politica-privacidad"
                        className="
                            text-slate-400 dark:text-slate-500 
                            hover:text-slate-200 dark:hover:text-slate-300 
                            transition-colors duration-500 ease-out 
                            focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 
                            rounded-lg px-3 py-1.5
                            tracking-tight
                        "
                        aria-label="Ir a Política de Privacidad"
                    >
                        Política de Privacidad
                    </Link>
                    <Link 
                        to="/terminos-servicio"
                        className="
                            text-slate-400 dark:text-slate-500 
                            hover:text-slate-200 dark:hover:text-slate-300 
                            transition-colors duration-500 ease-out 
                            focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 
                            rounded-lg px-3 py-1.5
                            tracking-tight
                        "
                        aria-label="Ir a Términos de Servicio"
                    >
                        Términos de Servicio
                    </Link>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
