FROM node:12-alpine
WORKDIR /app
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
RUN yarn global add lerna
# Dependencies
COPY package.json yarn.lock lerna.json /app/

# Packages
COPY packages/microserver/package.json packages/microserver/yarn.lock packages/microserver/tsconfig.build.json /app/packages/microserver/
COPY packages/hasura-node-client/package.json packages/hasura-node-client/yarn.lock packages/hasura-node-client/tsconfig.build.json /app/packages/hasura-node-client/

# Install dependencies
RUN yarn
RUN lerna bootstrap

# Copy source
COPY packages/microserver /app/packages/microserver
COPY packages/hasura-node-client /app/packages/hasura-node-client

# TODO Build packages? Multistage docker then?
#RUN lerna run build

USER node
CMD ["node", "packages/authentication-service/lib/index.js"]