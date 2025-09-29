import Toallas from '../Activos/Imagenes/ImgCatalogo/Toallas-1.jpg';
import Toallas2 from '../Activos/Imagenes/ImgCatalogo/Toallas-2.jpg';
import Toallas3 from '../Activos/Imagenes/ImgCatalogo/Toallas-3.jpeg';

import Batas from '../Activos/Imagenes/ImgCatalogo/Batas/Batas-saten-1.jpg';
import Batas2 from '../Activos/Imagenes/ImgCatalogo/Batas/Batas-saten-2.jpeg';
import Batas3 from '../Activos/Imagenes/ImgCatalogo/Batas/Batas-saten-3.jpg';
import Batas4 from '../Activos/Imagenes/ImgCatalogo/Batas/Batas-saten-4.jpg';

import BatasPlush from '../Activos/Imagenes/ImgCatalogo/Batas/Batas-plush.jpeg';
import BatasPlush2 from '../Activos/Imagenes/ImgCatalogo/Batas/Batas-plush-2.jpg';

import Vinchas from '../Activos/Imagenes/ImgCatalogo/Vinchas-1.jpg';
import Vinchas2 from '../Activos/Imagenes/ImgCatalogo/Vinchas-2.jpg';
import Vinchas3 from '../Activos/Imagenes/ImgCatalogo/Vinchas-3.jpg';

import Pads from '../Activos/Imagenes/ImgCatalogo/Pads/Pads-1.jpeg';
import Pads2 from '../Activos/Imagenes/ImgCatalogo/Pads/Pads-2.jpeg';
import Pads3 from '../Activos/Imagenes/ImgCatalogo/Pads/Pads-3.jpg';

import KitFacial from '../Activos/Imagenes/ImgCatalogo/KitFacial/Kit-limpieza-facial-1.jpeg';
import kitFacial2 from '../Activos/Imagenes/ImgCatalogo/KitFacial/Kit-limpieza-facial-2.jpeg';
import kitFacial3 from '../Activos/Imagenes/ImgCatalogo/KitFacial/Kit-limpieza-facial-3.jpeg';
import kitFacial4 from '../Activos/Imagenes/ImgCatalogo/KitFacial/Kit-limpieza-facial-4.jpeg';

import Pareo from '../Activos/Imagenes/ImgCatalogo/Pareos/Pareo-1.jpg';
import Pareo2 from '../Activos/Imagenes/ImgCatalogo/Pareos/Pareo-2.jpg';
import Pareo3 from '../Activos/Imagenes/ImgCatalogo/Pareos/Pareo-3.jpg';
import Pareo4 from '../Activos/Imagenes/ImgCatalogo/Pareos/Pareo-4.png';

import ConjuntoCamilla from '../Activos/Imagenes/ImgCatalogo/ConjuntoCamilla/sabanas-camilla-1.jpeg';
import ConjuntoCamilla2 from '../Activos/Imagenes/ImgCatalogo/ConjuntoCamilla/sabanas-camilla-2.jpeg';
import ConjuntoCamilla3 from '../Activos/Imagenes/ImgCatalogo/ConjuntoCamilla/sabanas-camilla-3.jpeg';

import Turbantes from '../Activos/Imagenes/ImgCatalogo/Turbante/Turbante.jpeg';
import Turbantes2 from '../Activos/Imagenes/ImgCatalogo/Turbante/Turbante-2.jpeg';
import Turbantes3 from '../Activos/Imagenes/ImgCatalogo/Turbante/Turbante-3.jpg';

import ToteBag from '../Activos/Imagenes/ImgCatalogo/ToteBag/tote-bag-2.png';
import ToteBag2 from '../Activos/Imagenes/ImgCatalogo/ToteBag/tote-bag.jpg';

import Neceser from '../Activos/Imagenes/ImgCatalogo/Neceser/neceser.jpg';
import Neceser2 from '../Activos/Imagenes/ImgCatalogo/Neceser/neceser-2.png';


export const productos = [
  {
    id: '1',
    nombre: 'Set Toallas para Manos Premium',
    descripcion: 'Suavidad y absorción para tus clientes, ideal para spas y centros de estética.',
    descripcionCompleta: 'Nuestro set de toallas premium está confeccionado con 100% algodón de alta calidad. Ofrece una suavidad inigualable y una absorción superior, ideal para el uso profesional en spas, salones de belleza y centros de estética. Son duraderas, de fácil lavado y mantienen su textura después de múltiples ciclos de uso.',
    imagenSrc: Toallas,
    destacado: false,
    categoria: 'Blanquería para Estética',
    material: '100% Algodón',
    tamanos: ['(40x30cm)'],
    colores: ['Blanco'],
    personalizable: true,
    precio: 68000,
    cantidadUnidades: 12,
    imagenes: [
      { src: Toallas, alt: 'Set de Toallas Premium' },
      { src: Toallas2, alt: 'Toalla' },
      { src: Toallas3, alt: 'Toalla' }
    ],
  },
  {
    id: '2',
    nombre: 'Batas Beauty',
    descripcion: 'El toque de lujo y exclusividad para tu establecimiento. Beautiful.',
    descripcionCompleta: 'Estas batas de satén no solo son elegantes, sino que también son increíblemente cómodas. Pueden ser personalizadas con el logo de tu establecimiento, lo que las convierte en algo perfecto! o en un regalo de lujo para tus clientes más exclusivos. Su tejido ligero y suave proporciona una experiencia de máximo confort.',
    imagenSrc: Batas3,
    destacado: true,
    categoria: 'Blanquería para Estética',
    material: 'Satén de seda',
    tamanos: ['standard', 'Especial'],
    colores: ['Blanco', 'Negro', 'Marfil', 'Champagne'],
    personalizable: true,
    precio: 87000,
    cantidadUnidades: 2,
    imagenes: [
      { src: Batas3, alt: 'Batas Personalizadas' },
      { src: Batas, alt: 'Batas Personalizadas' },
      { src: Batas2, alt: 'Batas de satén en uso' },
      { src: Batas4, alt: 'Batas Personalizadas' },
      
    ],
  },
  {
    id: '3',
    nombre: 'Vinchas para Tratamientos Faciales',
    descripcion: 'Comodidad y estilo para cada sesión de belleza. Material hipoalergénico.',
    descripcionCompleta: 'Fabricadas con plush suave e hipoalergénica, estas vinchas están diseñadas para mantener el cabello alejado del rostro durante cualquier tratamiento facial o de maquillaje. Son elásticas, no aprietan y se adaptan a cualquier tamaño de cabeza, garantizando la comodidad de tus clientes durante toda la sesión.',
    imagenSrc: Vinchas,
    destacado: false,
    categoria: 'Blanquería para Estética',
    material: 'Plush',
    tamanos: ['Único'],
    colores: ['Blanco', 'Negro', 'Verde Inglés'],
    personalizable: true,
    precio: 66000,
    cantidadUnidades: 12,
    imagenes: [
      { src: Vinchas, alt: 'Vinchas para Tratamientos Faciales' },
      { src: Vinchas2, alt: 'Vinchas ' },
      { src: Vinchas3, alt: 'Vinchas ' }
    ],
  },
  {
    id: '4',
    nombre: 'Pads',
    descripcion: 'Pads de limpieza facial, perfectos para tus clientes. Material hipoalergénico.',
    descripcionCompleta: 'Nuestros pads de limpieza facial reutilizables son la alternativa sostenible a los discos de algodón desechables. Hechos de un material ultra suave, eliminan el maquillaje y las impurezas de manera efectiva y delicada. Ideales para el cuidado diario de la piel y el uso profesional en salones de belleza.',
    imagenSrc: Pads,
    destacado: false,
    categoria: 'Blanquería para Estética',
    material: 'plush y toalla',
    tamanos: ['Único'],
    colores: ['Varios'],
    personalizable: false,
    precio: 36000,
    cantidadUnidades: 12,
    imagenes: [
      { src: Pads, alt: 'Pads de limpieza facial' },
      { src: Pads2, alt: 'Paquetes de pads' },
      { src: Pads3, alt: 'Paquetes de pads' }
    ],
  },
  {
    id: '5',
    nombre: 'Kit de Limpieza Facial',
    descripcion: 'Kit de limpieza facial. Material hipoalergénico.',
    descripcionCompleta: 'El kit de limpieza facial es un conjunto completo para un cuidado de la piel profundo. Incluye una vincha, toalla facial y pads, todo fabricado con materiales hipoalergénicos de la más alta calidad para asegurar una limpieza suave pero efectiva. Perfecto para rituales de spa en casa o como un detalle de bienvenida para tus clientes.(6 Toallas de manos, 6 Vinchas, 12 Pads)',
    imagenSrc: KitFacial,
    destacado: true,
    categoria: 'Blanquería para Estética',
    material: 'Varios',
    tamanos: ['Único'],
    colores: ['Varios'],
    personalizable: true,
    precio: 103000,
    cantidadUnidades: 24,
    imagenes: [
      { src: KitFacial, alt: 'Kit de Limpieza Facial' },
      { src: kitFacial2, alt: 'Productos del kit' },
      { src: kitFacial3, alt: 'Productos del kit' },
      { src: kitFacial4, alt: 'Productos del kit' }
    ],
  },
  { id: '6',
    nombre: 'Pareos',
    descripcion: 'Pareos caricias sin fin. Material hipoalergénico.',
    descripcionCompleta: 'Pareos caricias sin fin para tratamientos corporales. suaves y ergonomicos, ideal para el uso profesional en salones de belleza y centros de estética.',
    imagenSrc: Pareo,
    destacado: true,
    categoria: 'Blanquería para Estética',
    material: 'plush',
    tamanos: ['Único'],
    colores: ['Negro, Blanco, Verde Inglés, Rosa, Natural'],
    personalizable: true,
    precio: 56000,
    cantidadUnidades: 2,
    imagenes: [
      { src: Pareo, alt: 'Pareos' },
      { src: Pareo2, alt: 'Pareos' },
      { src: Pareo3, alt: 'Pareos' },
      { src: Pareo4, alt: 'Pareos' }, 
    ],

  },
  {
    id: '7',
    nombre: 'Conjunto para Camilla',
    descripcion: 'Sabana más Funda de Almohada.',
    descripcionCompleta: 'Diseñados para un entorno profesional y de confort. Ideal para el uso profesional en Salones de Belleza, Centros de Estética y Spas.',
    imagenSrc: ConjuntoCamilla,
    destacado: false,
    categoria: 'Blanquería para Estética',
    material: 'Microfibra',
    tamanos: ['2x1.20m', '2.40x1.20m'],
    colores: ['Blanco'],
    personalizable: true,
    precio: 26000,
    cantidadUnidades: 1,
    imagenes: [
      { src: ConjuntoCamilla, alt: 'Conjunto para Camilla' },
      { src: ConjuntoCamilla2, alt: 'conjunto para camilla' },
      { src: ConjuntoCamilla3, alt: 'conjunto para camilla' },
    ],
  },
  {
    id: '8',
    nombre: 'Turbantes',
    descripcion: 'Toalla Turbante.',
    descripcionCompleta: ' Envuelve delicadamente el cabello, reduciendo el tiempo de secado y minimizando el frizz sin necesidad de fricción. Ideal para el uso post-tratamiento capilar, facial o corporal, nuestro turbante ofrece una solución confortable que eleva la experiencia del cliente.',
    imagenSrc: Turbantes,
    destacado: false,
    categoria: 'Blanquería para Estética',
    material: '100% algodón',
    tamanos: ['Único'],
    colores: ['Varios'],
    personalizable: true,
    precio: 60000,
    cantidadUnidades: 4,
    imagenes: [
      { src: Turbantes, alt: 'Toalla Turbante' },
      { src: Turbantes2, alt: 'Toalla Turbante' },
      { src: Turbantes3, alt: 'Toalla Turbante' },
    ],
  },
  {
    id: '9',
    nombre: 'Batas Caricias sin fin',
    descripcion: 'Batas Caricias Sin Fin. Donde el bienestar se siente, y el lujo se vive.',
    descripcionCompleta: 'Diseñadas para ofrecer una sensación de calidez y ligereza, son el complemento perfecto para relajar los sentidos antes y después de cada tratamiento. Permita que sus clientes experimenten la sublime suavidad que prolonga la serenidad y eleva el estándar de confort..',
    imagenSrc: BatasPlush,
    destacado: false,
    categoria: 'Blanquería para Estética',
    material: 'plush',
    tamanos: ['Único'],
    colores: ['Blanco'],
    personalizable: true,
    precio: 90000,
    cantidadUnidades: 2,
    imagenes: [
      { src: BatasPlush, alt: 'Batas Caricias sin fin' },
      { src: BatasPlush2, alt: 'Batas Caricias sin fin' },
    ],
  },
  {
    id: '10',
    nombre: 'Tote Bag Playera',
    descripcion: 'Descubre el equilibrio perfecto entre estilo, resistencia y funcionalidad con nuestro Tote Bag.',
    descripcionCompleta: 'Confeccionado en lienzo premium de alta durabilidad, este bolso está diseñado para acompañarte en tu día a día ',
    imagenSrc: ToteBag,
    destacado: false,
    categoria: 'Blanquería para Estética',
    material: 'Lienzo Premium',
    tamanos: ['Único'],
    colores: ['Natural'],
    personalizable: true,
    precio: 17000,
    cantidadUnidades: 10,
    imagenes: [
      { src: ToteBag, alt: 'Tote Bag Playera' },
      { src: ToteBag2, alt: 'Tote Bag Playera' },
    ],
  },
  {
    id: '11',
    nombre: 'Neceser',
    descripcion: 'Eleva tu rutina de belleza con nuestro Neceser Porta Cosméticos.',
    descripcionCompleta: 'Confeccionado en material Nido de Abeja (Waffle) de alta calidad, Elegancia natural. El detalle de spa que tus cosméticos merecen.',
    imagenSrc: Neceser2,
    destacado: false,
    categoria: 'Blanquería para Estética',
    material: 'Nido de Abeja',
    tamanos: ['Único'],
    colores: ['Blanco'],
    personalizable: true,
    precio: 8000,
    cantidadUnidades: 12,
    imagenes: [
      { src: Neceser, alt: 'Neceser Porta Cosméticos' },
      { src: Neceser2, alt: 'Neceser Porta Cosméticos' },
    ],

  }
];






