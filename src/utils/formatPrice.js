// =====================================================
// ¿QUÉ ES ESTO?
// Funciones para mostrar precios en formato argentino (pesos).
// Ejemplo: el número 1234.56 se muestra como "1.234,56"
//
// ¿CÓMO FUNCIONA?
// - formatPrice(precio)           → devuelve el número con formato local
// - formatPriceWithSymbol(precio) → igual pero con el símbolo $ adelante
// - parseArgentinePrice(texto)    → convierte el texto "1.234,56" al número 1234.56
// Usa el estándar argentino: punto (.) para miles, coma (,) para decimales.
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// ¿El precio se muestra sin formato?   Verificá que el valor sea un número (no string).
// ¿El precio muestra NaN?              El valor es null/undefined/NaN → la función devuelve '0,00'.
// ¿ParseArgentinePrice devuelve 0?     Verificá que el string use punto para miles y coma para decimales.
// =====================================================
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
