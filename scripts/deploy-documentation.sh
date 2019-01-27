#!/usr/bin/env sh

# abort on errors
set -e

# change npm verbosity
export npm_config_loglevel=error

# Install depedencies
npm install

# TODO: run tests
# TODO: enable a smart way to deploy:
# 1. pull/clone the github gh page repo into the ci image
# 2. build the dist
# 3. if dist files changed, commit and push
mkdir -p docs/.vuepress/dist && cd docs/.vuepress/dist
git clone https://$GH_USER:$GH_TOKEN@github.com/platyplus/platyplus.github.io.git
cd -

# build the docs
npm run docs:build

cd docs/.vuepress/dist
git add -A
cd -

git diff-index HEAD
if [[ ! `git diff-index --quiet HEAD docs/.vuepress/dist` ]]; then
    cd docs/.vuepress/dist
    # deploy to github pages
    git commit -m 'deploy'
    git push https://$GH_USER:$GH_TOKEN@github.com/platyplus/platyplus.github.io.git master
    cd -
else
    echo "no changes"
fi

