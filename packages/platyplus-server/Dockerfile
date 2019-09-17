FROM node:12-alpine
RUN yarn global add @platyplus/platyplus-server
COPY packages/platyplus/dist/pwa /var/www
USER node
EXPOSE 3000
CMD ["platyplus-server"]