import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const PieDePagina = () => {
    const manejarScrollAInicio = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const enlacesRapidos = [
        { to: '/', label: 'Inicio' },
        { to: '/catalogo', label: 'Catálogo' },
        { to: '/proceso', label: 'Nuestro Proceso' },
        { to: '/nosotros', label: 'Sobre Gaddyel' },
        { to: '/contacto', label: 'Contacto' },
    ];

    const redesSociales = [
        {
            href: 'https://www.instagram.com/gaddyel.oficial/',
            label: 'Instagram',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <circle cx="17.5" cy="6.5" r="1.5"></circle>
                </svg>
            ),
        },
        {
            href: 'https://www.facebook.com/gaddyel.gaddyel.184/',
            label: 'Facebook',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
            ),
        },
    ];

    return (
        <footer className="bg-gray-700 text-white mt-20">
            {/* SECCIÓN PRINCIPAL - 3 COLUMNAS */}
            <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                {/* COLUMNA 1: INFORMACIÓN EMPRESARIAL */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-semibold tracking-wide text-white">Gaddyel</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        “Blanquería personalizada
para centros de estética y spa”
                    </p>
                    <div className="pt-4 space-y-2 text-sm text-gray-300">
                        <p>📍 Virrey del Pino, Buenos Aires</p>
                        <p>📧 gaddyel.gaddyel@gmail.com</p>
                        <p>📱 +54 9 11 5509-8426</p>
                    </div>
                </div>

                {/* COLUMNA 2: ENLACES RÁPIDOS */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-semibold tracking-wide text-white">Navega</h3>
                    <ul className="space-y-3" role="list" aria-label="Enlaces de navegación">
                        {enlacesRapidos.map((link) => (
                            <li key={link.to}>
                                <Link
                                    to={link.to}
                                    onClick={link.to === '/' ? manejarScrollAInicio : undefined}
                                    onKeyDown={(e) => ['Enter', 'Space'].includes(e.key) && link.to === '/' && manejarScrollAInicio()}
                                    className="text-gray-300 text-sm hover:text-white transition-colors duration-300"
                                    aria-label={`Ir a ${link.label}`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* COLUMNA 3: REDES SOCIALES */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-semibold tracking-wide text-white">Síguenos</h3>
                    <p className="text-gray-300 text-sm">Conecta con nosotros en redes sociales</p>
                    <div className="flex space-x-4 pt-2">
                        {redesSociales.map((red) => (
                            <a
                                key={red.href}
                                href={red.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full border border-gray-500 flex items-center justify-center text-gray-300 hover:text-white hover:border-white transition-all duration-300 hover:bg-opacity-5 hover:scale-110 transform"
                                aria-label={`Visitar ${red.label} de Gaddyel`}
                            >
                                {red.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* SEPARADOR SUTIL */}
            <div className="border-t border-gray-600"></div>

            {/* FOOTER BOTTOM - COPYRIGHT Y LEGAL */}
            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-300 text-xs">
                    © {new Date().getFullYear()} Gaddyel. Todos los derechos reservados.
                </p>
                <div className="flex space-x-6 mt-4 md:mt-0 text-xs">
                    <NavLink 
                        to="/politica-privacidad"
                        className="text-gray-300 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded px-2 py-1"
                        aria-label="Ir a Política de Privacidad"
                    >
                        Política de Privacidad
                    </NavLink>
                    <NavLink 
                        to="/terminos-servicio"
                        className="text-gray-300 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded px-2 py-1"
                        aria-label="Ir a Términos de Servicio"
                    >
                        Términos de Servicio
                    </NavLink>
                </div>
            </div>
        </footer>
    );
};

export default React.memo(PieDePagina);