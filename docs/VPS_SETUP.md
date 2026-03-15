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

1. En tu PC: el código ya está en GitHub (sin `node_modules`, sin `.next`; el `.gitignore` ya los excluye).
2. **En el VPS:** conéctate y clona el repo:
   ```bash
   ssh ubuntu@TU_IP_DEL_VPS
   cd /home/ubuntu
   git clone https://github.com/JoanGrabo/Marketplace-de-Servicios-Profesionales.git marketplace
   cd marketplace
   ```
3. **La app Next.js está en la subcarpeta `marketplace-app`.** Entra en ella:
   ```bash
   cd marketplace-app
   ```
4. Crea `.env.local` en esta carpeta con las mismas variables que en tu PC (Supabase, etc.):
   ```bash
   nano .env.local
   ```
   Pega algo como (con tus valores reales):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
   Guarda: `Ctrl+O`, Enter, `Ctrl+X`.
5. Sigue con “Al desplegar la app más adelante” (npm install, build, PM2).

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

Cuando el código esté en el VPS, entra en la carpeta de la app (donde está `package.json`):

```bash
cd /home/ubuntu/marketplace/marketplace-app
npm ci
npm run build
pm2 start npm --name "marketplace" -- start
pm2 save
pm2 startup
```

**Importante:** usa `npm ci` **sin** `--omit=dev`, porque Tailwind y otras herramientas de build están en devDependencies y hacen falta para compilar. Luego `next start` solo usa la carpeta `.next` ya generada.

(Responde las preguntas de `pm2 startup` si las hace.)

---

## 9. Preparar Nginx para tu app

**Si la web no cambia** y sigues viendo "Welcome to nginx", es porque Nginx sigue usando el sitio por defecto. Hay que crear el sitio de la app y desactivar el default.

### 9.1 Crear el sitio (sin dominio, por IP)

```bash
sudo nano /etc/nginx/sites-available/marketplace
```

Pega este contenido (para servir por IP en el puerto 80):

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

### 9.2 Activar tu sitio y quitar el de Nginx por defecto

```bash
sudo ln -sf /etc/nginx/sites-available/marketplace /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 9.3 Comprobar que la app está en marcha

```bash
pm2 list
```

Debe aparecer `marketplace` en estado **online**. Si no está o está stopped:

```bash
cd /home/ubuntu/marketplace/marketplace-app
pm2 start npm --name "marketplace" -- start
pm2 save
```

Luego abre en el navegador **http://TU_IP_DEL_VPS**. Deberías ver "Marketplace de Servicios Profesionales".

---

### Con dominio y HTTPS (más adelante)

Cuando tengas dominio apuntando a la IP, usa Certbot y cambia el sitio a algo como:

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
