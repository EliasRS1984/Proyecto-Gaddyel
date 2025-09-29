import React from 'react';
import { Link } from 'react-router-dom';

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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-instagram">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
            ),
        },
        {
            href: 'https://www.facebook.com/gaddyel.gaddyel.184/',
            label: 'Facebook',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-facebook">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
            ),
        },
    ];

    return (
        <footer className="bg-gray-800 text-white p-8 mt-16 shadow-inner animate-fade-in">
            <div className="contenedor-principal mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Columna 1: Información de Contacto */}
                <div>
                    <h3 className="text-xl font-bold mb-4 relative group">
                        Contáctanos
                        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
                    </h3>
                    <p className="text-gray-300 mb-2">Email: gaddyel.gaddyel@gmail.com</p>
                    <p className="text-gray-300 mb-2">Teléfono: +54 9 11 5509-8426</p>
                    <p className="text-gray-300">Dirección: Virrey del Pino, Buenos Aires, Argentina</p>
                </div>

                {/* Columna 2: Enlaces Rápidos */}
                <div>
                    <h3 className="text-xl font-bold mb-4 relative group">
                        Enlaces Rápidos
                        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
                    </h3>
                    <ul className="space-y-2" role="list" aria-label="Enlaces rápidos">
                        {enlacesRapidos.map((link) => (
                            <li key={link.to}>
                                <Link
                                    to={link.to}
                                    onClick={link.to === '/' ? manejarScrollAInicio : undefined}
                                    onKeyDown={(e) => ['Enter', 'Space'].includes(e.key) && link.to === '/' && manejarScrollAInicio()}
                                    className="text-gray-300 hover:text-blue-400 transition-all duration-200 hover:translate-x-1"
                                    aria-label={`Ir a ${link.label}`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Columna 3: Redes Sociales y Legal */}
                <div>
                    <h3 className="text-xl font-bold mb-4 relative group">
                        Síguenos
                        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
                    </h3>
                    <div className="flex space-x-4 mb-4">
                        {redesSociales.map((red) => (
                            <a
                                key={red.href}
                                href={red.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 transition-all duration-300 filter grayscale hover:grayscale-0 hover:scale-110 hover:shadow-lg"
                                aria-label={`Visitar ${red.label} de Gaddyel`}
                            >
                                {red.icon}
                            </a>
                        ))}
                    </div>
                    <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Gaddyel. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default React.memo(PieDePagina);