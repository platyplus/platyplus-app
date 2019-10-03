#!/bin/sh

set -e

log() {
    MESSAGE=$1
    echo $REVISION $MESSAGE
}

# wait for a port to be ready
wait_for_port() {
    local PORT=$1
    local HOST="localhost"

    if [ -n "$2" ]; then
      HOST="$2"
    fi

    log "waiting $HASURA_GRAPHQL_MIGRATIONS_SERVER_TIMEOUT for $HOST:$PORT to be ready"
    for i in `seq 1 $HASURA_GRAPHQL_MIGRATIONS_SERVER_TIMEOUT`;
    do
        nc -z $HOST $PORT > /dev/null 2>&1 && log "$HOST:$PORT is ready" && return
        sleep 1
    done
    log "failed waiting for $HOST:$PORT" && exit 1
}

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
export "HASURA_GRAPHQL_JWT_SECRET"="{ \"type\": \"RS256\", \"jwk_url\": \"$AUTHENTICATION_URL/jwks\"}"
export EVENTS_URL="$FUNCTIONS_URL/events"
export AUTH_URL="$AUTHENTICATION_URL/graphql"


if [ "$ENABLE_CLOUDSQL_PROXY" = true ]; then
  log "Starting cloud sql proxy..."
  cloud_sql_proxy -instances=$CLOUDSQL_INSTANCE=tcp:5432 &
fi

# TODO get rid of 5432 and $POSTGRES_HOST and parse the $HASURA_GRAPHQL_DATABASE_URL variable instead
wait_for_port 5432 $POSTGRES_HOST

if [ "$ENABLE_MIGRATIONS" = true ]; then
  log "Running migrations in background"
  ./migrate.sh &
fi

# if [ "$ENABLE_CONSOLE" = true ]; then
#   log "Running console in background"
#   ./console.sh &
# fi

log "Starting graphql engine on port $HASURA_GRAPHQL_SERVER_PORT"
exec graphql-engine serve

