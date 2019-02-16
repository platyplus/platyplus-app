FROM alpine:3.9

RUN apk add --no-cache curl

WORKDIR /opt
RUN curl -L https://github.com/hasura/graphql-engine/raw/master/cli/get.sh | ash
COPY docker-entrypoint.sh /usr/local/bin/

ENV HASURA_GRAPHQL_ADMIN_SECRET $HASURA_GRAPHQL_ADMIN_SECRET
ARG HASURA_ENDPOINT=http://graphql-engine:3000
ENV HASURA_ENDPOINT $HASURA_ENDPOINT
EXPOSE 3000 3001

ENTRYPOINT ["docker-entrypoint.sh"]
CMD sh -c 'while ! nc -z localhost 3000; do hasura console --console-port 3000 --api-port 3001 --no-browser; sleep 1; done'

