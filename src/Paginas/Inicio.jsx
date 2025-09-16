import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; // Se agrega Helmet para el SEO

// Importamos todos los datos y recursos desde el nuevo archivo centralizado
import { LogoGaddyel, imagenFondo, productos, faqs, imagenesCarrusel } from '../Datos/datos.js';

// Importamos los componentes de forma centralizada
import Carrusel from '../Componentes/UI/Carrusel/Carrusel.jsx';
import ScrollReveal from '../Componentes/Layout/ScrollReveal/ScrollReveal.jsx';
import ImagenArticulo from '../Activos/Imagenes/imagen-articulo/imagen-articulo.jpg';

// Componente para las preguntas frecuentes.
const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200">
            <button
                className="w-full flex justify-between items-center py-4 px-6 text-left focus:outline-none transition-colors duration-300"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-semibold text-gray-800">{question}</span>
                <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600' : 'text-gray-500'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            {isOpen && (
                <div className="px-6 pb-4 text-gray-600 leading-relaxed transition-all duration-500 ease-in-out">
                    {answer}
                </div>
            )}
        </div>
    );
};

// Componente TarjetaProductoDestacado ahora toma los datos del producto
const TarjetaProductoDestacado = ({ producto }) => (
    <ScrollReveal>
        <div className="bg-white p-6 rounded-2xl shadow-xl transition-all hover:scale-105 duration-300 transform border border-gray-100 flex flex-col items-center text-center">
            <img src={producto.imagenSrc} alt={producto.nombre} className="w-32 h-32 object-cover rounded-full mb-4 shadow-md" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">{producto.nombre}</h3>
            <p className="text-gray-600 text-sm mb-4">{producto.descripcion}</p>
            <NavLink to={`/catalogo/${producto.id}`} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full text-lg shadow-lg transition-transform transform hover:scale-105 duration-300">Ver Producto</NavLink>
        </div>
    </ScrollReveal>
);

const Inicio = () => {
    // Filtramos los productos para mostrar solo los destacados
    const productosDestacados = productos.filter(producto => producto.destacado);

    // === LÓGICA AGREGADA PARA LA SECCIÓN DE FAQ ===
    // Estado para controlar si se muestran todas las preguntas
    const [showAllFaqs, setShowAllFaqs] = useState(false);
    // Determinamos la cantidad de preguntas que se mostrarán inicialmente
    const initialFaqCount = 3;
    // Creamos un nuevo array con las preguntas a mostrar
    const faqsToShow = showAllFaqs ? faqs : faqs.slice(0, initialFaqCount);
    // === FIN DE LÓGICA AGREGADA ===

    return (
        <>
            <Helmet>
                <title>Inicio - Gaddyel</title>
                <meta name="description" content="Descubre Gaddyel, tu socio en productos premium para estética y cuidado personal. Calidad y confort para profesionales de la belleza." />
            </Helmet>
            <div
                className="w-full bg-fixed bg-cover bg-center"
                style={{ backgroundImage: `url(${imagenFondo})` }}
            >
                <div className="container mx-auto overflow-hidden">
                    <section className="min-h-screen flex items-center justify-center flex-col text-center p-4 md:p-8 bg-white rounded-b-2xl shadow-xl my-24">
                        <img
                            src={LogoGaddyel}
                            alt="Logo de Gaddyel"
                            className="mx-auto h-40 md:h-64 lg:h-80 mb-4"
                        />
                        <h1 className="italic text-3xl md:text-5xl lg:text-6xl font-extrabold text-indigo-800 mb-8 leading-tight max-w-4xl mx-auto">
                            <span className="block text-gray-700">Blanquería Personalizada con Distinción</span>
                        </h1>
                        
                        {/* Nueva sección dividida en dos columnas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto mb-12">
                            {/* Columna izquierda: Artículo con descripción */}
                            <ScrollReveal>
                                <article className="text-left p-6 bg-gray-50 rounded-lg shadow-md">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Nuestra Esencia en Gaddyel</h3>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        En Gaddyel, nos dedicamos a transformar el textil en una expresión de identidad y confort. 
                                        Fusionamos diseño exclusivo y la más alta calidad en blanquería personalizada, ideal para 
                                        spas, centros de estética, hoteles y cabañas que buscan dejar una impresión memorable.
                                    </p>
                                    <p className="text-gray-700 leading-relaxed">
                                        Cada pieza es confeccionada pensando en la durabilidad, la suavidad al tacto y la capacidad 
                                        de realzar el ambiente profesional. Desde toallas bordadas hasta batas con tu logo, 
                                        garantizamos un producto que habla por sí mismo y eleva la experiencia de tus clientes. 
                                        Descubre la diferencia Gaddyel, donde la personalización se une a la excelencia.
                                    </p>
                                </article>
                            </ScrollReveal>

                            {/* Columna derecha: Espacio para imagen */}
                            <ScrollReveal>
                                <div className="flex justify-center items-center h-full">
                                    <img
                                        src={ImagenArticulo} // Placeholder para la imagen
                                        alt="Descripción del emprendimiento Gaddyel"
                                        className="w-full h-auto max-w-lg rounded-lg shadow-xl object-cover"
                                    />
                                </div>
                            </ScrollReveal>
                        </div>

                        <ScrollReveal>
                            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8">
                                Diseños exclusivos!.
                            </p>
                        </ScrollReveal>
                        <NavLink to="/catalogo" className="inline-block bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
                            Explorar Catálogo
                        </NavLink>
                    </section>

                    <section className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-gray-50 rounded-2xl my-72 shadow-xl">
                        <div className="flex flex-col items-center w-full">
                            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6 md:mb-8 shrink-0">Nuestros Destacados</h2>
                            <ScrollReveal>
                                <Carrusel imagenes={imagenesCarrusel} />
                            </ScrollReveal>
                        </div>
                    </section>

                    <section className="min-h-screen flex items-center justify-center flex-col p-4 md:p-8 bg-white rounded-2xl my-72 shadow-xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">Productos que te Encantarán</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {productosDestacados.map(producto => (
                                <ScrollReveal key={producto.id}>
                                    <TarjetaProductoDestacado producto={producto} />
                                </ScrollReveal>
                            ))}
                        </div>
                    </section>

                    <section className="bg-gray-50 py-16 rounded-xl my-72 shadow-xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
                            Preguntas Frecuentes
                        </h2>
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            {faqsToShow.map((faq, index) => (
                                <ScrollReveal key={index}>
                                    <FaqItem question={faq.question} answer={faq.answer} />
                                </ScrollReveal>
                            ))}
                            {/* Lógica para mostrar ambos botones */}
                            {faqs.length > initialFaqCount && (
                                <div className="text-center mt-8">
                                    {!showAllFaqs ? (
                                        <button
                                            onClick={() => setShowAllFaqs(true)}
                                            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300"
                                        >
                                            Ver más preguntas
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setShowAllFaqs(false)}
                                            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300"
                                        >
                                            Ver menos preguntas
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="min-h-screen flex items-center justify-center flex-col text-center bg-blue-100 p-12 rounded-xl my-72 shadow-xl">
                        <ScrollReveal>
                            <h2 className="text-4xl md:text-5xl font-bold text-blue-800 mb-6">
                                ¿Listo para la Distinción de Gaddyel?
                            </h2>
                        </ScrollReveal>
                        <ScrollReveal>
                            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8">
                                Personaliza tu blanquería y eleva la imagen de tu marca.
                            </p>
                        </ScrollReveal>
                        <NavLink to="/contacto" className="inline-block bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
                            Contáctanos Ahora
                        </NavLink>
                    </section>
                </div>
            </div>
        </>
    );
};

export default Inicio;
