import React from 'react';
import { Helmet } from 'react-helmet-async';
import ScrollReveal from '../Componentes/Layout/ScrollReveal/ScrollReveal';
import { NavLink } from 'react-router-dom';

const SobreGaddyel = () => {
  return (
    <>
      <Helmet>
        <title>Sobre Gaddyel - Nuestra Historia</title>
        <meta name="description" content="Conoce la historia de Gaddyel, compromiso con la calidad y distinción en blanquería personalizada." />
      </Helmet>

      <div className="w-full min-h-screen bg-white font-sans">
        <article className="max-w-4xl mx-auto px-4 md:px-8 py-16 pt-24">

          {/* SECCIÓN HERO - Título Principal */}
          <ScrollReveal>
            <section className="text-center mb-16 py-16">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Gaddyel
              </h1>
              <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
                En el mundo de la estética y el cuidado personal, los detalles definen la excelencia.
              </p>
            </section>
          </ScrollReveal>

          {/* SECCIÓN 1: La Base de la Excelencia */}
          <ScrollReveal>
            <section className="mb-16 p-8 md:p-10 rounded-lg bg-gray-50 border border-gray-200">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 border-l-4 border-purple-500 pl-6">
                Productos Indispensables para un Tratamiento de Distinción
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Cada producto Gaddyel está formulado para ser un pilar en tu práctica diaria. Entendemos que en el salón, clínica o spa, cada paso del tratamiento debe ser impecable. Por eso, nuestros productos no son un simple complemento, son <span className="font-semibold text-gray-900">herramientas de precisión</span> diseñadas para maximizar la eficacia y el resultado de cada sesión. Desde la preparación de la piel hasta el cuidado post-tratamiento, nuestra línea asegura que tu trabajo sea consistente, confiable y, sobre todo, <span className="font-semibold text-gray-900">excepcional</span>.
              </p>
            </section>
          </ScrollReveal>

          {/* SECCIÓN 2: Un Sello de Distinción */}
          <ScrollReveal>
            <section className="mb-16 p-8 md:p-10 rounded-lg bg-white border border-gray-200">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 border-l-4 border-purple-500 pl-6">
                Un Sello de Distinción y Profesionalismo
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                La elección de tus productos dice mucho sobre la calidad de tu servicio. Al integrar los productos Gaddyel en tu cabina, no solo estás utilizando ingredientes de alta calidad, estás elevando la percepción de tu marca. Nuestros empaques elegantes y la reputación de nuestra marca se convierten en un <span className="font-semibold text-gray-900">sello de distinción</span> que tus clientes notarán y apreciarán. Es un reflejo de tu compromiso con la calidad y la innovación en tu campo.
              </p>
            </section>
          </ScrollReveal>

          {/* SECCIÓN 3: Publicidad a Través de la Excelencia */}
          <ScrollReveal>
            <section className="mb-16 p-8 md:p-10 rounded-lg bg-gray-50 border border-gray-200">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 border-l-4 border-purple-500 pl-6">
                Tu Mejor Publicidad: Los Resultados y la Experiencia
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                En un mercado saturado, la publicidad más efectiva es el boca a boca. Cuando tus clientes ven y sienten los resultados superiores de un tratamiento con productos Gaddyel, se convierten en tus embajadores de marca más fieles. Ellos no solo regresarán, sino que recomendarán tus servicios a sus conocidos, creando un <span className="font-semibold text-gray-900">ciclo de crecimiento orgánico y confiable</span>. Cada tratamiento exitoso con un producto Gaddyel es una inversión en la reputación y el crecimiento sostenible de tu negocio.
              </p>
              <blockquote className="pl-6 border-l-4 border-gray-300 italic text-gray-600">
                "En Gaddyel, creemos que la calidad de un producto es la mejor herramienta de marketing. Permítenos ser parte de tu historia de éxito."
              </blockquote>
            </section>
          </ScrollReveal>

          {/* FOOTER - CTA */}
          <ScrollReveal>
            <footer className="text-center py-12">
              <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
                Explora nuestra línea de productos y descubre cómo Gaddyel puede transformar tu práctica profesional.
              </p>
              <NavLink
                to="/catalogo"
                className="inter font-bold bg-purple-500 hover:bg-purple-700 text-black hover:text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 hover:scale-105"
              >
                Ver Catálogo
              </NavLink>
            </footer>
          </ScrollReveal>

        </article>
      </div>
    </>
  );
};

export default SobreGaddyel;
