#!/usr/bin/env node

/**
 * 🔍 AUDITORÍA DE DESIGN SYSTEM
 * 
 * Este script busca anti-patterns en los componentes que violan
 * el Design System profesional de Gaddyel.
 * 
 * Uso: node scripts/audit-design-system.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colores para terminal
const colors = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

// Anti-patterns a buscar
const antiPatterns = {
  // Paleta de color
  purplePinkGradient: {
    pattern: /(from-purple-\d+|to-pink-\d+|from-pink-\d+|to-purple-\d+)/g,
    description: '❌ Gradiente purple-pink genérico (usar slate)',
    severity: 'HIGH',
  },
  genericGradients: {
    pattern: /(from-blue-\d+.*to-cyan-\d+|from-green-\d+.*to-blue-\d+)/g,
    description: '❌ Gradiente genérico de IA',
    severity: 'MEDIUM',
  },
  
  // Spacing
  compactSpacing: {
    pattern: /(px-[1-3]|py-[1-2]|space-x-[1-2]|gap-[1-2])\s/g,
    description: '⚠️ Spacing muy compacto (considerar aumentar)',
    severity: 'MEDIUM',
  },
  
  // Transiciones
  fastTransitions: {
    pattern: /duration-(200|300)\s/g,
    description: '⚠️ Transición rápida (<500ms)',
    severity: 'LOW',
  },
  easeInOut: {
    pattern: /ease-in-out/g,
    description: '⚠️ Usar ease-out en lugar de ease-in-out',
    severity: 'LOW',
  },
  
  // Borders y sombras
  shadowWithoutBorder: {
    pattern: /shadow-(xl|2xl|3xl)(?!.*border)/g,
    description: '⚠️ Sombra sin border (agregar border sutil)',
    severity: 'MEDIUM',
  },
  roundedLg: {
    pattern: /rounded-lg(?!-)/g,
    description: '⚠️ rounded-lg (usar rounded-2xl)',
    severity: 'LOW',
  },
  
  // Glassmorphism
  wrongGlassmorphism: {
    pattern: /bg-gray-\d+\/9[0-9]/g,
    description: '⚠️ Glassmorphism con gray (usar white/slate)',
    severity: 'MEDIUM',
  },
  backdropBlurMd: {
    pattern: /backdrop-blur-md/g,
    description: '⚠️ backdrop-blur-md (usar backdrop-blur-xl)',
    severity: 'LOW',
  },
  
  // Hover states
  scaleHover: {
    pattern: /hover:scale-1(0[5-9]|[1-9]\d)/g,
    description: '⚠️ Hover con scale >= 1.05 (considerar más sutil)',
    severity: 'LOW',
  },
  
  // Dark mode
  missingDarkMode: {
    pattern: /bg-(white|slate-\d+|gray-\d+)(?!.*dark:)/g,
    description: '⚠️ Background sin dark: variant',
    severity: 'MEDIUM',
  },
};

// Directorios a auditar
const DIRS_TO_AUDIT = [
  'src/Componentes',
  'src/Paginas',
  'src/Context',
];

// Componentes ya actualizados (excluir de reporte)
const UPDATED_COMPONENTS = [
  'src/Componentes/UI/Navbar/Navbar.jsx',
];

// Resultados
let results = {
  totalFiles: 0,
  filesWithIssues: 0,
  issuesBySeverity: {
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
  },
  fileReports: [],
};

/**
 * Escanear un archivo en busca de anti-patterns
 */
function auditFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const issues = [];
  
  for (const [key, config] of Object.entries(antiPatterns)) {
    const matches = content.match(config.pattern);
    if (matches && matches.length > 0) {
      issues.push({
        type: key,
        description: config.description,
        severity: config.severity,
        count: matches.length,
        examples: matches.slice(0, 3), // Primeros 3 ejemplos
      });
      
      results.issuesBySeverity[config.severity] += matches.length;
    }
  }
  
  return issues;
}

/**
 * Escanear recursivamente un directorio
 */
function scanDirectory(dir) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (item.endsWith('.jsx') || item.endsWith('.js')) {
      // Saltar si ya está actualizado
      if (UPDATED_COMPONENTS.includes(fullPath.replace(/\\/g, '/'))) {
        continue;
      }
      
      results.totalFiles++;
      const issues = auditFile(fullPath);
      
      if (issues.length > 0) {
        results.filesWithIssues++;
        results.fileReports.push({
          file: fullPath,
          issues,
        });
      }
    }
  }
}

/**
 * Generar reporte en terminal
 */
function printReport() {
  console.log('\n');
  console.log(colors.bold + colors.cyan + '🔍 AUDITORÍA DE DESIGN SYSTEM - Gaddyel' + colors.reset);
  console.log(colors.cyan + '═'.repeat(60) + colors.reset);
  console.log('\n');
  
  // Resumen
  console.log(colors.bold + 'RESUMEN' + colors.reset);
  console.log(`  Total de archivos auditados: ${results.totalFiles}`);
  console.log(`  Archivos con issues: ${colors.yellow}${results.filesWithIssues}${colors.reset}`);
  console.log(`  Archivos OK: ${colors.green}${results.totalFiles - results.filesWithIssues}${colors.reset}`);
  console.log('\n');
  
  console.log(colors.bold + 'ISSUES POR SEVERIDAD' + colors.reset);
  console.log(`  ${colors.red}HIGH:${colors.reset}   ${results.issuesBySeverity.HIGH}`);
  console.log(`  ${colors.yellow}MEDIUM:${colors.reset} ${results.issuesBySeverity.MEDIUM}`);
  console.log(`  LOW:    ${results.issuesBySeverity.LOW}`);
  console.log('\n');
  
  // Detalles por archivo
  if (results.fileReports.length > 0) {
    console.log(colors.bold + 'DETALLES POR ARCHIVO' + colors.reset);
    console.log(colors.cyan + '─'.repeat(60) + colors.reset);
    console.log('\n');
    
    for (const report of results.fileReports) {
      console.log(colors.bold + `📁 ${report.file}` + colors.reset);
      
      for (const issue of report.issues) {
        const severityColor = 
          issue.severity === 'HIGH' ? colors.red :
          issue.severity === 'MEDIUM' ? colors.yellow :
          colors.reset;
        
        console.log(`   ${severityColor}[${issue.severity}]${colors.reset} ${issue.description}`);
        console.log(`   Ocurrencias: ${issue.count}`);
        if (issue.examples.length > 0) {
          console.log(`   Ejemplos: ${colors.cyan}${issue.examples.join(', ')}${colors.reset}`);
        }
        console.log('');
      }
      
      console.log('');
    }
  }
  
  // Recomendaciones
  console.log(colors.bold + colors.green + '📚 RECOMENDACIONES' + colors.reset);
  console.log('  1. Revisar docs/architecture/DESIGN_SYSTEM.md');
  console.log('  2. Priorizar issues de severidad HIGH');
  console.log('  3. Documentar cambios en CHANGELOG_LOGIC.md');
  console.log('  4. Usar el roadmap en DESIGN_SYSTEM_ROADMAP.md');
  console.log('\n');
  
  // Score
  const totalIssues = results.issuesBySeverity.HIGH + results.issuesBySeverity.MEDIUM + results.issuesBySeverity.LOW;
  const score = Math.max(0, 100 - (totalIssues * 2));
  const scoreColor = score >= 90 ? colors.green : score >= 70 ? colors.yellow : colors.red;
  
  console.log(colors.bold + 'DESIGN SYSTEM COMPLIANCE SCORE' + colors.reset);
  console.log(`  ${scoreColor}${score}/100${colors.reset}`);
  console.log('\n');
  
  if (score >= 90) {
    console.log(colors.green + '  ✨ Excelente! El sitio sigue el Design System consistentemente.' + colors.reset);
  } else if (score >= 70) {
    console.log(colors.yellow + '  ⚠️  Hay margen de mejora. Revisar issues de alta prioridad.' + colors.reset);
  } else {
    console.log(colors.red + '  ❌ Se requiere refactorización significativa.' + colors.reset);
  }
  
  console.log('\n');
}

/**
 * Generar reporte en archivo JSON
 */
function saveJsonReport() {
  const reportPath = path.join(process.cwd(), 'design-system-audit.json');
  const reportData = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: results.totalFiles,
      filesWithIssues: results.filesWithIssues,
      issuesBySeverity: results.issuesBySeverity,
    },
    details: results.fileReports,
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
  console.log(colors.cyan + `📄 Reporte JSON guardado en: ${reportPath}` + colors.reset);
  console.log('\n');
}

// Ejecutar auditoría
console.log(colors.cyan + 'Iniciando auditoría...' + colors.reset);

for (const dir of DIRS_TO_AUDIT) {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    scanDirectory(fullPath);
  }
}

printReport();
saveJsonReport();

// Exit code según severidad de issues
if (results.issuesBySeverity.HIGH > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
