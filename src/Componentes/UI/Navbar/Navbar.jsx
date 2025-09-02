import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import LogoGaddyel from '../../../Activos/Imagenes/Logo-Gaddyel.png';

const Navbar = () => {
    // Estado para controlar la visibilidad del menú en dispositivos móviles
    const [isOpen, setIsOpen] = useState(false);

    // Función para alternar el estado del menú
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Función para cerrar el menú después de hacer clic en un enlace
    const closeMenu = () => {
        setIsOpen(false);
    };

    // Estilo para los enlaces activos
    const activeLinkStyle = ({ isActive }) => (isActive ? 'text-gray-900 border-b-2 border-gray-900 dark:text-gray-100 dark:border-gray-100' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100');

    return (
        <header className="bg-gray-100 dark:bg-gray-900 shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                <div className="flex-shrink-0">
                    <NavLink to="/" className="flex items-center space-x-2">
                        <img
                            src={LogoGaddyel}
                            alt="Logo de Gaddyel"
                            className="h-16 rounded-lg"
                        />
                    </NavLink>
                </div>

                {/* Botón del menú de hamburguesa para móviles */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-gray-900 dark:text-gray-100 focus:outline-none">
                        {/* Renderizado condicional del ícono de hamburguesa o "X" */}
                        {isOpen ? (
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Enlaces de navegación para escritorio */}
                <div className="hidden md:flex items-center space-x-6">
                    <NavLink to="/" className={activeLinkStyle}>
                        Inicio
                    </NavLink>
                    <NavLink to="/catalogo" className={activeLinkStyle}>
                        Catálogo
                    </NavLink>
                    <NavLink to="/contacto" className={activeLinkStyle}>
                        Contacto
                    </NavLink>
                </div>
            </nav>

            {/* Menú desplegable para móviles */}
            <div
                className={`md:hidden ${isOpen ? 'block' : 'hidden'} transition-all duration-300 ease-in-out transform`}
            >
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
                    <NavLink to="/" className="w-full text-center py-2 text-xl font-bold rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700" onClick={closeMenu}>
                        Inicio
                    </NavLink>
                    <NavLink to="/catalogo" className="w-full text-center py-2 text-xl font-bold rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700" onClick={closeMenu}>
                        Catálogo
                    </NavLink>
                    <NavLink to="/contacto" className="w-full text-center py-2 text-xl font-bold rounded-lg text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700" onClick={closeMenu}>
                        Contacto
                    </NavLink>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
