#!/usr/bin/env bash
#
# Reinicio completo en VPS: pull, dependencias, Prisma, build limpio, PM2.
# Uso (desde cualquier sitio):
#   bash /ruta/a/marketplace-app/scripts/restart-all.sh
# O desde marketplace-app:
#   ./scripts/restart-all.sh
#
# Variables opcionales (export antes de ejecutar):
#   GIT_BRANCH=main          rama a hacer pull
#   PM2_NAME=marketplace     nombre del proceso en PM2
#   SKIP_GIT=1               no ejecutar git pull
#   SKIP_CLEAN_NEXT=1        no borrar carpeta .next antes del build
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
# Raíz del repo: primero dentro de marketplace-app; si no, carpeta padre (ej. ~/marketplace)
if git -C "$APP_DIR" rev-parse --git-dir >/dev/null 2>&1; then
  GIT_ROOT="$(git -C "$APP_DIR" rev-parse --show-toplevel)"
else
  PARENT="$(cd "$APP_DIR/.." && pwd)"
  if git -C "$PARENT" rev-parse --git-dir >/dev/null 2>&1; then
    GIT_ROOT="$(git -C "$PARENT" rev-parse --show-toplevel)"
  else
    GIT_ROOT=""
  fi
fi

GIT_BRANCH="${GIT_BRANCH:-main}"
PM2_NAME="${PM2_NAME:-marketplace}"
SKIP_GIT="${SKIP_GIT:-0}"
SKIP_CLEAN_NEXT="${SKIP_CLEAN_NEXT:-0}"

log() {
  echo ""
  echo ">>> $*"
  echo ""
}

fail() {
  echo "ERROR: $*" >&2
  exit 1
}

log "CONNECTIA — reinicio completo"
echo "APP_DIR=$APP_DIR"
echo "GIT_ROOT=${GIT_ROOT:-"(no detectado)"}"
echo "GIT_BRANCH=$GIT_BRANCH PM2_NAME=$PM2_NAME"

if [[ "$SKIP_GIT" != "1" ]]; then
  log "1/7 git pull ($GIT_BRANCH)"
  if [[ -z "$GIT_ROOT" ]]; then
    fail "No se encontró repo git (ni en $APP_DIR ni en su carpeta padre)."
  fi
  cd "$GIT_ROOT"
  git pull origin "$GIT_BRANCH"
else
  log "1/7 git pull (omitido, SKIP_GIT=1)"
fi

log "2/7 npm ci (o npm install si falla)"
cd "$APP_DIR"
if ! npm ci; then
  echo "npm ci falló, probando npm install..."
  npm install
fi

log "3/7 Cargar .env.local para Prisma (si existe)"
if [[ -f .env.local ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
else
  echo "Aviso: no hay .env.local en $APP_DIR — Prisma puede fallar sin DATABASE_URL."
fi

log "4/7 prisma generate"
npx prisma generate

log "5/7 prisma migrate deploy"
npx prisma migrate deploy

if [[ "$SKIP_CLEAN_NEXT" != "1" ]]; then
  log "6/7 Limpiar .next y build"
  rm -rf .next
else
  log "6/7 Build (sin borrar .next, SKIP_CLEAN_NEXT=1)"
fi

npm run build

log "7/7 PM2 restart"
if ! command -v pm2 >/dev/null 2>&1; then
  fail "pm2 no está instalado o no está en PATH."
fi

pm2 restart "$PM2_NAME" --update-env
pm2 save

log "Listo. Revisa: pm2 logs $PM2_NAME --lines 50"
