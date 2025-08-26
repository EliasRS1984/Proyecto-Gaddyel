import React from "react";

// Este será el componente base para mostrar una tarjeta de producto de Gaddyel
const TarjetaProducto = () => {
  return (
    <div className="border border-gray-200 p-6 rounded-xl shadow-lg bg-white"> {/* Clases Tailwind aquí */}
      {/* Aquí irá el contenido de una tarjeta de producto, como imagen, nombre, etc. */}
      {/* Por ahora, está vacío, listo para ser construido. */}
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Nombre del Producto de Gaddyel</h3>
      <p className="text-gray-600 text-lg">Breve descripción del producto.</p>
    </div>
  );
}

export default TarjetaProducto;
