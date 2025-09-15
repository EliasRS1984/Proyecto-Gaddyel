import React from 'react';
import ScrollReveal from '../Componentes/Layout/ScrollReveal/ScrollReveal';

const SobreGaddyel = () => {
  return (
    // Contenedor principal de la página con un fondo suave
    <div className="container mx-auto px-4 py-16 pt-24 min-h-screen bg-[#EEEEEE] font-sans">
      <article className="max-w-4xl mx-auto text-gray-800">

        {/* Sección Principal del Artículo - Título */}
        {/* CORRECCIÓN: Fondo más oscuro y texto blanco para más contraste y presencia */}
        <section className="text-center mb-12 py-12 bg-[#E7D3D3] rounded-xl shadow-2xl">
          <h1 className="italic text-6xl font-extrabold text-gray-700 text-decoration-line: underline leading-tight tracking-wide">
            Gaddyel
          </h1>
          <p className="mt-4 text-xl text-gray-700 font-medium">
            En el mundo de la estética y el cuidado personal, los detalles definen la excelencia.
          </p>
        </section>

        {/* Capítulo 1: La Base de la Excelencia */}
        <ScrollReveal>
          <section className="mb-10 p-8 rounded-xl shadow-md bg-white">
            <h2 className="text-3xl font-bold text-gray-700 mt-8 mb-4 border-l-4 border-[#B9375D] pl-4">
              Productos Indispensables para un Tratamiento de Distinción
            </h2>
            <p className="text-lg leading-relaxed">
              Cada producto Gaddyel está formulado para ser un pilar en tu práctica diaria. Entendemos que en el salón, clínica o spa, cada paso del tratamiento debe ser impecable. Por eso, nuestros productos no son un simple complemento, son <span className="font-bold text-[#D25D5D]">herramientas de precisión</span> diseñadas para maximizar la eficacia y el resultado de cada sesión. Desde la preparación de la piel hasta el cuidado post-tratamiento, nuestra línea asegura que tu trabajo sea consistente, confiable y, sobre todo, <span className="font-bold text-[#D25D5D]">excepcional</span>.
            </p>
          </section>
        </ScrollReveal>
        {/* Capítulo 2: La Marca que Habla por Ti */}
        <section className="mb-10 p-8 rounded-xl shadow-md bg-[#E7D3D3]">
          <h2 className="text-3xl font-bold text-gray-700 mt-8 mb-4 border-l-4 border-[#B9375D] pl-4">
            Un Sello de Distinción y Profesionalismo
          </h2>
          <p className="text-lg leading-relaxed">
            La elección de tus productos dice mucho sobre la calidad de tu servicio.  Al integrar los productos Gaddyel en tu cabina, no solo estás utilizando ingredientes de alta calidad, estás elevando la percepción de tu marca. Nuestros empaques elegantes y la reputación de nuestra marca se convierten en un <span className="font-bold text-[#D25D5D]">sello de distinción</span> que tus clientes notarán y apreciarán. Es un reflejo de tu compromiso con la calidad y la innovación en tu campo.
          </p>
        </section>

        {/* Capítulo 3: Publicidad a Través de la Excelencia */}
        <ScrollReveal>
          <section className="mb-10 p-8 rounded-xl shadow-md bg-white">
            <h2 className="text-3xl font-bold text-gray-700 mt-8 mb-4 border-l-4 border-[#B9375D] pl-4">
              Tu Mejor Publicidad: Los Resultados y la Experiencia
            </h2>
            <p className="text-lg leading-relaxed">
              En un mercado saturado, la publicidad más efectiva es el boca a boca. Cuando tus clientes ven y sienten los resultados superiores de un tratamiento con productos Gaddyel, se convierten en tus embajadores de marca más fieles. Ellos no solo regresarán, sino que recomendarán tus servicios a sus conocidos, creando un <span className="font-bold text-[#D25D5D]">ciclo de crecimiento orgánico y confiable</span>. Cada tratamiento exitoso con un producto Gaddyel es una inversión en la reputación y el crecimiento sostenible de tu negocio.
            </p>
            <blockquote className="mt-6 p-4 border-l-4 border-gray-400 italic text-gray-600">
              "En Gaddyel, creemos que la calidad de un producto es la mejor herramienta de marketing. Permítenos ser parte de tu historia de éxito."
            </blockquote>
          </section>
        </ScrollReveal>
        {/* Botón "Ver Catálogo" con estilo */}
        <footer className="text-center text-sm text-gray-500 mt-12 py-8 bg-[#E7D3D3] rounded-xl shadow-md">
          <p className="text-gray-700 mb-4">Explora nuestra línea de productos y descubre cómo Gaddyel puede transformar tu práctica profesional.</p>
          <a href="/catalogo" className="inline-block px-8 py-3 text-white font-semibold bg-[#B9375D] rounded-full shadow-lg hover:bg-[#D25D5D] transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#B9375D] focus:ring-opacity-50">
            Ver Catálogo
          </a>
        </footer>

      </article>
    </div>
  );
};

export default SobreGaddyel;
