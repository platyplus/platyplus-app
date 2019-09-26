#!/bin/bash
if [ -z "$GRAPHQL_ENGINE_PUBLIC_URL" ]; then
    GRAPHQL_ENGINE_PUBLIC_URL="http://graphql.localhost"
fi
echo -n "Waiting for the services to be ready"
while ! curl -sf $GRAPHQL_ENGINE_PUBLIC_URL/healthz -o /dev/null
do
    sleep 5
done
echo "access_key: '$HASURA_GRAPHQL_ADMIN_SECRET'" > config.yaml
echo "endpoint: '$GRAPHQL_ENGINE_PUBLIC_URL'" >> config.yaml
hasura console
