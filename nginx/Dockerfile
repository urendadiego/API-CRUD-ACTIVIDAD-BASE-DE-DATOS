# Etapa 1: compilar el front de React
FROM node:24-alpine AS build
WORKDIR /app
COPY front-eventos/package*.json ./
RUN npm ci
COPY front-eventos/ ./
# Ruta relativa: el front le pega a /api del mismo nginx, que la balancea
ENV VITE_API_URL=/api
RUN npm run build

# Etapa 2: nginx con el front compilado y la configuración de balanceo
FROM nginx:alpine
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
