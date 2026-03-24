// ============================================================
// ¿QUÉ ES ESTO?
// Funciones que se comunican con el servidor para crear y consultar
// pedidos de compra. También transforma los datos entre el formato
// que usa el frontend y el que espera el backend.
//
// ¿CÓMO FUNCIONA?
// 1. Al confirmar una compra, normalizeCheckoutData transforma los
//    datos del formulario al formato que entiende el servidor.
// 2. createOrder envía el pedido al servidor y guarda la respuesta
//    localmente para que las páginas de confirmación puedan leerla.
// 3. denormalizeResponse convierte la respuesta del servidor de
//    vuelta al formato que espera el frontend.
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// - ¿El pedido no se crea? → Revisar createOrder() y el endpoint
//   del servidor /api/pedidos/crear.
// - ¿La página de confirmación no muestra datos? → Revisar
//   denormalizeResponse() y la clave 'lastOrderData' en localStorage.
// - ¿Timeout al crear pedido? → El servidor tiene 15 segundos para
//   responder. Revisar la sección CREAR PEDIDO.
// ============================================================

import axiosInstance from './axiosInstance';
import { logger } from '../utils/logger';

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
      // ✅ Normalizar ID para evitar undefined si viene como id/ID
      productoId: String(item._id || item.id || item.productoId),
      cantidad: item.cantidad,
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
    total: backendResponse.totals?.total ?? backendResponse.total,
    subtotal: backendResponse.totals?.subtotal ?? backendResponse.subtotal,
    // ?? en lugar de || para preservar el valor 0 (envío gratis).
    // Con ||, si shippingCost = 0 (falsy), se evaluaba el segundo operador y
    // podía resultar en undefined, rompiendo la visualización en PedidoConfirmado.
    costoEnvio: backendResponse.totals?.shippingCost ?? backendResponse.costoEnvio,
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

    // Validaciones iniciales
    if (!checkoutData) {
      throw new Error('Los datos del checkout son requeridos');
    }

    if (!cartItems || cartItems.length === 0) {
      logger.error('[orderService] Cartón vacío al intentar crear orden');
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

    const { data: backendResponse } = await axiosInstance.post(
      '/api/pedidos/crear',
      normalizedData,
      { withCredentials: true, timeout: 15000 }
    );

    if (isDev) {
      logger.success('orderService: Orden creada exitosamente');
      logger.debug('  Backend response:', backendResponse);
    }

    // Desnormalizar respuesta
    const denormalizedResponse = denormalizeResponse(backendResponse);

    // Guardar datos en localStorage para la página de confirmación
    if (denormalizedResponse.success) {
      try {
        localStorage.setItem('lastOrderData', JSON.stringify(denormalizedResponse));
      } catch (e) {
        logger.error('[orderService] Error al guardar en localStorage', e.message);
      }
    }

    return denormalizedResponse;

  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      logger.error('[orderService] Timeout en creación de orden');
      throw new Error('La solicitud tardó demasiado. Por favor, intenta de nuevo.');
    }
    const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
    logger.error('[orderService] Error creando orden:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Obtiene una orden existente por su ID.
export const getOrder = async (orderId) => {
  try {
    if (!orderId) {
      throw new Error('ID de orden requerido');
    }

    const { data } = await axiosInstance.get(`/api/orders/${orderId}`, {
      withCredentials: true,
      timeout: 10000
    });

    if (isDev) {
      logger.debug('✅ orderService: Orden obtenida:', data);
    }

    return denormalizeResponse(data);

  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      logger.error('[orderService] Timeout obteniendo orden');
      throw new Error('La solicitud tardó demasiado.');
    }
    if (error.response?.status === 404) {
      throw new Error('Orden no encontrada');
    }
    logger.error('[orderService] Error obteniendo orden:', error.message);
    throw error;
  }
};

// Solicita al servidor un nuevo enlace de pago para una orden que
// no completó el pago anteriormente.
export const retryPayment = async (orderId) => {
  try {
    if (!orderId) {
      throw new Error('ID de orden requerido');
    }

    const { data } = await axiosInstance.post(`/api/orders/${orderId}/retry`, null, {
      withCredentials: true,
      timeout: 10000
    });

    if (isDev) {
      logger.debug('✅ orderService: Reintento iniciado:', data);
    }

    return denormalizeResponse(data);

  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('La solicitud tardó demasiado.');
    }
    logger.error('Error reintentando pago:', error.message);
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
    logger.error('Error deserializando orden:', error);
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
