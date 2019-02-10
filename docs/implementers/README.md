---
title: Implementers
---

# Implementers documentation

## Installation

### Prerequisites

Docker

### Build the docker images

#### Authentication service

#### Server

#### Application (this repo)

### Set the environment variables

### Set the secrets

```
# Generate a hasura secret
LC_ALL=C tr -dc 'A-Za-z0-9_!@#$%^&*()\-+=' < /dev/urandom | head -c 128 > secret
base64 secret.key

# Generate the RSA keys
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout > public.pem

# print the keys in an escaped format
awk -v ORS='\\n' '1' private.pem | base64
awk -v ORS='\\n' '1' public.pem | base64

# don't forget to store the private key and the hasura secret key in a safe place!


```

cat

### Install the stack

```
docker stack deploy -c docker-compose.yml -c docker-compose-prod.yml platyplus
```
