FROM node:12-alpine as build
WORKDIR /opt
COPY . ./
RUN yarn --production --ignore-optional
RUN yarn run build

FROM node:12-alpine as production
WORKDIR /opt
COPY --from=build ./lib ./
COPY packages/platyplus/dist/pwa /var/www
USER node

CMD ["node","index.js"]