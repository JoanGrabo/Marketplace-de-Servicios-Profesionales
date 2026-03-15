# Marketplace de Servicios Profesionales

App Next.js (App Router) + Tailwind + Supabase.

## Desarrollar en local

1. Copia las variables de entorno:
   ```bash
   cp .env.example .env.local
   ```
2. Crea un proyecto en [Supabase](https://supabase.com), entra en Settings → API y rellena en `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Instala y arranca:
   ```bash
   npm install
   npm run dev
   ```
4. Abre [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` — build para producción
- `npm run start` — servir build (para el VPS con PM2)
- `npm run lint` — ESLint

## Estructura

- `app/` — páginas y layout (App Router)
- `lib/` — cliente Supabase y utilidades
