import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

/**
 * Checkout - Página de compra con formulario de cliente y carrito
 */
export const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getTotal, getCartForCheckout, clearCart, isEmpty } = useCart();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        whatsapp: ''
    });

    // Si el carrito está vacío, redirigir
    if (isEmpty) {
        return (
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 text-center mt-10">
                <h2 className="text-2xl font-bold mb-4">Carrito Vacío</h2>
                <p className="text-gray-600 mb-6">No puedes continuar sin productos en el carrito</p>
                <button 
                    onClick={() => navigate('/')}
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    Volver a Comprar
                </button>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validación básica
        if (!formData.nombre || !formData.email) {
            setError('Nombre y email son obligatorios');
            setLoading(false);
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Email inválido');
            setLoading(false);
            return;
        }

        try {
            const ordenData = {
                items: getCartForCheckout(),
                cliente: {
                    nombre: formData.nombre,
                    email: formData.email,
                    whatsapp: formData.whatsapp
                }
            };

            const response = await fetch(`${API_BASE}/pedidos/crear`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ordenData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al crear la orden');
            }

            const result = await response.json();
            
            // Guardar datos de la orden
            localStorage.setItem('ultimaOrden', JSON.stringify({
                id: result.ordenId,
                total: getTotal(),
                estado: result.estadoPago,
                fecha: new Date().toISOString()
            }));

            // Limpiar carrito
            clearCart();

            // Si hay URL de Mercado Pago, redirigir
            if (result.checkoutUrl) {
                window.location.href = result.checkoutUrl;
            } else {
                // Si no hay URL, ir a página de confirmación
                navigate(`/pedido-confirmado?id=${result.ordenId}`);
            }

        } catch (err) {
            console.error('❌ Error en checkout:', err);
            setError(err.message || 'Error al procesar la orden');
        } finally {
            setLoading(false);
        }
    };

    const total = getTotal();

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulario de cliente */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-6">Información de Cliente</h2>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Nombre Completo <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Tu nombre completo"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="tu@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    WhatsApp (Opcional)
                                </label>
                                <input
                                    type="tel"
                                    name="whatsapp"
                                    value={formData.whatsapp}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ej: +54 9 11 1234 5678"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                            >
                                {loading ? 'Procesando...' : 'Continuar a Pago'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Resumen de orden */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                        <h2 className="text-xl font-bold mb-6">Resumen de Orden</h2>

                        {/* Items */}
                        <div className="space-y-4 mb-6 border-b pb-6">
                            {cartItems.map(item => (
                                <div key={item._id} className="flex justify-between text-sm">
                                    <div>
                                        <p className="font-medium">{item.nombre}</p>
                                        <p className="text-gray-600">x{item.cantidad}</p>
                                    </div>
                                    <p className="font-medium">
                                        ${(item.precio * item.cantidad).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Totales */}
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Envío:</span>
                                <span>Consultar</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t pt-4">
                                <span>Total:</span>
                                <span className="text-blue-600">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="text-xs text-gray-600 space-y-2">
                            <p>✓ Pago seguro con Mercado Pago</p>
                            <p>✓ Datos encriptados</p>
                            <p>✓ Confirmación por email</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
