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

file_env 'HASURA_GRAPHQL_ACCESS_KEY'
file_env 'AUTH_PUBLIC_KEY'
export "HASURA_GRAPHQL_JWT_SECRET"="{\"type\":\"${AUTH_ALGORITHM}\", \"key\":\"${AUTH_PUBLIC_KEY}\"}"
unset AUTH_PUBLIC_KEY
unset AUTH_ALGORITHM
exec "$@"
