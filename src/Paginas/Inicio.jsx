import React from 'react';
import { NavLink } from 'react-router-dom';
// Importamos el logo de Gaddyel
import LogoGaddyel from '../Activos/imagenes/logo-gaddyel.png';

// Importamos tus imágenes del carrusel
import carrusel1 from '../Activos/Imagenes/ImgCarrusel/carrusel-1.jpeg';
import carrusel2 from '../Activos/imagenes/ImgCarrusel/carrusel-2.jpeg';
import carrusel3 from '../Activos/imagenes/ImgCarrusel/carrusel-3.jpeg';
import carrusel4 from '../Activos/imagenes/ImgCarrusel/carrusel-4.jpeg';
import carrusel5 from '../Activos/imagenes/ImgCarrusel/carrusel-5.jpeg';

// Importamos el componente Carrusel
import Carrusel from '../Componentes/UI/Carrusel/Carrusel.jsx';
import { productos } from '../Datos/productos.js';

// Componente TarjetaProductoDestacado ahora toma los datos del producto
const TarjetaProductoDestacado = ({ producto }) => (
    <div className="bg-white p-6 rounded-2xl shadow-xl transition-all hover:scale-105 duration-300 transform border border-gray-100 flex flex-col items-center text-center">
        {/* Usamos los datos del objeto producto */}
        <img src={producto.imagenSrc} alt={producto.nombre} className="w-32 h-32 object-cover rounded-full mb-4 shadow-md" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">{producto.nombre}</h3>
        <p className="text-gray-600 text-sm mb-4">{producto.descripcion}</p>
        {/* El botón ahora apunta a la URL correcta del producto */}
        <NavLink to={`/catalogo/${producto.id}`} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full text-lg shadow-lg transition-transform transform hover:scale-105 duration-300">Ver Producto</NavLink>
    </div>
);


const Inicio = () => {
    // Definición de las imágenes para el carrusel
    const imagenesCarrusel = [
        { src: carrusel1, alt: 'Kit Faciales de Gaddyel' },
        { src: carrusel2, alt: 'Kit Faciales y de Spa de Gaddyel' },
        { src: carrusel3, alt: 'Productos de Blanquería Personalizada Gaddyel' },
        { src: carrusel4, alt: 'Blanquería para Salones de Belleza Gaddyel' },
        { src: carrusel5, alt: 'Suministros para Barbería Gaddyel' },
    ];

    // Filtramos los productos para mostrar solo los destacados
    const productosDestacados = productos.filter(producto => producto.destacado);

    return (
        <div className="container mx-auto overflow-hidden">
            {/* Sección de Bienvenida */}
            <section className="min-h-screen flex items-center justify-center flex-col text-center p-4 md:p-8">
                <img
                    src={LogoGaddyel}
                    alt="Logo de Gaddyel"
                    className="mx-auto h-40 md:h-64 lg:h-80 mb-4"
                />
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-indigo-800 mb-8 leading-tight max-w-4xl mx-auto">
                    <span className="block text-gray-700">Blanquería Personalizada con Distinción</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8">
                    Diseños exclusivos, materiales de primera calidad y un toque único para tu spa, centro de estética, hotel o cabaña.
                </p>
                <NavLink to="/catalogo" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
                    Explorar Catálogo
                </NavLink>
            </section>

            {/* Sección del Carrusel - El contenedor principal se centra */}
            <section className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
                {/* Este div agrupa y centra el título y el carrusel */}
                <div className="flex flex-col items-center w-full max-w-[960px] mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6 md:mb-8 shrink-0">Nuestros Destacados</h2>
                    {/* El carrusel ahora se centrará dentro del div contenedor */}
                    <Carrusel imagenes={imagenesCarrusel} />
                </div>
            </section>

            {/* Sección de Productos Destacados */}
            <section className="min-h-screen flex items-center justify-center flex-col p-4 md:p-8">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">Productos que te Encantarán</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Usamos map para renderizar las tarjetas de productos dinámicamente */}
                    {productosDestacados.map(producto => (
                        <TarjetaProductoDestacado key={producto.id} producto={producto} />
                    ))}
                </div>
            </section>

            {/* Sección de Llamada a la Acción Final */}
            <section className="min-h-screen flex items-center justify-center flex-col text-center bg-blue-100 p-12 rounded-xl my-16 shadow-lg">
                <h2 className="text-4xl md:text-5xl font-bold text-blue-800 mb-6">
                    ¿Listo para la Distinción de Gaddyel?
                </h2>
                <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8">
                    Personaliza tu blanquería y eleva la imagen de tu marca.
                </p>
                <NavLink to="/contacto" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
                    Contáctanos Ahora
                </NavLink>
            </section>
        </div>
    );
};

export default Inicio;
