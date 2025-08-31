import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importamos los componentes de las páginas
import Inicio from './Paginas/Inicio.jsx';
import Catalogo from './Paginas/Catalogo.jsx';
import Contacto from './Paginas/Contacto.jsx';
import Producto from './Paginas/Producto.jsx';

// Importamos el componente de navegación y el footer
import Navbar from './Componentes/UI/Navbar/Navbar.jsx';
import PieDePagina from './Componentes/Layout/PieDePagina/PieDePagina.jsx'; // Importamos el componente PieDePagina

// Componente principal de la aplicación
const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/catalogo/:id" element={<Producto />} /> 
          <Route path="/contacto" element={<Contacto />} />
        </Routes>
      </main>
      <PieDePagina /> {/* Usamos el componente PieDePagina importado */}
    </BrowserRouter>
  );
};

export default App;
