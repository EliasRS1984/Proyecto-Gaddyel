#!/usr/bin/env node
/**
 * Script de Validación de Cálculos
 * 
 * Verifica que todos los lugares en el código que calculan 'cantidadProductos'
 * usan la fórmula correcta: cantidadUnidades × cantidad
 */

const fs = require('fs');
const path = require('path');

// Archivos a verificar
const filesToCheck = [
  'src/Paginas/Checkout.jsx',
  'src/Componentes/Cart.jsx',
  'src/Context/CartContext.jsx'
];

// Patrón correcto: Busca la fórmula correcta
const correctPatterns = [
  /cantidadUnidades.*?\*.*?cantidad/,
  /\(item\.cantidadUnidades.*?\*.*?item\.cantidad\)/
];

// Patrones incorrectos a evitar
const incorrectPatterns = [
  /reduce.*?sum.*?\+.*?item\.cantidad(?!\s*\*|\s*×)/  // sum + item.cantidad sin multiplicación
];

console.log('🔍 Validando cálculos de cantidadProductos...\n');

let allCorrect = true;

filesToCheck.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${file} - NO ENCONTRADO`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Buscar menciones de cantidadProductos o totalProductos
  const lines = content.split('\n');
  let foundIssues = false;
  
  lines.forEach((line, index) => {
    if (line.includes('totalProductos') || line.includes('cantidadProductos')) {
      // Buscar reduce en las próximas líneas
      let checkContent = line;
      for (let i = 1; i < 5 && index + i < lines.length; i++) {
        checkContent += '\n' + lines[index + i];
      }
      
      const hasCorrectFormula = correctPatterns.some(pattern => pattern.test(checkContent));
      const hasIncorrectFormula = incorrectPatterns.some(pattern => pattern.test(checkContent));
      
      if (hasIncorrectFormula && !hasCorrectFormula) {
        console.log(`❌ ${file}:${index + 1}`);
        console.log(`   Código: ${line.trim()}`);
        console.log(`   ⚠️  Usa cantidad sin multiplicar por cantidadUnidades`);
        foundIssues = true;
        allCorrect = false;
      } else if (hasCorrectFormula) {
        console.log(`✅ ${file}:${index + 1} - Fórmula CORRECTA`);
      }
    }
  });
  
  if (!foundIssues && allCorrect) {
    console.log(`✅ ${file} - VALIDADO`);
  }
});

console.log('\n' + '='.repeat(60));

if (allCorrect) {
  console.log('✅ TODAS LAS VALIDACIONES PASARON');
  console.log('\nFórmula correcta en todos los lugares:');
  console.log('cantidadProductos = Σ(cantidadUnidades × cantidad)');
  process.exit(0);
} else {
  console.log('❌ SE ENCONTRARON PROBLEMAS');
  console.log('\nCorrecciones pendientes:');
  console.log('- Reemplazar: sum + item.cantidad');
  console.log('- Con: sum + ((item.cantidadUnidades || 1) * (item.cantidad || 1))');
  process.exit(1);
}
