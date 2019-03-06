# if you're doing anything beyond your local machine, please pin this to a specific version at https://hub.docker.com/_/node/
FROM node:11-alpine
RUN apk add --no-cache bash

RUN npm i npm@latest -g
# TODO: only required because of the embedded functions
ARG ALGORITHM=RS256
ENV ALGORITHM $ALGORITHM

ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT 9229 9230

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /opt
COPY package.json package-lock.json* ./
RUN npm install --no-optional && npm cache clean --force

WORKDIR /opt/app
COPY . /opt/app

ENV PATH /opt/node_modules/.bin:$PATH

HEALTHCHECK --interval=30s CMD node healthcheck.js
USER node

COPY entrypoint.sh /usr/local/bin/
ENTRYPOINT ["entrypoint.sh"]

CMD [ "node", "index.js" ]
