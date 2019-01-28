#!/usr/bin/env sh

# abort on errors
set -e

# change npm verbosity
export npm_config_loglevel=error
# Install depedencies
npm install

# build the docs
npm run docs:build

# Instanciate the original github repo
mkdir dist-repo
cd dist-repo
git init .
git pull https://$GH_USER:$GH_TOKEN@github.com/platyplus/platyplus.github.io.git master

# Copy the built files into the repo
cp -r ../docs/.vuepress/dist/* ./
git add .

# TODO: check if any change in the previous commit in the docs directory
# Deploy to github pages
git commit -m 'deploy'
git push https://$GH_USER:$GH_TOKEN@github.com/platyplus/platyplus.github.io.git master
cd -

