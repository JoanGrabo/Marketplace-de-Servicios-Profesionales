# Base de datos: opciones para más adelante

De momento la app se despliega **sin base de datos**. Cuando quieras añadir usuarios, perfiles, servicios y pedidos, puedes elegir una de estas opciones.

---

## 1. Supabase (recomendado para empezar)

- **Qué es:** PostgreSQL en la nube + auth + API lista. Plan gratuito generoso.
- **Ventajas:** No instalas nada en el VPS, auth y RLS integrados, escalable.
- **Desventajas:** Dependes de un servicio externo; para crear proyecto a veces piden verificar tarjeta (no cobran si no pasas del free tier).

Cuando la uses, solo rellenas `.env.local` en el VPS con la URL y la anon key y reinicias: `pm2 restart marketplace`.

---

## 2. PostgreSQL en el VPS (local)

- **Qué es:** Instalas PostgreSQL en el mismo servidor donde corre la app.
- **Ventajas:** Todo en tu servidor, sin depender de terceros, control total.
- **Desventajas:** Tú te encargas de backups, actualizaciones y de exponer una API (p. ej. con un backend en Node/Next.js API routes que hable con Postgres).

Pasos típicos en el VPS:
```bash
sudo apt install -y postgresql postgresql-contrib
```
Luego crear usuario/BD y en la app usar un cliente como `pg` o Prisma para conectarte a `localhost` (o socket) desde las API routes.

---

## 3. SQLite (muy local y simple)

- **Qué es:** Un solo archivo como base de datos. Muy ligero.
- **Ventajas:** Cero instalación de servidor, ideal para MVP o poco tráfico.
- **Desventajas:** Menos adecuado para muchos usuarios concurrentes escribiendo; no tiene auth integrado (lo implementas tú).

En Next.js podrías usar SQLite en el servidor (API routes o Server Components) con algo como `better-sqlite3` o Prisma con driver SQLite. Los datos vivirían en un archivo en el VPS (p. ej. `data/marketplace.sqlite`).

---

## Resumen

| Opción        | Dónde corre | Mejor para                          |
|---------------|-------------|-------------------------------------|
| Supabase      | Nube        | Arrancar rápido, auth ya hecho     |
| PostgreSQL VPS | Tu servidor | Querer todo en casa, control total |
| SQLite        | Tu servidor | MVP muy simple, poco tráfico        |

Puedes desplegar ya sin ninguna y decidir más adelante. Si más tarde eliges Supabase, solo cambias las variables de entorno. Si eliges Postgres o SQLite en el VPS, habría que cambiar el código que hoy usa el cliente de Supabase por llamadas a tu propia BD (por ejemplo con Prisma, que sirve para Postgres y SQLite).
