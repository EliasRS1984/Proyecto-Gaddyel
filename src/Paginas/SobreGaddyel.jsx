import React from 'react';
import { Helmet } from 'react-helmet-async';
import ScrollReveal from '../Componentes/Layout/ScrollReveal/ScrollReveal';
import { NavLink } from 'react-router-dom';

const SobreGaddyel = () => {
  return (
    <>
      <Helmet>
        <title>Quiénes Somos | Gaddyel - Blanquería Premium para Profesionales de la Estética</title>
        <meta 
          name="description" 
          content="Gaddyel es tu aliado en elevar la identidad de marca de tu centro estético. Más de X años ofreciendo blanquería personalizada de calidad con atención a detalle." 
        />
        <meta
          name="keywords"
          content="quiénes somos, blanquería premium, marca estética, personalización textiles, gaddyel"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://gaddyel.vercel.app/nosotros" />
        <meta property="og:title" content="Quiénes Somos - Gaddyel Blanquería Personalizada" />
        <meta property="og:description" content="La historia detrás de Gaddyel: pasión por la calidad y el detalle." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gaddyel.vercel.app/nosotros" />
      </Helmet>

      <div className="w-full min-h-screen bg-transparent">
        <article className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12 py-16 pt-24">

          {/* ===== HERO DE ARTÍCULO ===== */}
          {/* Mismo glassmorphism y estructura de píldora que Inicio y Catálogo */}
          <ScrollReveal>
            <header className="
              text-center mb-10
              px-8 py-12 md:px-12 md:py-16
              bg-white/80 dark:bg-slate-900/80
              backdrop-blur-xl
              border border-slate-200/50 dark:border-slate-800/50
              rounded-2xl shadow-xl
            ">
              <span className="
                inline-flex items-center mb-5
                text-[11px] font-semibold tracking-[0.15em] uppercase
                text-indigo-700 dark:text-indigo-400
                bg-indigo-50 dark:bg-indigo-950/60
                border border-indigo-200/60 dark:border-indigo-800/60
                px-4 py-1.5 rounded-full
              ">
                Nuestra Historia · Nuestra Misión
              </span>

              <h1 className="
                italic text-5xl md:text-6xl font-extrabold tracking-tight
                text-slate-800 dark:text-slate-100
                leading-tight mb-5
              ">
                Sobre{' '}
                <span className="text-indigo-700 dark:text-indigo-400">Gaddyel</span>
              </h1>

              <p className="
                text-[16px] md:text-[17px] font-medium tracking-tight
                text-slate-500 dark:text-slate-400
                max-w-2xl mx-auto leading-relaxed
              ">
                Donde tu marca se vuelve parte de la experiencia que tus clientes recuerdan.
              </p>
            </header>
          </ScrollReveal>

          {/* ===== SECCIÓN 1: Posicionamiento ===== */}
          {/* Usa borde izquierdo en indigo como acento de marca, no purple */}
          <ScrollReveal>
            <section className="
              mb-8
              p-8 md:p-10
              bg-white/80 dark:bg-slate-900/80
              backdrop-blur-xl
              border border-slate-200/50 dark:border-slate-800/50
              rounded-2xl shadow-lg
              transition-all duration-500 ease-out
              hover:shadow-xl hover:border-indigo-200/60 dark:hover:border-indigo-800/60
            ">
              {/* Etiqueta de sección — identifica el argumento central */}
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-indigo-600 dark:text-indigo-400 mb-4">
                Nuestra propuesta
              </p>
              <h2 className="
                text-2xl md:text-3xl font-bold tracking-tight
                text-slate-900 dark:text-slate-100
                mb-5 border-l-4 border-indigo-500 dark:border-indigo-400 pl-5
              ">
                Más que productos, creamos herramientas de fidelización
              </h2>
              <p className="text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed">
                En el mundo de la estética, la excelencia no solo se siente, se recuerda. En Gaddyel, entendemos que tu negocio no solo vende tratamientos; vende experiencias. Por eso, nuestros productos son{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-100">herramientas de marketing sensorial</span>
                {' '}diseñadas para que cada sesión sea impecable y tu marca sea la única que el cliente quiera recordar.
              </p>
            </section>
          </ScrollReveal>

          {/* ===== SECCIÓN 2: Propuesta de valor ===== */}
          <ScrollReveal>
            <section className="
              mb-8
              p-8 md:p-10
              bg-slate-50/80 dark:bg-slate-800/70
              backdrop-blur-xl
              border border-slate-200/50 dark:border-slate-700/50
              rounded-2xl shadow-lg
              transition-all duration-500 ease-out
              hover:shadow-xl hover:border-indigo-200/60 dark:hover:border-indigo-800/60
            ">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-indigo-600 dark:text-indigo-400 mb-4">
                Impacto en tu negocio
              </p>
              <h2 className="
                text-2xl md:text-3xl font-bold tracking-tight
                text-slate-900 dark:text-slate-100
                mb-5 border-l-4 border-indigo-500 dark:border-indigo-400 pl-5
              ">
                Eleva la percepción de tu servicio
              </h2>
              <p className="text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed">
                La elección de tus insumos es la carta de presentación de tu profesionalismo. Al integrar Gaddyel en tu cabina, transformas un servicio estándar en una experiencia memorable. No se trata solo de calidad; se trata de{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-100">posicionar tu marca</span>
                {' '}ante los ojos de quien más importa. Cada detalle personalizado comunica compromiso, coherencia y distinción.
              </p>
            </section>
          </ScrollReveal>

          {/* ===== SECCIÓN 3: Marketing sensorial + Cita de marca ===== */}
          <ScrollReveal>
            <section className="
              mb-8
              p-8 md:p-10
              bg-white/80 dark:bg-slate-900/80
              backdrop-blur-xl
              border border-slate-200/50 dark:border-slate-800/50
              rounded-2xl shadow-lg
              transition-all duration-500 ease-out
              hover:shadow-xl hover:border-indigo-200/60 dark:hover:border-indigo-800/60
            ">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-indigo-600 dark:text-indigo-400 mb-4">
                El efecto Gaddyel
              </p>
              <h2 className="
                text-2xl md:text-3xl font-bold tracking-tight
                text-slate-900 dark:text-slate-100
                mb-5 border-l-4 border-indigo-500 dark:border-indigo-400 pl-5
              ">
                Cada sesión, una acción de marketing
              </h2>
              <p className="text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed mb-7">
                La mejor publicidad es la que tus clientes llevan consigo. Un detalle personalizado bien ejecutado es una{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-100">acción de marketing de alto impacto</span>
                {' '}que no requiere presupuesto en medios. Cuando un cliente siente la distinción, no solo regresa: recomienda.
              </p>

              {/* Cita de marca — tratamiento tipográfico premium */}
              <blockquote className="
                pl-6
                border-l-4 border-indigo-400/60 dark:border-indigo-600/60
                italic
                text-[15px] font-medium tracking-tight
                text-slate-600 dark:text-slate-400
                leading-relaxed
              ">
                "No solo fabricamos productos; diseñamos el sello de identidad que hace que tu marca sea la que eligen volver a vivir."
              </blockquote>
            </section>
          </ScrollReveal>

          {/* ===== DIFERENCIADORES REALES — Tags de ADN ===== */}
          {/* Igual que los tags del Hero de Inicio: concretos, no aplican a ningún otro */}
          <ScrollReveal>
            <section className="
              mb-10
              p-8 md:p-10
              bg-indigo-50/60 dark:bg-indigo-950/30
              backdrop-blur-xl
              border border-indigo-200/50 dark:border-indigo-800/40
              rounded-2xl shadow-lg
            ">
              <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-indigo-600 dark:text-indigo-400 mb-6">
                Por qué elegirnos
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { valor: 'Desde 12 unidades', detalle: 'Personalización accesible para negocios en crecimiento' },
                  { valor: 'Bordado con tu logo', detalle: 'Técnica industrial aplicada a cada pieza' },
                  { valor: 'Envíos a todo el país', detalle: 'Llegamos a tu centro sin importar la ciudad' },
                ].map(({ valor, detalle }) => (
                  <div key={valor} className="
                    p-5
                    bg-white/70 dark:bg-slate-900/70
                    border border-indigo-200/40 dark:border-indigo-800/40
                    rounded-2xl
                  ">
                    <p className="text-[14px] font-bold tracking-tight text-indigo-700 dark:text-indigo-400 mb-1">{valor}</p>
                    <p className="text-[13px] font-medium tracking-tight text-slate-600 dark:text-slate-400">{detalle}</p>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* ===== CTA FINAL ===== */}
          <ScrollReveal>
            <footer className="
              text-center
              px-8 py-12
              bg-white/80 dark:bg-slate-900/80
              backdrop-blur-xl
              border border-slate-200/50 dark:border-slate-800/50
              rounded-2xl shadow-xl
            ">
              <p className="
                text-[15px] font-medium tracking-tight
                text-slate-600 dark:text-slate-400
                max-w-xl mx-auto leading-relaxed mb-8
              ">
                Descubrí cómo Gaddyel puede transformar la identidad visual de tu centro en una experiencia que los clientes eligen repetir.
              </p>
              <NavLink
                to="/catalogo"
                className="
                  inline-block
                  font-semibold tracking-tight
                  bg-indigo-600 hover:bg-indigo-700
                  dark:bg-indigo-500 dark:hover:bg-indigo-600
                  text-white
                  py-3 px-8
                  rounded-full
                  transition-all duration-500 ease-out
                  hover:scale-105
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                  shadow-lg hover:shadow-xl
                "
              >
                Explorar el catálogo
              </NavLink>
            </footer>
          </ScrollReveal>

        </article>
      </div>
    </>
  );
};

export default SobreGaddyel;
