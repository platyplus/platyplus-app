# Build stage
FROM node:9.11.1-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN $(npm bin)/quasar build -m pwa -t mat

# Production stage
FROM nginx:1.15.8-alpine as production-stage
COPY --from=build-stage /app/dist/spa-mat /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
CMD ["sh", "-c", "envsubst < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]