# PostgreSQL en el VPS

Guía para instalar y configurar PostgreSQL en tu VPS (Ubuntu) y usarlo con la app CONNECTIA.

---

## 1. Instalar PostgreSQL

En el VPS (por SSH):

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

Comprueba que está en marcha:

```bash
sudo systemctl status postgresql
```

---

## 2. Crear usuario y base de datos

Entra como usuario `postgres` y crea la base de datos y un usuario para la app:

```bash
sudo -u postgres psql
```

Dentro de `psql`, ejecuta (cambia `TU_PASSWORD` por una contraseña segura):

```sql
CREATE USER connectia WITH PASSWORD 'TU_PASSWORD';
CREATE DATABASE connectia OWNER connectia;
\q
```

---

## 3. Permitir conexiones locales con contraseña

Por defecto Postgres usa "peer" para conexiones locales. Para que la app (usuario `ubuntu`) se conecte con usuario `connectia` y contraseña, hay que usar `md5` o `scram-sha-256`.

Edita la configuración (la ruta puede ser `14`, `16`, etc.; revisa con `ls /etc/postgresql/`):

```bash
sudo nano /etc/postgresql/14/postgresql.conf
```

Busca la línea `#listen_addresses = 'localhost'` y déjala como está (o `listen_addresses = 'localhost'`). Guarda y cierra.

Luego:

```bash
sudo nano /etc/postgresql/14/pg_hba.conf
```

Al final del archivo, añade una línea para permitir conexiones locales con contraseña:

```
# Conexión local con contraseña (app Next.js)
host    connectia    connectia    127.0.0.1/32    scram-sha-256
```

Guarda, cierra y reinicia Postgres:

```bash
sudo systemctl restart postgresql
```

---

## 4. Cadena de conexión (DATABASE_URL)

En la app (en tu PC y en el VPS) usarás una variable de entorno. En el **VPS**, en `marketplace-app/.env.local`:

```
DATABASE_URL="postgresql://connectia:TU_PASSWORD@127.0.0.1:5432/connectia"
```

Sustituye `TU_PASSWORD` por la contraseña que pusiste al crear el usuario `connectia`.

En **local** (tu PC), si quieres desarrollar contra el mismo Postgres del VPS tendrías que abrir el puerto 5432 (no recomendado por seguridad). Lo habitual es tener Postgres instalado en tu PC o usar Docker con la misma URL pero `localhost`. Para solo desarrollar en local puedes usar por ejemplo:

```
DATABASE_URL="postgresql://connectia:TU_PASSWORD@localhost:5432/connectia"
```

con Postgres instalado en tu máquina y la misma base `connectia` creada.

---

## 5. Crear tablas desde la app (Prisma)

Las tablas no se crean a mano: la app usa **Prisma** y sus migraciones. En la carpeta del proyecto (en tu PC o en el VPS):

```bash
cd marketplace-app
npx prisma migrate deploy
```

Eso aplica las migraciones y deja la base con las tablas `Profile`, `Service`, etc.

---

## Resumen

| Paso | Acción |
|------|--------|
| 1 | `apt install postgresql` en el VPS |
| 2 | Crear usuario `connectia` y base de datos `connectia` |
| 3 | Configurar `pg_hba.conf` para conexión con contraseña |
| 4 | Poner `DATABASE_URL` en `.env.local` (VPS y/o local) |
| 5 | Ejecutar `npx prisma migrate deploy` para crear tablas |

Si algo falla, revisa los logs: `sudo journalctl -u postgresql -n 50`.
