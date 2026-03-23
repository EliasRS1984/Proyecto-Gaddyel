// ============================================================
// ¿QUÉ ES ESTO?
// Componente de imagen inteligente que optimiza automáticamente
// las imágenes alojadas en Cloudinary.
//
// ¿CÓMO FUNCIONA?
// 1. Recibe la URL de la imagen y parámetros opcionales (ancho, calidad)
// 2. Si la URL es de Cloudinary, agrega q_auto + f_auto para reducir el peso
// 3. Si la imagen falla al cargar, muestra un placeholder gris
// 4. Si la prop "priority" está activa, carga la imagen de forma prioritaria
//    (usar en imágenes "above the fold" como el logo del inicio)
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// - Imagen no carga → revisar que src no sea null/undefined antes de pasarla
// - Imagen deformada → revisar la prop "crop" (usar 'fill' para covers, omitir para logos)
// - Logo hero no priorizado → asegurarse de pasar priority={true}
// - Atributos HTML no llegan → están en ...rest, verificar que no colisionen
// ============================================================

import { useState, memo } from 'react';

const ImageOptimizer = memo(({
    src,
    alt,
    width = 400,
    height = 400,
    className = '',
    loading = 'lazy',
    quality = 'auto',
    format = 'auto',
    // Modo de recorte Cloudinary — usar 'fill' para fotos de producto (object-cover)
    // Omitir (undefined) para logos o imágenes que no deben recortarse
    crop,
    // Si es true: carga inmediata + alta prioridad del navegador (usar en hero/LCP)
    priority = false,
    // Cualquier atributo HTML extra (itemProp, data-*, aria-*, etc.) se reenvía al <img>
    ...rest
}) => {
    // Estado para manejar error de carga — si la imagen 404, mostramos placeholder
    const [imgError, setImgError] = useState(false);

    // ======== PLACEHOLDER ========
    // Se muestra si: no hay src, o la imagen falló al cargar
    if (!src || imgError) {
        return (
            <div
                className={`bg-slate-100 dark:bg-slate-800 flex items-center justify-center ${className}`}
                role="img"
                aria-label={alt || 'Imagen no disponible'}
            >
                {/* Ícono neutro — no texto, funciona en cualquier tamaño */}
                <svg
                    className="w-6 h-6 text-slate-300 dark:text-slate-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
            </div>
        );
    }

    // ======== OPTIMIZACIÓN CLOUDINARY ========
    // Solo se transforma si la URL pertenece a Cloudinary
    const optimizedSrc = src.includes('cloudinary.com')
        ? addCloudinaryOptimizations(src, { width, quality, format, crop })
        : src;

    // ======== PRIORIDAD DE CARGA ========
    // priority=true → loading="eager" + fetchpriority="high" (navegadores modernos)
    // Usar en imágenes LCP (la más grande visible sin scroll, como el logo del hero)
    const loadingAttr = priority ? 'eager' : loading;
    const fetchPriorityValue = priority ? 'high' : undefined;

    return (
        <img
            src={optimizedSrc}
            alt={alt}
            className={className}
            loading={loadingAttr}
            fetchPriority={fetchPriorityValue}
            width={width}
            height={height}
            decoding="async"
            onError={() => setImgError(true)}
            {...rest}
        />
    );
});

ImageOptimizer.displayName = 'ImageOptimizer';

// ======== HELPER: CONSTRUIR URL CLOUDINARY ========
// Inserta los parámetros de optimización en la URL de Cloudinary
// Ejemplo: .../upload/w_400,q_auto,f_auto/imagen.jpg
//
// ¿La URL ya tiene parámetros? → los respeta y no duplica
function addCloudinaryOptimizations(url, { width, quality = 'auto', format = 'auto', crop }) {
    if (!url) return url;

    // Si ya están los parámetros base, devolver como está
    if (url.includes('q_auto') && url.includes('f_auto')) {
        return url;
    }

    const transforms = [
        `w_${width}`,
        `q_${quality}`,
        `f_${format}`,
        // Crop solo se agrega si se pasó explícitamente
        // 'fill' → para fotos que ocupan el contenedor completo (TarjetaProducto)
        // undefined → para logos, banners o imágenes que no deben recortarse
        crop ? `c_${crop}` : null,
    ].filter(Boolean);

    // Cloudinary espera los params después de /upload/
    const parts = url.split('/upload/');
    if (parts.length === 2) {
        return `${parts[0]}/upload/${transforms.join(',')}/${parts[1]}`;
    }

    return url;
}

export default ImageOptimizer;
