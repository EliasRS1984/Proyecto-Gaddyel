import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';

import Inicio from './Paginas/Inicio';
import Catalogo from './Paginas/Catalogo';
import SobreGaddyel from './Paginas/SobreGaddyel';
import Contacto from './Paginas/Contacto';
import PieDePagina from './Componentes/Layout/PieDePagina/PieDePagina';
import ScrollTop from './Componentes/Layout/ScrollTop/ScrollTop';
import DetalleProducto from './Paginas/DetalleProducto';
import NuestroProceso from './Paginas/NuestroProceso';
import Cart from './Componentes/Cart';
import Checkout from './Paginas/Checkout';
import PedidoConfirmado from './Paginas/PedidoConfirmado';
import PedidoPendiente from './Paginas/PedidoPendiente';
import PedidoFallido from './Paginas/PedidoFallido';
import CartIcon from './Componentes/CartIcon';
import { CartProvider } from './Context/CartContext';

import LogoGaddyel from './Activos/Imagenes/Logo-Gaddyel.png';


const App = () => {
    // 💡 NUEVO: Estado para controlar si el menú está abierto o cerrado
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 💡 NUEVO: Función para alternar el estado del menú
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const manejarScrollAInicio = () => {
        window.scrollTo({
            top: 0, // Desplaza a la parte superior de la página
            behavior: 'smooth' // Hace que el desplazamiento sea suave
        });
    };

    return (
        <HelmetProvider>
            <CartProvider>
                <Router>
                    <ScrollTop />
                    <div className="flex flex-col min-h-screen font-sans">
                        <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-1 transition-all duration-300">
                            <div className="container mx-auto px-4 flex justify-between items-center">
                                <NavLink to="/"
                                    onClick={manejarScrollAInicio} className="flex-shrink-0">
                                    <img
                                        src={LogoGaddyel}
                                        alt="Logo de Gaddyel"
                                        className="h-16 transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg rounded-lg"
                                    />
                                </NavLink>
                                {/* 💡 CORRECCIÓN: Ocultamos el menú principal en pantallas pequeñas */}
                                <nav className="hidden md:flex space-x-4 md:space-x-8">
                                    <NavLink to="/"
                                        onClick={manejarScrollAInicio} className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                        Inicio
                                    </NavLink>
                                    <NavLink to="/catalogo" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                        Catálogo
                                    </NavLink>
                                    <NavLink to="/nosotros" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                        Nosotros
                                    </NavLink>
                                    <NavLink to="/contacto" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                        Contacto
                                    </NavLink>
                                    {/* 💡 NUEVO: Enlace para 'Nuestro Proceso' en el menú de escritorio */}
                                    <NavLink to="/proceso" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                        Nuestro Proceso
                                    </NavLink>
                                </nav>

                                <div className="flex items-center gap-4">
                                    {/* Icono del carrito */}
                                    <CartIcon />
                                    
                                    {/* 💡 NUEVO: Botón del menú hamburguesa para pantallas pequeñas */}
                                    <button onClick={toggleMenu} className="md:hidden text-gray-600 hover:text-blue-600 focus:outline-none">
                                        <svg className="h-8 w-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                            {isMenuOpen ? (
                                                <path d="M6 18L18 6M6 6l12 12" />
                                            ) : (
                                                <path d="M4 6h16M4 12h16M4 18h16" />
                                            )}
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </header>

                    {/* 💡 NUEVO: Contenedor del menú móvil que se muestra condicionalmente */}
                    {isMenuOpen && (
                        <div className="md:hidden fixed top-20 left-0 right-0 z-40 bg-white shadow-lg p-4 transition-all duration-300">
                            <nav className="flex flex-col items-center space-y-4">
                                <NavLink to="/" onClick={toggleMenu} className="text-gray-600 hover:text-blue-600 font-medium w-full text-center py-2 border-b">
                                    Inicio
                                </NavLink>
                                <NavLink to="/catalogo" onClick={toggleMenu} className="text-gray-600 hover:text-blue-600 font-medium w-full text-center py-2 border-b">
                                    Catálogo
                                </NavLink>
                                <NavLink to="/nosotros" onClick={toggleMenu} className="text-gray-600 hover:text-blue-600 font-medium w-full text-center py-2 border-b">
                                    Nosotros
                                </NavLink>
                                <NavLink to="/contacto" onClick={toggleMenu} className="text-gray-600 hover:text-blue-600 font-medium w-full text-center py-2 border-b">
                                    Contacto
                                </NavLink>
                                {/* 💡 NUEVO: Enlace para 'Nuestro Proceso' en el menú móvil */}
                                <NavLink to="/proceso" onClick={toggleMenu} className="text-gray-600 hover:text-blue-600 font-medium w-full text-center py-2">
                                    Nuestro Proceso
                                </NavLink>
                            </nav>
                        </div>
                    )}
                    <main className="flex-grow pt-20">
                        <Routes>
                            <Route path="/" element={<Inicio />} />
                            <Route path="/catalogo" element={<Catalogo />} />
                            <Route path="/nosotros" element={<SobreGaddyel />} />
                            <Route path="/contacto" element={<Contacto />} />
                            <Route path="/catalogo/:id" element={<DetalleProducto />} />
                            <Route path="/proceso" element={<NuestroProceso />} />
                            <Route path="/carrito" element={<Cart />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/pedido-confirmado" element={<PedidoConfirmado />} />
                            <Route path="/pedido-pendiente" element={<PedidoPendiente />} />
                            <Route path="/pedido-fallido" element={<PedidoFallido />} />
                        </Routes>
                    </main>
                    <PieDePagina />
                    <Analytics />
                </div>
            </Router>
            </CartProvider>
        </HelmetProvider>
    );
};

export default App;