# Etapa 1: Construcción de la app
FROM node:18-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

COPY . ./
RUN npm run build

# Etapa 2: Servir la app con Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
