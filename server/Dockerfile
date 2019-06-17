FROM node:11-alpine as prepare-deps-stage
WORKDIR /app
COPY package.json yarn.lock ./
RUN NODE_ENV=development yarn --ignore-optional
COPY . ./

FROM prepare-deps-stage as build-app-stage
RUN $(npm bin)/quasar build -m pwa -t mat

FROM platyplus/service-template as production-stage
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV
COPY server/package.json server/package-lock.json server/index.js ./
RUN install.sh

COPY --from=build-app-stage /app/dist ./

USER node
