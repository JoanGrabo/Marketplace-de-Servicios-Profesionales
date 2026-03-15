# Marketplace de Servicios Profesionales

App Next.js (App Router) + Tailwind. Base de datos opcional al inicio (Supabase u otra después).

## Desarrollar en local

1. Copia las variables de entorno:
   ```bash
   cp .env.example .env.local
   ```
2. **Sin base de datos:** puedes dejar `.env.local` como está (valores placeholder); la app arranca y la página de inicio funciona.
3. **Con Supabase:** crea un proyecto en [Supabase](https://supabase.com), Settings → API, y rellena en `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Instala y arranca:
   ```bash
   npm install
   npm run dev
   ```
5. Abre [http://localhost:3000](http://localhost:3000).

## Desplegar sin base de datos

En el VPS, en `.env.local` puedes usar los mismos placeholders de `.env.example`. La app sirve la web sin BD. Cuando añadas login, perfiles o servicios, podrás elegir Supabase o una BD local (p. ej. PostgreSQL en el mismo VPS o SQLite).

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` — build para producción
- `npm run start` — servir build (para el VPS con PM2)
- `npm run lint` — ESLint

## Estructura

- `app/` — páginas y layout (App Router)
- `lib/` — cliente Supabase y utilidades
