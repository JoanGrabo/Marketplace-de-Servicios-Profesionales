# Desplegar el Marketplace en el VPS desde cero

Sigue estos pasos **en orden** después de conectarte al VPS (o tras reiniciarlo). Sustituye `51.254.133.49` por tu IP si es distinta.

---

## 0. Conectarte al VPS

```bash
ssh ubuntu@51.254.133.49
```

---

## 1. Ir a home y clonar el repositorio

```bash
cd /home/ubuntu
rm -rf marketplace
git clone https://github.com/JoanGrabo/Marketplace-de-Servicios-Profesionales.git marketplace
```

---

## 2. Entrar en la app y crear `.env.local`

```bash
cd /home/ubuntu/marketplace/marketplace-app
nano .env.local
```

Pega esto (para funcionar sin Supabase):

```
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
```

Guarda: `Ctrl+O`, Enter, `Ctrl+X`.

---

## 3. Instalar dependencias y hacer el build

```bash
npm ci
npm run build
```

Espera a que termine sin errores (debe compilar Tailwind y Next.js).

---

## 4. Arrancar la app con PM2

```bash
pm2 start npm --name "marketplace" -- start
pm2 save
pm2 startup
```

Si `pm2 startup` te muestra un comando que empieza por `sudo env PATH=...`, **cópialo y ejecútalo** para que la app arranque al reiniciar el servidor.

Comprueba que está en marcha:

```bash
pm2 list
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000
```

- `pm2 list` debe mostrar **marketplace** en **online**.
- El `curl` debe devolver **200**.

---

## 5. Configurar Nginx para que sirva tu app

Crear el sitio:

```bash
sudo nano /etc/nginx/sites-available/marketplace
```

Pega exactamente esto:

```nginx
server {
    listen 80;
    server_name _;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Guarda: `Ctrl+O`, Enter, `Ctrl+X`.

Activar tu sitio y quitar el de Nginx por defecto:

```bash
sudo ln -sf /etc/nginx/sites-available/marketplace /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## 6. Probar en el navegador

Abre: **http://51.254.133.49**

Deberías ver **"Marketplace de Servicios Profesionales"** en lugar de "Welcome to nginx!".

---

## Resumen de comandos (copiar y pegar por bloques)

```bash
# 0. Conectar
ssh ubuntu@51.254.133.49

# 1. Clonar
cd /home/ubuntu
git clone https://github.com/JoanGrabo/Marketplace-de-Servicios-Profesionales.git marketplace

# 2. .env.local (luego nano y pegar las 2 líneas)
cd /home/ubuntu/marketplace/marketplace-app
nano .env.local

# 3. Build
npm ci
npm run build

# 4. PM2
pm2 start npm --name "marketplace" -- start
pm2 save
pm2 startup

# 5. Nginx (crear archivo con nano, luego:)
sudo ln -sf /etc/nginx/sites-available/marketplace /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## Si algo falla

- **Build falla (Tailwind / módulo no encontrado):** asegúrate de usar `npm ci` **sin** `--omit=dev`.
- **`curl` devuelve 000:** la app no está en el 3000; revisa `pm2 list` y `pm2 logs marketplace`.
- **Sigue saliendo "Welcome to nginx!":** comprueba que no exista `default` en sites-enabled: `ls /etc/nginx/sites-enabled/` y que el archivo `marketplace` tenga `proxy_pass http://127.0.0.1:3000`.
