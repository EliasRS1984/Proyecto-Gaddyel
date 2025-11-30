// src/Servicios/productosService.js
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const API_URL = `${API_BASE}/productos`;

const isDev = import.meta.env.DEV;
if (isDev) {
    console.log("🌐 Frontend Web - API_BASE:", API_BASE);
}

/**
 * Obtiene todos los productos con timeout y manejo de errores mejorado
 */
export const obtenerProductos = async () => {
    try {
        if (isDev) {
            console.log("📤 Fetch: GET /productos");
        }
        
        // Crear AbortController para timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos timeout
        
        const respuesta = await fetch(API_URL, {
            signal: controller.signal,
            headers: { 'Accept': 'application/json' }
        });
        
        clearTimeout(timeoutId);
        
        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status} al obtener productos`);
        }
        
        const data = await respuesta.json();
        if (isDev) {
            console.log("✅ Productos cargados:", data.length, "items");
        }
        return data;
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
