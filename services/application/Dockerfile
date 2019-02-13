# Build stage
FROM node:10.15.1-alpine as build-stage
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN $(npm bin)/quasar build -m pwa -t mat

FROM node:10.15.1-alpine as production-stage
WORKDIR /app
COPY --from=build-stage /app/dist ./
COPY services/application ./
RUN yarn
EXPOSE 80

# check every 30s to ensure this service returns HTTP 200
HEALTHCHECK --interval=30s CMD node healthcheck.js

CMD ["node", "server.js"]
