

// Importamos las URLs de las imágenes y activos para su uso local
import LogoGaddyel from '../Activos/Imagenes/Logo-Gaddyel.png';

// ✅ Imagen de fondo con efecto parallax - Logo Neon Gaddyel
import imagenFondo from '../Activos/Imagenes/imagenFondo.jpg';

// Exportamos los datos de las preguntas frecuentes (FAQ)
export const faqs = [
    {
        question: '¿Cómo funciona el proceso de compra?',
        answer: 'Podés realizar tu compra directamente desde nuestra web a través del carrito Seleccionás los productos, cargás tus datos y finalizás el pago de forma segura mediante Mercado Pago. Una vez confirmado el pago, iniciamos la producción de tu pedido.'
    },
    {
        question: '¿Qué medios de pago puedo utilizar?',
        answer: `Trabajamos con Mercado Pago, lo que te permite pagar con:
            Dinero en cuenta
            Tarjetas de crédito y débito
            Crédito personal de Mercado Pago    
            Todas las opciones disponibles se muestran al finalizar la compra.`
    },
    {
        question: '¿Debo pagar el total del pedido al comprar?',
        answer: `Sí. Con la nueva modalidad, el pago se realiza en su totalidad al confirmar la compra a través de Mercado Pago.
                Esto nos permite iniciar la confección de tu pedido de forma inmediata.`
    },
    {
        question: 'Cuánto tiempo tarda la confección de mi pedido?',
        answer: `El plazo de confección es de hasta 20 días corridos desde la confirmación del pago.
                Al tratarse de productos personalizados, cada pedido se realiza a medida.`
    },
    {
        question: '¿Cómo se calcula el costo de envío?',
        answer: `El costo de envío se calcula automáticamente en el carrito.
                Este valor se informa antes de finalizar la compra.`
    },
    {
        question: '¿El envío tiene algún beneficio?',
        answer: `Sí.
                👉 Si comprás 3 o más productos (iguales o diferentes), el envío es bonificado.`
    },
    {
        question: 'Cómo puedo seguir mi pedido',
        answer: `Una vez despachado, te enviaremos por WhatsApp o email el código de seguimiento para que puedas rastrear tu pedido en la página de Correo Argentino hasta su entrega.`
    },
    {
        question: '¿Recibo confirmación antes del envío?',
        answer: `Sí.
                Cuando tu pedido esté finalizado, te enviaremos fotografías de los productos terminados, para que puedas ver el resultado antes del despacho.`
    },
    {
        question: '¿Qué pasa si cargo mal mis datos de envío?',
        answer: `Si detectás un error en los datos, contactanos lo antes posible.
                Si el pedido aún no fue despachado, podremos corregirlos.
                Una vez entregado al correo, los cambios quedan sujetos a las políticas de Correo Argentino.`
    },
    {
        question: '¿Los productos son personalizados?',
        answer: `Sí. Todos nuestros productos se confeccionan de manera personalizada para centros de estética y spa, respetando las especificaciones de cada pedido.`
    }


];

// Re-exportamos los productos y activos importados para que estén disponibles
export { LogoGaddyel, imagenFondo };
