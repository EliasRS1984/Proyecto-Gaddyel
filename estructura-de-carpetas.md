src/
├── Componentes/              // Aquí irán todos nuestros componentes reutilizables y específicos de la UI
│   ├── Layout/               // Componentes para la estructura general de la página (Header, Footer)
│   │   ├── Encabezado/       // Carpeta para el componente de Encabezado/Navegación
│   │   │   └── Encabezado.jsx
│   │   │   └── Navegacion.jsx // Opcional, si separamos la navegación
│   │   └── PieDePagina/
│   │       └── PieDePagina.jsx
│   ├── UI/                   // Componentes de interfaz de usuario genéricos (Botones, Carruseles, Inputs)
│   │   ├── Boton/
│   │   │   └── Boton.jsx
│   │   ├── Carrusel/
│   │   │   └── Carrusel.jsx
│   │   └── Modal/
│   │       └── Modal.jsx
│   ├── TarjetaProducto/      // Componente para mostrar un producto individual
│   │   └── TarjetaProducto.jsx
│   ├── Secciones/            // Componentes que representan secciones completas de una página
│   │   ├── SeccionBienvenida/
│   │   │   └── SeccionBienvenida.jsx
│   │   ├── SeccionProceso/
│   │   │   └── SeccionProceso.jsx
│   │   └── SeccionTestimonios/
│   │       └── SeccionTestimonios.jsx
│   └── Comunes/              // Componentes pequeños y reutilizables en muchos lugares (Iconos, Cargas)
│       └── Cargando.jsx
├── Paginas/                  // Aquí irán los componentes que representan páginas completas
│   ├── Inicio.jsx            // Página de inicio
│   ├── Catalogo.jsx          // Página del catálogo de productos
│   ├── DetalleProducto.jsx   // Página de detalle de un producto
│   ├── Contacto.jsx
│   └── SobreNosotros.jsx
├── Hooks/                    // Hooks personalizados si necesitamos lógica reutilizable
│   └── useScroll.js
├── Utilidades/               // Funciones de utilidad que no son componentes (formateo, validación)
│   └── formatearPrecios.js
├── Estilos/                  // Archivos CSS adicionales si fueran necesarios (aunque usaremos Tailwind)
│   └── variables.css         // Ejemplo si hubieran variables CSS
├── Activos/                  // Imágenes, íconos, videos (aquí irá tu logo de Gaddyel)
│   ├── imagenes/
│   ├── iconos/
│   └── videos/
├── main.jsx                  // Punto de entrada de React
├── App.jsx                   // Componente principal que coordina las páginas/rutas
└── index.css                 // Archivo CSS principal con directivas de Tailwind