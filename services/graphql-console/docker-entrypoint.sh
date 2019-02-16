#!/bin/sh
set -euo pipefail
echo "access_key: ${HASURA_GRAPHQL_ADMIN_SECRET}" > config.yaml
echo "endpoint: ${HASURA_ENDPOINT}" >> config.yaml

exec "$@"
