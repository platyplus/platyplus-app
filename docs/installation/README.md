---
title: Installation
---

# Installation

## Prerequisites

Docker

## Build the docker images

### Authentication service

### Server

### Application (this repo)

## Set the environment variables

## Set the secrets

```
# Generate a hasura secret
LC_ALL=C tr -dc 'A-Za-z0-9_!@#$%^&*()\-+=' < /dev/urandom | head -c 128

# TODO: how to generate those keys escaped with \n directly... or test without escapted in hasura
# Generate the RSA keys
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout > public.pem

# print the keys in an escaped format
awk -v ORS='\\n' '1' private.pem
awk -v ORS='\\n' '1' public.pem

# don't forget to store the private key and the hasura secret key in a safe place!


```

cat

## Install the stack

```
docker stack deploy -c docker-compose.yml -c docker-compose-prod.yml platyplus
```
