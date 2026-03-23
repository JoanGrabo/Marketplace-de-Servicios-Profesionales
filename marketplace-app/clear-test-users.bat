@echo off
setlocal

echo.
echo === Limpiar usuarios de prueba (CONNECTIA) ===
echo.
echo Ejemplos:
echo   clear-test-users.bat --email joan@example.com
echo   clear-test-users.bat --domain test.com
echo   clear-test-users.bat --all --confirm
echo.

npm run db:clear:test-users -- %*
set EXIT_CODE=%ERRORLEVEL%

if %EXIT_CODE% neq 0 (
  echo.
  echo Error al ejecutar el limpiador de usuarios.
  exit /b %EXIT_CODE%
)

echo.
echo Operacion completada.
exit /b 0
