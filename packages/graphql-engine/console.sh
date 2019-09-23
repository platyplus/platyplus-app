#!/bin/bash
echo -n "Waiting for the services to be ready"
while ! curl -sf http://graphql.localhost/healthz -o /dev/null
do
    sleep 5
done
echo "access_key: '$HASURA_GRAPHQL_ADMIN_SECRET'" > config.yaml
echo "endpoint: 'http://graphql.${DOMAIN}'" >> config.yaml
hasura console
