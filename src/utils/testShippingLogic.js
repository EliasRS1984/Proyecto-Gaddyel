/**
 * testShippingLogic.js
 * Script para verificar la lógica de cálculo de envío
 * Simula el flujo completo: Frontend → Backend
 */

/**
 * Simula el cálculo del frontend (Checkout.jsx)
 */
function calcularEnvioFrontend(cartItems) {
    console.log('=== CALCULANDO EN FRONTEND ===');
    console.log('Items en carrito:', JSON.stringify(cartItems, null, 2));
    
    // Calcular totalProductos como en Checkout.jsx línea 311
    const totalProductos = cartItems.reduce((sum, item) => {
        const unidadesPorItem = (item.cantidadUnidades || 1) * (item.cantidad || 1);
        console.log(`  ${item.nombre}: ${item.cantidadUnidades || 1} × ${item.cantidad} = ${unidadesPorItem}`);
        return sum + unidadesPorItem;
    }, 0);
    
    console.log(`Total de unidades: ${totalProductos}`);
    
    // Calcular envío como en orderService.calculateShipping()
    const envioGratis = totalProductos >= 3;
    const costoEnvio = envioGratis ? 0 : 12000;
    
    console.log(`¿Envío gratis (>= 3)? ${envioGratis}`);
    console.log(`Costo envío: $${costoEnvio.toLocaleString('es-AR')}`);
    
    return {
        totalProductos,
        envioGratis,
        costoEnvio
    };
}

/**
 * Simula el cálculo del backend (orderController.js)
 */
function calcularEnvioBackend(items) {
    console.log('\n=== CALCULANDO EN BACKEND ===');
    console.log('Items recibidos:', JSON.stringify(items, null, 2));
    
    let cantidadProductosCalculada = 0;
    
    items.forEach(item => {
        const cantidadUnidadesPorItem = item.cantidadUnidades || 1;
        const unidadesTotalesItem = cantidadUnidadesPorItem * item.cantidad;
        
        console.log(`  Producto ${item.productoId}: ${cantidadUnidadesPorItem} × ${item.cantidad} = ${unidadesTotalesItem}`);
        cantidadProductosCalculada += unidadesTotalesItem;
    });
    
    console.log(`Total de unidades calculado: ${cantidadProductosCalculada}`);
    
    // Calcular envío como en orderController.js línea 81
    const envioGratis = cantidadProductosCalculada >= 3;
    const costoEnvioCalculado = envioGratis ? 0 : 12000;
    
    console.log(`¿Envío gratis (>= 3)? ${envioGratis}`);
    console.log(`Costo envío: $${costoEnvioCalculado.toLocaleString('es-AR')}`);
    
    return {
        cantidadProductosCalculada,
        envioGratis,
        costoEnvioCalculado
    };
}

/**
 * Ejecuta test completo
 */
export function runShippingTest(cartItems) {
    console.log('🧪 PRUEBA DE LÓGICA DE ENVÍO\n');
    
    const frontend = calcularEnvioFrontend(cartItems);
    const items = cartItems.map(item => ({
        productoId: item._id,
        cantidad: item.cantidad,
        cantidadUnidades: item.cantidadUnidades
    }));
    const backend = calcularEnvioBackend(items);
    
    console.log('\n=== VALIDACIÓN ===');
    const cantidadesIguales = frontend.totalProductos === backend.cantidadProductosCalculada;
    const envioIgual = frontend.costoEnvio === backend.costoEnvioCalculado;
    
    console.log(`✓ Cantidades iguales: ${cantidadesIguales ? '✅' : '❌'} (${frontend.totalProductos} vs ${backend.cantidadProductosCalculada})`);
    console.log(`✓ Costo envío igual: ${envioIgual ? '✅' : '❌'} ($${frontend.costoEnvio} vs $${backend.costoEnvioCalculado})`);
    
    return {
        frontend,
        backend,
        isConsistent: cantidadesIguales && envioIgual
    };
}

/**
 * Casos de prueba
 */
export function runAllTests() {
    console.log('╔════════════════════════════════════════════╗');
    console.log('║  PRUEBAS DE LÓGICA DE ENVÍO - GADDYEL     ║');
    console.log('╚════════════════════════════════════════════╝\n');
    
    // Test 1: 1 producto con 2 unidades (NO gratis)
    console.log('TEST 1: 1 producto × 2 unidades = 2 unidades (NO GRATIS)');
    console.log('─'.repeat(50));
    const test1 = runShippingTest([
        {
            _id: 'prod1',
            nombre: 'Producto A',
            cantidad: 1,
            cantidadUnidades: 2
        }
    ]);
    console.log(`RESULTADO: ${test1.isConsistent ? '✅ CONSISTENTE' : '❌ INCONSISTENTE'}\n\n`);
    
    // Test 2: 2 productos × 1 unidad + 1 unidad = 3 unidades (GRATIS)
    console.log('TEST 2: 2 productos × 1 unidad + 1 = 3 unidades (GRATIS)');
    console.log('─'.repeat(50));
    const test2 = runShippingTest([
        {
            _id: 'prod1',
            nombre: 'Producto A',
            cantidad: 2,
            cantidadUnidades: 1
        },
        {
            _id: 'prod2',
            nombre: 'Producto B',
            cantidad: 1,
            cantidadUnidades: 1
        }
    ]);
    console.log(`RESULTADO: ${test2.isConsistent ? '✅ CONSISTENTE' : '❌ INCONSISTENTE'}\n\n`);
    
    // Test 3: 3 productos complejos
    console.log('TEST 3: 3 productos complejos = 5 unidades (GRATIS)');
    console.log('─'.repeat(50));
    const test3 = runShippingTest([
        {
            _id: 'prod1',
            nombre: 'Producto A',
            cantidad: 2,
            cantidadUnidades: 2
        },
        {
            _id: 'prod2',
            nombre: 'Producto B',
            cantidad: 1,
            cantidadUnidades: 1
        }
    ]);
    console.log(`RESULTADO: ${test3.isConsistent ? '✅ CONSISTENTE' : '❌ INCONSISTENTE'}\n\n`);
    
    // Resumen
    console.log('╔════════════════════════════════════════════╗');
    console.log('║           RESUMEN DE PRUEBAS              ║');
    console.log('╚════════════════════════════════════════════╝');
    const allPassed = [test1, test2, test3].every(t => t.isConsistent);
    console.log(`✓ Todas las pruebas: ${allPassed ? '✅ PASADAS' : '❌ FALLIDAS'}`);
    
    return allPassed;
}

// Ejecutar si se importa como módulo principal
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllTests();
}
