// Importamos los datos de productos existentes
import { productos } from './productos.js';

// Importamos las URLs de las imágenes y activos para su uso local
import LogoGaddyel from '../Activos/Imagenes/Logo-Gaddyel.png';

import imagenFondo from '../Activos/Imagenes/imagenFondo.png';

import carrusel1 from '../Activos/Imagenes/ImgCarrusel/carrusel-1.jpg';
import carrusel2 from '../Activos/Imagenes/ImgCarrusel/carrusel-2.jpeg';
import carrusel3 from '../Activos/Imagenes/ImgCarrusel/carrusel-3.jpg';
import carrusel4 from '../Activos/Imagenes/ImgCarrusel/carrusel-4.jpeg';
import carrusel5 from '../Activos/Imagenes/ImgCarrusel/carrusel-5.jpeg';
import carrusel6 from '../Activos/Imagenes/ImgCarrusel/carrusel-6.jpg';



// Exportamos los datos de las preguntas frecuentes (FAQ)
export const faqs = [
    {
        question: '¿Cómo funciona el proceso de compra?',
        answer: 'Es muy simple. Nos solicitas un presupuesto con la cantidad de productos que necesitas. Luego, calculamos el costo de envío (variable según tu ubicación y el método de entrega) y te enviamos el presupuesto final con el total. Para confirmar el pedido e iniciar la producción, solo necesitas abonar el 50% del total. Una vez que los productos estén listos, te enviaremos fotos y podrás pagar el 50% restante para que procedamos al envío.'
    },
    {
        question: '¿Cuánto tiempo tardan en confeccionar mi pedido?',
        answer: 'El plazo máximo para la confección de tu pedido es de 20 días corridos a partir del momento en que se confirma el pago del 50%.'
    },
    {
        question: '¿Por qué debo pagar un 50% por adelantado?',
        answer: 'El pago inicial del 50% nos permite congelar los precios pactados para iniciar la producción de tus productos personalizados.'
    },
    {
        question: '¿Qué métodos de pago aceptan?',
        answer: 'Aceptamos varios métodos de pago. Las opciones disponibles se te informarán al momento de solicitar el presupuesto.'
    },
    {
        question: '¿Cómo se calcula el costo de envío?',
        answer: 'El costo de envío es variable y se calcula en base a tu ubicación geográfica y la modalidad de entrega que elijas: envío a domicilio o retiro en la sucursal de Correo Argentino más cercana. Este valor se suma al total del presupuesto de tus productos.'
    },
    {
        question: '¿Qué empresa de envíos utilizan?',
        answer: 'Trabajamos con Correo Argentino para garantizar que tu pedido llegue a todo el país de forma segura y eficiente.'
    },
    {
        question: '¿Cómo puedo rastrear mi pedido?',
        answer: 'Una vez que hayas abonado el 50% restante y tu pedido sea despachado, te enviaremos por email el código de seguimiento. Con este código, podrás monitorear la trazabilidad de tu paquete en la página de Correo Argentino hasta que llegue a tu domicilio.'
    },
    {
        question: '¿Qué pasa si mi dirección de envío es incorrecta?',
        answer: 'Si te das cuenta de que la dirección de envío tiene un error, por favor contáctanos de inmediato. Si el paquete aún no fue despachado, podremos corregirla. Sin embargo, si el pedido ya está en manos de Correo Argentino, es posible que no podamos realizar cambios y la entrega podría verse afectada.'
    },
    {
        question: '¿Cómo sé que mi pedido está listo para ser enviado?',
        answer: 'Una vez que hayamos terminado la confección de tus productos, te enviaremos fotografías de los artículos terminados. Esto te dará la seguridad de que están listos y en perfectas condiciones antes de realizar el pago final y proceder con el envío.'
    }
    
];

// Exportamos las imágenes para el carrusel
export const imagenesCarrusel = [
    { src: carrusel1, alt: 'Kit Faciales de Gaddyel' },
    { src: carrusel2, alt: 'Kit Faciales y de Spa de Gaddyel' },
    { src: carrusel3, alt: 'Productos de Blanquería Personalizada Gaddyel' },
    { src: carrusel4, alt: 'Blanquería para Salones de Belleza Gaddyel' },
    { src: carrusel5, alt: 'Suministros para Barbería Gaddyel' },
    { src: carrusel6, alt: 'Batas Beauty Gaddyel' },
];

// Re-exportamos los productos y activos importados para que estén disponibles
export { productos, LogoGaddyel, imagenFondo };
