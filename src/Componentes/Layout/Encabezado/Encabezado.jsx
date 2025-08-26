import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoGaddyel from '../../../Activos/imagenes/logo-gaddyel.png';

const Encabezado = () => {
    const [menuAbierto, setMenuAbierto] = useState(false);

    const alternarMenu = () => {
        setMenuAbierto(!menuAbierto);
    };

    return (
        <header className="bg-white shadow-md p-4 sticky top-0 z-50">
            <div className="contenedor-principal mx-auto flex justify-between items-center max-w-7xl">
                {/* Logo de Gaddyel */}
                <div className="flex items-center">
                    <Link to="/" className="flex items-center space-x-2" onClick={() => setMenuAbierto(false)}>
                        {/* Ajustamos el tamaño del logo: de h-10 md:h-12 a h-12 md:h-16 */}
                        <img src={LogoGaddyel} alt="Logo de Gaddyel" className="h-12 md:h-16 lg:h-20" />
                        <span className="sr-only">Gaddyel Blanquería Personalizada</span>
                    </Link>
                </div>

                {/* Botón de Hamburguesa para Móviles */}
                <div className="md:hidden">
                    <button onClick={alternarMenu} className="text-gray-800 focus:outline-none">
                        {menuAbierto ? (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        ) : (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        )}
                    </button>
                </div>

                {/* Navegación Principal para Escritorio y Móviles */}
                <nav className={`
            ${menuAbierto ? 'flex flex-col absolute top-full left-0 w-full bg-white shadow-md py-4' : 'hidden'}
            md:flex md:flex-row md:items-center md:space-x-8 md:static md:w-auto md:bg-transparent md:shadow-none md:py-0
        `}>
                    <Link to="/" onClick={menuAbierto ? alternarMenu : undefined} className="enlace-navegacion block py-2 px-4 md:py-0 md:px-0 text-gray-800 hover:text-blue-600 font-semibold transition-colors duration-200">Inicio</Link>
                    <Link to="/catalogo" onClick={menuAbierto ? alternarMenu : undefined} className="enlace-navegacion block py-2 px-4 md:py-0 md:px-0 text-gray-800 hover:text-blue-600 font-semibold transition-colors duration-200">Catálogo</Link>
                    <Link to="/nuestro-proceso" onClick={menuAbierto ? alternarMenu : undefined} className="enlace-navegacion block py-2 px-4 md:py-0 md:px-0 text-gray-800 hover:text-blue-600 font-semibold transition-colors duration-200">Nuestro Proceso</Link>
                    <Link to="/sobre-gaddyel" onClick={menuAbierto ? alternarMenu : undefined} className="enlace-navegacion block py-2 px-4 md:py-0 md:px-0 text-gray-800 hover:text-blue-600 font-semibold transition-colors duration-200">Sobre Gaddyel</Link>
                    <Link to="/galeria" onClick={menuAbierto ? alternarMenu : undefined} className="enlace-navegacion block py-2 px-4 md:py-0 md:px-0 text-gray-800 hover:text-blue-600 font-semibold transition-colors duration-200">Galería</Link>
                    <Link to="/contacto" onClick={menuAbierto ? alternarMenu : undefined} className="enlace-navegacion block py-2 px-4 md:py-0 md:px-0 text-gray-800 hover:text-blue-600 font-semibold transition-colors duration-200">Contacto</Link>
                </nav>
            </div>
        </header>
    );
};

export default Encabezado;
