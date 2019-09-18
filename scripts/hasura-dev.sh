#!/bin/bash
# * Important note: don't forget to load the environment variables 
docker build -t platyplus/service-template:latest services/service-template
# TODO: option --build
docker-compose -f docker-compose.yml -f docker-compose-dev.yml up  -d

# trap ctrl-c and call ctrl_c()
trap ctrl_c INT
function ctrl_c() {
    # TODO: kill the console first. Example: https://github.com/hasura/graphql-engine/blob/master/scripts/cli-migrations/docker-entrypoint.sh
    docker-compose -f docker-compose.yml -f docker-compose-dev.yml down
    exit
}
echo -n "Waiting for the services to be ready"
while ! curl -sf http://graphql.localhost/healthz -o /dev/null
do
    echo -n .
    sleep 1
done
echo
cd packages/graphql-engine && yarn run console

# TODO: enhance the script into start-stack $1 dev, prod, ssl...