import React from 'react';

/**
 * ✅ ImageOptimizer - Componente para optimizar imágenes con Cloudinary
 * Características:
 * - q_auto: Optimización automática de calidad según navegador
 * - f_auto: Formato automático (WebP, AVIF cuando sea posible)
 * - w_: Ancho automático (especificar en props)
 * - loading: lazy para cargar diferido
 * - Fallback src para imágenes sin Cloudinary
 */
const ImageOptimizer = React.memo(({
    src,
    alt,
    width = 400,
    height = 400,
    className = '',
    loading = 'lazy',
    quality = 'auto',
    format = 'auto'
}) => {
    if (!src) {
        return (
            <div
                className={`bg-gray-200 flex items-center justify-center ${className}`}
                style={{ width: `${width}px`, height: `${height}px` }}
                aria-label="Imagen no disponible"
            >
                <span className="text-gray-500 text-sm">Imagen no disponible</span>
            </div>
        );
    }

    // ✅ Optimizar URL si es de Cloudinary
    const optimizedSrc = src.includes('cloudinary.com')
        ? addCloudinaryOptimizations(src, { width, quality, format })
        : src;

    return (
        <img
            src={optimizedSrc}
            alt={alt}
            className={className}
            loading={loading}
            width={width}
            height={height}
            decoding="async"
            role="img"
        />
    );
});

ImageOptimizer.displayName = 'ImageOptimizer';

/**
 * ✅ Agregar parámetros de optimización a URLs de Cloudinary
 * Evita duplicar lógica en múltiples componentes
 */
function addCloudinaryOptimizations(url, { width, quality = 'auto', format = 'auto' }) {
    if (!url) return url;

    // Evitar duplicar parámetros
    if (url.includes('q_auto') && url.includes('f_auto')) {
        return url;
    }

    // Construir transformación Cloudinary
    const transforms = [
        `w_${width}`,
        `q_${quality}`,
        `f_${format}`,
        'c_fill' // crop: fill para mantener aspecto
    ].filter(Boolean);

    // Insertar /c_transform/ antes del nombre del archivo
    const parts = url.split('/upload/');
    if (parts.length === 2) {
        return `${parts[0]}/upload/${transforms.join(',')}/${parts[1]}`;
    }

    return url;
}

export default ImageOptimizer;
