# Web Sales JKE

Este es un proyecto Astro configurado para despliegue estático con Docker y Nginx.

## 🛠️ Desarrollo Local

Para levantar el proyecto en tu máquina local:

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Iniciar servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    El sitio estará disponible en `http://localhost:4321`.

3.  **Construir para producción (localmente):**
    ```bash
    npm run build
    npm run preview
    ```

## 🐳 Docker (Producción)

El proyecto incluye un `Dockerfile` optimizado para servir los archivos estáticos usando Nginx.

### Construir la imagen

```bash
docker build -t web-sales-jke .
```

### Correr el contenedor

Ejecuta el siguiente comando para iniciar el contenedor en el puerto 8080:

```bash
docker run -d -p 8080:80 --name web-sales-jke-container web-sales-jke
```

Tu aplicación estará disponible en `http://localhost:8080`.

### Estructura de Docker

-   **Etapa 1 (Base):** Imagen base de Node.js.
-   **Etapa 2 (Build):** Instalación de dependencias y compilación (`npm run build`).
-   **Etapa 3 (Runtime):** Imagen ligera de Nginx (`nginx:alpine`) que sirve los archivos desde la carpeta `dist/`.

## 📂 Estructura del Proyecto

```text
/
├── public/       # Archivos estáticos
├── src/          # Código fuente (páginas, componentes)
├── dist/         # Resultado del build (generado automáticamente)
├── Dockerfile    # Configuración de Docker
├── nginx.conf    # Configuración de Nginx para SPA/Estáticos
└── package.json  # Dependencias y scripts
```
