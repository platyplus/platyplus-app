# Build stage
FROM node:10.15.1-alpine as build-stage
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN $(npm bin)/quasar build -m pwa -t mat

FROM node:10.15.1-alpine as production-stage
WORKDIR /app
COPY --from=build-stage /app/dist /app/server.js ./
RUN yarn add express serve-static connect-history-api-fallback
EXPOSE 80
CMD ["node", "server.js"]
