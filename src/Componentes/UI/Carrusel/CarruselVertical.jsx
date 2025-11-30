import React, { useState, useEffect } from 'react';

const CarruselVertical = ({ imagenes = [] }) => {
    // 🔧 Normalizamos: si el array tiene strings, los convertimos en objetos { src, alt }
    const imagenesNormalizadas = Array.isArray(imagenes)
        ? imagenes.map((img) =>
            typeof img === "string"
                ? { src: img, alt: "Imagen del producto" }
                : { src: img?.src, alt: img?.alt || "Imagen del producto" }
        ).filter(img => img.src)
        : [];

    const placeholder = {
        src: "https://via.placeholder.com/400?text=Sin+imagen",
        alt: "Sin imagen disponible",
    };

    const primeraImagen = imagenesNormalizadas[0] || placeholder;
    const [imagenPrincipal, setImagenPrincipal] = useState(primeraImagen.src);

    useEffect(() => {
        setImagenPrincipal(primeraImagen.src);
    }, [imagenes]);

    const handleSiguiente = () => {
        if (imagenesNormalizadas.length <= 1) return;
        const currentIndex = imagenesNormalizadas.findIndex(img => img.src === imagenPrincipal);
        const nextIndex = (currentIndex + 1) % imagenesNormalizadas.length;
        setImagenPrincipal(imagenesNormalizadas[nextIndex].src);
    };

    const handleAnterior = () => {
        if (imagenesNormalizadas.length <= 1) return;
        const currentIndex = imagenesNormalizadas.findIndex(img => img.src === imagenPrincipal);
        const prevIndex = (currentIndex - 1 + imagenesNormalizadas.length) % imagenesNormalizadas.length;
        setImagenPrincipal(imagenesNormalizadas[prevIndex].src);
    };

    const imagenActual = imagenesNormalizadas.find(img => img.src === imagenPrincipal) || placeholder;

    return (
        <div className="flex flex-col lg:flex-row-reverse items-center justify-center lg:items-start gap-4 h-full">

            {/* Imagen principal */}
            <div className="w-full lg:w-4/5 h-[400px] md:h-[500px] bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                <img
                    src={imagenPrincipal}
                    alt={imagenActual.alt}
                    // NOTA: Mantuve object-cover aquí. Si la imagen principal se recorta, cámbialo a object-contain
                    className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                />
            </div>

            {/* Miniaturas */}
            {/* 🚨 MODIFICACIÓN CLAVE: Cambiamos overflow-x-auto/overflow-y-auto por overflow-visible */}
            <div className="flex items-center justify-center gap-2 p-2 w-full overflow-visible lg:flex-col lg:items-start lg:p-0 lg:w-1/5">
                {imagenesNormalizadas.length > 0 ? (
                    imagenesNormalizadas.map((imagen) => (
                        <div
                            key={imagen.src}
                            role="button"
                            tabIndex={0}
                            className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 transform ${imagen.src === imagenPrincipal
                                ? "border-2 border-purple-600 scale-110 shadow-lg"
                                : "border-2 border-transparent hover:border-gray-400"
                                }`}
                            onClick={() => setImagenPrincipal(imagen.src)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    setImagenPrincipal(imagen.src);
                                }
                            }}
                        >
                            <img
                                src={imagen.src}
                                alt={imagen.alt}
                                loading="lazy"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">Sin imágenes</p>
                )}
            </div>
        </div>
    );
};

export default React.memo(CarruselVertical);