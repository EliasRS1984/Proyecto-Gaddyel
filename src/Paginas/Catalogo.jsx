import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { productos } from '../Datos/productos';
import TarjetaProducto from '../Componentes/TarjetaProducto/TarjetaProducto.jsx';

const Catalogo = () => {
    const [productosCatalogo, setProductosCatalogo] = useState(productos || []); // Nuevo: Estado para productos

    useEffect(() => {
        setProductosCatalogo(productos || []); // Nuevo: Actualizar si productos cambia
    }, [productos]);

    return (
        <>
            <Helmet>
                <title>Catálogo de Productos - Blanquería para Estética y Spa | Gaddyel</title>
                <meta name="description" content="Explora nuestro catálogo completo de blanquería personalizada para spas, centros de estética y hoteles. Descubre turbantes de toalla, toallas de microfibra y kits de calidad premium. Ver precios." />
            </Helmet>
            <div className="container mx-auto p-4 md:p-8">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 md:mb-12">Nuestro Catálogo Completo</h1>
                {productosCatalogo.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {productosCatalogo.map(producto => (
                            producto.id && producto.nombre && producto.imagenSrc && producto.descripcion ? (
                                <TarjetaProducto key={producto.id} producto={producto} />
                            ) : null
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 text-center text-lg">No hay productos disponibles en este momento.</p>
                )}
            </div>
        </>
    );
};

export default Catalogo;