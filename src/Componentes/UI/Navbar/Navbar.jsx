import React from 'react';
import { NavLink } from 'react-router-dom';
import LogoGaddyel from '../../../Activos/Imagenes/Logo-Gaddyel.png';

const Navbar = () => {
    const activeLinkStyle = ({ isActive }) => (isActive ? 'text-gray-900 border-b-2 border-gray-900 dark:text-gray-100 dark:border-gray-100' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100');

    return (
        <header className="bg-gray-100 dark:bg-gray-900 shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                <div className="flex-shrink-0">
                    <NavLink to="/" className="flex items-center space-x-2">
                        {/* TODO: Reemplazar esta URL por la de tu logo real. 
                    Por ahora, es un marcador de posición. 
                */}
                        <img
                            src= {LogoGaddyel}
                            alt="Logo de Gaddyel"
                            className="h-16 rounded-lg"
                        />
                    </NavLink>
                </div>

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
        </header>
    );
};

export default Navbar;
