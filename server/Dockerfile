FROM node:11-alpine as prepare-deps-stage
WORKDIR /opt/build
COPY . ./
RUN NODE_ENV=development yarn --ignore-optional

FROM prepare-deps-stage as build-app-stage
RUN $(npm bin)/quasar build -m pwa -t mat

FROM platyplus/service-template as production-stage
WORKDIR /opt/app
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV
COPY server/package.json server/package-lock.json server/index.js ./
RUN install.sh

COPY --from=build-app-stage /opt/build/dist ./

USER node
