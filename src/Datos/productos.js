import Toallas from '../Activos/Imagenes/ImgCatalogo/Toallas-1.jpg';
import Batas from '../Activos/Imagenes/ImgCatalogo/Batas-saten-1.jpg';
import Vinchas from  '../Activos/Imagenes/ImgCatalogo/Vinchas-1.jpg';
import Pads from '../Activos/Imagenes/ImgCatalogo/Pads-1.jpeg';
import KitFacial from '../Activos/Imagenes/ImgCatalogo/Kit-limpieza-facial-1.jpeg';

// Imágenes genéricas para el carrusel vertical
const imgGenerica1 = 'https://via.placeholder.com/500x700.png?text=Imagen+Adicional+1';
const imgGenerica2 = 'https://via.placeholder.com/500x700.png?text=Imagen+Adicional+2';
const imgGenerica3 = 'https://via.placeholder.com/500x700.png?text=Imagen+Adicional+3';
const imgGenerica4 = 'https://via.placeholder.com/500x700.png?text=Imagen+Adicional+4';

export const productos = [
  {
    id: '1',
    nombre: 'Set de Toallas Premium',
    descripcion: 'Suavidad y absorción para tus clientes, ideal para spas y centros de estética.',
    descripcionCompleta: 'Nuestro set de toallas premium está confeccionado con 100% algodón de alta calidad. Ofrece una suavidad inigualable y una absorción superior, ideal para el uso profesional en spas, salones de belleza y hoteles. Son duraderas, de fácil lavado y mantienen su textura después de múltiples ciclos de uso.',
    imagenSrc: Toallas,
    destacado: true,
    material: '100% Algodón',
    tamanos: ['Grande', 'Mediano', 'Pequeño'],
    colores: ['Blanco', 'Gris', 'Azul'],
    personalizable: true,
    imagenes: [
      { src: Toallas, alt: 'Set de Toallas Premium' },
      { src: imgGenerica1, alt: 'Detalle de Toalla' },
      { src: imgGenerica2, alt: 'Toalla doblada' }
    ],
  },
  {
    id: '2',
    nombre: 'Batas Personalizadas',
    descripcion: 'El toque de lujo y exclusividad para tu establecimiento. Caricias sin fin.',
    descripcionCompleta: 'Estas batas de satén no solo son elegantes, sino que también son increíblemente cómodas. Pueden ser personalizadas con el logo de tu negocio, lo que las convierte en el uniforme perfecto para tu personal o en un regalo de lujo para tus clientes más exclusivos. Su tejido ligero y suave proporciona una experiencia de máximo confort.',
    imagenSrc: Batas,
    destacado: true,
    material: 'Satén de seda',
    tamanos: ['Único'],
    colores: ['Blanco', 'Negro', 'Rosa'],
    personalizable: true,
    imagenes: [
      { src: Batas, alt: 'Batas Personalizadas' },
      { src: imgGenerica3, alt: 'Batas de satén en uso' },
    ],
  },
  {
    id: '3',
    nombre: 'Vinchas para Tratamientos Faciales',
    descripcion: 'Comodidad y estilo para cada sesión de belleza. Material hipoalergénico.',
    descripcionCompleta: 'Fabricadas con microfibra suave e hipoalergénica, estas vinchas están diseñadas para mantener el cabello alejado del rostro durante cualquier tratamiento facial o de maquillaje. Son elásticas, no aprietan y se adaptan a cualquier tamaño de cabeza, garantizando la comodidad de tus clientes durante toda la sesión.',
    imagenSrc: Vinchas,
    destacado: false,
    material: 'Microfibra',
    tamanos: ['Único'],
    colores: ['Blanco', 'Rosa', 'Azul Claro'],
    personalizable: false,
    imagenes: [
      { src: Vinchas, alt: 'Vinchas para Tratamientos Faciales' },
      { src: imgGenerica4, alt: 'Vinchas en uso' },
    ],
  },
  {
    id: '4',
    nombre: 'Pads',
    descripcion: 'Pads de limpieza facial, perfectos para tus clientes. Material hipoalergénico.',
    descripcionCompleta: 'Nuestros pads de limpieza facial reutilizables son la alternativa sostenible a los discos de algodón desechables. Hechos de un material ultra suave, eliminan el maquillaje y las impurezas de manera efectiva y delicada. Ideales para el cuidado diario de la piel y el uso profesional en salones de belleza.',
    imagenSrc: Pads,
    destacado: false,
    material: 'Microfibra',
    tamanos: ['Único'],
    colores: ['Blanco'],
    personalizable: false,
    imagenes: [
      { src: Pads, alt: 'Pads de limpieza facial' },
      { src: imgGenerica1, alt: 'Paquetes de pads' }
    ],
  },
  {
    id: '5',
    nombre: 'Kit de Limpieza Facial',
    descripcion: 'Kit de limpieza facial. Material hipoalergénico.',
    descripcionCompleta: 'El kit de limpieza facial es un conjunto completo para un cuidado de la piel profundo. Incluye una vincha, toalla facial y pads, todo fabricado con materiales hipoalergénicos de la más alta calidad para asegurar una limpieza suave pero efectiva. Perfecto para rituales de spa en casa o como un detalle de bienvenida para tus clientes.',
    imagenSrc: KitFacial,
    destacado: true,
    material: 'Microfibra',
    tamanos: ['Único'],
    colores: ['Varios'],
    personalizable: true,
    imagenes: [
      { src: KitFacial, alt: 'Kit de Limpieza Facial' },
      { src: imgGenerica2, alt: 'Productos del kit' }
    ],
  },
];






