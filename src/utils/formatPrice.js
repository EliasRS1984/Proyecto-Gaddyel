/**
 * UTILIDAD: Formato de Precios - Estándar Argentino
 * 
 * ¿QUÉ HACE?
 * - Formatea precios usando formato argentino: punto (.) para miles, coma (,) para decimales
 * - Ejemplo: 1234.56 → "1.234,56"
 * 
 * ¿POR QUÉ?
 * - Normativa argentina: usar punto para miles y coma para decimales
 * - Evitar confusión en precios
 * - Consistencia en toda la aplicación
 * 
 * @param {number} precio - Precio a formatear
 * @param {boolean} includeDecimals - Si incluir decimales (default: true)
 * @returns {string} - Precio formateado en formato argentino
 */
export const formatPrice = (precio, includeDecimals = true) => {
    if (precio === null || precio === undefined || isNaN(precio)) {
        return '0,00';
    }

    const options = {
        minimumFractionDigits: includeDecimals ? 2 : 0,
        maximumFractionDigits: includeDecimals ? 2 : 0,
        useGrouping: true
    };

    // Usar formato argentino: es-AR
    return Number(precio).toLocaleString('es-AR', options);
};

/**
 * Formatea precio con símbolo de pesos
 * @param {number} precio - Precio a formatear
 * @param {boolean} includeDecimals - Si incluir decimales (default: true)
 * @returns {string} - Precio formateado con símbolo $
 */
export const formatPriceWithSymbol = (precio, includeDecimals = true) => {
    return `$${formatPrice(precio, includeDecimals)}`;
};

/**
 * Parse string de precio argentino a número
 * Ejemplo: "1.234,56" → 1234.56
 * @param {string} priceString - String con formato argentino
 * @returns {number} - Número parseado
 */
export const parseArgentinePrice = (priceString) => {
    if (!priceString) return 0;
    
    // Remover símbolo de pesos si existe
    let cleanString = priceString.replace('$', '').trim();
    
    // Reemplazar puntos (separador de miles) por nada
    cleanString = cleanString.replace(/\./g, '');
    
    // Reemplazar coma (separador decimal) por punto
    cleanString = cleanString.replace(',', '.');
    
    return parseFloat(cleanString) || 0;
};
