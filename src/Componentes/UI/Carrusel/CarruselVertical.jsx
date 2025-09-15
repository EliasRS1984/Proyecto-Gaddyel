import React, { useState } from 'react';


const CarruselVertical = ({ imagenes }) => {
    // Estado para la imagen principal mostrada
    const [imagenPrincipal, setImagenPrincipal] = useState(imagenes[0]?.src || '');

    return (
        <div className="flex flex-col lg:flex-row-reverse items-center justify-center lg:items-start gap-4 h-full">
            {/* Contenedor de la imagen principal */}
            <div className="w-full lg:w-4/5 h-[400px] md:h-[500px] bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                <img
                    src={imagenPrincipal}
                    alt="Imagen principal del producto"
                    className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                />
            </div>

            {/* Contenedor de las miniaturas horizontales para móviles y verticales para desktop */}
            <div className="flex items-center justify-center gap-2 p-2 w-full overflow-x-auto lg:flex-col lg:items-start lg:p-0 lg:w-1/5 lg:overflow-y-auto">
                {imagenes.map((imagen, index) => (
                    <div
                        key={index}
                        className={`
                            shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 transform 
                            ${imagen.src === imagenPrincipal ? 'border-2 border-transparent scale-110 shadow-lg' : 'border-2 border-transparent hover:border-gray-400'}
                        `}
                        onClick={() => setImagenPrincipal(imagen.src)}
                    >
                        <img
                            src={imagen.src}
                            alt={imagen.alt}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CarruselVertical;
