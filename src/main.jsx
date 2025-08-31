import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Importa los estilos de Tailwind CSS.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ¡Importante! Aquí solo renderizamos el componente App */}
    {/* El BrowserRouter debe estar dentro de App, no aquí */}
    <App />
  </React.StrictMode>,
);