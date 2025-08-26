import React from 'react';
// Importamos el componente Link de react-router-dom para la navegación interna
import { Link } from 'react-router-dom';

const PieDePagina = () => {
    // Función para hacer scroll suave al inicio de la página
    const manejarScrollAInicio = () => {
        window.scrollTo({
            top: 0,          // Desplaza a la parte superior de la página
            behavior: 'smooth' // Hace que el desplazamiento sea suave
        });
    };

    return (
        <footer className="bg-gray-800 text-white p-8 mt-16 shadow-inner">
            <div className="contenedor-principal mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Columna 1: Información de Contacto */}
                <div>
                    <h3 className="text-xl font-bold mb-4">Contáctanos</h3>
                    <p className="text-gray-300 mb-2">Email: info@gaddyel.com</p>
                    <p className="text-gray-300 mb-2">Teléfono: +54 9 11 1234 5678</p>
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
                        <li><Link to="/nuestro-proceso" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Nuestro Proceso</Link></li>
                        <li><Link to="/sobre-gaddyel" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Sobre Gaddyel</Link></li>
                        <li><Link to="/contacto" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Contacto</Link></li>
                    </ul>
                </div>

                {/* Columna 3: Redes Sociales y Legal */}
                <div>
                    <h3 className="text-xl font-bold mb-4">Síguenos</h3>
                    <div className="flex space-x-4 mb-4">
                        {/* Íconos de redes sociales - Placeholder */}
                        <a href="https://instagram.com/gaddyel" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-pink-500 transition-colors duration-200">
                            {/* Icono de Instagram (puedes reemplazarlo con un SVG o un icono real de FontAwesome) */}
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.8 2c-1.321 0-2.4 1.079-2.4 2.4v15.2c0 1.321 1.079 2.4 2.4 2.4h8.4c1.321 0 2.4-1.079 2.4-2.4v-15.2c0-1.321-1.079-2.4-2.4-2.4h-8.4zm.2 2h8c.22 0 .4.18.4.4v14.2c0 .22-.18.4-.4.4h-8c-.22 0-.4-.18-.4-.4v-14.2c0-.22.18-.4.4-.4zM12 9c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 2c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1zm5 2c0 .552-.448 1-1 1s-1-.448-1-1 .448-1 1-1 1 .448 1 1zM7 8c0-.552-.448-1-1-1s-1 .448-1 1 .448 1 1 1 1-.448 1-1z" /></svg>
                        </a>
                        <a href="https://facebook.com/gaddyel" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-600 transition-colors duration-200">
                            {/* Icono de Facebook */}
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.424-1.333 1.546-1.333h2.454v-3h-4c-3.123 0-4 2.123-4 4v2z" /></svg>
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
