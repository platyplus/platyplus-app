FROM node:12-alpine
WORKDIR /opt
RUN yarn global add @platyplus/platyplus-server
COPY packages/platyplus/dist/pwa /var/www
USER node

CMD ["platyplus-server"]