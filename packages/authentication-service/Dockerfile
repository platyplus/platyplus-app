FROM node:12-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN yarn global add lerna
# Dependencies
COPY package.json yarn.lock lerna.json /app/

# Packages
COPY packages/platyplus-service/package.json yarn.lock /app/packages/platyplus-service/
COPY packages/microserver/package.json yarn.lock /app/packages/microserver/
COPY packages/hasura-node-client/package.json yarn.lock /app/packages/hasura-node-client/

# Install dependencies
RUN yarn
RUN lerna bootstrap

# Copy source
COPY packages/platyplus-service /app/packages/platyplus-service
COPY packages/microserver /app/packages/microserver
COPY packages/hasura-node-client /app/packages/hasura-node-client

# TODO Build packages? Multistage docker then?
#RUN lerna run build

USER node
CMD ["node", "packages/authentication-service/lib/index.js"]