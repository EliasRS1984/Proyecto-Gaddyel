// ============================================================
// ¿QUÉ ES ESTO?
// Componente invisible que hace que cada vez que el usuario
// navega a una página distinta, la vista vuelva al tope.
//
// ¿CÓMO FUNCIONA?
// 1. Detecta cuándo cambia la URL del navegador
// 2. Automáticamente desplaza la ventana hasta arriba
// 3. No muestra nada en pantalla — es lógica pura
//
// ¿DÓNDE BUSCAR SI HAY PROBLEMAS?
// ¿La página no vuelve al tope al navegar? Verificar que
// <ScrollTop /> esté dentro de <BrowserRouter> en App.jsx
// ============================================================

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollTop = () => {
  // Detecta cuándo cambia la ruta (URL) del navegador
  const { pathname } = useLocation();

  useEffect(() => {
    // Cada vez que el usuario navega a otra página, esta línea
    // mueve la ventana de vuelta al principio de forma instantánea.
    // Usamos 'instant' para evitar que el scroll suavizado del navegador
    // interfiera con el cambio de página.
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null; // Este componente no muestra nada en pantalla
};

export default ScrollTop;