import React from 'react';
// Importamos el componente Link de react-router-dom para la navegación interna
import { Link } from 'react-router-dom';

const PieDePagina = () => {
    // Función para hacer scroll suave al inicio de la página
    const manejarScrollAInicio = () => {
        window.scrollTo({
            top: 0, // Desplaza a la parte superior de la página
            behavior: 'smooth' // Hace que el desplazamiento sea suave
        });
    };

    return (
        <footer className="bg-gray-800 text-white p-8 mt-16 shadow-inner">
            <div className="contenedor-principal mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Columna 1: Información de Contacto */}
                <div>
                    <h3 className="text-xl font-bold mb-4">Contáctanos</h3>
                    <p className="text-gray-300 mb-2">Email: gaddyel.gaddyel@gmail.com</p>
                    <p className="text-gray-300 mb-2">Teléfono: +54 9 11 5509-8426</p>
                    <p className="text-gray-300">Dirección: Virrey del Pino, Buenos Aires, Argentina</p>
                </div>

                {/* Columna 2: Enlaces Rápidos */}
                <div>
                    <h3 className="text-xl font-bold mb-4">Enlaces Rápidos</h3>
                    <ul className="space-y-2">
                        {/* Añadimos el enlace a Inicio aquí y le agregamos la función de scroll */}
                        <li>
                            <Link
                                to="/"
                                onClick={manejarScrollAInicio} // <-- Aquí se añade la función
                                className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                            >
                                Inicio
                            </Link>
                        </li>
                        <li><Link to="/catalogo" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Catálogo</Link></li>
                        <li><Link to="/proceso" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Nuestro Proceso</Link></li>
                        <li><Link to="/nosotros" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Sobre Gaddyel</Link></li>
                        <li><Link to="/contacto" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Contacto</Link></li>
                    </ul>
                </div>

                {/* Columna 3: Redes Sociales y Legal */}
                <div>
                    <h3 className="text-xl font-bold mb-4">Síguenos</h3>
                    <div className="flex space-x-4 mb-4">
                        {/* 💡 CAMBIO CLAVE: Icono de Instagram con filtro de escala de grises y efecto de hover */}
                        <a 
                            // REEMPLAZA "TU-URL-DE-INSTAGRAM" con el enlace exacto a tu perfil
                            href="https://www.instagram.com/gaddyel.oficial/" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-8 h-8 transition-all duration-300 filter grayscale hover:grayscale-0"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-instagram">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>
                        
                        {/* 💡 CAMBIO CLAVE: Icono de Facebook con filtro de escala de grises y efecto de hover */}
                        <a 
                            // REEMPLAZA "TU-URL-DE-FACEBOOK" con el enlace exacto a tu perfil
                            href="https://www.facebook.com/gaddyel.gaddyel.184/" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-8 h-8 transition-all duration-300 filter grayscale hover:grayscale-0"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-facebook">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                        </a>
                    </div>
                    <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Gaddyel. Todos los derechos reservados.</p>
                    <p className="text-gray-400 text-sm mt-1">
                        <Link to="/politica-privacidad" className="hover:text-blue-400 transition-colors duration-200">Política de Privacidad</Link> |
                        <Link to="/terminos-servicio" className="hover:text-blue-400 transition-colors duration-200 ml-1">Términos de Servicio</Link>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default PieDePagina;
