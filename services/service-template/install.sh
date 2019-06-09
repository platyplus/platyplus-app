#!/bin/sh
set -euo pipefail

mv /opt/app/package*.json* /opt/
cd /opt
npm install --no-optional
npm install @godaddy/terminus
npm cache clean --force
