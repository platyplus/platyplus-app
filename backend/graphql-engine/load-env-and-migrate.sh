#!/bin/sh
set -e

# usage: file_env VAR [DEFAULT]
#    ie: file_env 'XYZ_DB_PASSWORD' 'example'
# (will allow for "$XYZ_DB_PASSWORD_FILE" to fill in the value of
#  "$XYZ_DB_PASSWORD" from a file, especially for Docker's secrets feature)
file_env() {
  var=$1
  file_var="${var}_FILE"
  var_value=$(printenv $var || true)
  file_var_value=$(printenv $file_var || true)
  default_value=$2
  if [ -n "$var_value" -a -n "$file_var_value" ]; then
    echo >&2 "error: both $var and $file_var are set (but are exclusive)"
    exit 1
  fi

  if [ -z "${var_value}" ]; then
    if [ -z "${file_var_value}" ]; then
      export "${var}"="${default_value}"
    else
      export "${var}"="$(cat ${file_var_value})"
    fi
  fi

  unset "$file_var"
}

file_env 'HASURA_GRAPHQL_ADMIN_SECRET'
export "HASURA_GRAPHQL_MIGRATIONS_DIR"="/opt/hasura-migrations"
export "HASURA_GRAPHQL_JWT_SECRET"="{ \"type\": \"RS256\", \"jwk_url\": \"$AUTHENTICATION_URL/jwks\"}"
# TODO remove log
echo $HASURA_GRAPHQL_JWT_SECRET
echo $AUTHENTICATION_URL
# Using a port that is not exposed to other services
# We then can't mix the service as being ready e.g. wait-for-it or healthchecks
prod_port=$HASURA_GRAPHQL_SERVER_PORT
export "HASURA_GRAPHQL_SERVER_PORT"=9999
if [ "$ENABLE_CLOUDSQL_PROXY" = true ]; then
  echo "Starting cloud sql proxy..."
  cloud_sql_proxy -instances=$CLOUDSQL_INSTANCE=tcp:5432 &
fi
docker-entrypoint.sh
export "HASURA_GRAPHQL_SERVER_PORT"=$prod_port
exec "$@"
