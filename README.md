
# Web Vitrinas Sílice 🌐

Sitio web estático de **Vitrinas Sílice**, optimizado para rendimiento, accesibilidad y SEO.  
Desplegado en contenedor **Nginx Unprivileged (Alpine)** para mayor seguridad y ligereza.

---

## 🚀 Características

- ✅ **HTML + CSS + VanillaJS** (sin frameworks pesados).  
- ✅ **Optimizado para Google Lighthouse** (Performance, SEO, Accesibilidad).  
- ✅ **Servido con Nginx en modo no root**.  
- ✅ **Imágenes optimizadas (WebP, lazy loading)**.  
- ✅ **Docker Ready** para desarrollo y producción.  

---

## 📂 Estructura de directorios

```bash

project-root/
│
├── public/                 # Archivos públicos
│   ├── index.html          # Página principal
│   ├── assets/             # Recursos estáticos
│   │   ├── css/            # Estilos
│   │   ├── js/             # Scripts
│   │   ├── img/            # Imágenes optimizadas (WebP/SVG)
│   │   └── fonts/          # Fuentes locales (opcional)
│   └── favicon.ico
│
├── nginx/
│   └── nginx.conf          # Configuración personalizada de nginx
│
├── Dockerfile              # Imagen de producción
├── docker-compose.yml      # Orquestación para desarrollo
└── README.md

````

---

## 🐳 Docker

### Construir la imagen
```bash
docker build -t web-vitrinas-silice:2.0.0 .
````

### Ejecutar el contenedor

```bash
docker run -p 8080:8080 web-vitrinas-silice:2.0.0
```

👉 La web estará disponible en:
[http://localhost:8080](http://localhost:8080)

---

## 🐙 Docker Compose

Archivo `docker-compose.yml` incluido para desarrollo local:

```yaml
services:
  silixe-web:
    image: nginxinc/nginx-unprivileged:stable-alpine
    ports:
      - "80:8080"
    volumes:
      - ./public:/usr/share/nginx/html:ro   # monta la carpeta local
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
```

Levantar el servicio:

```bash
docker compose up
```

---

## 📈 Roadmap 2.0.0

* [x] Estructura de proyecto estático
* [ ] Optimización de imágenes a WebP
* [ ] Configuración gzip y cache en Nginx
* [ ] Lazy loading de recursos
* [ ] Auditoría final con Lighthouse (objetivo: >90 en Performance)

---

## 🏷️ Versionado

Usamos **versionado semántico (SemVer)**:

* `1.0.4` → Versión inicial
* `2.0.0` → Rediseño completo, optimización performance/SEO

---

## 📜 Licencia

Este proyecto es privado para uso de **Vitrinas Sílice**.


