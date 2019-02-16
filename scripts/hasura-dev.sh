#!/bin/bash
. ./scripts/load-dev-env.sh
# TODO: option --build
docker-compose -f docker-compose.yml -f docker-compose-dev.yml up --force-recreate -d

# trap ctrl-c and call ctrl_c()
trap ctrl_c INT
function ctrl_c() {
    # TODO: kill the console first. Example: https://github.com/hasura/graphql-engine/blob/master/scripts/cli-migrations/docker-entrypoint.sh
    docker-compose -f docker-compose.yml -f docker-compose-dev.yml down
    exit
}
echo -n "Waiting for the services to be ready"
envsubst < config.yaml.template > services/graphql-engine/config.yaml
while ! curl -sf http://graphql.localhost/v1/version -o /dev/null
do
    echo -n .
    sleep 1
done
echo
hasura console --project services/graphql-engine

# TODO: enhance the script into start-stack $1 dev, prod, ssl...