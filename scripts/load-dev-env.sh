#!/bin/bash
if [[ "${BASH_SOURCE[0]}" != "${0}" ]]; then
    export DOMAIN=localhost
    export HASURA_URL=http://graphql.localhost/v1/graphql
    export HASURA_ACCESS_KEY=$(cat secret.key)
    export PUBLIC_KEY=$(cat public.pem)
    export PRIVATE_KEY=$(cat private.pem)
else
    echo "load the script with . ./scripts/load-dev-env.sh"
fi
