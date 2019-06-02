#!/bin/bash
# Automatically invoqued at every git commit
# Install the script with: npm i -g merge-yaml-cli
merge-yaml -i docker-compose.yml docker-compose-prod.yml -o portainer-stack.yml
merge-yaml -i docker-compose.yml docker-compose-prod.yml docker-compose-ssl.yml -o portainer-stack-ssl.yml
