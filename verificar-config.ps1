#!/usr/bin/env pwsh
# Script para verificar la configuración del proyecto

Write-Host "🔍 Verificando Configuración del Proyecto Gaddyel" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar archivos .env
Write-Host "📁 Archivos de Configuración:" -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "  ✅ .env.local existe" -ForegroundColor Green
    Write-Host "     " -NoNewline
    Get-Content ".env.local" | Select-String "VITE_API_BASE" | ForEach-Object { Write-Host $_ -ForegroundColor Gray }
} else {
    Write-Host "  ⚠️  .env.local NO existe (usando .env)" -ForegroundColor Yellow
}

if (Test-Path ".env") {
    Write-Host "  ✅ .env existe" -ForegroundColor Green
    Write-Host "     " -NoNewline
    Get-Content ".env" | Select-String "VITE_API_BASE" | ForEach-Object { Write-Host $_ -ForegroundColor Gray }
}

if (Test-Path ".env.production") {
    Write-Host "  ✅ .env.production existe" -ForegroundColor Green
    Write-Host "     " -NoNewline
    Get-Content ".env.production" | Select-String "VITE_API_BASE" | ForEach-Object { Write-Host $_ -ForegroundColor Gray }
}

Write-Host ""

# Verificar si el backend está corriendo
Write-Host "🌐 Verificando Backend:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/productos" -Method GET -TimeoutSec 3 -ErrorAction Stop
    Write-Host "  ✅ Backend respondiendo en http://localhost:5000/api" -ForegroundColor Green
    Write-Host "     Status: $($response.StatusCode)" -ForegroundColor Gray
} catch {
    Write-Host "  ❌ Backend NO está corriendo en http://localhost:5000" -ForegroundColor Red
    Write-Host "     Inicia el backend con:" -ForegroundColor Yellow
    Write-Host "     cd c:\Users\Eliana\Desktop\gaddyel-backend" -ForegroundColor Gray
    Write-Host "     npm run dev" -ForegroundColor Gray
}

Write-Host ""

# Instrucciones
Write-Host "🚀 Para iniciar el desarrollo:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Terminal 1 (Backend):" -ForegroundColor Yellow
Write-Host "  cd c:\Users\Eliana\Desktop\gaddyel-backend" -ForegroundColor Gray
Write-Host "  npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "Terminal 2 (Frontend):" -ForegroundColor Yellow
Write-Host "  cd c:\Users\Eliana\Desktop\programacion-Gemini\Proyecto-Gaddyel" -ForegroundColor Gray
Write-Host "  npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "📚 Más información: CONFIGURACION_DESARROLLO.md" -ForegroundColor Cyan
