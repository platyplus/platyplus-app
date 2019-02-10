#!/bin/bash
# Install the script with: npm i -g merge-yaml-cli
merge-yaml -i docker-stack.yml docker-stack-dev.yml -o portainer-dev.yml
merge-yaml -i docker-stack.yml docker-stack-prod.yml -o portainer-prod.yml
