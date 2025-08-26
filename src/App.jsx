// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importamos nuestros componentes de diseño
import Encabezado from './Componentes/Layout/Encabezado/Encabezado.jsx';
import PieDePagina from './Componentes/Layout/PieDePagina/PieDePagina.jsx'; // ¡Importamos el PieDePagina!

// Importamos los componentes de nuestras páginas
import Inicio from './Paginas/Inicio.jsx';
import Catalogo from './Paginas/Catalogo.jsx';
import NuestroProceso from './Paginas/NuestroProceso.jsx';
import SobreGaddyel from './Paginas/SobreGaddyel.jsx';
import Galeria from './Paginas/Galeria.jsx';
import Contacto from './Paginas/Contacto.jsx';
// También creamos placeholders para páginas legales
import PoliticaPrivacidad from './Paginas/PoliticaPrivacidad.jsx'; // Crear este archivo
import TerminosServicio from './Paginas/TerminosServicio.jsx';   // Crear este archivo


function App() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* El Encabezado se renderiza siempre */}
      <Encabezado />

      {/* Aquí definimos las rutas de nuestra aplicación */}
      <main className="flex-grow p-4 md:p-8 overflow-hidden">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/nuestro-proceso" element={<NuestroProceso />} />
          <Route path="/sobre-gaddyel" element={<SobreGaddyel />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/contacto" element={<Contacto />} />
          {/* Rutas para las páginas legales */}
          <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
          <Route path="/terminos-servicio" element={<TerminosServicio />} />
          <Route path="*" element={<h1 className="text-center text-3xl font-bold mt-20">404 - Página no encontrada</h1>} />
        </Routes>
      </main>

      {/* El Pie de Página se renderiza siempre */}
      <PieDePagina />
    </div>
  );
}

export default App;
