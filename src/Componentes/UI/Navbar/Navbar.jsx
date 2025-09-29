import React, { useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import LogoGaddyel from './Activos/Imagenes/Logo-Gaddyel.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const logoSrc = LogoGaddyel || 'https://via.placeholder.com/64?text=Logo';

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    const activeLinkStyle = useCallback(
        ({ isActive }) =>
            isActive
                ? 'text-gray-900 border-b-2 border-gray-900 dark:text-gray-100 dark:border-gray-100 transition-colors duration-200'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors duration-200',
        []
    );

    const navLinks = [
        { to: '/', label: 'Inicio' },
        { to: '/catalogo', label: 'Catálogo' },
        { to: '/nosotros', label: 'Nosotros' },
        { to: '/contacto', label: 'Contacto' },
        { to: '/proceso', label: 'Nuestro Proceso' },
    ];

    return (
        <header className="bg-gray-100 dark:bg-gray-900 shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                <div className="flex-shrink-0">
                    <NavLink to="/" className="flex items-center space-x-2" aria-label="Ir a la página de inicio de Gaddyel">
                        <img
                            src={logoSrc}
                            alt="Logo de Gaddyel"
                            className="h-16 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                        />
                    </NavLink>
                </div>

                {/* Botón del menú de hamburguesa para móviles */}
                <div className="md:hidden">
                    <button
                        onClick={toggleMenu}
                        onKeyDown={(e) => ['Enter', 'Space'].includes(e.key) && toggleMenu()}
                        className="text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        aria-label="Menú de navegación"
                        aria-expanded={isOpen}
                        aria-controls="mobile-menu"
                    >
                        <div className="relative h-8 w-8">
                            <svg
                                className={`h-8 w-8 absolute transition-opacity duration-200 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                            <svg
                                className={`h-8 w-8 absolute transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </button>
                </div>

                {/* Enlaces de navegación para escritorio */}
                <div className="hidden md:flex items-center space-x-6" role="navigation" aria-label="Menú principal">
                    {navLinks.map((link) => (
                        <NavLink key={link.to} to={link.to} className={activeLinkStyle}>
                            {link.label}
                        </NavLink>
                    ))}
                </div>
            </nav>

            {/* Menú desplegable para móviles */}
            <div
                id="mobile-menu"
                className={`md:hidden absolute w-full bg-gray-100 dark:bg-gray-900 transition-all duration-300 ease-in-out transform ${
                    isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
                }`}
                role="menu"
                aria-label="Menú móvil"
            >
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className="w-full text-center py-2 text-xl font-bold rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-105"
                            onClick={closeMenu}
                            onKeyDown={(e) => ['Enter', 'Space'].includes(e.key) && closeMenu()}
                            role="menuitem"
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>
            </div>
        </header>
    );
};

export default React.memo(Navbar);