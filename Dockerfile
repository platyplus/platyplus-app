# Build stage
FROM node:10.15.1-alpine as build-stage
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN $(npm bin)/quasar build -m pwa -t mat

# Production stage
# FROM nginx:1.15.8-alpine as production-stage
# COPY --from=build-stage /app/dist/pwa-mat /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf.template

#EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
# CMD ["sh", "-c", "envsubst < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

FROM node:10.15.1-alpine as production-stage
WORKDIR /app
COPY --from=build-stage /app/dist/pwa-mat /app/dist/pwa-mat
COPY --from=build-stage /app/server.js .
RUN yarn add express serve-static connect-history-api-fallback
EXPOSE 80
CMD ["node", "server.js"]
