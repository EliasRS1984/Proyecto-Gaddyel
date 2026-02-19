import React, { useState, useEffect } from 'react';
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import CarruselVertical from '../Componentes/UI/Carrusel/CarruselVertical';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../Context/CartContext';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const DetalleProducto = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [productoData, setProductoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cantidad, setCantidad] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const response = await fetch(`${API_BASE}/api/productos/${id}`);
                if (!response.ok) throw new Error('Error al obtener el producto');
                const data = await response.json();
                setProductoData(data);
            } catch (error) {
                console.error('Error al obtener producto:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducto();
    }, [id]);

    if (loading) {
        return (
            <div className="container mx-auto p-8 text-center min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-4">Cargando...</h1>
                <p className="text-lg text-gray-700">Por favor espera un momento.</p>
            </div>
        );
    }

    if (!productoData) {
        return (
            <div className="container mx-auto p-8 text-center min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-3xl md:text-5xl font-extrabold text-red-600 mb-4">Producto No Encontrado</h1>
                <p className="text-lg text-gray-700 mb-8">El producto que buscas no está disponible.</p>
                <NavLink
                    to="/catalogo"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 duration-300"
                >
                    Volver al Catálogo
                </NavLink>
            </div>
        );
    }

    const {
        nombre = 'Producto sin nombre',
        descripcionCompleta = 'No hay descripción disponible.',
        material = 'No especificado',
        tamanos = [],
        colores = [],
        imagenes = [],
        personalizable = false,
        precio = 0,
        cantidadUnidades = 1,
        categoria = 'Producto'
    } = productoData || {};

    return (
        <>
            <Helmet>
                <title>{`${nombre} Personalizado | ${categoria} con Logo Bordado | Gaddyel`}</title>
                <meta
                    name="description"
                    content={`${descripcionCompleta.substring(0, 145)}... Personalizado con logo bordado. Desde 12 unidades. Envíos a Argentina.`}
                />
                <meta
                    name="keywords"
                    content={`${nombre}, ${categoria} personalizado, bordado logo, estética spa, gaddyel`}
                />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={`https://gaddyel.vercel.app/catalogo/${id}`} />
                
                {/* ✅ Open Graph para redes sociales */}
                <meta property="og:title" content={`${nombre} Personalizado | Gaddyel`} />
                <meta property="og:description" content={`${descripcionCompleta.substring(0, 145)}... Personalizable con logo bordado.`} />
                <meta property="og:type" content="product" />
                <meta property="og:image" content={imagenes[0]?.src || productoData.imagenSrc} />
                <meta property="og:url" content={`https://gaddyel.vercel.app/catalogo/${id}`} />
                <meta property="og:site_name" content="Gaddyel" />
                <meta property="og:locale" content="es_AR" />
                
                {/* ✅ Schema.org Product Schema Optimizado */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org/",
                        "@type": "Product",
                        "@id": `https://gaddyel.vercel.app/catalogo/${id}`,
                        "name": nombre,
                        "description": descripcionCompleta,
                        "image": imagenes.map(img => img.src || img),
                        "brand": {
                            "@type": "Brand",
                            "name": "Gaddyel"
                        },
                        "offers": {
                            "@type": "Offer",
                            "url": `https://gaddyel.vercel.app/catalogo/${id}`,
                            "priceCurrency": "ARS",
                            "price": precio.toString(),
                            "availability": "https://schema.org/InStock"
                        }
                    })}
                </script>
            </Helmet>
            <div className="container mx-auto p-4 md:p-8 flex flex-col lg:flex-row items-start gap-8 min-h-screen">
                {/* Carrusel de imágenes */}
                <div className="lg:w-1/2 w-full lg:sticky lg:top-24" aria-label={`Imágenes de ${nombre}`}>
                    <CarruselVertical imagenes={imagenes} />
                </div>

                {/* Información del producto */}
                <div className="lg:w-1/2 w-full p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">{nombre}</h1>
                    <p className="text-gray-600 text-lg mb-6">{descripcionCompleta}</p>

                    <div className="p-4 bg-purple-50 border-l-4 border-purple-500 shadow-md rounded-lg mb-6">
                        <p className="!text-5xl !font-bold !text-purple-950 !mb-2" style={{ fontSize: '3rem', fontWeight: '700', color: '#4c1d95', marginBottom: '0.5rem' }}>
                            ${precio.toLocaleString('es-AR')}
                        </p>
                        <p className="!text-sm !text-purple-700 !font-bold" style={{ fontSize: '0.875rem', fontWeight: '700', color: '#7e22ce' }}>
                            Incluye {cantidadUnidades} {cantidadUnidades === 1 ? 'unidad' : 'unidades'}
                        </p>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Características Principales</h3>
                        <ul className="list-disc list-inside text-gray-600">
                            <li>Material: {material}</li>
                            <li>Tamaño: {tamanos.length > 0 ? tamanos.join(', ') : 'No especificado'}</li>
                            <li>Colores disponibles: {colores.length > 0 ? colores.join(', ') : 'No especificado'}</li>
                        </ul>
                    </div>

                    {personalizable && (
                        <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500 mb-6">
                            <p className="font-semibold text-yellow-800">
                                ✨ ¡Este producto es personalizable! Contáctanos para obtener los detalles de tu diseño.
                            </p>
                        </div>
                    )}

                    {/* Selector de cantidad */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                        <input
                            type="number"
                            min="1"
                            value={cantidad}
                            onChange={(e) => {
                                setCantidad(Math.max(1, parseInt(e.target.value) || 1));
                                setAddedToCart(false);
                            }}
                            className="w-20 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => {
                                addToCart(productoData, cantidad);
                                setAddedToCart(true);
                                setTimeout(() => setAddedToCart(false), 2000);
                            }}
                            className="flex-1 bg-blue-500 hover:bg-blue-700 text-black hover:text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg btn"
                        >
                            {addedToCart ? '✓ Agregado al Carrito' : '🛒 Agregar al Carrito'}
                        </button>
                        <NavLink
                            to="/contacto"
                            className="bg-purple-500 hover:bg-purple-700 text-black hover:text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg btn"
                            aria-label={`Contactar para comprar ${nombre}`}
                        >
                            Contactar
                        </NavLink>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DetalleProducto;
