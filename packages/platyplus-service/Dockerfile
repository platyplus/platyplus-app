FROM node:12-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN yarn global add lerna
# Dependencies
COPY package.json yarn.lock lerna.json /app/

# Packages
COPY packages/platyplus-service/package.json yarn.lock /app/packages/platyplus-service/
COPY packages/microserver/package.json yarn.lock /app/microserver/platyplus/
COPY packages/platyplus/package.json yarn.lock /app/packages/platyplus/
COPY packages/hasura-apollo-client/package.json yarn.lock /app/packages/hasura-apollo-client/
COPY packages/vuex-apollo-offline/package.json yarn.lock /app/packages/vuex-apollo-offline/

# Install dependencies
RUN yarn
RUN lerna bootstrap

# Copy source
COPY packages/platyplus-service /app/packages/platyplus-service
COPY packages/microserver /app/microserver/platyplus
COPY packages/platyplus /app/packages/platyplus
COPY packages/hasura-apollo-client /app/packages/hasura-apollo-client
COPY packages/vuex-apollo-offline /app/packages/vuex-apollo-offline

# TODO Build packages? Multistage docker then?
#RUN lerna run build

USER node
CMD ["node", "packages/platyplus-service/lib/index.js"]