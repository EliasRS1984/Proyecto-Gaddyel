import { useState, useCallback, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../Context/CartContext';
import { useOrder } from '../../Context/OrderContext';
import { AuthContext } from '../../Context/AuthContext';
import orderService from '../../Servicios/orderService';
import orderStorage from '../../utils/orderStorage';
import { validateForm, formatField, INITIAL_FORM_STATE } from '../../Servicios/checkoutSchema';
import { logger } from '../../utils/logger';

/**
 * Hook personalizado para manejar el estado y lógica del checkout
 * Separa la lógica de negocio de la UI
 * 
 * REFACTORIZADO: Usa AuthContext en lugar de useAuth hook
 * Razón: AuthContext es la fuente única de verdad para estado de autenticación
 */
export const useCheckoutState = () => {
    const navigate = useNavigate();
    const { cartItems, total, clearCart, isEmpty } = useCart();
    const { createOrder, isLoading: orderLoading, lastError, clearError } = useOrder();
    const { isAuthenticated, cliente, actualizarPerfil } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [touched, setTouched] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});
    const [isEditingAddress, setIsEditingAddress] = useState(false);

    // Inicializar formData con datos del cliente o localStorage
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

    // Auto-guardar borrador en localStorage
    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem('checkoutDraft', JSON.stringify(formData));
        }, 500);
        return () => clearTimeout(timer);
    }, [formData]);

    // Sincronizar errores del contexto
    useEffect(() => {
        if (lastError) {
            setError(lastError);
        }
    }, [lastError]);

    /**
     * Validar un campo específico
     */
    const performFieldValidation = useCallback((name, value) => {
        const testData = { [name]: value };
        const validation = validateForm(testData);
        return validation.errors[name] || '';
    }, []);

    /**
     * Validar todo el formulario
     */
    const performFormValidation = useCallback(() => {
        const validation = validateForm(formData);
        setFieldErrors(validation.errors);
        return validation.isValid;
    }, [formData]);

    /**
     * Manejar cambios en campos del formulario
     */
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        const formattedValue = formatField(name, value);

        setFormData(prev => ({ ...prev, [name]: formattedValue }));

        if (touched[name]) {
            const error = performFieldValidation(name, formattedValue);
            setFieldErrors(prev => ({ ...prev, [name]: error }));
        }
    }, [touched, performFieldValidation]);

    /**
     * Manejar blur en campos
     */
    const handleBlur = useCallback((e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));

        let finalValue = value;
        if (['domicilio', 'localidad', 'provincia', 'nombre'].includes(name)) {
            finalValue = value.trim();
            setFormData(prev => ({ ...prev, [name]: finalValue }));
        }

        const error = performFieldValidation(name, finalValue);
        setFieldErrors(prev => ({ ...prev, [name]: error }));
    }, [performFieldValidation]);

    /**
     * Manejar envío del formulario
     */
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        
        logger.debug('[Checkout] handleSubmit iniciado', {
            cartItemsLength: cartItems.length,
            isEmpty
        });

        // Validar formulario
        const isValid = performFormValidation();
        if (!isValid) {
            logger.warn('[Checkout] Validación fallida', fieldErrors);
            setError('Por favor completa todos los campos correctamente');
            return;
        }

        // Para usuarios autenticados, verificar dirección completa
        if (isAuthenticated) {
            const direccionCompleta =
                (formData.domicilio || cliente.domicilio || cliente.direccion) &&
                (formData.localidad || cliente.localidad || cliente.ciudad) &&
                (formData.provincia || cliente.provincia) &&
                (formData.codigoPostal || cliente.codigoPostal);

            if (!direccionCompleta) {
                setError('Por favor completa todos los campos de dirección antes de continuar');
                setIsEditingAddress(true);
                return;
            }
        }

        setLoading(true);
        setError('');
        clearError();

        try {
            // Actualizar perfil si hay cambios en dirección
            if (isAuthenticated && cliente) {
                const direccionCambio =
                    formData.domicilio !== (cliente.domicilio || cliente.direccion) ||
                    formData.localidad !== (cliente.localidad || cliente.ciudad) ||
                    formData.provincia !== cliente.provincia ||
                    formData.codigoPostal !== cliente.codigoPostal;

                if (direccionCambio) {
                    try {
                        await actualizarPerfil({
                            domicilio: formData.domicilio,
                            localidad: formData.localidad,
                            provincia: formData.provincia,
                            codigoPostal: formData.codigoPostal
                        });
                        logger.success('[Checkout] Perfil actualizado');
                    } catch (error) {
                        logger.warn('[Checkout] Error al actualizar perfil', error);
                    }
                }
            }

            // Calcular totales
            const cantidadSolicitudes = cartItems.reduce((sum, item) => sum + item.cantidad, 0);
            const subtotal = total;
            const costoEnvio = orderService.calculateShipping(cantidadSolicitudes);
            const totalFinal = subtotal + costoEnvio;

            // Preparar datos para crear orden
            const checkoutData = {
                ...formData,
                clienteId: cliente?._id || null,
                cantidadProductos: cantidadSolicitudes,
                subtotal,
                costoEnvio,
                total: totalFinal
            };

            logger.debug('[Checkout] Enviando datos', checkoutData);

            // Crear orden
            const resultado = await createOrder(checkoutData, cartItems);

            logger.success('[Checkout] Orden creada', resultado.ordenId);
            
            // ✅ DEBUG: Mostrar qué se va a guardar
            console.log('💾 [Checkout] Datos a guardar en orderStorage:', {
                ordenId: resultado.ordenId,
                total: resultado.total,
                subtotal: resultado.subtotal,
                costoEnvio: resultado.costoEnvio,
                itemsCount: resultado.items?.length || 0,
                hasCheckoutUrl: !!resultado.checkoutUrl
            });

            // ✅ IMPORTANTE: Guardar datos de la orden en localStorage para PedidoConfirmado
            // Esto asegura que los detalles del pedido estén disponibles en la página de confirmación
            orderStorage.save(resultado, 'pending_payment');

            // Limpiar carrito
            clearCart();
            localStorage.removeItem('checkoutDraft');

            // Redireccionar según resultado
            if (resultado.checkoutUrl) {
                // Mercado Pago: Redirige a pagar
                window.location.href = resultado.checkoutUrl;
            } else {
                // Sin Mercado Pago: Ir directamente a confirmación
                navigate(`/pedido-confirmado/${resultado.ordenId}`);
            }

        } catch (err) {
            logger.error('[Checkout] Error', err);
            setError(err.message || 'Error al procesar el pedido');
        } finally {
            setLoading(false);
        }
    }, [
        cartItems,
        isEmpty,
        performFormValidation,
        fieldErrors,
        isAuthenticated,
        formData,
        cliente,
        clearError,
        actualizarPerfil,
        total,
        createOrder,
        clearCart,
        navigate
    ]);

    return {
        // Estado
        formData,
        loading: loading || orderLoading,
        error,
        fieldErrors,
        touched,
        isEditingAddress,
        isEmpty,
        cartItems,
        total,

        // Funciones
        handleChange,
        handleBlur,
        handleSubmit,
        setIsEditingAddress,
        
        // Info del cliente
        isAuthenticated,
        cliente
    };
};

export default useCheckoutState;
