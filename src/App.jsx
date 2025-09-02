import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Inicio from './Paginas/Inicio';
import Catalogo from './Paginas/Catalogo';
import SobreNosotros from './Paginas/SobreGaddyel';
import Contacto from './Paginas/Contacto';
import PieDePagina from './Componentes/Layout/PieDePagina/PieDePagina';

// La importación de DetalleProducto estaba causando el error. 
// Aquí está la ruta correcta.
import DetalleProducto from './Paginas/DetalleProducto'; 

import LogoGaddyel from './Activos/Imagenes/Logo-Gaddyel.png';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen font-sans">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-4 transition-all duration-300">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <NavLink to="/" className="flex-shrink-0">
              <img src={LogoGaddyel} alt="Logo de Gaddyel" className="h-16" />
            </NavLink>
            <nav className="flex space-x-4 md:space-x-8">
              <NavLink to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Inicio
              </NavLink>
              <NavLink to="/catalogo" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Catálogo
              </NavLink>
              <NavLink to="/nosotros" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Nosotros
              </NavLink>
              <NavLink to="/contacto" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Contacto
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/nosotros" element={<SobreNosotros />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/catalogo/:id" element={<DetalleProducto />} />
          </Routes>
        </main>
        <PieDePagina />
      </div>
    </Router>
  );
};

export default App;






