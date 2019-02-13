#!/bin/bash
# if [[ "${BASH_SOURCE[0]}" != "${0}" ]]; then
export DOMAIN=localhost
export HASURA_ACCESS_KEY=$(cat secret.key)
envsubst < config.yaml.template > services/graphql-engine/config.yaml
hasura console --project services/graphql-engine
