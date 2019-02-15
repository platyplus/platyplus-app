#!/bin/bash
. ./scripts/load-dev-env.sh
envsubst < config.yaml.template > services/graphql-engine/config.yaml
hasura console --project services/graphql-engine
# TODO: change the script into start-stack $1 dev, prod, ssl...