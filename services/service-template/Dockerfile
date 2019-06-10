# if you're doing anything beyond your local machine, please pin this to a specific version at https://hub.docker.com/_/node/
FROM node:11-alpine
RUN apk add --no-cache bash

WORKDIR /opt/app
# you'll likely want the latest npm, regardless of node version, for speed and fixes
# but pin this version for the best stability
RUN npm i npm@latest -g

# check every 30s to ensure this service returns HTTP 200
HEALTHCHECK --interval=30s CMD node healthcheck.js

COPY ./start ./start-dev /opt/
COPY ./healthcheck.js /opt/app/
COPY docker-entrypoint.sh install.sh /usr/local/bin/

ENV PATH /opt/node_modules/.bin:$PATH
# default to port 3000 for node, and 9229 and 9230 (tests) for debug
ENV PORT $PORT
EXPOSE $PORT 9229 9230

ENTRYPOINT ["docker-entrypoint.sh"]

CMD [ "node", "/opt/start" ]
