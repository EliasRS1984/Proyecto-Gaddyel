import React, { useState, useEffect } from 'react';

const CarruselVertical = ({ imagenes }) => {
    const [imagenPrincipal, setImagenPrincipal] = useState(imagenes[0]?.src || 'https://via.placeholder.com/400?text=Sin+imagen');

    // Actualiza la imagen principal si el array de imágenes cambia
    useEffect(() => {
        if (imagenes.length > 0 && !imagenes.some(img => img.src === imagenPrincipal)) {
            setImagenPrincipal(imagenes[0].src);
        }
    }, [imagenes]);

    // Funciones para navegar
    const handleSiguiente = () => {
        const currentIndex = imagenes.findIndex(img => img.src === imagenPrincipal);
        const nextIndex = (currentIndex + 1) % imagenes.length;
        setImagenPrincipal(imagenes[nextIndex].src);
    };

    const handleAnterior = () => {
        const currentIndex = imagenes.findIndex(img => img.src === imagenPrincipal);
        const prevIndex = (currentIndex - 1 + imagenes.length) % imagenes.length;
        setImagenPrincipal(imagenes[prevIndex].src);
    };

    // Buscar el alt de la imagen principal
    const imagenActual = imagenes.find(img => img.src === imagenPrincipal) || imagenes[0] || { alt: 'Sin imagen' };

    return (
        <div className="flex flex-col lg:flex-row-reverse items-center justify-center lg:items-start gap-4 h-full">
            {/* Contenedor de la imagen principal */}
            {imagenes.length > 0 ? (
                <div className="w-full lg:w-4/5 h-[400px] md:h-[500px] bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                    <img
                        src={imagenPrincipal}
                        alt={imagenActual.alt}
                        className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                    />
                </div>
            ) : (
                <div className="w-full lg:w-4/5 h-[400px] md:h-[500px] bg-gray-200 rounded-xl flex items-center justify-center">
                    <p>No hay imágenes disponibles</p>
                </div>
            )}

            {/* Contenedor de las miniaturas */}
            <div className="flex items-center justify-center gap-2 p-2 w-full overflow-x-auto lg:flex-col lg:items-start lg:p-0 lg:w-1/5 lg:overflow-y-auto">
                {imagenes.map((imagen) => (
                    <div
                        key={imagen.src}
                        role="button"
                        tabIndex={0}
                        className={`
                            shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 transform 
                            ${imagen.src === imagenPrincipal ? 'border-2 border-transparent scale-110 shadow-lg' : 'border-2 border-transparent hover:border-gray-400'}
                        `}
                        onClick={() => setImagenPrincipal(imagen.src)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
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
                ))}
            </div>
        </div>
    );
};

export default React.memo(CarruselVertical);