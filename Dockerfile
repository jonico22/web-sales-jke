# ETAPA 1: Base
# Usamos una imagen ligera de Node
FROM node:20-alpine AS base
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package.json package-lock.json ./

# ETAPA 2: Dependencias e Instalación
FROM base AS build
# Instalamos todas las dependencias (incluyendo las de desarrollo para el build)
RUN npm ci
# Copiamos todo el código fuente
COPY . .

# --- AGREGA ESTO AQUÍ ---
# Declaras que esperas esta variable durante el build
ARG PUBLIC_API_URL
ARG PUBLIC_WEBSITE_NAME
# Se la pasas al entorno del build
ENV PUBLIC_API_URL=$PUBLIC_API_URL
ENV PUBLIC_WEBSITE_NAME=$PUBLIC_WEBSITE_NAME
# ------------------------
# Construimos el proyecto (genera la carpeta dist/)
RUN npm run build

# ETAPA 3: Ejecución (Nginx - Servidor Estático)
FROM nginx:alpine AS runtime

# Copiamos la carpeta construida desde la etapa anterior al directorio predeterminado de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiamos un archivo de configuración de nginx personalizado
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponemos el puerto 4321 (para coincidir con configuración previa/Coolify)
EXPOSE 4321

# Comando por defecto de Nginx (no es estrictamente necesario declararlo, pero es explícito)
CMD ["nginx", "-g", "daemon off;"]