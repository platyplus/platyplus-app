#!/bin/bash
if [[ "${BASH_SOURCE[0]}" != "${0}" ]]; then
    export DOMAIN=localhost
    export HASURA_ACCESS_KEY=$(cat secret.key)
    envsubst < config.yaml.template > config.yaml
    echo "Don't forget to add graphql.localhost to your /etc/hosts file"
else
    echo "Error: the script is not sourced. Call the script with dot space:"
    echo ". ./scripts/init-local.sh"
fi