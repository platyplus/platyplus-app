# Build stage
FROM node:10.15.1-alpine as prepare-deps-stage
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --ignore-optional
COPY . ./

FROM prepare-deps-stage as build-app-stage
RUN $(npm bin)/quasar build -m pwa -t mat

FROM platyplus/service-template as production-stage
WORKDIR /opt
COPY server/package.json server/yarn.lock ./
RUN yarn
ENV PATH /opt/node_modules/.bin:$PATH

WORKDIR /opt/app
COPY --from=build-app-stage /app/dist ./
COPY server/index.js ./

USER node

CMD [ "node", "./bin/www" ]