#!/usr/bin/env sh

# abort on errors
set -e

# change npm verbosity
export npm_config_loglevel=error

# Install depedencies
npm install

# build the docs
npm run docs:build

# deploy to github pages
cd docs/.vuepress/dist
git init
git add -A
git commit -m 'deploy'
git push -f https://$GH_USER:$GH_TOKEN@github.com/platyplus/platyplus.github.io.git master

cd -
