import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCheckoutState } from './useCheckoutState';
import { CheckoutForm } from './CheckoutForm';
import { OrderSummary } from './OrderSummary';

/**
 * Checkout - Página de checkout modular
 * 
 * Arquitectura:
 * - index.jsx: Orquestador principal (este archivo)
 * - useCheckoutState: Lógica y estado
 * - CheckoutForm: Formulario de datos
 * - OrderSummary: Resumen de orden
 * 
 * Responsabilidades separadas para mejor mantenibilidad y testing
 */
export const Checkout = () => {
    const navigate = useNavigate();
    
    // Toda la lógica y estado está en el hook
    const {
        formData,
        loading,
        error,
        fieldErrors,
        touched,
        isEditingAddress,
        isEmpty,
        cartItems,
        total,
        handleChange,
        handleBlur,
        handleSubmit,
        setIsEditingAddress,
        isAuthenticated
    } = useCheckoutState();

    // Redireccionar si el carrito está vacío
    if (isEmpty) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Carrito Vacío</h2>
                    <p className="text-gray-600 mb-6">
                        No puedes continuar sin productos en el carrito
                    </p>
                    <button
                        onClick={() => navigate('/catalogo')}
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        Ir al Catálogo
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Checkout - Gaddyel</title>
                <meta name="description" content="Completa tu pedido de productos artesanales personalizados" />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Finalizar Compra</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulario (2/3 del espacio) */}
                    <div className="lg:col-span-2">
                        <CheckoutForm
                            formData={formData}
                            fieldErrors={fieldErrors}
                            touched={touched}
                            isEditingAddress={isEditingAddress}
                            isAuthenticated={isAuthenticated}
                            loading={loading}
                            error={error}
                            onSubmit={handleSubmit}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onToggleEditAddress={setIsEditingAddress}
                        />
                    </div>

                    {/* Resumen de orden (1/3 del espacio) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <OrderSummary
                                cartItems={cartItems}
                                total={total}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Checkout;
