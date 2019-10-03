#!/bin/bash
if [ -z "$GRAPHQL_ENGINE_PUBLIC_URL" ]; then
    GRAPHQL_ENGINE_PUBLIC_URL="http://graphql.localhost"
fi
echo "Waiting for the services to be ready"
while ! curl -sf $GRAPHQL_ENGINE_PUBLIC_URL/healthz -o /dev/null
do
    sleep 5
done
echo "Service is ready"
echo "access_key: '$HASURA_GRAPHQL_ADMIN_SECRET'" > config.yaml
echo "endpoint: '$GRAPHQL_ENGINE_PUBLIC_URL'" >> config.yaml
hasura console
# set -e

# Start hasura console once Graphql server is up
# wait-for -t 999999 localhost:8080 -- \
#   sleep 5 && hasura-cli console \
#     --endpoint http://localhost:8080 \
#     --address 0.0.0.0 \
#     --no-browser \
#     --skip-update-check &
