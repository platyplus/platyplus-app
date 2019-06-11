#!/usr/bin/env sh
# Deploys the documentation in the github page.
# Used in the CI pipeline
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

# Deploy to github pages
git commit -m 'deploy'
git push https://$GH_USER:$GH_TOKEN@github.com/platyplus/platyplus.github.io.git master
cd -

