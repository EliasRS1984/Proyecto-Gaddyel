/**
 * quickTest.js
 * Test rápido para validar la lógica de envío
 * Copia y pega esto en la consola del navegador
 */

console.log('🧪 TEST RÁPIDO: Lógica de Envío Gaddyel\n');

// Simulación de calculateShipping (debe ser 12000, no 10000)
const calculateShipping = (cantidadProductos) => {
    return cantidadProductos >= 3 ? 0 : 12000;
};

// Test cases
const tests = [
    { cantidad: 1, esperado: 12000, nombre: '1 unidad' },
    { cantidad: 2, esperado: 12000, nombre: '2 unidades' },
    { cantidad: 3, esperado: 0, nombre: '3 unidades' },
    { cantidad: 4, esperado: 0, nombre: '4 unidades' },
    { cantidad: 5, esperado: 0, nombre: '5 unidades' }
];

console.log('Pruebas de cantidad:');
console.log('─'.repeat(60));

let passed = 0;
tests.forEach(test => {
    const resultado = calculateShipping(test.cantidad);
    const ok = resultado === test.esperado;
    const icon = ok ? '✅' : '❌';
    const estado = ok ? 'PASÓ' : 'FALLÓ';
    
    console.log(
        `${icon} ${test.nombre.padEnd(15)} → $${resultado.toLocaleString('es-AR').padEnd(8)} ${estado}`
    );
    
    if (ok) passed++;
});

console.log('─'.repeat(60));
console.log(`Resultados: ${passed}/${tests.length} tests pasados`);

if (passed === tests.length) {
    console.log('✅ TODOS LOS TESTS PASARON - Lógica correcta');
} else {
    console.log('❌ ALGUNOS TESTS FALLARON');
}

// Validación adicional
console.log('\n📊 Verificación de valores:');
console.log(`  calculateShipping(1) = ${calculateShipping(1)} (debe ser 12000)`);
console.log(`  calculateShipping(3) = ${calculateShipping(3)} (debe ser 0)`);
console.log(`  Umbral envío gratis = 3 unidades`);

// Test con items del carrito (ejemplo)
console.log('\n🛒 Ejemplo con carrito real:');
const cartItems = [
    { nombre: 'Producto A', cantidadUnidades: 2, cantidad: 2 },
    { nombre: 'Producto B', cantidadUnidades: 1, cantidad: 1 }
];

const totalProductos = cartItems.reduce((sum, item) => {
    const unidades = (item.cantidadUnidades || 1) * (item.cantidad || 1);
    console.log(`  ${item.nombre}: ${item.cantidadUnidades} × ${item.cantidad} = ${unidades}`);
    return sum + unidades;
}, 0);

const envio = calculateShipping(totalProductos);
console.log(`\nTotal unidades: ${totalProductos}`);
console.log(`Costo envío: $${envio.toLocaleString('es-AR')} ${envio === 0 ? '✓ GRATIS' : ''}`);

console.log('\n✓ Test completado');
