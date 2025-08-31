import Toallas from '../Activos/Imagenes/ImgCatalogo/Toallas-1.jpg';
import Batas from '../Activos/Imagenes/ImgCatalogo/Batas-saten-1.jpg';
import Vinchas from  '../Activos/Imagenes/ImgCatalogo/Vinchas-1.jpg';
import Pads from '../Activos/Imagenes/ImgCatalogo/Pads-1.jpeg';
import KitFacial from '../Activos/Imagenes/ImgCatalogo/Kit-limpieza-facial-1.jpeg';

// Un array de objetos que representa cada producto.
// Esto centraliza la información para usarla en todo el sitio.
export const productos = [
  {
    id: '1',
    nombre: 'Set de Toallas Premium',
    descripcion: 'Suavidad y absorción para tus clientes, ideal para spas y centros de estética.',
    imagenSrc: Toallas,
    destacado: true,
  },
  {
    id: '2',
    nombre: 'Batas Personalizadas',
    descripcion: 'El toque de lujo y exclusividad para tu establecimiento. Caricias sin fin.',
    imagenSrc: Batas,
    destacado: true,
  },
  {
    id: '3',
    nombre: 'Vinchas para Tratamientos Faciales',
    descripcion: 'Comodidad y estilo para cada sesión de belleza. Material hipoalergénico.',
    imagenSrc: Vinchas,
    destacado: false,
  },
  {
    id: '4',
    nombre: 'Pads',
    descripcion: 'Pads de limpieza facial, perfectos para tus clientes. Material hipoalergénico.',
    imagenSrc: Pads,
    destacado: false,
  },
  {
    id: '5',
    nombre: 'Kit de Limpieza Facial',
    descripcion: 'Kit de limpieza facial. Material hipoalergénico.',
    imagenSrc: KitFacial,
    destacado: true,
  },
];
