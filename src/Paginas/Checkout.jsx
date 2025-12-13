import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Context/CartContext';
import { useOrder } from '../Context/OrderContext';
import { AuthContext } from '../Context/AuthContext';
import orderService from '../Servicios/orderService';
import * as authService from '../Servicios/authService';
import { validateForm, formatField, INITIAL_FORM_STATE } from '../Servicios/checkoutSchema';

export const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getTotal, getCartForCheckout, clearCart, isEmpty } = useCart();
    const { createOrder, isLoading, lastError, clearError } = useOrder();
    const { isAuthenticated, cliente, refrescarPerfil, actualizarPerfil } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [touched, setTouched] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    
    const [formData, setFormData] = useState(() => {
        if (isAuthenticated && cliente) {
            return {
                nombre: cliente.nombre || '',
                email: cliente.email || '',
                whatsapp: cliente.whatsapp || '',
                domicilio: cliente.domicilio || cliente.direccion || '',
                localidad: cliente.localidad || cliente.ciudad || '',
                provincia: cliente.provincia || '',
                codigoPostal: cliente.codigoPostal || '',
                notasAdicionales: ''
            };
        }
        
        const saved = localStorage.getItem('checkoutDraft');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                return INITIAL_FORM_STATE;
            }
        }
        return INITIAL_FORM_STATE;
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem('checkoutDraft', JSON.stringify(formData));
        }, 500);
        return () => clearTimeout(timer);
    }, [formData]);

    // Sincronizar errores del contexto con estado local
    useEffect(() => {
        if (lastError) {
            setError(lastError);
        }
    }, [lastError]);

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

    const performFieldValidation = (name, value) => {
        // Crear un objeto con solo este campo para validación
        const testData = { [name]: value };
        const validation = validateForm(testData);
        return validation.errors[name] || '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Aplicar formateo automático (sin trim para domicilio/localidad/provincia)
        const formattedValue = formatField(name, value);
        
        setFormData(prev => ({ ...prev, [name]: formattedValue }));
        
        if (touched[name]) {
            const error = performFieldValidation(name, formattedValue);
            setFieldErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        
        // Hacer trim() solo en onBlur para campos de dirección (así el usuario puede ver espacios mientras escribe)
        let finalValue = value;
        if (['domicilio', 'localidad', 'provincia', 'nombre'].includes(name)) {
            finalValue = value.trim();
            setFormData(prev => ({ ...prev, [name]: finalValue }));
        }
        
        const error = performFieldValidation(name, finalValue);
        setFieldErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const performFormValidation = () => {
        const validation = validateForm(formData);
        setFieldErrors(validation.errors);
        return validation.isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('🔵 [Checkout] handleSubmit iniciado');
        console.log('  - cartItems.length:', cartItems.length);
        console.log('  - isEmpty:', isEmpty);
        
        // Validar formulario
        console.log('🔵 [Checkout] Validando formulario...');
        const isValid = performFormValidation();
        console.log('  - isValid:', isValid, 'fieldErrors:', fieldErrors);
        
        if (!isValid) {
            console.log('❌ [Checkout] Validación fallida');
            setError('Por favor completa todos los campos correctamente');
            return;
        }
        console.log('✅ [Checkout] Validación exitosa');

        // Para usuarios autenticados, verificar dirección completa
        if (isAuthenticated) {
            console.log('🔵 [Checkout] Usuario autenticado, verificando dirección...');
            const direccionCompleta = 
                (formData.domicilio || cliente.domicilio || cliente.direccion) &&
                (formData.localidad || cliente.localidad || cliente.ciudad) &&
                (formData.provincia || cliente.provincia) &&
                (formData.codigoPostal || cliente.codigoPostal);
            
            console.log('  - direccionCompleta:', direccionCompleta);
            if (!direccionCompleta) {
                console.log('❌ [Checkout] Dirección incompleta');
                setError('Por favor completa todos los campos de dirección antes de continuar');
                setIsEditingAddress(true);
                return;
            }
            console.log('✅ [Checkout] Dirección completada');
        }

        setLoading(true);
        setError('');
        clearError();

        try {
            console.log('🔵 [Checkout] Preparando datos...');
            
            // Si usuario autenticado y hay cambios en dirección, actualizar perfil primero
            if (isAuthenticated && cliente) {
                const direccionCambio = 
                    formData.domicilio !== (cliente.domicilio || cliente.direccion) ||
                    formData.localidad !== (cliente.localidad || cliente.ciudad) ||
                    formData.provincia !== cliente.provincia ||
                    formData.codigoPostal !== cliente.codigoPostal;
                
                if (direccionCambio) {
                    console.log('📝 [Checkout] Actualizando perfil con nueva dirección...');
                    try {
                        await actualizarPerfil({
                            domicilio: formData.domicilio,
                            localidad: formData.localidad,
                            provincia: formData.provincia,
                            codigoPostal: formData.codigoPostal
                        });
                        console.log('✅ [Checkout] Perfil actualizado correctamente');
                    } catch (error) {
                        console.error('⚠️ [Checkout] Error al actualizar perfil:', error);
                        // Continuar con el pedido aunque falle la actualización del perfil
                    }
                }
            }
            
            // Preparar datos para crear orden
            // Calcular cantidad de SOLICITUDES (TOTAL de veces que se agregaron productos)
            const cantidadSolicitudes = cartItems.reduce((sum, item) => sum + item.cantidad, 0);
            const subtotal = getTotal();
            const costoEnvio = orderService.calculateShipping(cantidadSolicitudes);
            const total = subtotal + costoEnvio;

            console.log('  - cantidadSolicitudes:', cantidadSolicitudes);
            console.log('  - subtotal:', subtotal);
            console.log('  - costoEnvio:', costoEnvio);
            console.log('  - total:', total);

            const checkoutData = {
                ...formData,
                subtotal,
                costoEnvio,
                total,
                cantidadProductos: cantidadSolicitudes,
                clienteId: isAuthenticated && cliente?._id ? cliente._id : null
            };

            console.log('🛒 [Checkout] Enviando datos:', checkoutData);
            console.log('🛒 [Checkout] Items del carrito:', cartItems);

            // Crear orden usando orderService (ya normaliza y mapea datos)
            console.log('🔵 [Checkout] Llamando a createOrder...');
            const response = await createOrder(checkoutData, cartItems);

            console.log('✅ [Checkout] Respuesta de creación:', response);

            if (response && (response.ordenId || response.pedidoId)) {
                const orderId = response.ordenId || response.pedidoId;
                console.log('✅ [Checkout] Navegando a:', `/pedido-confirmado/${orderId}`);
                
                // Si está autenticado, guardar dirección en el perfil para futuros pedidos
                if (isAuthenticated) {
                    try {
                        console.log('💾 [Checkout] Guardando dirección en perfil...');
                        await authService.actualizarDireccion({
                            domicilio: formData.domicilio,
                            localidad: formData.localidad,
                            provincia: formData.provincia,
                            codigoPostal: formData.codigoPostal
                        });
                        console.log('✅ [Checkout] Dirección guardada en perfil');
                        
                        // Refrescar datos del cliente en el contexto
                        if (refrescarPerfil) {
                            await refrescarPerfil();
                        }
                    } catch (error) {
                        console.error('⚠️ [Checkout] Error al guardar dirección en perfil:', error);
                        // Continuar aunque falle, el pedido ya fue creado
                    }
                }
                
                // Guardar orden completa en context con todos los detalles
                const orderData = {
                    ...response,
                    items: cartItems,
                    envio: {
                        mensaje: 'Tu pedido será procesado en aproximadamente 20 días corridos desde la confirmación del pago.',
                        diasProduccion: 20,
                        fechaEnvioEstimada: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
                    }
                };
                
                // No usamos lastOrderData en localStorage, solo en context
                localStorage.setItem('lastOrderData', JSON.stringify(orderData));
                
                // Limpiar carrito y draft
                clearCart();
                localStorage.removeItem('checkoutDraft');

                // Navegar a confirmación
                navigate(`/pedido-confirmado/${orderId}`);
            } else {
                console.error('❌ [Checkout] Respuesta sin ordenId:', response);
                throw new Error('No se recibió ID de orden del servidor');
            }

        } catch (err) {
            const errorMessage = err.message || 'Error al procesar el pedido';
            console.error('❌ [Checkout] Error:', errorMessage);
            console.error('  - Error completo:', err);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const toggleEditAddress = () => {
        setIsEditingAddress(!isEditingAddress);
    };

    const resetAddress = () => {
        setFormData(prev => ({
            ...prev,
            domicilio: cliente.domicilio || cliente.direccion || '',
            localidad: cliente.localidad || cliente.ciudad || '',
            provincia: cliente.provincia || '',
            codigoPostal: cliente.codigoPostal || ''
        }));
        setIsEditingAddress(false);
        setFieldErrors({});
        setTouched({});
    };

    const saveAddress = () => {
        // Validar que todos los campos estén completos
        const camposRequeridos = ['domicilio', 'localidad', 'provincia', 'codigoPostal'];
        const validation = validateForm(formData);
        const { errors } = validation;
        
        const erroresDir = Object.keys(errors).reduce((acc, key) => {
            if (camposRequeridos.includes(key)) {
                acc[key] = errors[key];
            }
            return acc;
        }, {});

        if (Object.keys(erroresDir).length > 0) {
            setFieldErrors(prev => ({ ...prev, ...erroresDir }));
            setTouched({
                domicilio: true,
                localidad: true,
                provincia: true,
                codigoPostal: true
            });
            setError('Por favor completa todos los campos de dirección');
            return;
        }

        // Simplemente cerrar el modo edición - la dirección se guardará cuando se envíe el formulario
        setIsEditingAddress(false);
        setError('');
    };

    const cantidadSolicitudes = cartItems.reduce((sum, item) => sum + item.cantidad, 0);  // Total de veces que se agregaron productos
    const subtotal = getTotal();
    const envioGratis = cantidadSolicitudes >= 3;  // 3 o más solicitudes = gratis
    const costoEnvio = envioGratis ? 0 : 12000; // $12.000 para menos de 3 solicitudes
    const total = subtotal + costoEnvio;
    const mensajeEnvio = envioGratis ? 'GRATIS' : '$12.000';

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulario */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                                    {error}
                                </div>
                            )}

                            {isAuthenticated ? (
                                <>
                                    {/* Datos de cliente autenticado */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <h3 className="font-semibold text-blue-900 mb-3">Cliente</h3>
                                        <div className="text-sm text-blue-800 space-y-1">
                                            <p><strong>Nombre:</strong> {cliente.nombre}</p>
                                            <p><strong>Email:</strong> {cliente.email}</p>
                                            <p><strong>WhatsApp:</strong> {cliente.whatsapp}</p>
                                        </div>
                                    </div>

                                    {/* Dirección de envío */}
                                    {!isEditingAddress ? (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="font-semibold text-green-900">Dirección de Envío</h3>
                                                <button
                                                    type="button"
                                                    onClick={toggleEditAddress}
                                                    className="text-sm text-green-600 hover:text-green-800 font-medium"
                                                >
                                                    Cambiar dirección
                                                </button>
                                            </div>
                                            <div className="text-sm text-green-800 space-y-2">
                                                <p><strong>Domicilio:</strong> {formData.domicilio || cliente.domicilio || cliente.direccion || '(No especificado)'}</p>
                                                <p><strong>Localidad:</strong> {formData.localidad || cliente.localidad || cliente.ciudad || '(No especificada)'}</p>
                                                <p><strong>Provincia:</strong> {formData.provincia || cliente.provincia || '(No especificada)'}</p>
                                                <p><strong>Código Postal:</strong> {formData.codigoPostal || cliente.codigoPostal || '(No especificado)'}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                                <p className="text-sm text-yellow-800">Puedes editar tu dirección para este pedido</p>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium mb-2">
                                                        Domicilio (calle y número) <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="domicilio"
                                                        value={formData.domicilio}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 transition ${
                                                            fieldErrors.domicilio && touched.domicilio
                                                                ? 'border-red-500 focus:ring-red-500'
                                                                : 'focus:ring-blue-500'
                                                        }`}
                                                        placeholder="Calle, número, piso, departamento"
                                                        autoComplete="off"
                                                    />
                                                    {fieldErrors.domicilio && touched.domicilio && (
                                                        <p className="text-red-500 text-sm mt-1">{fieldErrors.domicilio}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium mb-2">
                                                        Localidad <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="localidad"
                                                        value={formData.localidad}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 transition ${
                                                            fieldErrors.localidad && touched.localidad
                                                                ? 'border-red-500 focus:ring-red-500'
                                                                : 'focus:ring-blue-500'
                                                        }`}
                                                        placeholder="Tu localidad o ciudad"
                                                    />
                                                    {fieldErrors.localidad && touched.localidad && (
                                                        <p className="text-red-500 text-sm mt-1">{fieldErrors.localidad}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium mb-2">
                                                        Provincia <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="provincia"
                                                        value={formData.provincia}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 transition ${
                                                            fieldErrors.provincia && touched.provincia
                                                                ? 'border-red-500 focus:ring-red-500'
                                                                : 'focus:ring-blue-500'
                                                        }`}
                                                        placeholder="Tu provincia"
                                                    />
                                                    {fieldErrors.provincia && touched.provincia && (
                                                        <p className="text-red-500 text-sm mt-1">{fieldErrors.provincia}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium mb-2">
                                                        Código Postal <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="codigoPostal"
                                                        value={formData.codigoPostal}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        maxLength="6"
                                                        className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 transition ${
                                                            fieldErrors.codigoPostal && touched.codigoPostal
                                                                ? 'border-red-500 focus:ring-red-500'
                                                                : 'focus:ring-blue-500'
                                                        }`}
                                                        placeholder="1234"
                                                    />
                                                    {fieldErrors.codigoPostal && touched.codigoPostal && (
                                                        <p className="text-red-500 text-sm mt-1">{fieldErrors.codigoPostal}</p>
                                                    )}
                                                </div>

                                                <div className="flex gap-2 pt-4">
                                                    <button
                                                        type="button"
                                                        onClick={resetAddress}
                                                        className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 font-medium"
                                                    >
                                                        Cancelar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={saveAddress}
                                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                                                    >
                                                        Guardar Cambios
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                // Formulario para invitados
                                <>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Nombre Completo <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 transition ${
                                                fieldErrors.nombre && touched.nombre
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'focus:ring-blue-500'
                                            }`}
                                            placeholder="Tu nombre completo"
                                        />
                                        {fieldErrors.nombre && touched.nombre && (
                                            <p className="text-red-500 text-sm mt-1">{fieldErrors.nombre}</p>
                                        )}
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
                                            onBlur={handleBlur}
                                            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 transition ${
                                                fieldErrors.email && touched.email
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'focus:ring-blue-500'
                                            }`}
                                            placeholder="tu@email.com"
                                        />
                                        {fieldErrors.email && touched.email && (
                                            <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            WhatsApp <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="whatsapp"
                                            value={formData.whatsapp}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 transition ${
                                                fieldErrors.whatsapp && touched.whatsapp
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'focus:ring-blue-500'
                                            }`}
                                            placeholder="+54 9 11 1234-5678"
                                        />
                                        {fieldErrors.whatsapp && touched.whatsapp && (
                                            <p className="text-red-500 text-sm mt-1">{fieldErrors.whatsapp}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Domicilio (calle y número) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="domicilio"
                                            value={formData.domicilio}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 transition ${
                                                fieldErrors.domicilio && touched.domicilio
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'focus:ring-blue-500'
                                            }`}
                                            placeholder="Calle, número, piso, departamento"
                                        />
                                        {fieldErrors.domicilio && touched.domicilio && (
                                            <p className="text-red-500 text-sm mt-1">{fieldErrors.domicilio}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Localidad <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="localidad"
                                            value={formData.localidad}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 transition ${
                                                fieldErrors.localidad && touched.localidad
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'focus:ring-blue-500'
                                            }`}
                                            placeholder="Tu localidad o ciudad"
                                        />
                                        {fieldErrors.localidad && touched.localidad && (
                                            <p className="text-red-500 text-sm mt-1">{fieldErrors.localidad}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Provincia <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="provincia"
                                            value={formData.provincia}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 transition ${
                                                fieldErrors.provincia && touched.provincia
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'focus:ring-blue-500'
                                            }`}
                                            placeholder="Tu provincia"
                                        />
                                        {fieldErrors.provincia && touched.provincia && (
                                            <p className="text-red-500 text-sm mt-1">{fieldErrors.provincia}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Código Postal <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="codigoPostal"
                                            value={formData.codigoPostal}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            maxLength="6"
                                            className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 transition ${
                                                fieldErrors.codigoPostal && touched.codigoPostal
                                                    ? 'border-red-500 focus:ring-red-500'
                                                    : 'focus:ring-blue-500'
                                            }`}
                                            placeholder="1234"
                                        />
                                        {fieldErrors.codigoPostal && touched.codigoPostal && (
                                            <p className="text-red-500 text-sm mt-1">{fieldErrors.codigoPostal}</p>
                                        )}
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Notas Adicionales para el Envío (opcional)
                                </label>
                                <textarea
                                    name="notasAdicionales"
                                    value={formData.notasAdicionales}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    placeholder="Ej: Dejar con portero, especificar timbre, horario preferido, etc."
                                    rows="3"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    💡 Estas notas aparecerán en los datos de envío del pedido
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                {loading ? 'Procesando...' : 'Confirmar Pedido'}
                            </button>
                        </form>
                    </div>

                    {/* Resumen del carrito */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6 sticky top-4">
                            <h3 className="text-lg font-bold mb-4">Resumen de Compra</h3>

                            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                                {cartItems.map((item) => (
                                    <div key={`${item._id}-${item.variant}`} className="flex justify-between text-sm">
                                        <div className="flex-1">
                                            <p className="font-medium">
                                                {item.titulo || item.nombre}: {item.cantidad} {item.cantidadUnidades && `(${item.cantidadUnidades * item.cantidad} ${(item.cantidadUnidades * item.cantidad) === 1 ? 'unidad' : 'unidades'})`}
                                            </p>
                                            <p className="text-gray-600">
                                                {item.cantidad}x ${item.precio.toFixed(2)}
                                            </p>
                                        </div>
                                        <p className="font-semibold">${(item.precio * item.cantidad).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-300 my-4"></div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Subtotal ({cantidadSolicitudes} {cantidadSolicitudes === 1 ? 'solicitud' : 'solicitudes'}):</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Envío:</span>
                                    <span className={envioGratis ? 'text-green-600 font-semibold' : 'text-gray-600'}>
                                        {mensajeEnvio}
                                    </span>
                                </div>
                                {envioGratis ? (
                                    <div className="text-xs text-green-600 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                        </svg>
                                        ¡Envío gratis por {totalProductos} productos o más!
                                    </div>
                                ) : (
                                    <div className="text-xs text-gray-600 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                                        </svg>
                                        Envío gratis a partir de 3 productos
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold border-t pt-4">
                                    <span>Total:</span>
                                    <span className="text-blue-600">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="text-xs text-gray-600 space-y-2 mt-4">
                                <p>✓ Pago seguro con Mercado Pago</p>
                                <p>✓ Datos encriptados</p>
                                <p>✓ Confirmación por email</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
