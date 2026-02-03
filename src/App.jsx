import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';

// ✅ Code Splitting: Carga diferida de rutas no críticas
import Inicio from './Paginas/Inicio';
const Catalogo = React.lazy(() => import('./Paginas/Catalogo'));
const SobreGaddyel = React.lazy(() => import('./Paginas/SobreGaddyel'));
const Contacto = React.lazy(() => import('./Paginas/Contacto'));
const DetalleProducto = React.lazy(() => import('./Paginas/DetalleProducto'));
const NuestroProceso = React.lazy(() => import('./Paginas/NuestroProceso'));
const Cart = React.lazy(() => import('./Componentes/Cart'));
const Checkout = React.lazy(() => import('./Paginas/Checkout')); // ✅ Ahora importa desde carpeta modular
const PedidoConfirmado = React.lazy(() => import('./Paginas/PedidoConfirmado'));
const PedidoPendiente = React.lazy(() => import('./Paginas/PedidoPendiente'));
const PedidoFallido = React.lazy(() => import('./Paginas/PedidoFallido'));
const Login = React.lazy(() => import('./Paginas/Login'));
const Registro = React.lazy(() => import('./Paginas/RegistroNuevo'));
const Perfil = React.lazy(() => import('./Paginas/Perfil'));
const PoliticaPrivacidad = React.lazy(() => import('./Paginas/PoliticaPrivacidad'));
const TerminosServicio = React.lazy(() => import('./Paginas/TerminosServicio'));

import PieDePagina from './Componentes/Layout/PieDePagina/PieDePagina';
import ScrollTop from './Componentes/Layout/ScrollTop/ScrollTop';
import CartIcon from './Componentes/CartIcon';
import Navbar from './Componentes/UI/Navbar/Navbar';
import ProtectedRoute from './Componentes/ProtectedRoute';
import LoadingScreen from './Componentes/LoadingScreen';
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
                                    {/* ✅ Suspense boundary para rutas lazy-loaded */}
                                    <Suspense fallback={<LoadingScreen />}>
                                        <Routes>
                                            <Route path="/" element={<Inicio />} />
                                            <Route path="/catalogo" element={<Catalogo />} />
                                            <Route path="/nosotros" element={<SobreGaddyel />} />
                                            <Route path="/contacto" element={<Contacto />} />
                                            <Route path="/catalogo/:id" element={<DetalleProducto />} />
                                            <Route path="/proceso" element={<NuestroProceso />} />
                                            
                                            {/* Ruta protegida - requiere autenticación */}
                                            <Route element={<ProtectedRoute />}>
                                                <Route path="/carrito" element={<Cart />} />
                                                <Route path="/checkout" element={<Checkout />} />
                                                <Route path="/perfil" element={<Perfil />} />
                                            </Route>
                                            
                                            <Route path="/pedido-confirmado/:id" element={<PedidoConfirmado />} />
                                            <Route path="/pedido-confirmado" element={<PedidoConfirmado />} />
                                            <Route path="/pedido-pendiente/:id" element={<PedidoPendiente />} />
                                            <Route path="/pedido-pendiente" element={<PedidoPendiente />} />
                                            <Route path="/pedido-fallido/:id" element={<PedidoFallido />} />
                                            <Route path="/pedido-fallido" element={<PedidoFallido />} />
                                            <Route path="/login" element={<Login />} />
                                            <Route path="/registro" element={<Registro />} />
                                                                                    <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
                                                                                    <Route path="/terminos-servicio" element={<TerminosServicio />} />
                                        </Routes>
                                    </Suspense>
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