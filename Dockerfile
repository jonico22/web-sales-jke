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
# Se la pasas al entorno del build
ENV PUBLIC_API_URL=$PUBLIC_API_URL
# ------------------------
# Construimos el proyecto (genera la carpeta dist/)
RUN npm run build

# ETAPA 3: Ejecución (Imagen Final)
FROM base AS runtime

# Copiamos las dependencias de producción y la carpeta construida desde la etapa anterior
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Variables de entorno clave para Docker/Coolify
ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production

# Exponemos el puerto
EXPOSE 4321

# Comando para iniciar el servidor
CMD ["node", "./dist/server/entry.mjs"]