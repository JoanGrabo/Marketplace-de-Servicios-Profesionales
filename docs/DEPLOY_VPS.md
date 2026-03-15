# Script de despliegue en el VPS

El script **`scripts/deploy-vps.sh`** actualiza el código en el VPS, instala dependencias, aplica migraciones de Prisma, hace el build y reinicia la app con PM2.

---

## Uso en el VPS

### Primera vez (ya tienes el repo clonado)

Después de hacer **git pull** en tu PC y **git push**, en el VPS:

```bash
cd /home/ubuntu/marketplace
git pull origin main
bash scripts/deploy-vps.sh
```

(Si tu rama se llama `master`, en el script cambia `BRANCH="main"` por `BRANCH="master"` o ejecuta antes `git pull origin master`.)

### Desde cero (borrar y volver a clonar)

Si quieres que el script haga el **clone** él solo (por ejemplo tras borrar la carpeta):

```bash
cd /home/ubuntu
rm -rf marketplace
git clone https://github.com/JoanGrabo/Marketplace-de-Servicios-Profesionales.git marketplace
cd marketplace
bash scripts/deploy-vps.sh
```

Antes de ejecutarlo la primera vez, crea **`.env.local`** en `marketplace-app` con `DATABASE_URL` y las demás variables, porque el script no toca ese archivo.

---

## Qué hace el script

| Paso | Acción |
|------|--------|
| 1 | Si existe `marketplace`: **git pull**. Si no: **git clone**. |
| 2 | **npm ci** en `marketplace-app` |
| 3 | **npx prisma generate** y **npx prisma migrate deploy** (si hay Prisma) |
| 4 | **npm run build** |
| 5 | **pm2 restart marketplace** (o **pm2 start** si no existía) y **pm2 save** |

---

## Configuración

Edita las variables al inicio de `scripts/deploy-vps.sh` si cambias:

- `REPO_URL` — URL del repositorio
- `BRANCH` — rama (por defecto `main`)
- `DEPLOY_DIR` — carpeta del repo (por defecto `/home/ubuntu/marketplace`)
- `PM2_NAME` — nombre del proceso en PM2 (por defecto `marketplace`)

---

## Comprobar después del deploy

```bash
curl -s http://127.0.0.1:3000/api/health
pm2 list
```
