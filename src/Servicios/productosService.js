// src/Servicios/productosService.js
import { logger } from '../utils/logger';

const API_BASE = import.meta.env.VITE_API_BASE || "https://gaddyel-backend.onrender.com";
const API_URL = `${API_BASE}/api/productos`;

logger.debug("🌐 Frontend Web - API_BASE:", API_BASE);

/**
 * ✅ MEJORADO: Obtiene todos los productos con paginación servidor
 * Backend ahora retorna: { data: [], pagination: { total, page, limit, pages } }
 */
export const obtenerProductos = async (params = {}) => {
    try {
        logger.debug("📤 Fetch: GET /productos", params);
        
        // Crear AbortController para timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos timeout
        
        // Construir query string
        const queryParams = new URLSearchParams({
            page: params.page || 1,
            limit: params.limit || 12,
            sortBy: params.sortBy || 'createdAt',
            sortDir: params.sortDir || -1,
            ...params
        });
        
        const respuesta = await fetch(`${API_URL}?${queryParams.toString()}`, {
            signal: controller.signal,
            headers: { 'Accept': 'application/json' }
        });
        
        clearTimeout(timeoutId);
        
        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status} al obtener productos`);
        }
        
        const resultado = await respuesta.json();
        
        // ✅ Backend retorna { data, pagination }
        const productos = resultado.data || resultado; // Backwards compatibility
        
        logger.debug("✅ Productos cargados:", productos.length, "items");
        logger.debug("📊 Paginación:", resultado.pagination);
        
        // Retornar estructura compatible con frontend
        return {
            productos,
            pagination: resultado.pagination || null
        };
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error("❌ Error: Timeout en solicitud de productos");
            throw new Error('La solicitud tardó demasiado. Por favor, intenta de nuevo.');
        }
        console.error("❌ Error cargando productos:", error.message);
        throw new Error('No se pudieron cargar los productos. Por favor, intenta más tarde.');
    }
};

/**
 * Obtiene un producto por ID
 */
export const obtenerProductoPorId = async (id) => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        const respuesta = await fetch(`${API_URL}/${id}`, {
            signal: controller.signal,
            headers: { 'Accept': 'application/json' }
        });
        
        clearTimeout(timeoutId);
        
        if (!respuesta.ok) {
            throw new Error(`Producto no encontrado`);
        }
        
        return respuesta.json();
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error("❌ Error: Timeout en solicitud de producto");
            throw new Error('La solicitud tardó demasiado.');
        }
        console.error("❌ Error cargando producto:", error.message);
        throw new Error('Error al obtener el producto');
    }
};
