import React, { useState, useCallback, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import CartIcon from '../../CartIcon';
import LogoGaddyel from '../../../Activos/Imagenes/Logo-Gaddyel.png';
import { logger } from '../../../utils/logger';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { isAuthenticated, cliente, cerrarSesion } = useAuth(); // ✅ Usar hook useAuth
    const navigate = useNavigate();
    const logoSrc = LogoGaddyel || 'https://via.placeholder.com/64?text=Logo';

    // Monitorear scroll para sombra dinámica
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Monitorear cambios en autenticación
    useEffect(() => {
        logger.debug('[Navbar] Estado actualizado:', {
            isAuthenticated,
            cliente: cliente?.nombre || 'No autenticado'
        });
    }, [isAuthenticated, cliente]);

    const toggleMenu = () => {
        setIsOpen((prev) => !prev);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen((prev) => !prev);
    };

    const closeUserMenu = () => {
        setIsUserMenuOpen(false);
    };

    const handleLogout = () => {
        logger.info('[Navbar] Logout iniciado');
        cerrarSesion();
        closeUserMenu();
        navigate('/', { replace: true });
    };

    const handleScrollToTop = useCallback(() => {
        // ✅ HELPER: Scroll suave al tope de la página
        // ¿Por qué? Logo debe llevar a inicio Y hacer scroll al top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleLogoClick = useCallback((e) => {
        // ✅ Si ya estamos en inicio, solo hace scroll
        // Si estamos en otra página, NavLink navega y luego scroll
        if (window.location.pathname === '/') {
            e.preventDefault();
            handleScrollToTop();
        } else {
            // NavLink se encargará de la navegación
            // Scroll sucederá en el siguiente render
            setTimeout(handleScrollToTop, 0);
        }
    }, [handleScrollToTop]);

    const navLinks = [
        { to: '/', label: 'Inicio' },
        { to: '/catalogo', label: 'Catálogo' },
        { to: '/nosotros', label: 'Nosotros' },
        { to: '/contacto', label: 'Contacto' },
        { to: '/proceso', label: 'Nuestro Proceso' },
    ];

    return (
        <header className={`bg-gray-100/95 dark:bg-gray-900/95 backdrop-blur-md sticky top-0 z-50 animate-fade-in transition-shadow duration-300 ${
            scrolled ? 'shadow-xl' : 'shadow-md'
        }`}>
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                <div className="flex-shrink-0">
                    <NavLink 
                        to="/" 
                        onClick={handleLogoClick}
                        className="flex items-center space-x-2" 
                        aria-label="Ir a la página de inicio de Gaddyel (volver al top)"
                    >
                        <img
                            src={logoSrc}
                            alt="Logo de Gaddyel"
                            className="h-16 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                        />
                    </NavLink>
                </div>

                {/* Separador visual sutil */}
                <div className="hidden md:block h-8 w-px bg-gray-300 dark:bg-gray-700 mx-4"></div>

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
                <div className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Menú principal">
                    {navLinks.map((link) => (
                        <NavLink 
                            key={link.to} 
                            to={link.to} 
                            className={({ isActive }) => 
                                `relative text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors duration-300 font-medium ${
                                    isActive ? 'text-gray-900 dark:text-gray-100' : ''
                                } group`
                            }
                        >
                            {link.label}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
                        </NavLink>
                    ))}

                    {/* CartIcon */}
                    <CartIcon />

                    {/* Menú de usuario */}
                    <div className="relative">
                        {isAuthenticated ? (
                            <>
                                <button
                                    onClick={toggleUserMenu}
                                    className="relative flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors duration-300 font-medium group"
                                    aria-label="Menú de usuario"
                                    aria-expanded={isUserMenuOpen}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium">{cliente?.nombre?.split(' ')[0] || 'Usuario'}</span>
                                    <svg className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
                                </button>

                                {/* Dropdown de usuario autenticado */}
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in fade-in zoom-in">
                                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{cliente?.nombre}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{cliente?.email}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                navigate('/perfil');
                                                closeUserMenu();
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            Mi Perfil
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={toggleUserMenu}
                                    className="relative flex items-center space-x-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-300 font-medium group"
                                    aria-label="Menú de autenticación"
                                    aria-expanded={isUserMenuOpen}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium">Cuenta</span>
                                    <svg className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
                                </button>

                                {/* Dropdown de invitado */}
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                                        <button
                                            onClick={() => {
                                                navigate('/login');
                                                closeUserMenu();
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            Iniciar Sesión
                                        </button>
                                        <button
                                            onClick={() => {
                                                navigate('/registro');
                                                closeUserMenu();
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            Registrarse
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Menú desplegable para móviles */}
            <div
                id="mobile-menu"
                className={`md:hidden absolute w-full bg-gray-100 dark:bg-gray-900 transition-all duration-300 ease-in-out transform origin-top ${
                    isOpen ? 'opacity-100 translate-y-0 scale-y-100' : 'opacity-0 -translate-y-2 scale-y-95 pointer-events-none'
                }`}
                role="menu"
                aria-label="Menú móvil"
            >
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className="w-full text-center py-3 text-lg font-semibold rounded-lg text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 transform hover:translate-x-1 hover:shadow-md"
                            onClick={closeMenu}
                            onKeyDown={(e) => ['Enter', 'Space'].includes(e.key) && closeMenu()}
                            role="menuitem"
                        >
                            {link.label}
                        </NavLink>
                    ))}

                    {/* Separador */}
                    <div className="w-full border-t border-gray-300 dark:border-gray-700 my-2"></div>

                    {/* Opciones de autenticación en móvil */}
                    {isAuthenticated ? (
                        <>
                            <div className="w-full text-center py-2 px-4">
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{cliente?.nombre}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{cliente?.email}</p>
                            </div>
                            <button
                                onClick={() => {
                                    navigate('/perfil');
                                    closeMenu();
                                }}
                                className="w-full text-center py-2 text-lg font-bold rounded-lg text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                Mi Perfil
                            </button>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    closeMenu();
                                }}
                                className="w-full text-center py-2 text-lg font-bold rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900"
                            >
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => {
                                    navigate('/login');
                                    closeMenu();
                                }}
                                className="w-full text-center py-2 text-lg font-bold rounded-lg text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                onClick={() => {
                                    navigate('/registro');
                                    closeMenu();
                                }}
                                className="w-full text-center py-2 text-lg font-bold rounded-lg text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                Registrarse
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default React.memo(Navbar);