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
                Donde tu marca se vuelve inolvidable a través de los detalles que definen la excelencia.
              </p>
            </section>
          </ScrollReveal>

          {/* SECCIÓN 1: Más que productos, Soluciones */}
          <ScrollReveal>
            <section className="mb-16 p-8 md:p-10 rounded-lg bg-gray-50 border border-gray-200">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 border-l-4 border-purple-500 pl-6">
                Más que productos, creamos Herramientas de Fidelización
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                En el mundo de la estética, la excelencia no solo se siente, se recuerda. En Gaddyel, entendemos que tu negocio no solo vende tratamientos; vende experiencias. Por eso, nuestros productos son <span className="font-semibold text-gray-900">herramientas de marketing sensorial</span> diseñadas para que cada sesión sea impecable y tu marca sea la única que el cliente quiera recordar.
              </p>
            </section>
          </ScrollReveal>

          {/* SECCIÓN 2: Elevando tu Marca */}
          <ScrollReveal>
            <section className="mb-16 p-8 md:p-10 rounded-lg bg-white border border-gray-200">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 border-l-4 border-purple-500 pl-6">
                Eleva la Percepción de tu Negocio
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                La elección de tus insumos es la carta de presentación de tu profesionalismo. Al integrar Gaddyel en tu cabina, transformas un servicio estándar en una experiencia de lujo. No se trata solo de alta calidad; se trata de <span className="font-semibold text-gray-900">posicionar tu marca</span> ante los ojos del cliente. Cada detalle personalizado es un sello de distinción que comunica compromiso, innovación y exclusividad.
              </p>
            </section>
          </ScrollReveal>

          {/* SECCIÓN 3: El Poder del Marketing Sensorial */}
          <ScrollReveal>
            <section className="mb-16 p-8 md:p-10 rounded-lg bg-gray-50 border border-gray-200">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 border-l-4 border-purple-500 pl-6">
                Convierte cada Sesión en una Acción de Marketing
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Sabemos que la publicidad más poderosa es la que tus clientes llevan consigo. Muy pocos comprenden que un detalle personalizado es una <span className="font-semibold text-gray-900">acción de marketing de alto impacto</span>. Cuando un cliente siente la distinción de Gaddyel, no solo regresa: se convierte en un embajador fiel que recomienda tu éxito de manera orgánica y constante.
              </p>
              <blockquote className="pl-6 border-l-4 border-gray-300 italic text-gray-600">
                "En Gaddyel, no solo fabricamos productos; diseñamos el éxito de tu marca a través de la excelencia. Permítenos ser el aliado estratégico de tu historia."
              </blockquote>
            </section>
          </ScrollReveal>

          {/* FOOTER - CTA */}
          <ScrollReveal>
            <footer className="text-center py-12">
              <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
                Descubre cómo Gaddyel puede transformar tu práctica profesional en una herramienta de marketing imparable.
              </p>
              <NavLink
                to="/catalogo"
                className="inter font-bold bg-purple-500 hover:bg-purple-700 text-black hover:text-white py-3 px-8 rounded-full transition-all duration-300 hover:scale-105 inline-block"
              >
                Explorar Soluciones
              </NavLink>
            </footer>
          </ScrollReveal>

        </article>
      </div>
    </>
  );
};

export default SobreGaddyel;
