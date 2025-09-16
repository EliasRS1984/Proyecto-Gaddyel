import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollTop = () => {
  // `useLocation` es un hook de React Router que devuelve el objeto de ubicación actual.
  // Con él, podemos saber cuándo ha cambiado la ruta (URL).
  const { pathname } = useLocation();

  useEffect(() => {
    // Cuando `pathname` (la ruta) cambia, esta función se ejecuta.
    // El método `window.scrollTo` mueve la ventana del navegador.
    // Le pasamos `0` para la posición X (horizontal) y `0` para la posición Y (vertical).
    window.scrollTo(0, 0);
  }, [pathname]); // El array de dependencia asegura que el efecto solo se ejecute cuando el `pathname` cambie.

  return null; // Este componente no renderiza nada en el DOM. Es solo para la lógica.
};

export default ScrollTop;