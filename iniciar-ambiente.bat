@echo off
setlocal
title Grupo Raizes - Faturamento Inteligente (POC)
cd /d "%~dp0"

if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install
)

echo Iniciando ambiente...
start "" cmd /c "npm run dev -- --port 7277"

echo Aguardando o servidor iniciar...
timeout /t 5 /nobreak >nul

start "" http://localhost:7277

endlocal
