import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import TarjetaProducto from '../Componentes/TarjetaProducto/TarjetaProducto.jsx';
import { obtenerProductos } from '../Servicios/productosService';

const Catalogo = () => {
    const [productosCatalogo, setProductosCatalogo] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await obtenerProductos();
                setProductosCatalogo(data);
            } catch (err) {
                console.error("Error cargando productos:", err);
            } finally {
                setCargando(false);
            }
        };
        fetchData();
    }, []);

    return (
        <>
            <Helmet>
                <title>Catálogo de Productos - Gaddyel</title>
            </Helmet>

            <div className="container mx-auto p-4 md:p-8">

                {cargando ? (
                    <p className="text-center text-gray-600">Cargando productos...</p>
                ) : productosCatalogo.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {productosCatalogo.map(producto => (
                            <TarjetaProducto key={producto._id} producto={producto} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600">No hay productos disponibles.</p>
                )}
            </div>
        </>
    );
};

export default Catalogo;

