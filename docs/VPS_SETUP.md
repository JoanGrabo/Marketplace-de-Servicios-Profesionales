# Guion: Configuración del VPS para el Marketplace

Sigue estos pasos en orden. Si ya tienes usuario con sudo y SSH por clave, puedes saltar los pasos 1 y 2.

---

## 0. Conectarte al VPS (si estás en tu PC)

```bash
ssh root@TU_IP_DEL_VPS
```

(Sustituye `TU_IP_DEL_VPS` por la IP que te dio el proveedor.)

---

## 1. Actualizar el sistema

```bash
sudo apt update && sudo apt upgrade -y
```

---

## 2. Crear usuario con sudo (si aún usas root)

```bash
adduser deploy
usermod -aG sudo deploy
```

Pon una contraseña segura cuando te la pida. Luego copia tu clave SSH al nuevo usuario para poder entrar con él:

```bash
rsync -av --chown=deploy:deploy ~/.ssh /home/deploy/
```

Cierra sesión y vuelve a entrar con el usuario `deploy`:

```bash
exit
ssh deploy@TU_IP_DEL_VPS
```

A partir de aquí trabaja siempre con `deploy` (o el nombre que hayas elegido), no con root.

---

## 3. (Opcional) Endurecer SSH

Solo si ya has comprobado que entras bien con `deploy` por clave:

```bash
sudo nano /etc/ssh/sshd_config
```

Busca y ajusta:

- `PasswordAuthentication no`
- `PermitRootLogin no`

Reinicia SSH:

```bash
sudo systemctl restart sshd
```

No cierres esta sesión hasta probar en **otra terminal** que `ssh deploy@TU_IP` sigue funcionando.

---

## 4. Firewall

```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
sudo ufw status
```

---

## 5. Instalar Node.js (LTS)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

Deberías ver la versión 20.x.

---

## 6. Instalar Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

Prueba en el navegador: `http://TU_IP_DEL_VPS`. Deberías ver la página por defecto de Nginx.

---

## 7. Instalar Certbot (SSL)

```bash
sudo apt install -y certbot python3-certbot-nginx
```

**Cuando tengas el dominio apuntando a esta IP**, genera el certificado:

```bash
sudo certbot --nginx -d tudominio.com -d www.tudominio.com
```

Sigue las preguntas (email, aceptar términos). Certbot configurará HTTPS en Nginx.

**Sin dominio:** salta este paso y sigue con el 8. Cuando tengas dominio, vuelve y ejecuta Certbot.

---

## 8. Instalar PM2 (para mantener la app Node en marcha)

Solo instala PM2 por ahora. **No ejecutes** `pm2 start` ni `npm run build` hasta que el proyecto Next.js exista en el VPS.

```bash
sudo npm install -g pm2
```

**Si ya ejecutaste** `pm2 start` sin tener el proyecto, borra ese proceso:

```bash
pm2 delete marketplace
pm2 save
```

---

### Cómo subir el proyecto al VPS (no copies todo)

**No copies** la carpeta entera: `node_modules` y `.next` pesan mucho y se generan en el VPS. Usa una de estas dos formas:

---

**Opción A – Con Git (recomendado)**

1. En tu PC: crea un repo (GitHub, GitLab, etc.), sube solo el código (sin `node_modules`, sin `.next`; el `.gitignore` ya los excluye).
2. En el VPS:
   ```bash
   cd /home/ubuntu
   git clone https://github.com/TU_USUARIO/marketplace-app.git marketplace
   cd marketplace
   ```
3. Crea `.env.local` en el VPS con las mismas variables que en tu PC (Supabase, etc.):
   ```bash
   nano .env.local
   ```
4. Sigue con “Al desplegar la app más adelante” (npm install, build, PM2).

---

**Opción B – Copiar solo el código (sin Git)**

1. En tu PC, entra en `marketplace-app` y comprime solo el código (sin `node_modules` ni `.next`). En PowerShell, desde la carpeta donde está `marketplace-app`:
   ```powershell
   cd "Marketplace de Servicios Profesionales"
   Compress-Archive -Path marketplace-app\app, marketplace-app\lib, marketplace-app\package.json, marketplace-app\package-lock.json, marketplace-app\tsconfig.json, marketplace-app\next.config.mjs, marketplace-app\tailwind.config.ts, marketplace-app\postcss.config.mjs, marketplace-app\next-env.d.ts -DestinationPath marketplace-app.zip
   ```
   Si tienes carpeta `marketplace-app\public`, añádela a la lista. No incluyas `node_modules` ni `.next`.
2. Sube el ZIP al VPS (por ejemplo con SCP o WinSCP):
   ```bash
   scp marketplace-app.zip ubuntu@TU_IP_DEL_VPS:/home/ubuntu/
   ```
3. En el VPS:
   ```bash
   cd /home/ubuntu
   unzip marketplace-app.zip -d marketplace
   cd marketplace
   ```
   Crea `.env.local` con las variables (Supabase, etc.) y luego instala, build y PM2.

---

### Al desplegar la app más adelante

Cuando el código esté en el VPS (por ejemplo en `/home/ubuntu/marketplace`), en esa carpeta:

```bash
cd /home/ubuntu/marketplace   # o la ruta donde esté el proyecto
npm ci --omit=dev
npm run build
pm2 start npm --name "marketplace" -- start
pm2 save
pm2 startup
```

(Responde las preguntas de `pm2 startup` si las hace.)

---

## 9. Preparar Nginx para tu app (plantilla)

Cuando la app esté en el servidor y escuchando en un puerto (por ejemplo 3000), crearás un sitio en Nginx. Por ahora puedes dejar un archivo de ejemplo:

```bash
sudo nano /etc/nginx/sites-available/marketplace
```

Contenido (sustituye `tudominio.com` y el puerto si cambia):

```nginx
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name tudominio.com www.tudominio.com;

    ssl_certificate /etc/letsencrypt/live/tudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tudominio.com/privkey.pem;

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

Activar sitio y comprobar:

```bash
sudo ln -s /etc/nginx/sites-available/marketplace /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**Nota:** Este paso 9 lo harás cuando tengas dominio y la app desplegada. Si aún no tienes dominio, puedes usar solo la IP y servir la app en el puerto 80 con una configuración más simple; si quieres, en el siguiente despliegue te paso esa variante.

---

## Resumen de lo que habrás hecho

| Paso | Acción |
|------|--------|
| 1 | Sistema actualizado |
| 2 | Usuario `deploy` con sudo y SSH por clave |
| 3 | (Opcional) SSH endurecido |
| 4 | Firewall: 22, 80, 443 |
| 5 | Node.js 20 LTS |
| 6 | Nginx instalado y activo |
| 7 | Certbot para HTTPS (cuando tengas dominio) |
| 8 | PM2 para ejecutar la app Node |
| 9 | Plantilla Nginx para cuando despliegues la app |

Cuando tengas el build de Next.js en el VPS, solo faltará: `pm2 start`, configurar el sitio en Nginx (paso 9) y apuntar el dominio a esta IP.
