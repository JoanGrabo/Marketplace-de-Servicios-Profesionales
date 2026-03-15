#!/bin/bash
# Script de despliegue en el VPS: actualiza código, instala, migra y reinicia la app.
# Uso: desde el VPS, ejecuta: bash deploy-vps.sh
#      o, si ya está en el repo: bash scripts/deploy-vps.sh

set -e

# --- Configuración (ajusta si cambias de repo o rutas) ---
REPO_URL="https://github.com/JoanGrabo/Marketplace-de-Servicios-Profesionales.git"
BRANCH="main"
DEPLOY_DIR="/home/ubuntu/marketplace"
APP_DIR="${DEPLOY_DIR}/marketplace-app"
PM2_NAME="marketplace"

# --- Comprobar que estamos en un entorno válido ---
if [ ! -d "/home/ubuntu" ]; then
  echo "No se encuentra /home/ubuntu. ¿Estás en el VPS?"
  exit 1
fi

echo "=== Deploy CONNECTIA en VPS ==="

# --- Clonar o actualizar código ---
cd /home/ubuntu

if [ -d "$DEPLOY_DIR" ]; then
  echo ">>> Actualizando código (git pull)..."
  cd "$DEPLOY_DIR"
  git fetch origin
  git reset --hard "origin/${BRANCH}"
  git pull origin "$BRANCH"
else
  echo ">>> Primera vez: clonando repositorio..."
  git clone -b "$BRANCH" "$REPO_URL" "$DEPLOY_DIR"
  cd "$DEPLOY_DIR"
fi

# --- Comprobar que existe la app ---
if [ ! -f "${APP_DIR}/package.json" ]; then
  echo "Error: no se encuentra ${APP_DIR}/package.json"
  exit 1
fi

# --- Instalar dependencias ---
echo ">>> Instalando dependencias (npm ci)..."
cd "$APP_DIR"
npm ci

# --- Prisma: generar cliente y aplicar migraciones ---
if [ -f "prisma/schema.prisma" ]; then
  echo ">>> Prisma: generate..."
  npx prisma generate
  echo ">>> Prisma: migrate deploy..."
  npx prisma migrate deploy
else
  echo ">>> No hay Prisma en este proyecto, se omite."
fi

# --- Build ---
echo ">>> Build (npm run build)..."
npm run build

# --- Reiniciar PM2 ---
echo ">>> Reiniciando PM2 (${PM2_NAME})..."
pm2 restart "$PM2_NAME" --update-env || pm2 start npm --name "$PM2_NAME" -- start
pm2 save

echo "=== Deploy terminado. Comprueba: curl -s http://127.0.0.1:3000/api/health ==="
