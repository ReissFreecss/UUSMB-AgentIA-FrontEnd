# --- Etapa de Construcción (Build Stage) ---
# Usamos una imagen de Node.js para construir el proyecto de React.
FROM node:18-alpine AS build

# Establecemos el directorio de trabajo.
WORKDIR /app

# Copiamos package.json y package-lock.json para instalar dependencias.
COPY package*.json ./

# Instalamos las dependencias del proyecto.
RUN npm install

# Copiamos el resto de los archivos de la aplicación.
COPY . .

# Construimos la aplicación para producción.
RUN npm run build

# --- Etapa de Producción (Production Stage) ---
# Usamos una imagen oficial de Nginx para servir los archivos estáticos.
FROM nginx:1.23-alpine

# Copiamos los archivos construidos desde la etapa anterior al directorio web de Nginx.
COPY --from=build /app/dist /usr/share/nginx/html

# Copiamos nuestra configuración personalizada de Nginx que incluye el proxy inverso.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponemos el puerto 80, que es el puerto por defecto de Nginx.
EXPOSE 80

# El comando por defecto de la imagen de Nginx iniciará el servidor.
CMD ["nginx", "-g", "daemon off;"]