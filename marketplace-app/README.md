# Expertysm — Marketplace de Servicios Profesionales

App Next.js (App Router) + Tailwind + **PostgreSQL** (Prisma).

## Desarrollar en local

1. Copia las variables de entorno y rellena `DATABASE_URL` (PostgreSQL):
   ```bash
   cp .env.example .env.local
   ```
   En `.env.local` pon algo como:
   ```
   DATABASE_URL="postgresql://connectia:TU_PASSWORD@localhost:5432/connectia"
   ```
2. Instala dependencias y genera el cliente Prisma:
   ```bash
   npm install
   npx prisma generate
   ```
3. Si la base de datos está vacía, aplica las migraciones:
   ```bash
   npx prisma migrate deploy
   ```
4. Arranca el servidor:
   ```bash
   npm run dev
   ```
5. Abre [http://localhost:3000](http://localhost:3000). Prueba la API de salud: [http://localhost:3000/api/health](http://localhost:3000/api/health).

### Variables para autenticación

Para el flujo completo de auth (Google + verificación por email) configura en `.env.local`:

- `AUTH_SECRET`
- `APP_BASE_URL` (ej. `http://localhost:3000` en local)
- `SESSION_DAYS_DEFAULT` y `SESSION_DAYS_REMEMBER` (duración de sesión)
- `GOOGLE_CLIENT_ID` y `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `MAIL_FROM`
- `MESSAGE_COOLDOWN_SECONDS` (cooldown anti-spam entre mensajes)

## Mensajería interna (MVP)

- Vista pública de servicios y detalle.
- Botón de contactar que obliga login si el usuario no está autenticado.
- Bandeja en `/mensajes` y conversación en `/mensajes/[id]`.
- Persistencia de conversaciones y mensajes en base de datos.

Tras actualizar el esquema Prisma, ejecuta:

```bash
cd marketplace-app
npx prisma migrate deploy
npx prisma generate
```

## Recuperación de contraseña

- Solicitud de enlace: `/auth/forgot-password`
- Restablecer contraseña: `/auth/reset-password?token=...`
- Requiere SMTP configurado (`GMAIL_USER`, `GMAIL_APP_PASSWORD`, `MAIL_FROM`).

## PostgreSQL en el VPS

Ver **`docs/POSTGRES_VPS.md`** para instalar Postgres en el VPS, crear usuario y base de datos, y configurar `DATABASE_URL` en `.env.local` del servidor. Luego en el VPS:

```bash
cd marketplace-app
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 restart marketplace
```

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` — genera Prisma client y build de Next.js
- `npm run start` — servir build (para el VPS con PM2)
- `npm run lint` — ESLint
- `npm run db:generate` — genera cliente Prisma
- `npm run db:migrate` — aplica migraciones (producción)
- `npm run db:migrate:dev` — crea y aplica migraciones (desarrollo)
- `npm run db:studio` — abre Prisma Studio (visor de BD)

## Estructura

- `app/` — páginas y API (App Router)
- `lib/` — Prisma (`db.ts`), Supabase (opcional)
- `prisma/` — schema y migraciones
