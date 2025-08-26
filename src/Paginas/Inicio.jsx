import React from 'react';
// Importamos el logo de Gaddyel
import LogoGaddyel from '../Activos/imagenes/logo-gaddyel.png';

// Por ahora, usamos un placeholder para el Carrusel y Tarjetas de Producto.
const CarruselDeImagenes = () => (
    <div className="bg-gray-200 h-64 md:h-96 flex items-center justify-center rounded-lg shadow-md mb-12 w-full">
        <p className="text-xl text-gray-700">Carrusel de Imágenes Destacadas (Próximamente)</p>
    </div>
);

const TarjetaProductoDestacado = ({ titulo, descripcion, imagenSrc }) => (
    <div className="bg-white p-6 rounded-2xl shadow-xl transition-all hover:scale-105 duration-300 transform border border-gray-100 flex flex-col items-center text-center">
        <img src={imagenSrc} alt={titulo} className="w-32 h-32 object-cover rounded-full mb-4 shadow-md" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">{titulo}</h3>
        <p className="text-gray-600 text-sm mb-4">{descripcion}</p>
        <a href="/catalogo" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full text-lg shadow-lg transition-transform transform hover:scale-105 duration-200">Ver Producto</a>
    </div>
);


const Inicio = () => {
    return (
        <div className="container mx-auto px-4 py-8 overflow-hidden">
            {/* Sección de Bienvenida */}
            <section className="text-center my-12 md:my-16">
                {/* Logo de Gaddyel como elemento central */}
                <img
                    src={LogoGaddyel}
                    alt="Logo de Gaddyel"
                    // Hemos ajustado el tamaño para que sea más grande y se centre mejor
                    className="mx-auto h-40 md:h-64 lg:h-80 mb-4" // Ajustado tamaño del logo: h-32 md:h-48 lg:h-56
                />
                {/* Hemos convertido el span en un h1 para semántica y aplicado el estilo de título principal */}
                <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-800 mb-8 leading-tight"> {/* Estilo de h1 aplicado al texto */}
                    <span className="block text-gray-700">Blanquería Personalizada con Distinción</span>
                </h1>
                {/* El párrafo de descripción mantiene sus estilos */}
                <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8">
                    Diseños exclusivos, materiales de primera calidad y un toque único para tu spa, centro de estética, hotel o cabaña.
                </p>
                <a href="/catalogo" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
                    Explorar Catálogo
                </a>
            </section>

            {/* Sección del Carrusel (Placeholder) */}
            <section className="my-12 md:my-16">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">Nuestros Destacados</h2>
                <CarruselDeImagenes />
            </section>

            {/* Sección de Productos Destacados (Placeholders) */}
            <section className="my-12 md:my-16">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">Productos que te Encantarán</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <TarjetaProductoDestacado
                        titulo="Set de Toallas Premium"
                        descripcion="Suavidad y absorción para tus clientes."
                        imagenSrc="https://placehold.co/128x128/a8c3d9/ffffff?text=Toalla"
                    />
                    <TarjetaProductoDestacado
                        titulo="Batas Personalizadas"
                        descripcion="El toque de lujo para tu establecimiento."
                        imagenSrc="https://placehold.co/128x128/b3a8d9/ffffff?text=Bata"
                    />
                    <TarjetaProductoDestacado
                        titulo="Vinchas para Tratamientos"
                        descripcion="Comodidad y estilo en cada sesión."
                        imagenSrc="https://placehold.co/128x128/d9a8a8/ffffff?text=Vincha"
                    />
                </div>
            </section>

            {/* Sección de Llamada a la Acción Final */}
            <section className="text-center bg-blue-100 p-12 rounded-xl my-16 shadow-lg">
                <h2 className="text-4xl md:text-5xl font-bold text-blue-800 mb-6">
                    ¿Listo para la Distinción de Gaddyel?
                </h2>
                <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8">
                    Personaliza tu blanquería y eleva la imagen de tu marca.
                </p>
                <a href="/contacto" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
                    Contáctanos Ahora
                </a>
            </section>
        </div>
    );
};

export default Inicio;
