import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCheckoutState } from './useCheckoutState';
import { CheckoutForm } from './CheckoutForm';
import { OrderSummary } from './OrderSummary';

// =====================================================
// ¿QUÉ ES ESTO?
// Página de finalizar pedido (checkout). Es la pantalla donde
// el usuario completa sus datos y paga a través de Mercado Pago.
//
// ¿CÓMO FUNCIONA?
// 1. Obtiene todos los datos y acciones desde useCheckoutState
// 2. Si el carrito está vacío, muestra un aviso y un botón al catálogo
// 3. Si hay productos, divide la pantalla en dos columnas:
//    izquierda → formulario de datos del cliente (CheckoutForm)
//    derecha   → resumen del pedido con totales (OrderSummary)
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// ¿El formulario no carga datos? Revisá useCheckoutState.js
// ¿El resumen no muestra los productos? Revisá OrderSummary.jsx
// ¿El botón de pago no arranca? Revisá handleSubmit en useCheckoutState.js
// =====================================================
export const Checkout = () => {
    const navigate = useNavigate();
    
    // Toda la lógica y estado está en el hook
    const {
        formData,
        loading,
        error,
        fieldErrors,
        touched,
        isEmpty,
        cartItems,
        total,
        handleChange,
        handleBlur,
        handleSubmit,
        isAuthenticated
    } = useCheckoutState();

    // ======== CHECKOUT VACÍO ========
    // Si el usuario llega aquí sin productos, se le muestra este estado
    if (isEmpty) {
        return (
            <div className="min-h-[72vh] flex items-center justify-center px-6 py-24">
                <div className="max-w-md w-full text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 mb-10">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                        <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-slate-500 dark:text-slate-400">
                            Finalizar Pedido · Textiles B2B
                        </span>
                    </div>
                    <div className="w-24 h-24 mx-auto mb-10 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 ring-2 ring-slate-200 dark:ring-slate-700 ring-offset-4 ring-offset-white dark:ring-offset-slate-950">
                        <svg className="w-11 h-11 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 mb-4">
                        No hay productos en tu carrito
                    </h2>
                    <p className="text-[15px] text-slate-500 dark:text-slate-400 leading-relaxed mb-10 max-w-sm mx-auto">
                        Necesitás agregar productos antes de continuar con el pago.
                    </p>
                    <button
                        onClick={() => navigate('/catalogo')}
                        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-[14px] font-semibold tracking-tight transition-all duration-500 ease-out hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5"
                    >
                        Explorar catálogo
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Finalizar Pedido - Gaddyel</title>
                <meta name="description" content="Completa tu pedido de textiles profesionales con bordado personalizado" />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* ======== LAYOUT PRINCIPAL ======== */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-24">

                {/* Encabezado de página */}
                <div className="mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                        <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-slate-500 dark:text-slate-400">
                            Finalizar Pedido · Pago Seguro
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                        Completar Compra
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulario (2/3 del espacio) */}
                    <div className="lg:col-span-2">
                        <CheckoutForm
                            formData={formData}
                            fieldErrors={fieldErrors}
                            touched={touched}
                            isAuthenticated={isAuthenticated}
                            loading={loading}
                            error={error}
                            onSubmit={handleSubmit}
                            onChange={handleChange}
                            onBlur={handleBlur}
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
