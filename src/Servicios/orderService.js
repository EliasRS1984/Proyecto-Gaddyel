/**
 * orderService.js
 * 
 * Servicio centralizado para gestión de órdenes de compra.
 * Responsabilidades:
 * - Normalizar datos entre frontend y backend
 * - Comunicación con API de órdenes
 * - Enriquecimiento de datos antes de enviar
 * - Manejo consistente de respuestas
 * - Manejo de errores estandarizado
 */

import { logger } from '../utils/logger';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
const isDev = import.meta.env.DEV;

/**
 * Normaliza datos de checkout del frontend al formato esperado por el backend
 * @param {Object} checkoutData - Datos del formulario de checkout
 * @param {Array} cartItems - Items del carrito con detalles completos
 * @returns {Object} Datos normalizados para enviar al backend
 */
const normalizeCheckoutData = (checkoutData, cartItems) => {
  // Mapeo: Frontend → Backend
  // El backend espera los datos del cliente en un objeto 'cliente' con todos los campos
  // incluyendo dirección
  
  return {
    items: cartItems.map(item => ({
      productoId: item._id,        // Backend espera productoId
      cantidad: item.cantidad,     // cantidad
    })),
    
    cliente: {
      nombre: checkoutData.nombre,
      email: checkoutData.email,
      whatsapp: checkoutData.whatsapp,
      domicilio: checkoutData.domicilio,
      localidad: checkoutData.localidad,
      provincia: checkoutData.provincia,
      codigoPostal: checkoutData.codigoPostal,
      notasAdicionales: checkoutData.notasAdicionales,
    },
    
    // Totales calculados en frontend (el backend validará/recalculará)
    totals: {
      subtotal: checkoutData.subtotal,
      costoEnvio: checkoutData.costoEnvio,
      total: checkoutData.total
    },
    
    // Metadatos útiles
    cantidadProductos: checkoutData.cantidadProductos,
    clienteId: checkoutData.clienteId || null,
    subtotal: checkoutData.subtotal,
    costoEnvio: checkoutData.costoEnvio,
    total: checkoutData.total
  };
};

/**
 * Desnormaliza la respuesta del backend al formato esperado por el frontend
 * @param {Object} backendResponse - Respuesta del servidor
 * @returns {Object} Datos normalizados para el frontend
 */
const denormalizeResponse = (backendResponse) => {
  return {
    ordenId: backendResponse.orderId || backendResponse.ordenId,
    pedidoId: backendResponse.orderId || backendResponse.ordenId,  // Alias para compatibilidad
    success: true,
    ok: true,  // Alias para compatibilidad
    total: backendResponse.totals?.total || backendResponse.total,
    subtotal: backendResponse.totals?.subtotal || backendResponse.subtotal,
    costoEnvio: backendResponse.totals?.shippingCost || backendResponse.costoEnvio,
    cantidadProductos: backendResponse.cantidadProductos,
    items: backendResponse.items || [],
    orderNumber: backendResponse.orderNumber || '',
    estado: backendResponse.orderStatus,
    // Mercado Pago
    checkoutUrl: backendResponse.checkoutUrl,
    sandboxUrl: backendResponse.sandboxUrl,
    preferenceId: backendResponse.payment?.mp_preference_id
  };
};

/**
 * Crea una nueva orden
 * @param {Object} checkoutData - Datos del checkout validados
 * @param {Array} cartItems - Items del carrito
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<Object>} Respuesta desnormalizada
 */
export const createOrder = async (checkoutData, cartItems, options = {}) => {
  try {
    const { includeItems = true } = options;

    // Debug de entrada
    console.log('🔍 [orderService] createOrder llamado con:', {
      checkoutData: checkoutData ? 'presente' : 'ausente',
      cartItems: cartItems ? `${cartItems.length} items` : 'ausente',
      cartItemsArray: cartItems
    });

    // Validaciones iniciales
    if (!checkoutData) {
      throw new Error('Los datos del checkout son requeridos');
    }

    if (!cartItems || cartItems.length === 0) {
      console.error('❌ [orderService] Validación falló:', {
        cartItems,
        isArray: Array.isArray(cartItems),
        length: cartItems?.length
      });
      throw new Error('El carrito está vacío');
    }

    // Normalizar datos
    const normalizedData = normalizeCheckoutData(checkoutData, cartItems);

    if (isDev) {
      logger.debug('📦 orderService: Creando orden con datos normalizados');
      logger.debug('  Frontend data:', checkoutData);
      logger.debug('  Cart items:', cartItems);
      logger.debug('  Normalized data:', normalizedData);
    }

    // Crear AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos

    const response = await fetch(`${API_BASE}/api/pedidos/crear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(normalizedData),
      credentials: 'include',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error || errorData.message || `Error ${response.status}`;
      throw new Error(errorMessage);
    }

    const backendResponse = await response.json();

    // ✅ DEBUG: Mostrar respuesta RAW del backend
    console.log('🔍 [orderService] RESPUESTA RAW DEL BACKEND:', backendResponse);
    console.log('   - checkoutUrl presente:', !!backendResponse.checkoutUrl);
    console.log('   - preferenceId presente:', !!backendResponse.preferenceId);
    console.log('   - sandboxCheckoutUrl presente:', !!backendResponse.sandboxCheckoutUrl);

    if (isDev) {
      logger.success('✅ orderService: Orden creada exitosamente');
      logger.debug('  Backend response:', backendResponse);
    }

    // Desnormalizar respuesta
    const denormalizedResponse = denormalizeResponse(backendResponse);

    // Guardar datos en localStorage para la página de confirmación
    if (denormalizedResponse.success) {
      try {
        localStorage.setItem('lastOrderData', JSON.stringify(denormalizedResponse));
        if (isDev) {
          logger.debug('💾 orderService: Datos de la orden guardados en localStorage');
        }
      } catch (e) {
        console.error('❌ orderService: Error al guardar en localStorage', e);
      }
    }

    return denormalizedResponse;

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('❌ orderService: Timeout en creación de orden');
      throw new Error('La solicitud tardó demasiado. Por favor, intenta de nuevo.');
    }

    console.error('❌ orderService: Error creando orden:', error.message);
    throw error;
  }
};

/**
 * Obtiene una orden existente por ID
 * @param {string} orderId - ID de la orden
 * @returns {Promise<Object>} Detalles de la orden
 */
export const getOrder = async (orderId) => {
  try {
    if (!orderId) {
      throw new Error('ID de orden requerido');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${API_BASE}/api/orders/${orderId}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      credentials: 'include',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Orden no encontrada');
      }
      throw new Error(`Error ${response.status} al obtener orden`);
    }

    const data = await response.json();

    if (isDev) {
      logger.debug('✅ orderService: Orden obtenida:', data);
    }

    return denormalizeResponse(data);

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('❌ orderService: Timeout obteniendo orden');
      throw new Error('La solicitud tardó demasiado.');
    }

    console.error('❌ orderService: Error obteniendo orden:', error.message);
    throw error;
  }
};

/**
 * Reintentar pago de una orden
 * @param {string} orderId - ID de la orden
 * @returns {Promise<Object>} Respuesta con nuevo checkout URL
 */
export const retryPayment = async (orderId) => {
  try {
    if (!orderId) {
      throw new Error('ID de orden requerido');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${API_BASE}/api/orders/${orderId}/retry`, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      credentials: 'include',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error ${response.status}`);
    }

    const data = await response.json();

    if (isDev) {
      logger.debug('✅ orderService: Reintento iniciado:', data);
    }

    return denormalizeResponse(data);

  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('La solicitud tardó demasiado.');
    }

    console.error('❌ orderService: Error reintentando pago:', error.message);
    throw error;
  }
};

/**
 * Calcula el costo de envío basado en cantidad de SOLICITUDES
 * @param {number} cantidadSolicitudes - Suma total de item.cantidad (total de veces que se agregaron productos)
 * @returns {number} Costo de envío ($12.000 o $0 gratis)
 */
export const calculateShipping = (cantidadSolicitudes) => {
  // Envío gratis a partir de 3 solicitudes diferentes
  return cantidadSolicitudes >= 3 ? 0 : 12000; // En pesos argentinos
};

/**
 * Valida si los datos de checkout son suficientes
 * @param {Object} checkoutData - Datos a validar
 * @returns {Object} { isValid: boolean, errors: string[] }
 */
export const validateCheckoutData = (checkoutData) => {
  const errors = [];

  if (!checkoutData) {
    errors.push('Datos de checkout requeridos');
    return { isValid: false, errors };
  }

  const requiredFields = {
    nombre: 'Nombre',
    email: 'Email',
    whatsapp: 'WhatsApp',
    domicilio: 'Domicilio',
    localidad: 'Localidad',
    provincia: 'Provincia',
    codigoPostal: 'Código Postal'
  };

  Object.entries(requiredFields).forEach(([field, label]) => {
    if (!checkoutData[field] || !checkoutData[field].toString().trim()) {
      errors.push(`${label} es requerido`);
    }
  });

  // Validaciones adicionales
  if (checkoutData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkoutData.email)) {
    errors.push('Email inválido');
  }

  if (checkoutData.whatsapp) {
    const digits = checkoutData.whatsapp.replace(/\D/g, '');
    if (digits.length < 10) {
      errors.push('WhatsApp debe tener al menos 10 dígitos');
    }
  }

  if (checkoutData.codigoPostal && !/^\d{4,6}$/.test(checkoutData.codigoPostal.replace(/\s/g, ''))) {
    errors.push('Código postal inválido (4-6 dígitos)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Prepara los datos para localStorage
 * @param {Object} order - Datos de la orden
 * @returns {Object} Datos para persistir
 */
export const serializeOrderForStorage = (order) => {
  return {
    ordenId: order.ordenId,
    pedidoId: order.pedidoId,
    orderNumber: order.orderNumber,
    total: order.total,
    subtotal: order.subtotal,
    costoEnvio: order.costoEnvio,
    cantidadProductos: order.cantidadProductos,
    items: order.items,
    estado: order.estado,
    createdAt: new Date().toISOString()
  };
};

/**
 * Recupera datos de orden desde localStorage
 * @param {string} key - Clave en localStorage
 * @returns {Object|null} Datos de orden o null
 */
export const deserializeOrderFromStorage = (key = 'currentOrder') => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error deserializando orden:', error);
    return null;
  }
};

export default {
  createOrder,
  getOrder,
  retryPayment,
  calculateShipping,
  validateCheckoutData,
  serializeOrderForStorage,
  deserializeOrderFromStorage,
  normalizeCheckoutData,
  denormalizeResponse
};
