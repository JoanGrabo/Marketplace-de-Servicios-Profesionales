#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$APP_DIR"

echo
echo "=== Limpiar usuarios de prueba (VPS) ==="
echo
echo "Ejemplos:"
echo "  ./scripts/clear-test-users.sh --email joan@example.com"
echo "  ./scripts/clear-test-users.sh --domain test.com"
echo "  ./scripts/clear-test-users.sh --all --confirm"
echo

npm run db:clear:test-users -- "$@"
echo
echo "Operacion completada."
