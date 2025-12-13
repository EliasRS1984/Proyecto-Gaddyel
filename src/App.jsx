import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import Login from './Paginas/Login';
import Registro from './Paginas/Registro';
import Perfil from './Paginas/Perfil';
import CartIcon from './Componentes/CartIcon';
import Navbar from './Componentes/UI/Navbar/Navbar';
import ProtectedRoute from './Componentes/ProtectedRoute';
import { CartProvider } from './Context/CartContext';
import { AuthProvider } from './Context/AuthContext';
import { OrderProvider } from './Context/OrderContext';

const App = () => {
    return (
        <HelmetProvider>
            <AuthProvider>
                <CartProvider>
                    <OrderProvider>
                        <Router>
                            <ScrollTop />
                            <div className="flex flex-col min-h-screen font-sans">
                                {/* Usar el Navbar component con autenticación */}
                                <Navbar />

                                <main className="flex-grow pt-20">
                                    <Routes>
                                        <Route path="/" element={<Inicio />} />
                                        <Route path="/catalogo" element={<Catalogo />} />
                                        <Route path="/nosotros" element={<SobreGaddyel />} />
                                        <Route path="/contacto" element={<Contacto />} />
                                        <Route path="/catalogo/:id" element={<DetalleProducto />} />
                                        <Route path="/proceso" element={<NuestroProceso />} />
                                        <Route path="/carrito" element={<Cart />} />
                                        
                                        {/* Ruta protegida - requiere autenticación */}
                                        <Route element={<ProtectedRoute />}>
                                            <Route path="/checkout" element={<Checkout />} />
                                            <Route path="/perfil" element={<Perfil />} />
                                        </Route>
                                        
                                        <Route path="/pedido-confirmado/:id" element={<PedidoConfirmado />} />
                                        <Route path="/pedido-confirmado" element={<PedidoConfirmado />} />
                                        <Route path="/pedido-pendiente" element={<PedidoPendiente />} />
                                        <Route path="/pedido-fallido" element={<PedidoFallido />} />
                                        <Route path="/login" element={<Login />} />
                                        <Route path="/registro" element={<Registro />} />
                                    </Routes>
                                </main>
                                <PieDePagina />
                                <Analytics />
                            </div>
                        </Router>
                    </OrderProvider>
                </CartProvider>
            </AuthProvider>
        </HelmetProvider>
    );
};

export default App;