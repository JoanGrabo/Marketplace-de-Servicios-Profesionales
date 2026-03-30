# CONNECTIA — Documentación general del proyecto

**Versión del documento:** 1.0 (marzo 2026)  
**Producto:** Marketplace de servicios profesionales (web)

---

## Cómo obtener este documento en Word o PDF

| Formato | Cómo hacerlo |
|--------|----------------|
| **PDF** | Abre `docs/CONNECTIA-documentacion-general.html` en Chrome/Edge → `Ctrl+P` → **Guardar como PDF**. |
| **Word** | Abre Microsoft Word → **Archivo → Abrir** → elige el mismo archivo `.html`, o importa este `.md` con un plugin, o copia y pega desde el HTML. |
| **Desde Markdown** | Usa Pandoc: `pandoc CONNECTIA-documentacion-general.md -o connectia.docx` (si tienes Pandoc instalado). |

---

## 1. Qué es CONNECTIA

**CONNECTIA** es una plataforma web (marketplace) que **conecta a personas que necesitan servicios profesionales** con **profesionales que ofrecen esos servicios**. El enfoque inicial está en ámbitos como **arquitectura, visualización (renders), planificación/planos y asesoría técnica**, con posibilidad de ampliar a otras áreas (por ejemplo legal) de forma progresiva.

En esencia, CONNECTIA se inspira en el modelo de **marketplaces de servicios** (como Fiverr u otras plataformas similares): catálogo de ofertas, ficha de servicio, contacto entre usuarios y comunicación para cerrar el encargo — adaptado al mercado hispanohablante y a proyectos reales de construcción, diseño y asesoría.

---

## 2. En qué se basa (modelo y propuesta de valor)

- **Modelo de negocio:** intermediación entre oferta y demanda de servicios profesionales, con presencia digital clara (precio orientativo, plazos, descripción).
- **Propuesta central:** reducir fricción entre cliente y profesional: **menos pasos**, **mensajes claros** y **contacto directo** dentro de la propia plataforma.
- **Diferenciadores que la web promueve:**
  - **Especialización** en servicios técnicos/profesionales.
  - **Contacto directo** mediante mensajería integrada (no solo formularios externos).
  - **Claridad en la oferta** (título, descripción acotada en listados, detalle ampliado en la ficha).
  - **Evolución continua** del producto (confianza, UX, nuevas funciones).

---

## 3. Misión, visión y lema

### Misión

Conectar clientes y profesionales de forma **transparente** para **acelerar decisiones** y **ejecutar mejor** cada proyecto.

### Visión

Ser la plataforma de **referencia** para servicios técnicos y profesionales especializados en el **mercado hispanohablante**.

### Lema

**Conecta • Aprende • Crece**

- **Conecta** con las personas adecuadas.  
- **Aprende** del proceso.  
- **Haz crecer** tu negocio o proyecto.

---

## 4. Qué queremos hacer (objetivos del producto)

A corto y medio plazo, CONNECTIA persigue:

1. **Facilitar el descubrimiento** de servicios publicados (búsqueda, filtros, fichas por slug).
2. **Permitir que cualquier usuario registrado** pueda **contratar** (contactar) y **publicar** servicios — un mismo perfil puede actuar como cliente y como profesional según el caso.
3. **Centralizar la comunicación** en **conversaciones y mensajes** dentro de la app, con avisos de no leídos y límites anti-spam razonables.
4. **Generar confianza**: cuentas verificadas por correo, inicio de sesión seguro (incluido Google), recuperación de contraseña.
5. **Mejorar el perfil profesional** (datos públicos, imagen, etc.) y, en el futuro, **reseñas**, **pagos** o **pedidos** más formales si el negocio lo requiere.

---

## 5. Cómo actúa la página web (visión de usuario)

### 5.1 Páginas públicas (sin iniciar sesión)

- **Inicio:** presentación del valor de CONNECTIA, llamadas a la acción hacia el catálogo y el registro.
- **Servicios (`/servicios`):** listado de servicios activos con búsqueda y filtros de precio; acceso al detalle y botón para contactar.
- **Detalle de servicio (`/servicios/[slug]`):** información completa del anuncio; botón **Contactar para contratar** (si el visitante es el autor del servicio, la interfaz indica que es su propia publicación y orienta a mensajes / “Mis servicios”).
- **Quiénes somos, Contacto:** información institucional y canal de contacto con el equipo.

### 5.2 Registro e identidad

- **Registro** con email y contraseña (rol inicial cliente/profesional como preferencia).
- **Verificación de correo** antes de poder iniciar sesión con contraseña (según configuración).
- **Inicio de sesión con Google** (si está configurado en el entorno).
- **Recuperación de contraseña** por email.
- **Sesión** configurable (duración, “mantener sesión iniciada”).

### 5.3 Área privada (usuario logueado)

- **Mi perfil:** datos del perfil, avatar (subida de imagen), campos orientados a presentación pública.
- **Mis servicios:** crear, listar y editar servicios propios; cada servicio tiene URL amigable (`slug`).
- **Contactar un servicio (`/servicios/[slug]/contactar`):** formulario de primer mensaje; crea o reutiliza una **conversación** ligada al servicio y al profesional.
- **Mensajes (`/mensajes`):** bandeja de conversaciones; dentro de cada conversación, historial y envío de mensajes con control de cooldown anti-spam.

### 5.4 Comportamiento destacado

- **Contactar sin estar logueado:** al pulsar contactar, se redirige a **login** guardando la ruta de retorno (`next`) para volver al formulario tras autenticarse.
- **Privacidad en listados:** en el catálogo se prioriza el **nombre público** del profesional (no el email).
- **Seguridad básica:** validación de datos en servidor, límites de longitud en mensajes y servicios, cookies de sesión acordes al entorno (HTTP/HTTPS).

---

## 6. Resumen técnico (para equipos y partners)

| Aspecto | Descripción breve |
|--------|-------------------|
| **Frontend / backend** | Aplicación **Next.js** (App Router), UI con **Tailwind CSS**. |
| **Base de datos** | **PostgreSQL** con **Prisma** (ORM). |
| **Autenticación** | Sesión con **JWT** en cookie; **bcrypt** para contraseñas; opción **Google OAuth**. |
| **Correo** | Envío transaccional (verificación, reset de contraseña) vía **SMTP** (p. ej. Gmail con contraseña de aplicación). |
| **Despliegue** | Servidor Node con **PM2** en VPS; variables de entorno para BD, secretos y URLs públicas. |

*(El detalle de variables y comandos está en `marketplace-app/README.md` y en la documentación de VPS en `/docs`.)*

---

## 7. Roadmap orientativo (no contractual)

Posibles líneas de mejora alineadas con la visión del producto:

- Valoraciones y reseñas entre usuarios.
- Pagos o depósitos (pasarela).
- Perfil público “vitrina” para profesionales.
- Moderación y reportes.
- SEO avanzado por servicio y metadatos sociales (Open Graph).

---

## 8. Cierre

CONNECTIA busca ser el **punto de encuentro** entre **talento profesional** y **proyectos reales**, con un producto que **escucha al mercado**, prioriza **experiencias simples** y **mejora de forma continua**.

---

*Documento generado para uso interno y comunicación con colaboradores. Puede actualizarse cuando cambien funcionalidades o posicionamiento del producto.*
